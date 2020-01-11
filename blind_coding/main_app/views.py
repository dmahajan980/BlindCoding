from django.shortcuts import render,redirect
from django.shortcuts import render
from django.http import JsonResponse,HttpResponseRedirect,HttpResponse
from .models import Userdata,Question,Time_Penalty
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required

import json
import requests
import base64	
import time
import blind_coding.settings as settings

def default(request):
	return render(request,'loggedIn.html')

def index(request):
	return render(request,'index.html')

def login(request):
#	if request.POST:
	return redirect('/accounts/google/login')
#	return render(request,'index.html')

@login_required(login_url='/')
def main(request):
   return render(request, 'loggedIn.html',)

def question(request):
	data = json.loads( request.body.decode('utf-8') )
	num = data['queNum']
	print(num)
	ques = Question.objects.get(qno=num)
	question = ques.text
	sampleTestCaseNum = ques.testcaseno
	sampleIn = ques.samplein
	sampleOut = ques.sampleout
	res={}
	res['question'] = question
	res['qNo'] = num
	res['sampTCNum'] = sampleTestCaseNum
	res['sampIn'] = sampleIn
	res['sampleOut'] = sampleOut
	res['userScore'] = Userdata.objects.get(user_id = request.user).score
	print('hi')
	print(res['userScore'])
	return HttpResponse(json.dumps(res))

def runCode(request):
	postData = json.loads( request.body.decode('utf-8') )
	url = 'https://api.judge0.com/submissions?base64_encoded=false&wait=false'
	que = Question.objects.get(qno=postData['qNo'])
	stdin = '3'+'\n'+que.test_case1+'\n'+que.test_case2+'\n'+que.test_case3
	# postData['stdin'] = str(base64.b64encode(stdin.encode("utf-8")))
	postData['stdin'] = stdin
	# postData['source_code'] = str(base64.b64encode(postData['source_code'].encode('utf-8')))
	print(postData)

	response = requests.post(url,json=postData)
	resp = response.json()
	# resp = json.loads(resp)
	print('qNo',postData['qNo'])
	print('response token: ',resp['token'])

	url2 = 'https://api.judge0.com/submissions/'+resp['token']+'?base64_encoded=false'
	time.sleep(1)
	resp = requests.get(url2).json()
	if 'status' in resp:
		if resp['status']['description'] == "Processing":
			while resp['status']['description'] == "Processing":
				resp = requests.get(url2).json()
	print(resp)
	# print('exit_code ',resp['exit_code'])
	# print('exit_signal ',resp['exit_signal'])
	# print( str(base64.b64decode(resp['stderr'].encode('utf-8').strip()), "utf-8") )
	# print('output response: ',resp['stdout'])
	res = {}
	#Get current user
	currUser = Userdata.objects.get(user_id = request.user)
	if 'error' in resp:
		res['stdout'] = 'error'
	elif resp['status']['description'] != "Accepted":
		if resp['stderr'] is not None:
			res['stdout'] = resp['stderr']
		elif resp['compile_output'] is not None:
			res['stdout'] = resp['compile_output']
		else:
			res['stdout'] = 'error'
	else:
		quesNo = postData['qNo']
		quesData = Question.objects.get(qno= quesNo)
		answer = quesData.test_case1_sol+'\n'+quesData.test_case2_sol+'\n'+quesData.test_case3_sol+'\n'
		print(answer)
		currUser.timeElapsed += int(postData['timeElapsed'])
		if answer == resp['stdout']:
			print('hurray')
			res['stdout'] = 'Correct Answer'
			print(currUser.answerGiven)
			lst = list(currUser.answerGiven)
			print(lst)
			if(lst[quesNo] == '0'):	# if the question is being answered first time
				print('Updating score for question no', )
				lst[quesNo] = '1'
				currUser.answerGiven="".join(lst)
				timepenalty , status =Time_Penalty.objects.get_or_create(player=currUser,question=que)
				timepenalty.time_penalty=int(postData['timeElapsed'])+(0.2*timepenalty.no_wa*que.weight)
				currUser.score+=que.weight
				currUser.total_penalty+=timepenalty.time_penalty
				timepenalty.save()
				currUser.save()
		else:
			timepenalty , status = Time_Penalty.objects.get_or_create(player=currUser,question=que)
			print('hiii')
			print('hola: ',timepenalty)
			print('timepenalty_player',timepenalty.player)
			timepenalty.no_wa+=1
			res['stdout'] = 'Wrong answer..'
			timepenalty.save()
	currUser.save()
	res['score'] = currUser.score
	if currUser.answerGiven == "11111":
		res['completedGame'] = 'true'
	else:
		res['completedGame'] = 'false'
	return HttpResponse(json.dumps(res))

def l_out(request):
	logout(request)
	return render(request,'index.html')

def leaderboard(request):
	leaderboard = Userdata.objects.order_by('-score','total_penalty')
	print(leaderboard)
	username = []
	score = []
	for i in range(10):
		try:
			username.append(leaderboard[i].name)
			score.append(leaderboard[i].score)
		except:
			pass
	
	curr_user = Userdata.objects.get(user_id=request.user)
	curr_score = curr_user.score
	rank = 1
	for player in leaderboard:
		if curr_score < player.score:
			rank += 1

	resp = {'username': username, 'score': score, 'rank': rank}
	return HttpResponse(json.dumps(resp), content_type='application/json')

def getChancesUsed(request):
	res={}
	res['chancesUsed'] = Userdata.objects.get(user_id = request.user).chancesUsed
	return HttpResponse(json.dumps(res))

def increaseClicks(request):
	data = json.loads( request.body.decode('utf-8') )
	clicks = data['clicks']
	user = Userdata.objects.get(user_id = request.user)
	user.chancesUsed = clicks
	user.save()
	res = {}
	res['error'] = 'No Error'
	return HttpResponse(json.dumps(res))
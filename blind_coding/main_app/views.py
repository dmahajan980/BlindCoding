from django.shortcuts import render,redirect
import requests

# Create your views here.
def default(request):
    return render(request,'loggedIn.html')

def index(request):
    return render(request,'index.html')
#
#def login(request):
#    pass
from django.shortcuts import render
from django.http import JsonResponse,HttpResponseRedirect,HttpResponse
from .models import Userdata,Question
from django.contrib.auth import logout
import json
import blind_coding.settings as settings

from django.contrib.auth.decorators import login_required


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
	url = 'https://api.jdoodle.com/execute/'
	print(postData)
	que = Question.objects.get(qno=postData['qNo'])
	postData['stdin'] = '3'+'\n'+que.test_case1+'\n'+que.test_case2+'\n'+que.test_case3
	postData['clientId'] = settings.clientId
	postData['clientSecret'] = settings.clientSecret
	response = requests.post(url,json=postData)
	resp = response.json()
#	resp = json.loads(resp)
	print('qNo',postData['qNo'])
	print('jdoodle response json object: ',resp)
	print('jdoodle output response: ',resp['output'])
	res = {}
	#Get current user
	currUser = Userdata.objects.get(user_id = request.user)

	if resp['output'].find('error') != -1:
		res['output'] = resp['output']
	else:
		quesNo = postData['qNo']
		quesData = Question.objects.get(qno= quesNo)
		answer = quesData.test_case1_sol+'\n'+quesData.test_case2_sol+'\n'+quesData.test_case3_sol+'\n'
		print(answer)
		currUser.timeElapsed += int(postData['timeElapsed'])
		if answer == resp['output']:
			print('hurray')
			res['output'] = 'Correct Answer'
			print(currUser.answerGiven)
			lst = list(currUser.answerGiven)
			print(lst)
			if(lst[quesNo] == '0'):	# if the question is being answered first time
				print('Updating score for question no', )
				lst[quesNo] = '1'
				currUser.answerGiven="".join(lst)
				currUser.score+=10
				currUser.save()
		else:
			res['output'] = 'Wrong answer..'
			
		currUser.save()
	res['score'] = currUser.score
	return HttpResponse(json.dumps(res))

def l_out(request):
    logout(request)
    return render(request,'index.html')

def leaderboard(request):
	leaderboard = Userdata.objects.order_by('-score')
	print(leaderboard)
	username = []
	score = []
	for i in range(10):
		try:
			username.append(leaderboard[i].name)
			score.append(leaderboard[i].score)
		except:
			pass

	resp = {'username': username, 'score': score}

	return HttpResponse(json.dumps(resp), content_type='application/json')

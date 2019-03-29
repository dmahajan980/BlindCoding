from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Userdata(models.Model):
    user_id=models.ForeignKey(User,on_delete=models.CASCADE)
    name=models.CharField(max_length=100)
    score = models.IntegerField(default = 0)
    answerGiven = models.CharField(max_length = 10, default="00000")
    timeElapsed = models.IntegerField(default = 0)
	
    def __str__(self):
            return str(self.user_id.username)

class Question(models.Model):
    qno=models.IntegerField(default=0)
    text = models.CharField(max_length=45000)
    testcaseno=models.IntegerField(default=0)
    samplein = models.CharField(max_length=45000,default='')
    sampleout = models.CharField(max_length=45000,default='')
    test_case1=models.CharField(max_length=1000)
    test_case2=models.CharField(max_length=1000)
    test_case3=models.CharField(max_length=1000)
    test_case1_sol=models.CharField(max_length=1000)
    test_case2_sol=models.CharField(max_length=1000)
    test_case3_sol=models.CharField(max_length=1000)

    def __str__(self):
        return str(self.pk)

from django.contrib import admin
from django.urls import path,include,re_path
from . import views


app_name='quiz'

urlpatterns=[
     path('main/',views.default),
	 path('',views.index),
     path('login/',views.login),
     path('logout/',views.l_out),
	 path('question/',views.question, name='question'),
	 path('main/runCode/',views.runCode, name='runCode')

]

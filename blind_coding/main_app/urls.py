from django.contrib import admin
from django.urls import path,include,re_path
from . import views

app_name='quiz'

urlpatterns=[
     path('main/', views.default, name='main'),
     path('', views.index, name='index'),
     path('login/', views.login, name='login'),
     path('logout/', views.l_out, name='logout'),
     path('question/', views.question, name='question'),
     path('main/runCode/', views.runCode, name='runCode'),
     path('leaderboard/', views.leaderboard, name='leaderboard')
]

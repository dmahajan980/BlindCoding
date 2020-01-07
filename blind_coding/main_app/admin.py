from __future__ import unicode_literals
from django.contrib import admin
from .models import Question,Userdata,Time_Penalty

# Register your models here.
admin.site.register(Question)
admin.site.register(Userdata)
admin.site.register(Time_Penalty)
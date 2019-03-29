from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Userdata

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        userdata=Userdata(user_id=instance,name=instance.username,score=0)
        userdata.save()
    else:
        userdata=Userdata.objects.get(user_id=instance)
        userdata.save()
		
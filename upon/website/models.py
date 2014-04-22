#-*- coding:utf-8 -*-
# from django.db import models
#change ORM with redis
from redisco import models

from django.contrib.auth.models import User
# Create your models here.

class Team(models.Model):
    name = models.Attribute(required=True)
    member = models.ListField(User)

class Project(models.Model):
    name = models.Attribute(required=True)
    team = models.ReferenceField(Team)

class Task(models.Model):
    name = models.Attribute(required=True)
    project = models.ReferenceField(Team)
    detail = models.Attribute()
    starter = models.ReferenceField(User)
    todoer = models.ListField(User)
    deadline = models.DateField()
    starttime = models.DateField()
    priority = models.IntegerField(default=2) #优先级 0-Critical 1-Severe 2-Major   3-Minor
    type = models.IntegerField() #类型 0-Future 1-NextWeek 2-ThisWeek  3-overtime   (delay task will still be this week~!)
    status = models.IntegerField() #状态 0-Wait For Complete(thisweek nextweek future) 1-Cannot complete(rubbishbin) 2-Wait For Confirm 3-total Finished
    createtime = models.DateField(auto_now_add=True)

class Log(models.Model):
    author = models.ReferenceField(User)
    action = models.Attribute()
    createtime = models.DateField(auto_now_add=True)
    task = models.ReferenceField(Task)

class Comment(models.Model):
    author = models.ReferenceField(User)
    content = models.Attribute()
    createtime = models.DateField(auto_now_add=True)
    task = models.ReferenceField(Task)

class Avatar(models.Model):
    user = models.ReferenceField(User)
    avatar = models.Attribute()
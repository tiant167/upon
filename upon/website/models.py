#-*- coding:utf-8 -*-
# from django.db import models
#change ORM with redis
from redisco import models
# Create your models here.
class UserInfo(models.Model):
    id=models.Attribute()
    username = models.Attribute()
    email = models.Attribute()

class Team(models.Model):
    name = models.Attribute(required=True)
    member = models.ListField(UserInfo)

class Project(models.Model):
    name = models.Attribute(required=True)
    team = models.ReferenceField(Team)

class Task(models.Model):   
    name = models.Attribute(required=True)
    project = models.ReferenceField(Project)
    detail = models.Attribute()
    starter = models.ReferenceField(UserInfo)
    todoer = models.ListField(UserInfo)
    deadline = models.DateField()
    priority = models.Attribute(default='2') #优先级 0-Critical 1-Severe 2-Major   3-Minor
    type = models.Attribute() #类型 0-Future 1-NextWeek 2-ThisWeek  3-overtime   (delay task will still be this week~!)
    status = models.Attribute() #状态 0-Wait For Complete(thisweek nextweek future) 1-Cannot complete(rubbishbin) 2-Wait For Confirm 3-total Finished
    createtime = models.DateField(auto_now_add=True)

class Log(models.Model):
    author = models.ReferenceField(UserInfo)
    action = models.Attribute()
    createtime = models.DateField(auto_now_add=True)
    task = models.ReferenceField(Task)

class Comment(models.Model):
    author = models.ReferenceField(UserInfo)
    content = models.Attribute()
    createtime = models.DateField(auto_now_add=True)
    task = models.ReferenceField(Task)

class Avatar(models.Model):
    user = models.ReferenceField(UserInfo)
    avatar = models.Attribute()
#-*- coding:utf-8 -*-
# from django.db import models
#change ORM with redis
from redisco import models
# Create your models here.
#ListField UserInfo 这是有问题的， list append进一个user的所有信息，如果一旦一个用户对用户名进行了修改，就会到只和list里的信息对不上，就会出问题
#现在的解决办法是在list里面只存放用户的id，这样就可以不受用户名修改的原因
#而reference不会出问题，是因为他在reference的时候会增加一个字段用来存储那个对象的id，而我查找reference对象都是通过那个id去找。但是可能有不一致问题，需要看一下

#4月26
#refernce对象会在初始化的时候去校验应用对象是否为最新。所以这里不会有数据一致性问题。
class UserInfo(models.Model):
    id=models.Attribute()
    username = models.Attribute()
    email = models.Attribute()

class Team(models.Model):
    name = models.Attribute(required=True)
    member = models.ListField(str)

class Project(models.Model):
    name = models.Attribute(required=True)
    team = models.ReferenceField(Team,attname="team_id")

class Task(models.Model):   
    name = models.Attribute(required=True)
    project = models.ReferenceField(Project)
    detail = models.Attribute()
    starter = models.ReferenceField(UserInfo)
    todoer = models.ListField(str)
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
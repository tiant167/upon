#-*- coding:utf-8 -*-
from django.db import models
from django.contrib.auth.models import User
# Create your models here.




class Team(models.Model):
    name = models.CharField(max_length=30)
    member = models.ManyToManyField(User)
    
    def __unicode__(self):
        return self.name

class Project(models.Model):
    name = models.CharField(max_length=30)
    team = models.ForeignKey(Team)

    def __unicode__(self):
        return self.name

class Task(models.Model):
    name = models.CharField(max_length=40)
    project = models.ForeignKey(Project)
    detail = models.CharField(max_length=150)
    starter = models.ForeignKey(User,related_name="starter")
    todoer = models.ManyToManyField(User)
    deadline = models.DateField(blank=True,null=True)
    starttime = models.DateField(blank=True,null=True)
    priority = models.IntegerField(default=2) #优先级 0-Critical 1-Severe 2-Major   3-Minor
    type = models.IntegerField() #类型 0-Future 1-NextWeek 2-ThisWeek 3-RubbishBin 
    status = models.IntegerField() #状态 0-Cannot Complete 1-Wait For Complete 2-Wait For Confirm 3-total Finished
    createtime = models.DateField(auto_now=True)

    def __unicode__(self):
        return self.name

class Log(models.Model):
    author = models.ForeignKey(User)
    action = models.CharField(max_length=30)
    createtime = models.DateField(auto_now=True)
    task = models.ForeignKey(Task)

    def __unicode__(self):
        return self.action

class Comment(models.Model):
    author = models.ForeignKey(User)
    content = models.CharField(max_length=140)
    createtime = models.DateField(auto_now=True)
    task = models.ForeignKey(Task)

    def __unicode__(self):
        return self.contet

class Avatar(models.Model):
    user = models.ForeignKey(User)
    avatar = models.CharField(max_length=100)
    
#team1 = Team.objects.create(name=u"测试团队")
#user1 = User.objects.create_user(username=u"123@qq.com",email=u"Tim",password=u"123")
#team1.member.add(user1)
#project1 = Project.objects.create(name=u"广告模块",team=team1)
#task1 = Task.objects.create(name=u"广告模块第一广告位黑盒测试",project=project1,detail=u"针对第一广告位进行黑盒测试，保证各个逻辑分支准确无误",starter=user1,type=2,status=1)
#task1.todoer.add(user1)
#-*- coding:utf-8 -*-
from django.contrib.auth.models import User

from website.models import *

team1 = Team.objects.create(name=u"广告测试团队")
team2 = Team.objects.create(name=u"论坛开发团队")

user1 = User.objects.create_user(username=u"123@123.com",email=u"杜肖请吃饭",password=u"123")
team1.member.add(user1)
team2.member.add(user1)

project1 = Project.objects.create(name=u"广告模块",team=team1)
project2 = Project.objects.create(name=u"推荐位模块",team=team1)
project3 = Project.objects.create(name=u"论坛",team=team1)

project4 = Project.objects.create(name=u"论坛开发",team=team2)
project5 = Project.objects.create(name=u"管理后台开发",team=team2)

task1 = Task.objects.create(name=u"广告模块第一广告位黑盒测试",project=project1,detail=u"针对第一广告位进行黑盒测试，保证各个逻辑分支准确无误",starter=user1,type=2,status=1)
task1.todoer.add(user1)
task2 = Task.objects.create(name=u"广告随机性测试",project=project1,detail=u"随机性是否达标",starter=user1,type=2,status=1,priority=2)
task2.todoer.add(user1)
task3 = Task.objects.create(name=u"投放精准度测试",project=project1,detail=u"精准度测试",starter=user1,type=2,status=1,priority=2)
task3.todoer.add(user1)
task4 = Task.objects.create(name=u"完善文档",project=project1,detail=u"初步完成各个测试文档",starter=user1,type=2,status=1,priority=3)
task4.todoer.add(user1)
task5 = Task.objects.create(name=u"面试一个候选人",project=project1,detail=u"宁缺毋滥",starter=user1,type=2,status=1,priority=3)
task5.todoer.add(user1)
task6 = Task.objects.create(name=u"与渣浪洽谈合作",project=project1,detail=u"渣浪怎么样？有没有合作必要",starter=user1,type=2,status=1,priority=1)
task6.todoer.add(user1)
task7 = Task.objects.create(name=u"收购人人网",project=project1,detail=u"收购人人网",starter=user1,type=2,status=1,priority=0)
task7.todoer.add(user1)

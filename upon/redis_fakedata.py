from django.contrib.auth.models import User

from website.models import *

team1 = Team(name=u"广告测试团队")
team1.save()
team2 = Team(id='2',name=u"论坛开发团队")
team2.save()

user1 = User.objects.create_user(username=u"123@999.com",email=u"杜肖请吃饭",password=u"123")
user2 = User.objects.create_user(username=u"321@999.com",email=u"Mike",password=u"321")

user1 = UserInfo(id=str(user1.id),username=user1.email,email=user1.username)
user1.save()
user2 = UserInfo(id=str(user2.id),username=user2.email,email=user2.username)
user2.save()

avatar1 = Avatar(user=user1,avatar="image/avatar/pole.jpg")
avatar1.save()
avatar2 = Avatar(user=user2,avatar="image/avatar/green.jpg")
avatar2.save()
# team1.member.add(user1)
# team2.member.add(user1)
# team1.member.add(user2)
# team2.member.add(user2)

#ORM Redis
team1.member.append(user1.id)
team2.member.append(user1.id)
team1.member.append(user2.id)
team2.member.append(user2.id)
team1.save()
team2.save()

project1 = Project(name=u"广告模块",team=team1)
project1.save()
project2 = Project(name=u"推荐位模块",team=team1)
project2.save()
project3 = Project(name=u"论坛",team=team1)
project3.save()

project4 = Project(name=u"论坛开发",team=team2)
project4.save()
project5 = Project(name=u"管理后台开发",team=team2)
project5.save()

task1 = Task(name=u"广告模块第一广告位黑盒测试",project=project1,detail=u"针对第一广告位进行黑盒测试，保证各个逻辑分支准确无误",starter=user1,type='2',status='0')
task1.todoer.append(user1)
task1.save()

task2 = Task(name=u"广告随机性测试",project=project1,detail=u"随机性是否达标",starter=user1,type='2',status='0',priority='2')
task2.todoer.append(user1.id)
task2.save()

task3 = Task(name=u"投放精准度测试",project=project1,detail=u"精准度测试",starter=user1,type='2',status='0',priority='2')
task3.todoer.append(user2.id)
task3.save()

task4 = Task(name=u"完善文档",project=project1,detail=u"初步完成各个测试文档",starter=user1,type='2',status='0',priority='3')
task4.todoer.append(user1.id)
task4.save()

task5 = Task(name=u"面试一个候选人",project=project1,detail=u"宁缺毋滥",starter=user1,type='2',status='0',priority='3')
task5.todoer.append(user2.id)
task5.save()

task6 = Task(name=u"与渣浪洽谈合作",project=project1,detail=u"渣浪怎么样？有没有合作必要",starter=user1,type='2',status='0',priority='1')
task6.todoer.append(user2.id)
task6.save()

task7 = Task(name=u"收购人人网",project=project1,detail=u"收购人人网",starter=user1,type='2',status='0',priority='0')
task7.todoer.append(user1.id)
task7.save()

comment1 = Comment(author=user2,content=u"good thing",task=task7)
comment1.save()
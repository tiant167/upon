#-*- coding:utf-8 -*-
from django.shortcuts import render
from django.contrib import auth
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect , HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required
import json
from website.models import *
# Create your views here.

#attention to all
#django的user里面username是unique的，email不是。与我们正好相反，所以现在username存的是邮箱地址，email存的是用户名
def login(request):
    errors = []
    if request.method == 'POST':
        username = request.POST.get('email', '')
        password = request.POST.get('password', '')
        user = auth.authenticate(username=username, password=password)
        if user is not None:
            auth.login(request, user)
            return HttpResponseRedirect("/")
        else:
            # Show an error page
            errors.append('邮箱或密码错误')
    return render(request,'upon/login.html',{'errors':errors,})

def register(request):
    errors = []
    if request.method == 'POST':
        try:
            username = request.POST['email']
            try:
                User.objects.get(username=username)
            except ObjectDoesNotExist:
                password1 = request.POST['password1']
                password2 = request.POST['password2']
                if password1 != password2:
                    errors.append('两次密码不一致，请重新输入~')
                else:
                    email = request.POST['username']
                    user = User.objects.create_user(username=username,email=email,password=password1)
                    user.save()
                    login_user = auth.authenticate(username=username, password=password1)
                    auth.login(request, login_user)
                    render(request,"upon/noteam.html")
            errors.append('邮箱已被注册')       
        except KeyError:
            errors.append('请填写完整的表单')
    return render(request,"upon/register.html",{'errors':errors})
    
def logout(request):
    auth.logout(request)
    return HttpResponseRedirect("/login")

@login_required
def main(request):
    teamList =  Team.objects.filter(member=request.user)
    if not teamList:
        # 这个是没有team的时候渲染的页面，现在还冒得
        # return render(request,'upon/noteam.html')
        return HttpResponseRedirect("/noteam")
    currentTeam = teamList[0]

    projectList = Project.objects.filter(team=currentTeam)
    currentProject = projectList[0]

    taskList = Task.objects.filter(project=currentProject).exclude(type=3) #except rubbishbin task
    taskField = TaskField(taskList)
    taskField.judgePriority()

    return render(request,'upon/main.html',{
        'user':request.user,
        'teams':teamList,
        'projects':projectList,
        'currentWeekTasks':taskField.currentWeekTask,
        'nextWeekTasks':taskField.nextWeekTask,
        'futureTasks':taskField.futureTask,
        })

@login_required
def noteam(request):
    teamList =  Team.objects.filter(member=request.user)
    if  teamList:
        return HttpResponseRedirect("/")
    else:
        return render(request,'upon/noteam.html',{
            'user':request.user,
            })

@login_required
def getTaskDetail(request,taskid):
    #what needs to do ?
    #add logs 
    if taskid:
        try:
            taskDetail = Task.objects.get(id=taskid)
        except ObjectDoesNotExist:
            return HttpResponse(json.dumps({'error_code':'500'}))
        if request.user in taskDetail.project.team.member.all():
            todoerids = ([{'userid':item.id,'username':item.email} for item in taskDetail.todoer.all()])
            # Comment.objects.create(author=request.user,content=u"这个本周五之前给我答复",task=taskDetail)
            comments = Comment.objects.filter(task=taskDetail)
            commentsList = []
            if comments:
                commentsList = ([{'commentid':item.id,'authorid':item.author.id,'authorName':item.author.email,'content':item.content,'createtime':trasferDatetimeToString(item.createtime)} for item in comments])       
            result = {
                'error_code':'0',
                'id':taskDetail.id,
                'name':taskDetail.name,
                'projectid':taskDetail.project.id,
                'detail':taskDetail.detail,
                'starterid':taskDetail.starter.id,
                'todoer':todoerids,
                'deadline':trasferDatetimeToString(taskDetail.deadline),
                'starttime':trasferDatetimeToString(taskDetail.starttime),
                'priority':taskDetail.priority,
                'type':taskDetail.type,
                'status':taskDetail.status,
                'createtime':trasferDatetimeToString(taskDetail.createtime),
                'comments':commentsList,
                }
            return HttpResponse(json.dumps(result))
    return HttpResponse(json.dumps({'error_code':'500'}))

@login_required
def addComment(requests):
    if method == "POST":
        try:
            taskid = request.POST.get("taskid",False)
            content = request.POST.get("content",'')
        except:
            return HttpResponse(json.dumps({'error_code':'500'}))
        author = request.user
        if taskid:
            task = Task.objects.get(id=taskid)
            comment = Comment.objects.create(author=author,content=content,task=task)
            if comment:
                return HttpResponse(json.dumps({'error_code':'0'}))
    return HttpResponse(json.dumps({'error_code':'500'}))

        


########################helper function##########################
def trasferDatetimeToString(time):
    if time == None:
        return None
    else:
        return time.strftime("%Y-%m-%d")


class TaskField:
    def __init__(self,taskList):
        self.currentWeekTask = {'Critical':[],'Severe':[],'Major':[],'Minor':[]}
        self.futureTask = {'Critical':[],'Severe':[],'Major':[],'Minor':[]}
        self.nextWeekTask = {'Critical':[],'Severe':[],'Major':[],'Minor':[]}
        self.taskList = taskList

    def judgePriority(self):
        for task in self.taskList:
            if task.type == 0:
                taskBox = self.futureTask
            elif task.type == 1:
                taskBox = self.nextWeekTask
            elif task.type == 2 :
                taskBox = self.currentWeekTask

            if task.priority == 0:
                taskBox['Critical'].append(task)
            elif task.priority == 1:
                taskBox['Severe'].append(task)
            elif task.priority == 2:
                taskBox['Major'].append(task)
            elif task.priority == 3:
                taskBox['Minor'].append(task)

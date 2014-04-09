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
                    return render(request,"upon/noteam.html")
            errors.append('邮箱已被注册')       
        except KeyError:
            errors.append('请填写完整的表单')
    return render(request,"upon/register.html",{'errors':errors})
    
def logout(request):
    auth.logout(request)
    return HttpResponseRedirect("/login")

@login_required
def main(request,teamid,projectid):
    teamList =  Team.objects.filter(member=request.user)
    if not teamList:
        # 这个是没有team的时候渲染的页面，现在还冒得
        # return render(request,'upon/noteam.html')
        return HttpResponseRedirect("/noteam")
    if teamid == None:
        currentTeam = teamList[0]
    else:
        try:
            currentTeam = Team.objects.get(id=teamid)
        except ObjectDoesNotExist:
            currentTeam = teamList[0]
        if request.user  not in currentTeam.member.all():
            currentTeam = teamList[0]

    projectList = Project.objects.filter(team=currentTeam)
    if projectid == None:
        currentProject = projectList[0]
    else:
        try:
            currentProject = Project.objects.get(id=projectid)
        except ObjectDoesNotExist:
            currentProject = projectList[0]
        if request.user not in currentProject.team.member.all():
            currentProject = projectList[0]

    taskList = Task.objects.filter(project=currentProject).exclude(type=3) #except rubbishbin task
    taskField = TaskField(taskList)
    taskField.judgePriority()

    return render(request,'upon/main.html',{
        'user':request.user,
        'teams':teamList,
        'projects':projectList,
        'currentTeam':currentTeam,
        'currentProject':currentProject,
        'currentWeekTasks':taskField.currentWeekTask,
        'nextWeekTasks':taskField.nextWeekTask,
        'futureTasks':taskField.futureTask,
        'members':currentTeam.member.all(),
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
        if checkUserAndTask(request.user,taskDetail):
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
def addComment(request):
    if request.method == "POST":
        try:
            taskid = request.POST.get("taskid",False)
            content = request.POST.get("content","")
        except:
            return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
        author = request.user
        if taskid:
            task = Task.objects.get(id=taskid)
            if checkUserAndTask(author,task):
                comment = Comment.objects.create(author=author,content=content,task=task)
                if comment:
                    return HttpResponse(json.dumps({'error_code':'0'}))
                else:
                    return HttpResponse(json.dumps({'error_code':'502','error_message':'internal mistake'}))
            else:
                return HttpResponse(json.dumps({'error_code':'503','error_message':'not your belongings'}))
    return HttpResponse(json.dumps({'error_code':'500','error_message':'wrong method'}))

@login_required
def addTask(request):
    if request.method == "POST":
        try:
            taskid = request.POST.get("taskid","0")
            projectid = request.POST.get("projectid",False)
            name = request.POST.get("name",False)
            detail = request.POST.get("detail","")
            deadline = request.POST.get("deadline","")
            starttime = request.POST.get("starttime","")
            priority = request.POST.get("priority","2")
            type = request.POST.get("type","0")
            todoers = request.POST.getlist("todoer",[])
        except:
            return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
        if projectid and name:
            #new task
            project = Project.objects.get(id=projectid)
            if type == "2":
                status = "1"
            else:
                status = "0"
            if starttime == "":
                starttime = None
            if deadline == "":
                deadline = None
            if taskid =="0":
                newTask = Task.objects.create(
                    project=project,
                    name=name,
                    detail=detail,
                    starter=request.user,
                    deadline=deadline,
                    starttime=starttime,
                    priority=priority,
                    type=type,
                    status=status
                    )
            else:
                #no test
                oldTask = Task.objects.get(id=taskid)
                if checkUserAndTask(request.user,oldTask):
                    oldTask.name = name
                    oldTask.detail = detail
                    oldTask.deadline = deadline
                    oldTask.starttime = starttime
                    oldTask.priority = priority
                    oldTask.type = type
                    oldTask.status = status
                    oldTask.save()
                    oldTask.member.all().delete()
                else:
                    return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
            if todoers:
                for todoer in todoers:
                    newTask.todoer.add(User.objects.get(id=todoer))
            return HttpResponse(json.dumps({'error_code':'0','taskid':newTask.id}))
        else:
            return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
    else:
        return HttpResponse(json.dumps({'error_code':'500','error_message':'wrong method'}))


@login_required
def getTaskByProjectid(request,projectid):
    try:
        project = Project.objects.get(id=projectid)
    except ObjectDoesNotExist:
        return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
    taskList = Task.objects.filter(project=project).exclude(type=3)
    taskField = TaskField(taskList)
    taskField.judgePriorityWithJson()

    return HttpResponse(json.dumps({'current_week':taskField.currentWeekTask,'next_week':taskField.nextWeekTask,'future_task':taskField.futureTask}))

@login_required
def addProject(request):
    if request.method == "POST":
        projectName = request.POST.get("projectname",False)
        teamid = request.POST.get("teamid",False)
        if projectName and teamid:
            team = Team.objects.get(id=teamid)
            #check if this project name is existed in this team
            existProject = Project.objects.filter(team=team,name=projectName)
            if existProject:
                        return HttpResponse(json.dumps({'error_code':'502','error_message':'same name'}))
            newProject = Project.objects.create(name=projectName,team=team)
            return HttpResponse(json.dumps({'error_code':'0','projectid':newProject.id}))
        else:
            return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
    else:
        return HttpResponse(json.dumps({'error_code':'500','error_message':'wrong method'}))


########################helper function##########################
def checkUserAndTask(user,task):
    if user in task.project.team.member.all():
        return True
    else:
        return False

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
    def judgePriorityWithJson(self):
        for task in self.taskList:
            if task.type == 0:
                taskBox = self.futureTask
            elif task.type == 1:
                taskBox = self.nextWeekTask
            elif task.type == 2 :
                taskBox = self.currentWeekTask
            #here only give name and starttime deadline
            if task.priority == 0:    
                taskBox['Critical'].append({'name':task.name,'deadline':trasferDatetimeToString(task.deadline),'starttime':trasferDatetimeToString(task.starttime)})
            elif task.priority == 1:
                taskBox['Severe'].append({'name':task.name,'deadline':trasferDatetimeToString(task.deadline),'starttime':trasferDatetimeToString(task.starttime)})
            elif task.priority == 2:
                taskBox['Major'].append({'name':task.name,'deadline':trasferDatetimeToString(task.deadline),'starttime':trasferDatetimeToString(task.starttime)})
            elif task.priority == 3:
                taskBox['Minor'].append({'name':task.name,'deadline':trasferDatetimeToString(task.deadline),'starttime':trasferDatetimeToString(task.starttime)})
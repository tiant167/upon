#-*- coding:utf-8 -*-
from django.shortcuts import render
from django.contrib import auth
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect , HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required
import json,datetime
from website.models import *
from django.db.models import Q
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
                    avatarsrc = request.POST.get('avatar','image/avatar/red.jpg') 
                    Avatar.objects.create(user=user,avatar=avatarsrc)
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

    taskList = Task.objects.filter(Q(project=currentProject) & Q(status=0) | Q(status=2)).exclude(type=3) #except rubbishbin task
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
            todoers = request.POST.get("todoer",'')
            status = request.POST.get("status",0)
        except:
            return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
        if projectid and name:
            #new task
            project = Project.objects.get(id=projectid)
            if starttime == "":
                starttime = None
            if deadline == "":
                deadline = None
            if taskid =="0":
                task = Task.objects.create(
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
                task = Task.objects.get(id=taskid)
                if checkUserAndTask(request.user,task):
                    task.name = name
                    task.detail = detail
                    task.deadline = deadline
                    task.starttime = starttime
                    task.priority = priority
                    task.type = type
                    task.status = status
                    task.todoer.clear()
                    
                else:
                    return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
            
            if todoers:
                todoers = todoers.split(',')
                for todoer in todoers:
                    task.todoer.add(User.objects.get(id=todoer))
            task.save()
            if type != 3:
                taskList = fetchTaskListHelper(project,type)
                return render(request,"upon/ajax-tasklist.html",{'taskList':taskList})
            else:
                return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
        else:
            return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
    else:
        return HttpResponse(json.dumps({'error_code':'500','error_message':'wrong method'}))

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

@login_required
def addTeam(request):
    if request.method == "POST":
        teamName = request.POST.get("name",False)
        member = request.POST.get("member",False)
        if teamName and member:
            team = Team.objects.create(name=teamName)
            Project.objects.create(name=u"默认项目",team=team)
            memberList = member.split(",")
            try:
                for uid in memberList:
                    user = User.objects.get(id=uid)
                    team.member.add(user)
            except ObjectDoesNotExist:
                return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
            return HttpResponse(json.dumps({'error_code':'0','teamid':team.id}))
        else:
            return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
    else:
        return HttpResponse(json.dumps({'error_code':'500','error_message':'wrong method'}))

@login_required
def updateTeam(request):
    if request.method == "POST":
        teamid = request.POST.get("teamid",False)
        member = request.POST.get("member",False)
        if teamid and member:
            try:
                team = Team.objects.get(id=teamid)
                memberList = member.split(",")
                if len(memberList) > 0 and request.user in team.member.all():
                    team.member.clear()
                else:
                    return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
                for uid in memberList:
                    user = User.objects.get(id=uid)
                    team.member.add(user)
                team.save()
            except ObjectDoesNotExist:
                return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
            return HttpResponse(json.dumps({'error_code':'0','teamid':team.id}))
        else:
            return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
    else:
        return HttpResponse(json.dumps({'error_code':'500','error_message':'wrong method'}))

@login_required
def deleteTask(request):
    if request.method == "POST":
        taskid = request.POST.get("taskid",False)
        if taskid:
            try:
                task = Task.objects.get(id=taskid)
            except ObjectDoesNotExist:
                return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
            if checkUserAndTask(request.user, task):
                task.status = 1
                task.save()
                return HttpResponse(json.dumps({'error_code':'0'}))
            else:
                return HttpResponse(json.dumps({'error_code':'502','error_message':'not your belongings'}))
        else:
            return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
    else:
        return HttpResponse(json.dumps({'error_code':'500','error_message':'wrong method'}))

@login_required
def deleteProject(request):
    if request.method == "POST":
        projectid = request.POST.get("projectid",False)
        if projectid:
            try:
                project = Project.objects.get(id=projectid)
            except ObjectDoesNotExist:
                return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
            if request.user in project.team.member.all():
                project.delete()
                return HttpResponse(json.dumps({'error_code':'0'}))
            else:
                return HttpResponse(json.dumps({'error_code':'502','error_message':'not your belongings'}))
        else:
            return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
    else:
        return HttpResponse(json.dumps({'error_code':'500','error_message':'wrong method'}))

@login_required
def fetchMyTask(request,projectid):
    if projectid:
        try:
            project = Project.objects.get(id=projectid)
        except ObjectDoesNotExist:
            return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
        if request.user in project.team.member.all():
            taskList = Task.objects.filter(project=project,todoer=request.user,status=0).exclude(type=3)
            taskField = TaskField(taskList)
            taskField.judgePriority()
            resultList = {
                'currentWeek':taskField.currentWeekTask['Critical']+taskField.currentWeekTask['Severe']+taskField.currentWeekTask["Major"]+taskField.currentWeekTask['Minor'],
                'future':taskField.nextWeekTask['Critical']+taskField.futureTask['Critical']+taskField.nextWeekTask['Severe']+taskField.futureTask['Severe']+taskField.nextWeekTask['Major']+taskField.futureTask['Major']+taskField.nextWeekTask['Minor']+taskField.futureTask['Minor'], 
            }
            return render(request,"upon/mytask.html",{'currentWeek':resultList['currentWeek'],'future':resultList['future']})
        else:
            return HttpResponse(json.dumps({'error_code':'502','error_message':'not your belongings'}))
    else:
        return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))

@login_required
def fetchConfirmTask(request,projectid):
    if projectid:
        try:
            project = Project.objects.get(id=projectid)
        except ObjectDoesNotExist:
            return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
        if request.user in project.team.member.all():
            taskList = Task.objects.filter(project=project,starter=request.user,status=2)
            return render(request,"upon/confirm.html",{'taskList':taskList})
        else:
            return HttpResponse(json.dumps({'error_code':'502','error_message':'not your belongings'}))
    else:
        return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))

@login_required
def fetchRubbishTask(request,projectid):
    if projectid:
        try:
            project = Project.objects.get(id=projectid)
        except ObjectDoesNotExist:
            return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
        if request.user in project.team.member.all():
            taskList = Task.objects.filter(project=project,status=1)
            thisWeekList = []
            otherWeekList = []
            for task in  taskList:
                if task.type == 3:
                    otherWeekList.append(task)
                else:
                    thisWeekList.append(task)
            return render(request,"upon/rubbishbin.html",{'thisWeekList':thisWeekList,'otherWeekList':otherWeekList})
        else:
            return HttpResponse(json.dumps({'error_code':'502','error_message':'not your belongings'}))
    else:
        return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))

@login_required
def fetchCompletedTask(request,projectid):
    if projectid:
        try:
            project = Project.objects.get(id=projectid)
        except ObjectDoesNotExist:
            return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
        if request.user in project.team.member.all():
            taskList = Task.objects.filter(project=project,status=3)
            thisWeekList = []
            otherWeekList = []
            for task in  taskList:
                if task.type == 3:
                    otherWeekList.append(task)
                else:
                    thisWeekList.append(task)
            return render(request,"upon/completed.html",{'thisWeekList':thisWeekList,'otherWeekList':otherWeekList})
        else:
            return HttpResponse(json.dumps({'error_code':'502','error_message':'not your belongings'}))
    else:
        return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))

@login_required
def changeTaskStatus(request,status):
    if request.method == "POST" and status in (0,1,2,3):
        taskid = request.POST.get("taskid",0)
        try:
            task = Task.objects.get(id=taskid)
        except ObjectDoesNotExist:
            return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
        if checkUserAndTask(request.user,task):
            task.status = status
            task.save()
            return HttpResponse(json.dumps({'error_code':'0','error_message':'success'}))
        else:
            return HttpResponse(json.dumps({'error_code':'502','error_message':'not yours'}))    
    else:
        return HttpResponse(json.dumps({'error_code':'500','error_message':'wrong method'}))


@login_required
def fetchTaskList(request,projectid,type):
    #week 2-current week  1-next week  0-future
    try:
        project = Project.objects.get(id=projectid)
        taskList = fetchTaskListHelper(project,type)
    except ObjectDoesNotExist:
        return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
    return render(request,"upon/ajax-tasklist.html",{'taskList':taskList})
    
def fetchConfirmNum(request,projectid):
    if projectid:
        try:
            project = Project.objects.get(id=projectid)
        except ObjectDoesNotExist:
            return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
        if request.user in project.team.member.all():
            taskList = Task.objects.filter(project=project,starter=request.user,status=2)
            return HttpResponse(json.dumps({'error_code':'0','confirm':len(taskList)}))
        else:
            return HttpResponse(json.dumps({'error_code':'502','error_message':'not your belongings'}))
    else:
        return HttpResponse(json.dumps({'error_code':'501','error_message':'wrong arguments'}))
def fetchAvatar(request,userid):
    try:
        user = User.objects.get(id=userid)
        useravatar = Avatar.objects.filter(user=user)
        avatar = useravatar[0].avatar
    except ObjectDoesNotExist:
        avatar = 'image/avatar/red.jpg'
    #static url need to change by yourself when static file is changed
    f = open('./website/static/'+avatar, "rb")
    return HttpResponse(f.read(), mimetype="image/jpeg")

def searchPerson(request):
    keywords = request.GET.get('query','')
    result = User.objects.filter(username__contains=keywords)
    return HttpResponse(json.dumps({'suggestions':[{'value':item.username+' - '+item.email,'data':item.id} for item in result]}))

########################helper function##########################
def fetchTaskListHelper(project,type):
    tasks = Task.objects.filter(Q(project=project) & Q(type=type) & Q(status=0) | Q(status=2))
    taskList = {'type':type,'Critical':[],'Severe':[],'Major':[],'Minor':[],'Finished':[]}
    for task  in tasks:
        if task.type == 2 and task.status == 2:
            taskList['Finished'].append(task)
            continue

        if task.priority == 0:
            taskList['Critical'].append(task)
        elif task.priority == 1:
            taskList["Severe"].append(task)
        elif task.priority == 2:
            taskList["Major"].append(task)
        elif task.priority == 3:
            taskList['Minor'].append(task)
    return taskList
    

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
        self.currentWeekTask = {'Critical':[],'Severe':[],'Major':[],'Minor':[],'Finished':[]}
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

            if task.status == 2 and task.type == 2:
                taskBox['Finished'].append(task)
            else:
                if task.priority == 0:
                    taskBox['Critical'].append(task)
                elif task.priority == 1:
                    taskBox['Severe'].append(task)
                elif task.priority == 2:
                    taskBox['Major'].append(task)
                elif task.priority == 3:
                    taskBox['Minor'].append(task)
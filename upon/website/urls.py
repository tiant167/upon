from django.conf.urls import patterns, url
from website import views

urlpatterns = patterns('',
    url(r'^$',views.main,{'teamid':None,'projectid':None},name='main'),
    url(r'^(?P<teamid>\d+)/$',views.main,{'projectid':None}),
    url(r'^(?P<teamid>\d+)/(?P<projectid>\d+)/$',views.main),
    url(r'^login/$',views.login,name='login'),
    url(r'^register/$',views.register,name='register'),
    url(r'^logout/$',views.logout,name='logout'),
    url(r'^noteam/$',views.noteam,name='noteam'),
    url(r'^gettaskdetail/(?P<taskid>\d+)/$',views.getTaskDetail),
    url(r'^addcomment/$',views.addComment),
    url(r'^addtask/$',views.addTask,name="addtask"),
    url(r'^addproject/$',views.addProject),
    url(r'^addteam/$',views.addTeam),
    url(r'^updateteam/$',views.updateTeam),
    url(r'^deletetask/$',views.deleteTask),
    url(r'^deleteproject/$',views.deleteProject),
    url(r'^mytask/(?P<projectid>\d+)/$',views.fetchMyTask),
    url(r'^confirmtask/(?P<projectid>\d+)/$',views.fetchConfirmTask),
    url(r'^rubbishbin/(?P<projectid>\d+)/$',views.fetchRubbishTask),
    url(r'^completed/(?P<projectid>\d+)/$',views.fetchCompletedTask),
    url(r'^avatar/(?P<userid>\d+)/$',views.fetchAvatar),
    url(r'^completetask/$',views.changeTaskStatus,{'status':2}),
    url(r'^incompletetask/$',views.changeTaskStatus,{'status':0}),
    url(r'^confirmtask/$',views.changeTaskStatus,{'status':3}),
    url(r'^gettask/(?P<projectid>\d+)/(?P<type>\d+)/$',views.fetchTaskList),
    url(r'^getconfirmnum/(?P<projectid>\d+)/$',views.fetchConfirmNum),
    url(r'^searchperson/$',views.searchPerson),
    url(r'^updatepersonalinfo/$',views.updatePersonalInfo),

)

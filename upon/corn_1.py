#-*- coding:utf-8 -*-
from website.models import *

#彻底完成的任务 type 改为 overtime
finishedTaskList = Task.objects.filter(status=3)
for item in finishedTaskList:
    item.type=3
    item.save()



rubbishTaskList = Task.objects.filter(status=1)
for item in rubbishTaskList:
    item.type=3
    item.save()


#待确认的不动，仍为本周，已完成


#未完成的，delay到下周，优先级提高，也就是说，type不变，status不变，priority=0,name+=Delay
taskList = Task.objects.filter(status=0,type=2)
for item in taskList:
    item.priority = 0
    item.name = u"Delay: " + item.name
    item.save()



#下周任务，提到本周，就是说  type=2
nextWeekTaskList = Task.objects.filter(type=1,status=0)
for item in nextWeekTaskList:
    item.type = 2
    item.save()


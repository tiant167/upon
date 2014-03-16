#-*- coding:utf-8 -*-
from django.shortcuts import render
from django.contrib import auth
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required
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
                    return HttpResponseRedirect("/")
            errors.append('邮箱已被注册')       
        except KeyError:
            errors.append('请填写完整的表单')
    return render(request,"upon/register.html",{'errors':errors})
    
@login_required
def main(request):
    return render(request,'upon/main.html')
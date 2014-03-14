#-*- coding:utf-8 -*-
from django.shortcuts import render
from django.contrib import auth
from django.http import HttpResponseRedirect
# Create your views here.
def login(request):
    errors = []
    if request.method == 'POST':
        username = request.POST.get('email', '')
        password = request.POST.get('password', '')
        user = auth.authenticate(username=username, password=password)
        if user is not None and user.is_active:
            # Correct password, and the user is marked "active"
            auth.login(request, user)
            # Redirect to a success page.
            return HttpResponseRedirect("upon/main.html")
        else:
            # Show an error page
            errors.append('邮箱或密码错误');
    return render(request,'upon/login.html')

def register(request):
    return render(request,'upon/register.html')

def main(request):
    return render(request,'upon/main.html')
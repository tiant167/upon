#-*- coding:utf-8 -*-
from django.shortcuts import render
from django.contrib import auth
from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponseRedirect
# Create your views here.
def login(request):
    errors = []
    if request.method == 'POST':
        email = request.POST.get('email', '')
        password = request.POST.get('password', '')
        user = auth.authenticate(email=email, password=password)
        if user is not None and user.is_active:
            # Correct password, and the user is marked "active"
            auth.login(request, user)
            # Redirect to a success page.
            return HttpResponseRedirect("upon/main.html")
        else:
            # Show an error page
            errors.append('邮箱或密码错误')
    return render(request,'upon/login.html',{'errors':errors,})

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            new_user = form.save()
            return HttpResponseRedirect("upon/main.html")
    else:
        form = UserCreationForm()
    return render(request,"upon/register.html", {
        'form': form,
    })
    

def main(request):
    return render(request,'upon/main.html')
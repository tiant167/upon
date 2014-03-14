from django.shortcuts import render

# Create your views here.
def login(request):
    return render(request,'upon/login.html')

def register(request):
    return render(request,'upon/register.html')

def main(request):
    return render(request,'upon/main.html')
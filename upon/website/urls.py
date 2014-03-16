from django.conf.urls import patterns, url
from website import views

urlpatterns = patterns('',
    url(r'^$',views.main,name='main'),
    url(r'^login/$',views.login,name='login'),
    url(r'^register/$',views.register,name='register'),
    url(r'^logout/$',views.logout,name='logout'),
)

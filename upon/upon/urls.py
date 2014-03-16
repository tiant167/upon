from django.conf.urls import patterns, include, url
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'upon.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^', include('website.urls',namespace='upon')),
    url(r'^accounts/',include('website.urls')),
    url(r'^admin/', include(admin.site.urls)),
)

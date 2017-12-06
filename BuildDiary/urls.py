# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic.base import RedirectView
import xadmin
xadmin.autodiscover()
from xadmin.plugins import xversion
xversion.register_models()
from Projects.views import *
from BuildDiary import settings

urlpatterns = patterns('',
    url(r'^admin/', include(xadmin.site.urls)),
    url(r'^$', RedirectView.as_view(url='/index/')),
    url(r'^adminplat/', RedirectView.as_view(url='/admin/Projects/project/')),
    url(r'^index/$', index_view),
    url(r'^login/$', login),
    url(r'^applogin/$', applogin),
    url(r'^uploadfile_conc/$',uploadfile_conc),
    url(r'^uploadfile_blob/$',uploadfile_blob),
    url( r'^upload/(?P<path>.*)$', 'django.views.static.serve', { 'document_root': settings.UPLOAD_DIR } ),
    url(r'^shigongriji/$', shigongriji),
    url(r'^shigongrijiByDate/$', shigongrijiByDate),
    url(r'^shigongrijiByProject/$', shigongrijiByProject),
    url(r'^viewpdf/$', viewpdf),
    url(r'^getWeatherToday/$', getWeatherToday),
)

urlpatterns += patterns ('',
    url(r'^projects/', include('Projects.urls')),
    url(r'^user/', include('User.urls')),
    url(r'^file/', include('File.urls')),
)

if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'xadmin/(?P<path>.*)$','django.views.static.serve',{'document_root':settings.STATIC_ROOT+'xadmin/','show_indexes': True}),
        url(r'plugins/(?P<path>.*)$','django.views.static.serve',{'document_root':settings.STATIC_ROOT+'plugins/','show_indexes': True}),
        url(r'css/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT+'css/','show_indexes': True }),
        url(r'images/(?P<path>.*)$','django.views.static.serve',{'document_root':settings.STATIC_ROOT+'images/','show_indexes': True}),
        url(r'textures/(?P<path>.*)$','django.views.static.serve',{'document_root':settings.STATIC_ROOT+'textures/','show_indexes': True}),
        url(r'img/(?P<path>.*)$','django.views.static.serve',{'document_root':settings.STATIC_ROOT+'img/','show_indexes': True}),
        url(r'font/(?P<path>.*)$','django.views.static.serve',{'document_root':settings.STATIC_ROOT+'font/','show_indexes': True}),
        url(r'js/(?P<path>.*)$','django.views.static.serve',{'document_root':settings.STATIC_ROOT+'js/','show_indexes': True}),
        # url(r'media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT,'show_indexes': True}),
    )


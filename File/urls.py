# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic.base import RedirectView
from .views import *
import os
from rest_framework import routers, serializers, viewsets

router = routers.DefaultRouter()
router.register(r'wxfile', WXfileSet)

urlpatterns = patterns('File.views',
    url(r'^uploadWXfile/$', uploadWXfile),
    url(r'^rest/', include(router.urls)),
    # url(r'^rest/projects/get$', ProjectSet.as_view()),
)
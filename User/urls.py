# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
from User.views import *
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'department', DepartmentSet)
router.register(r'user', UserSet)
router.register(r'message', MessageSet)
router.register(r'userProject', UserProjectSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^logout/$',logout),
    url(r'^fetch_vcode/$', fetch_vcode),
    url(r'^fetchTK/$', fetchTK),
    url(r'^self/$',getself),
    url(r'^rest/', include(router.urls)),
]

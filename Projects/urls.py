# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic.base import RedirectView
from Projects.views import *
import os
from rest_framework import routers, serializers, viewsets

router = routers.DefaultRouter()
router.register(r'company', CompanySet)
router.register(r'document', DocumentSet)
router.register(r'projectfile', ProjectFileSet)
router.register(r'project', ProjectSet)
router.register(r'city', CitySet)
router.register(r'engineering', EngineeringSet)
router.register(r'branchengineering', BranchEngineeringSet)
router.register(r'JSFA', JSFASet)
router.register(r'WXYSet', WXYSet)
router.register(r'ProcedureSet', ProcedureSet)
router.register(r'procedurefile', ProcedureFileSet)
router.register(r'dangerengineeringfile', JSFAFileSet)
router.register(r'Records', RecordSet)
router.register(r'RecordWorks', RecordWorkSet)
router.register(r'RecordWorkTypes', RecordWorkTypeSet)

router.register(r'recordfile', RecordFileSet)

urlpatterns = patterns('Projects.views',
    url(r'^importengineer/$', importengineer),
    url(r'^addprojectfile/$', addprojectfile),
    url(r'^getProjectSpStatus/$', getProjectSpStatus),
    url(r'^getProjectSpyj/$', getProjectSpyj),
    url(r'^getProjectAttach/$', getProjectAttach),
    url(r'^loadBranchEngineerings/$', loadBranchEngineerings),
    url(r'^rest/', include(router.urls)),
    # url(r'^rest/projects/get$', ProjectSet.as_view()),
)

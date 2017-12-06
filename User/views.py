# -*- coding: utf-8 -*-
import traceback,json,sys,datetime,types,random,time,urllib2,urllib,cookielib,requests
from django.contrib import auth
from django.http import HttpResponse, HttpResponseRedirect
from django.template.loader import get_template
from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required
from django.shortcuts import render,render_to_response
from django.template import loader,Context,RequestContext
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from User.utility import *
from .serializers import *
import rest_framework_filters
from .models import *
from rest_framework import viewsets
from django.core import serializers 
from rest_framework.authentication import SessionAuthentication
from django_filters.rest_framework import DjangoFilterBackend

class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening

@csrf_exempt
def fetchTK(request):
    response_data = {"res":True}
    url = request.GET.get('urlpath')  
    if checkMobile(request):
        config={}
        ticket, appid, access_token = fetch_ticket()
        
        sign = Sign(ticket, url)
        
        config = sign.sign()
        config["appid"] = appid
        response_data['config'] = config
        response_data['access_token'] = access_token
    else:
        response_data = {"res":False}
       
    return HttpResponse(json.dumps(response_data), content_type="application/json")

class UserFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = User
        fields = {
            'username': ['exact', 'in'],
            'contract':['exact', 'in'],
        }
        
class UserSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    queryset = User.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filter_class = UserFilter

class MessageFilters(rest_framework_filters.FilterSet):
    class Meta:
        model = Message
        fields = {
            'touser_id': ['exact',],
            'project_id': ['exact',],
            'msgtype': ['exact',],
        }

class MessageSet(viewsets.ModelViewSet):
    queryset = Message.objects.all().order_by("opened","-createtime")
    serializer_class = MessageSerializer
    filter_backends = (DjangoFilterBackend,)
    filter_class = MessageFilters
    authentication_classes = (CsrfExemptSessionAuthentication, )
 
class UserProjectFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = UserProject
        fields = {
            'user_id': ['exact', 'in'],
            'project_id': ['exact', 'in'],
        }
  
class UserProjectSet(viewsets.ModelViewSet):
    queryset = UserProject.objects.all()
    serializer_class = UserProjectSerializer
    filter_backends = (DjangoFilterBackend,)
    filter_class = UserProjectFilter
    authentication_classes = (CsrfExemptSessionAuthentication, )
    
class DepartmentSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer   
     
def getself(requests):
    return HttpResponse(json.dumps({'id':requests.user.id,'truename':requests.user.truename}), content_type="application/json")

@csrf_exempt
def fetch_vcode(request):   
    response_data = {}
    username = request.POST.get('number')
    try:
        if len(username)!=11: 
            response_data["tip"] = "手机号码不合法！"
        else:
            if User.objects.filter(username=username):
                tgtUser = User.objects.get(username=username)
                vcode = str(random.randint(1000,9999))
                if send_mobile_msg(User.objects.get(username=username), vcode):
                    tgtUser.set_password(vcode)
                    tgtUser.save()
                    response_data["tip"] = "验证码发送成功！"
                    response_data["success"] = "验证码发送成功！"
                else:
                    response_data["tip"] = "请稍后再试！"
            else:
                response_data["tip"] = "用户未授权！"
                response_data["show_alert"] = True
            
    except:
        traceback.print_exc()
        response_data["tip"] = "获取失败！"
    
    return HttpResponse(json.dumps(response_data), content_type="application/json" )


@login_required(login_url="/login/")  
def logout(request):
    auth.logout(request)
    return HttpResponseRedirect("/login/")
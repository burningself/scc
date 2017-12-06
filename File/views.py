# -*- coding: utf-8 -*-
import traceback, json

from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import *
from .utility import *
from rest_framework.renderers import JSONRenderer
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.http import HttpResponse, HttpResponseRedirect

# Create your views here.

class SelfPagination(PageNumberPagination):
    page_size = 15

class WXfileSet(viewsets.ModelViewSet):
    queryset = WXfile.objects.all()
    serializer_class = WXfileSerializer
    pagination_class = SelfPagination
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('relatetype','relateid')
    
@csrf_exempt
def uploadWXfile(request):
    response_data = {}
    response_data['issuc'] = True
    docidList = []
    docList = []
    try:
        '''  relatetype: XM,WD,GX  ''' 
        userid = int(request.POST.get("userid",1))
        relatetype= request.POST.get('relatetype')
        relateid=int(request.POST.get('relateid',1))
        imgtype=request.POST.get('imgtype','jpg')
        mediaList = request.POST.get('mediaStr',"").split(":")
        
        print mediaList
        docidList, docList= uploadfile_weixin(mediaList, userid, relatetype, relateid, imgtype)
        response_data['docidList'] = docidList
        response_data['docList'] = docList
    except:
        response_data['issuc'] = False
        traceback.print_exc()
    return HttpResponse(json.dumps(response_data), content_type="application/json")

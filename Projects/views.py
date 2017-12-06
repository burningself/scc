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
from django.db.models import Q
from openpyxl import Workbook
from openpyxl import load_workbook
from dss.Serializer import serializer
from decimal import Decimal
from BuildDiary.utils import *
from Projects.models import *
from Projects.utility import *
from Projects.serializers import *
from BuildDiary import settings
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from Projects.fileutil import *
import Projects.workpeopleforview 
import Projects.body 
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.authentication import SessionAuthentication
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import renderer_classes
from rest_framework.renderers import StaticHTMLRenderer
import rest_framework_filters
import pdfkit
from django.http import StreamingHttpResponse

class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening

@csrf_exempt
def login(request):
    try:
        curtime=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime());
        template=None
        if checkMobile(request):
            template = 'projects/mobile_login.html'
        else:
            template= 'projects/login.html'
        if request.method=='GET':
            return render_to_response(template,RequestContext(request,{'curtime':curtime}))
        elif request.method=='POST':
            username=request.POST.get('username','')
            password=request.POST.get('password','')
            nextpage = request.POST.get('next',"/index/")
            user= auth.authenticate(username=username,password=password)
            if user and user.is_active:
                auth.login(request,user)
                return HttpResponseRedirect(nextpage)
            else:
                tip = u'账号或密码错误'
                return render_to_response(template, RequestContext(request, locals()))
        return render_to_response(template,RequestContext(request,{'curtime':curtime}))
    except:
        traceback.print_exc()

@csrf_exempt
def applogin(request):
    response_data = {}
    response_data['issuc'] = True
    try:
        if request.method=='GET':
            response_data['msg'] = u'登陆异常'
        elif request.method=='POST':
            username=request.POST.get('username','')
            password=request.POST.get('password','')
            user= auth.authenticate(username=username,password=password)
            if user and user.is_active:
                auth.login(request,user)
                response_data['msg'] = u'登陆成功'
            else:
                response_data['issuc'] = False
                response_data['msg'] = u'账号或密码错误'
    except:
        response_data['msg'] = u'登陆异常'
        response_data['issuc'] = False
        traceback.print_exc()
    return HttpResponse(json.dumps(response_data), content_type="application/json")

@login_required(login_url="/login/")
def index_view(request):
    response_data = {}
    response_data['issuc'] = True
    try:
        templateName = 'projects/index.html'
        isMobile = checkMobile(request)
        print isMobile
        if isMobile:
            templateName = 'projects/mobile/index.html'
    except Exception as e:
        raise e
    print templateName
    if isMobile:
        return render_to_response(templateName, RequestContext(request, locals()))
    else:
        return render_to_response(templateName, RequestContext(request, locals()))
        response_data['isMobile'] = isMobile
        return HttpResponse(json.dumps(response_data,encoding="UTF-8",ensure_ascii=False), content_type="application/json")
    
@csrf_exempt
def addprojectfile(request):
    response_data = {}
    response_data["issuc"]=True
    try:
        project_id = int(request.POST.get('project_id'))
        file_id = int(request.POST.get('file_id'))
        projectfileitem = ProjectFile.objects.create(file_id=file_id,project_id=project_id)
        response_data['fileinfo'] = serializer(Document.objects.get(id=file_id))
        response_data['projectfileitem'] = serializer(serializer(projectfileitem))
        print json.dumps(response_data)
    except Exception, e:
        response_data["issuc"]="false"
        traceback.print_exc()

    return HttpResponse(json.dumps(response_data), content_type="application/json")

@csrf_exempt
def getProjectSpStatus(request):
    response_data = {}
    response_data["issuc"]=True
    try:
        jsfa_id = int(request.POST.get('jsfa_id'))
        response_data['spstatus'] = getSGFAWFStatus(jsfa_id)
    except Exception, e:
        response_data["issuc"]=False
        traceback.print_exc()

    return HttpResponse(json.dumps(response_data), content_type="application/json")

@csrf_exempt
def getProjectSpyj(request):
    response_data = {}
    response_data["issuc"]=True
    try:
        jsfa_id = int(request.POST.get('jsfa_id'))
        response_data['spyj'] = getSGFAWFDealInfo(jsfa_id)
    except Exception, e:
        response_data["issuc"]=False
        traceback.print_exc()

    return HttpResponse(json.dumps(response_data), content_type="application/json")

@csrf_exempt
def getProjectAttach(request):
    response_data = {}
    response_data["issuc"]=True
    try:
        jsfa_id = int(request.POST.get('jsfa_id'))
        response_data['attachments'] = getSGFAWFAttachInfo(jsfa_id)
    except Exception, e:
        response_data["issuc"]=False
        traceback.print_exc()

    return HttpResponse(json.dumps(response_data), content_type="application/json")

class BranchEngineeringView(APIView):
    renderer_classes = (JSONRenderer, )
    authentication_classes = (CsrfExemptSessionAuthentication, )
    def get(self, request, format=None):
        user_count = BranchEngineering.objects.filter().count()
        content = {'user_count': user_count}
        return Response(content)
    
@api_view(('GET',))
@renderer_classes((StaticHTMLRenderer,))
def simple_html_view(request):
    data = '<html><body><h1>Hello, world</h1></body></html>'
    return Response(data)

def loadBranchEngineerings(request):
    response_data = {}
    response_data["issuc"]=True
    try:
        datatype = int(request.GET.get('datatype',0))#获取列表类型，0：获取分部工程，子工程。1：获取分部的分项。2：获取子工程分项
        engineerlist = []
        if datatype == 0:
            for item in BranchEngineering.objects.filter(parent_id=None):
                engineeritem = serializer(item)
                engineeritem['sublist'] = serializer(BranchEngineering.objects.filter(parent_id=item.id))
                engineerlist.append(engineeritem)
            response_data["engineerlist"]=engineerlist
        elif datatype==1:
            branchData = []
            for item in BranchEngineering.objects.filter(parent_id=None):
                # engineeritem = serializer(item)
                newitem = {}
                newitem['text'] = item.name
                newitem['value'] = item.id
                newitem['children'] = []
                for subitem in BranchEngineering.objects.filter(parent_id=item.id):
                    subnewitem = {}
                    subnewitem['text'] = subitem.name
                    subnewitem['value'] = subitem.id
                    subnewitem['children'] = []
                    for ssubitem in BranchEngineering.objects.filter(parent_id=subitem.id):
                        ssubnewitem = {}
                        ssubnewitem['text'] = ssubitem.name
                        ssubnewitem['value'] = ssubitem.id
                        subnewitem['children'].append(ssubnewitem)
                    newitem['children'].append(subnewitem)
                branchData.append(newitem)
            response_data["branchData"]=branchData
        elif datatype==2:
            branchData = []
            for item in BranchEngineering.objects.filter(parent_id=None):
                # engineeritem = serializer(item)
                newitem = {}
                newitem['text'] = item.name
                newitem['value'] = item.id

                branchData.append(newitem)
            response_data["branchData"]=branchData
    except Exception as e:
        response_data["issuc"]=False
        traceback.print_exc()
    return HttpResponse(json.dumps(response_data), content_type="application/json")

    return HttpResponse(json.dumps(response_data), content_type="application/json")
####自定义分页类
class SelfPagination(PageNumberPagination):
    page_size_query_param = 'pagesize'
    page_size = 15

class SelfBigPagination(PageNumberPagination):
    page_size_query_param = 'pagesize'
    page_size = 100

class DocumentSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    authentication_classes = (CsrfExemptSessionAuthentication, )

class CompanyFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = Company
        fields = {
            'parent_id':['exact', 'in','isnull'],
        }
class CompanySet(viewsets.ModelViewSet):
    queryset = Company.objects.all().order_by("name")
    serializer_class = CompanySerializer
    filter_backends = (DjangoFilterBackend,)
    filter_class = CompanyFilter
    pagination_class = SelfPagination


class ProjectFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = Project
        fields = {
            'company_id': ['exact', 'in'],
            'city_id':['exact', 'in'],
            'id':['exact', 'in'],
            'KGRQ':['exact', 'in','isnull'],
        }
class ProjectSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_backends = (DjangoFilterBackend,)
    pagination_class = SelfPagination
    filter_class = ProjectFilter
    authentication_classes = (CsrfExemptSessionAuthentication, )
    # def get_queryset(self):
    #     city_id = self.request.query_params.get('city_id', None)
    #     company_id = self.request.query_params.get('company_id', None)
    #     pk = self.request.query_params.get('pk', None)
    #     if pk is not None:
    #         return Project.objects.filter(id=pk)
    #     elif city_id is not None:
    #         return Project.objects.filter(city_id=city_id)
    #     elif company_id is not None:
    #         return Project.objects.filter(company_id=company_id)
    #     else:
    #         return Project.objects.all()
    def get(self):
        return serializer(Project.objects.all())

class ProjectFileFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = ProjectFile
        fields = {
            'project': ['exact', 'in'],
            'id':['exact', 'in'],
        }

class ProjectFileSet(viewsets.ModelViewSet):
    queryset = ProjectFile.objects.all()
    serializer_class = ProjectFileSerializer
    authentication_classes = (CsrfExemptSessionAuthentication, )
    filter_backends = (DjangoFilterBackend,)
    pagination_class = SelfPagination
    filter_class = ProjectFileFilter
    filter_fields = ('id',)

    def get_queryset(self):
        pk = self.request.query_params.get('pk', None)
        project_id = self.request.query_params.get('project_id', None)
        if pk is not None:
            return ProjectFile.objects.filter(id=pk)
        elif project_id is not None:
            return ProjectFile.objects.filter(project_id=project_id)
        else:
            return ProjectFile.objects.all()

class EngineeringFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = Engineering
        fields = {
            'project_id': ['exact', 'in'],
            'id':['exact', 'in'],
            'insert_dt':['exact', 'in','isnull'],
        }

class EngineeringSet(viewsets.ModelViewSet):
    queryset = Engineering.objects.all().order_by('-insert_dt')
    serializer_class = EngineeringSerializer
    filter_backends = (DjangoFilterBackend,)
    pagination_class = SelfPagination
    filter_class = EngineeringFilter
    authentication_classes = (CsrfExemptSessionAuthentication, )



class CityFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = City
        fields = {
            'id':['exact', 'in'],
            'parent':['exact', 'in','isnull'],
        }
class CitySet(viewsets.ModelViewSet):
    queryset = City.objects.all().order_by('id')
    serializer_class = CitySerializer
    filter_backends = (DjangoFilterBackend,)
    filter_class = CityFilter
    pagination_class = SelfPagination
    # def get_queryset(self):
    #     return City.objects.filter(parent_id=None)

class BranchEngineeringSet(viewsets.ModelViewSet):
    queryset = BranchEngineering.objects.filter()
    serializer_class = BranchEngineeringSerializer
    filter_fields = ('id')
    pagination_class = SelfBigPagination
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('parent__parent_id','parent_id')


class myDjangoFilterBackend(DjangoFilterBackend):
    def filter_queryset(self, request, queryset, view):
        filter_class = self.get_filter_class(view, queryset)
        branch_engeering_id = request.GET.get('branch_engeering_id',None)
        selectAll = int(request.GET.get('selectAll',1))
        if branch_engeering_id :
            queryset = queryset.filter(Q(branch_engeering_id=branch_engeering_id) |
                Q(branch_engeering__parent_id=branch_engeering_id)|
                Q(branch_engeering__parent__parent_id=branch_engeering_id)|
                Q(branch_engeering_id=None))
        else:
            if selectAll == 0:
                queryset = queryset.filter(branch_engeering_id=None)
            else:
                queryset = queryset.filter()

        if filter_class:
            return filter_class(request.query_params, queryset=queryset, request=request).qs
        return queryset

class WXYSet(viewsets.ModelViewSet):
    queryset = JSFA.objects.all().exclude(sfzdwxy="否").order_by('-insert_dt','-BZRQ')
    serializer_class = JSFASerializer
    pagination_class = SelfPagination
    filter_backends = (myDjangoFilterBackend,)
    authentication_classes = (CsrfExemptSessionAuthentication, )
    filter_fields = ('engineering_id','engineering__project__company_id','engineering__project_id','engineering_id')
    
class JSFASet(viewsets.ModelViewSet):
    queryset = JSFA.objects.all().order_by('-insert_dt','-BZRQ')
    serializer_class = JSFASerializer
    pagination_class = SelfPagination
    filter_backends = (myDjangoFilterBackend,)
    authentication_classes = (CsrfExemptSessionAuthentication, )
    filter_fields = ('engineering_id','engineering__project__company_id','engineering__project_id','engineering_id')

class ProcedureSet(viewsets.ModelViewSet):
    queryset = Procedure.objects.all().order_by('-addtime')
    serializer_class = ProcedureSerializer
    pagination_class = SelfPagination
    filter_backends = (myDjangoFilterBackend,)
    # search_fields = ('branch_engeering__parent_id','branch_engeering_id',)
    authentication_classes = (CsrfExemptSessionAuthentication, )
    filter_fields = ('engineering__project__company_id','engineering__project_id','engineering_id','gxtype',)

class ProcedureFileSet(viewsets.ModelViewSet):
    queryset = ProcedureFile.objects.all()
    serializer_class = ProcedureFileSerializer
    pagination_class = SelfPagination
    filter_backends = (DjangoFilterBackend,)
    authentication_classes = (CsrfExemptSessionAuthentication, )
    filter_fields = ('procedure_id',)

class JSFAFileSet(viewsets.ModelViewSet):
    queryset = JSFAFile.objects.all()
    serializer_class = JSFAFileSerializer
    pagination_class = SelfPagination
    filter_backends = (DjangoFilterBackend,)
    authentication_classes = (CsrfExemptSessionAuthentication, )
    filter_fields = ('danger_id',)

class RecordFileSet(viewsets.ModelViewSet):
    queryset = RecordFile.objects.all()
    serializer_class = RecordFileSerializer
    pagination_class = SelfPagination
    filter_backends = (DjangoFilterBackend,)
    authentication_classes = (CsrfExemptSessionAuthentication, )
    filter_fields = ('record_id',)


class RecordSet(viewsets.ModelViewSet):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    pagination_class = SelfPagination
    filter_backends = (DjangoFilterBackend,)
    authentication_classes = (CsrfExemptSessionAuthentication, )
    filter_fields = ('engineering_id','id')
    def pre_save(self, obj):
        print "heh"

class RecordWorkSet(viewsets.ModelViewSet):
    queryset = RecordWork.objects.all()
    serializer_class = RecordWorkSerializer
    pagination_class = SelfPagination
    filter_backends = (DjangoFilterBackend,)
    authentication_classes = (CsrfExemptSessionAuthentication, )

class RecordWorkTypeSet(viewsets.ModelViewSet):
    queryset = RecordWorkType.objects.all()
    serializer_class = RecordWorkTypeSerializer
    pagination_class = SelfPagination
    filter_backends = (DjangoFilterBackend,)
    authentication_classes = (CsrfExemptSessionAuthentication, )

#导入分部分项工程
def importengineer(request):
    response_data = {}
    path = 'c://tttt.xlsx'
    wb = load_workbook(path)
    sheetname = wb.get_sheet_names()[0]
    sheetContent = wb[sheetname]
    response_data['sheetname'] = sheetname
    row = sheetContent.rows
    parent_name = ''
    parent_id = 0
    curr_name = ''

    city_parent_id = 0
    provice = ''
    city = ''
    for index,cell in enumerate(row):
        # if index>1:
        #     cell1 = str(cell[1].value).strip()
        #     cell2 = str(cell[2].value).strip()
        #     cell3 = u''+str(cell[3].value).strip()
        #     if cell[1].value == None:
        #         curr_name = cell2
        #         cell3list = cell3.split('，')
        #         bran2 = BranchEngineering.objects.create(name=curr_name,parent_id=parent_id)
        #         for index,value in enumerate(cell3list):
        #             BranchEngineering.objects.create(name=value,parent_id=bran2.id)
        #     else:
        #         curr_name = cell1
        #         parent_name = cell1
        #         bran = BranchEngineering.objects.create(name=curr_name)
        #         parent_id = bran.id
        cell1 = str(cell[0].value).strip()
        cell2 = str(cell[1].value).strip()
        # cell3 = u''+str(cell[2].value).strip()
        if provice != cell1:
            provice = cell1
            city = cell2
            bran1 = City.objects.create(name=cell1)
            parent_id = bran1.id
            bran2 = City.objects.create(name=cell2,parent_id=parent_id)
            city_parent_id = bran2.id
            # bran3 = City.objects.create(name=cell3,parent_id=bran2.id)
        else:
            # if city != cell2:
            city = cell2
            bran2 = City.objects.create(name=cell2,parent_id=parent_id)
            city_parent_id = bran2.id
                # bran3 = City.objects.create(name=cell3,parent_id=bran2.id)
            # else:
                # bran3 = City.objects.create(name=cell3,parent_id=city_parent_id)

    return HttpResponse(json.dumps(response_data,encoding="UTF-8",ensure_ascii=False), content_type="application/json")


@csrf_exempt
def uploadfile_conc(request):
    response_data = {}
    response_data["issuc"]=False
    normal = request.POST.get('doctype','normal')
    try:
        fileinfo = request.FILES.get("Filedata",None)
        print fileinfo.name
        if fileinfo:
            name,filename=handle_uploaded_file(fileinfo)
            doc = Document()
            doc.name = filename
            doc.shortname = getfilerealname(fileinfo.name)
            doc.filepath = u"upload/"
            doc.filesize = fileinfo._size
            doc.filetype = getfiletype(fileinfo)
            doc.doctype = normal
            doc.save()
            response_data["issuc"]=True
            response_data["docId"]=doc.id
            response_data["docpath"]='/'+str(doc.filepath)+doc.name
            response_data["docname"]=doc.name
            print json.dumps(response_data)
    except Exception, e:
        response_data["issuc"]="false"
        traceback.print_exc()

    return HttpResponse(json.dumps(response_data), content_type="application/json")

@csrf_exempt
def uploadfile_blob(request):
    response_data = {}
    response_data["issuc"]="false"
    try:
        imagedata  = request.POST.get('imgdata')
        fileinfo = request.FILES.get("imgdata",None)
        filename = time.strftime('%Y%m%d%H%M%S')+'_'+fileinfo.name
        # print fileinfo.content_type,fileinfo.size
        imagedata  = base64.b64decode(imagedata)
        path=u"upload/"
        file_path_name = path + filename
        destination = open(file_path_name, 'wb+')
        destination.write(imagedata)
        destination.close()

        if not Document.objects.filter(name=filename):
            doc = Document()
            doc.name = filename
            doc.shortname = filename
            doc.filepath = u"upload/"
            doc.creator=request.user
            doc.filesize = len(imagedata)
            doc.filetype = fileinfo.content_type
            doc.doctype='normal'
            doc.save()
            response_data["doc"] = serializer(doc)

        response_data["issuc"]="true"

    except:
        traceback.print_exc()
        response_data["issuc"]="false"


    return HttpResponse(json.dumps(response_data), content_type="application/json")


def viewpdf(request):
    # Create a URL of our project and go to the template route
    aim=request.GET['aim']
    options = {
        'page-size': 'A4',
    }
    url  = request.GET.get('url','')+"&aim="+aim
    projectUrl = request.get_host() + url
    pdf = pdfkit.from_url(projectUrl, False,options=options)
    # Generate download
    response = StreamingHttpResponse(pdf)
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment;filename="shigongriji.pdf"'
    return response


def shigongriji(request):
    response_data={}
    allBody=[]
    cid=request.GET['id']
    aim=request.GET['aim']
    aBody=getABody(cid)
    if aBody != None:
        allBody.append(aBody)
    response_data["length"]=len(allBody)
    response_data["data"]=allBody
    if len(allBody)>0:
        if aim == "preview" :
            return render_to_response('projects/shigongriji.html',response_data)
        else :
            return render_to_response('projects/pdfmodel.html',response_data)
    else :
        return render_to_response('projects/nodata.html')
   

def shigongrijiByDate(request):
    aim=request.GET['aim']
    allBody = []
    response_data = {}
    projectId=request.GET['projectId']
    beginDate=datetime.datetime.strptime(request.GET['beginDate'], "%Y-%m-%d")
    endDate=datetime.datetime.strptime(request.GET['endDate'], "%Y-%m-%d")
    recordList=Record.objects.filter(engineering=projectId).filter(curr_time__range=(beginDate,endDate))
    for record in recordList:
        id=record.id
        allBody.append(getABody(id))
    response_data["length"]=len(allBody)
    response_data["data"]=allBody
    if len(allBody)>0:
        if aim == "preview" :
            return render_to_response('projects/shigongriji.html',response_data)
        else :
            return render_to_response('projects/pdfmodel.html',response_data)
    else :
        return render_to_response('projects/nodata.html')

def shigongrijiByProject(request):
    response_data={}
    allBody=[]
    aim=request.GET['aim']
    projectId=request.GET['projectId']
    recordList=Record.objects.filter(engineering=projectId)
    for record in recordList:
        id=record.id
        allBody.append(getABody(id))
    response_data["length"]=len(allBody)
    response_data["data"]=allBody
    if len(allBody)>0:
        if aim == "preview" :
            return render_to_response('projects/shigongriji.html',response_data)
        else :
            return render_to_response('projects/pdfmodel.html',response_data)
    else :
        return render_to_response('projects/nodata.html')


def getABody(id):
    body=None
    record=None
    try :
        record=Record.objects.get(id=id)
    except :
        pass
    if record:
        recordWorkQuarySet=record.rewordworks.all()
        mountOfWork=[]
        recordWorkTypeList=[]

        for i in recordWorkQuarySet:
            recordWorkType=i.rewordworktypes.all()
            mountOfWork.append(len(recordWorkType))
            for j in recordWorkType:
                recordWorkTypeList.append(j)
        if(len(recordWorkTypeList)<9):
            for i in range(0,8-len(recordWorkTypeList)):
                recordWorkTypeList.append(None)

        recordWorkList=[]
        m=0
        for i in recordWorkQuarySet:
            trusNum=[0,0,0,0,0,0,0,0]
            cursors=0
            for n in range(0,m):
                cursors=cursors+mountOfWork[n]
            for j in range(0,mountOfWork[m]):
                trusNum[j+cursors]=recordWorkTypeList[j+cursors].peoples
        
            workpeopleforview=Projects.workpeopleforview.workpeopleforview(i.name,i.designwork,i.completework,trusNum)
            recordWorkList.append(workpeopleforview)
            m+=1

        if(len(recordWorkList)<9):
            for i in range(0,9-len(recordWorkList)):
                recordWorkList.append(None)
        weekday=0
        if record.curr_time != None:
            weekday=record.curr_time.weekday()
        else :
            weekday=7
        template=0
        if len(record.template)>0 :
            template=int(record.template,10)-6
        else :
            template="无"
        body=Projects.body.body(record,recordWorkList,recordWorkTypeList,template,weekday)
        return body
    else :
        return body

def getWeatherToday(request):
    response_data = {}
    cn=request.GET['cityName']
    host = 'http://jisutqybmf.market.alicloudapi.com'
    path = '/weather/query'
    method = 'GET'
    appcode = '6c1ac5211ff74dcc9d0e64948d266193'
    querys = 'city='+cn
    bodys = {}
    url = host + path + '?' + querys
    request = urllib2.Request(url)
    request.add_header('Authorization', 'APPCODE ' + appcode)
    response = urllib2.urlopen(request)
    content = response.read()
    if (content):
        daily=json.loads(content).get("result").get("daily")
        todayTemphigh=daily[0].get("day").get("temphigh")
        todayWeather=daily[0].get("day").get("weather")
        response_data['issuc'] = "true"
        response_data['temphigh'] = todayTemphigh

        weather=json.dumps(todayWeather).decode('unicode-escape').replace('"',"")
        if ("雨".decode('utf-8') in weather ) or ("冰雹".decode('utf-8') in weather) :
            todayWeather="雨"
            print todayWeather
        elif "雪".decode('utf-8') in weather:
            todayWeather="雪"
        else :
            todayWeather="晴"

        response_data['weather'] = todayWeather
    else :
        response_data['issuc'] = "false"
    return HttpResponse(json.dumps(response_data), content_type="application/json;charset=utf-8")

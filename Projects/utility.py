# -*- coding: utf-8 -*-
import os,time,random, sys, datetime, calendar, traceback,zipfile
import httplib,json,socket
import xml.etree.ElementTree as ET 
import  xml.dom.minidom as minidom
import json,thread, base64,codecs, chardet

from django.conf import settings
from BuildDiary.settings import UPLOAD_DIR
from Projects.models import *
from django.db.models import Q

reload(sys)  
sys.setdefaultencoding('utf8')   
account = "720e9000-4fd4-4bab-b8fa-139e5d0d0080"
socket.setdefaulttimeout(2)

def updateCom():
    for eachPrj in Project.objects.filter(company=None):
        if not Company.objects.filter(name = eachPrj.GCGS) and eachPrj.GCGS:
            newCom = Company.objects.create(name = eachPrj.GCGS, introduction=eachPrj.GCGS)
            eachPrj.company = newCom
            eachPrj.save()
            
        else:
            eachPrj.company = Company.objects.filter(name = eachPrj.GCGS)[0]
            eachPrj.save()

def updateProject():
    for  tgtFA in JSFA.objects.filter(Q(PrjSys=None) | Q(engineering=None)):          
        if Project.objects.filter(PrjId = tgtFA.PrjId):
            tgtFA.PrjSys_id=Project.objects.get(PrjId = tgtFA.PrjId).id
            
            if Engineering.objects.filter(name = "单位工程1_" + tgtFA.PrjName):
                tgtFA.engineering=Engineering.objects.get(name = "单位工程1_" + tgtFA.PrjName)
            else:
                tgtUnit = Engineering.objects.create(name = "单位工程1_" + tgtFA.PrjName, project = Project.objects.get(PrjId = tgtFA.PrjId))
                tgtFA.engineering = tgtUnit
            
            tgtFA.save()
            
        else:
            newPrj = Project.objects.create(PrjId = tgtFA.PrjId, 
                PrjName = tgtFA.PrjName,
                GCGS = tgtFA.GCGS,
                GCGSID = tgtFA.GCGSID, 
                XMGCS = tgtFA.xmgcs, 
                XMJL = tgtFA.xmjl, 
             )

            tgtFA.PrjSys = newPrj

            tgtUnit = Engineering.objects.create(name = "单位工程1_" + tgtFA.PrjName, project = newPrj)
            tgtFA.engineering = tgtUnit
            
            tgtFA.save()

def initPrj():
    tree = ET.parse('./Projects/initFile/zjxm.xml')
    root = tree.getroot()
    for child in root:
        print child.attrib["FABH"]
    pass 
    
    
def initJSFA():
    tree = ET.parse('./Projects/initFile/jsfa.xml')
    root = tree.getroot()
    for child in root:
        if child.attrib:
            try:                   
                if JSFA.objects.filter(FABH=child.attrib["FABH"]):
                    JSFA.objects.filter(FABH=child.attrib["FABH"]).update(**child.attrib)
                else:
                    JSFA.objects.create(**child.attrib)
        
            except:
                traceback.print_exc()
                continue
        
    print "update Projects" 
    updateProject()

    print "update Company" 
    updateCom()
    
    return True
    

def getPrjInfo1():
    ''' 获取项目立项信息    '''
    SoapMessage ='''<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <getPrjInfo xmlns="http://tempuri.org/">
      <Account>720e9000-4fd4-4bab-b8fa-139e5d0d0080</Account>
    </getPrjInfo>
  </soap:Body>
</soap:Envelope>'''
    try:
        #使用的WebService地址为sdk.entinfo.cn:8061/webservice.asmx，
        webservice = httplib.HTTP("116.236.180.116:44")
        #连接到服务器后的第一个调用。它发送由request字符串到到服务器
        webservice.putrequest("POST", "/WS_Tech/Webservice_Tech.asmx")
        webservice.putheader("Host", "116.236.180.116")
    #     webservice.putheader("User-Agent", "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)")
        webservice.putheader("Content-type", "text/xml")
        webservice.putheader("Content-Length", len(SoapMessage) )
        webservice.putheader("SOAPAction", '"http://tempuri.org/getPrjInfo"')
        #发送空行到服务器，指示header的结束
        webservice.endheaders()
        #发送报文数据到服务器
        webservice.send(SoapMessage)
        #获取返回HTTP 响应信息
    
        statuscode, statusmessage, header = webservice.getreply()
        resmessage = webservice.getfile().read()
        
        OutXml = unicode(base64.b64decode(resmessage[resmessage.find('<getPrjInfoResult>') + 18 :resmessage.find('</getPrjInfoResult>')]), "gbk")
        
        root = ET.fromstring(OutXml.encode("utf-8","ignore"))  
        for child in root:
            if child.attrib:
                try:                   
                    if Project.objects.filter(PrjId=child.attrib["PrjId"]):
                        Project.objects.filter(PrjId=child.attrib["PrjId"]).update(**child.attrib)
                        pass
                    else:
                        newPrj = Project.objects.create(**child.attrib)
                except:
                    continue
        
        print "update Company" 
        updateCom()
        
        return True
    except:
        traceback.print_exc()
        return False

import urllib2,traceback,json
def getPrjInfo():
    try:
        req = urllib2.Request("http://www.wufea.com/scg4/prjinfotodaily.asp?dcount=sihttst8Z3eKar3rUrrm") 
        #enable cookie 
        opener = urllib2.build_opener(urllib2.HTTPCookieProcessor()) 
        response = opener.open(req)
        body = json.loads(response.read().decode('gbk').encode('utf8'))
        for prj in body['prjinfotodaily']:
            myprj = {}
            for key in prj:
                if key=='mj':
                    myprj['area'] = prj[key]
                elif key=='zj':
                    myprj['price'] = prj[key]
                elif key=='dtsl':
                    myprj['danti_nums'] = prj[key]
                elif key=='aqmb':
                    myprj['safe_target'] = prj[key]
                elif key=='zlmb':
                    myprj['quality_target'] = prj[key]
                elif key=='hbmb':
                    myprj['environment_target'] = prj[key]
                elif key=='xmmb':
                    myprj['project_target'] = prj[key]
                elif key=='wmmb':
                    myprj['culture_target'] = prj[key]
                elif key=='htmb':
                    myprj['pact_target'] = prj[key]
                elif key=='sd':
                    myprj['deep'] = prj[key]
                elif key=='gd':
                    myprj['height'] = prj[key]
                elif key=='xmjd':
                    myprj['longitude'] = prj[key]
                elif key=='xmwd':
                    myprj['latitude'] = prj[key]
                elif key=='KGRQ' or key=='JGRQ':
                    if prj[key]:
                        myprj[key] = prj[key]
                else:
                    myprj[key] = prj[key]
            if Project.objects.filter(PrjId=myprj['PrjId']).count():
                print u'更新Project信息',myprj
                apply(Project.objects.filter(PrjId=myprj['PrjId']).update, (), myprj)
            elif myprj['PrjId']:
                print u'创建Project',myprj
                apply(Project.objects.create, (), myprj)
    except:
        traceback.print_exc()


def getJSFA():
    '''  获取施工方案  '''
    SoapMessage ='''<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <getSGFA xmlns="http://tempuri.org/">
        <Account>720e9000-4fd4-4bab-b8fa-139e5d0d0080</Account>
    </getSGFA>
  </soap:Body>
</soap:Envelope>'''
    try:
        print "update JSFA" 
        #使用的WebService地址为sdk.entinfo.cn:8061/webservice.asmx，
        webservice = httplib.HTTP("116.236.180.116:44")
        #连接到服务器后的第一个调用。它发送由request字符串到到服务器
        webservice.putrequest("POST", "/WS_Tech/Webservice_Tech.asmx")
        webservice.putheader("Host", "116.236.180.116")
    #     webservice.putheader("User-Agent", "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)")
        webservice.putheader("Content-type", "text/xml")
        webservice.putheader("Content-Length", len(SoapMessage) )
        webservice.putheader("SOAPAction", '"http://tempuri.org/getSGFA"')
        #发送空行到服务器，指示header的结束
        webservice.endheaders()
        #发送报文数据到服务器
        webservice.send(SoapMessage)
        #获取返回HTTP 响应信息
    
        statuscode, statusmessage, header = webservice.getreply()
        resmessage = webservice.getfile().read()
        
        OutXml = unicode(base64.b64decode(resmessage[resmessage.find('<getSGFAResult>') + 15 :resmessage.find('</getSGFAResult>')]), "gbk")
        
        root = ET.fromstring(OutXml.encode("utf-8","ignore"))  
        for child in root:
            if child.attrib:
                try:                   
                    if JSFA.objects.filter(FABH=child.attrib["FABH"]):
                        JSFA.objects.filter(FABH=child.attrib["FABH"]).update(**child.attrib)
                    else:
                        JSFA.objects.create(**child.attrib)
 
                except:
                    traceback.print_exc()
                    continue
        
        print "update Projects" 
        updateProject()
    
        print "update Company" 
        updateCom()
               
        return True
    except:
        traceback.print_exc()
        return False

def updateSGFAWDSSRQ(faid, ssrq):  
    ''' 更新危大实施日期 '''   
    SoapMessage ='''<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <updateSGFAWDSSRQ xmlns="http://tempuri.org/">
      <Account>''' + account +'''</Account>
      <FAID>'''+ str(faid) + '''</FAID>
      <SSRQ>'''+ ssrq +'''</SSRQ>
    </updateSGFAWDSSRQ>
  </soap:Body>
</soap:Envelope>'''
    try:
        #使用的WebService地址为sdk.entinfo.cn:8061/webservice.asmx，
        webservice = httplib.HTTP("116.236.180.116:44")
        #连接到服务器后的第一个调用。它发送由request字符串到到服务器
        webservice.putrequest("POST", "/WS_Tech/Webservice_Tech.asmx")
        webservice.putheader("Host", "116.236.180.116")
    #     webservice.putheader("User-Agent", "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)")
        webservice.putheader("Content-type", "text/xml")
        webservice.putheader("Content-Length", len(SoapMessage) )
        webservice.putheader("SOAPAction", '"http://tempuri.org/updateSGFAWDSSRQ"')
        #发送空行到服务器，指示header的结束
        webservice.endheaders()
        #发送报文数据到服务器
        webservice.send(SoapMessage)
        #获取返回HTTP 响应信息
    
        statuscode, statusmessage, header = webservice.getreply()
        resmessage = webservice.getfile().read()
        if resmessage[resmessage.find('<updateSGFAWDSSRQResult>') + 24 :resmessage.find('</updateSGFAWDSSRQResult>')] == "1":
            if JSFA.objects.filter(FAID=faid):
                JSFA.objects.filter(FAID=faid).update(xcssrq=ssrq)
                
        return True     
    except:
        traceback.print_exc()
        return False

def getSGFAWFStatus(faid): 
    ''' 获取指定施工方案的流程审批状态 '''   
    SoapMessage ='''<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <getSGFAWFStatus xmlns="http://tempuri.org/">
      <Account>''' + account +'''</Account>
      <FAID>'''+ str(faid) +'''</FAID>
    </getSGFAWFStatus>
  </soap:Body>
</soap:Envelope>'''
    try:
        #使用的WebService地址为sdk.entinfo.cn:8061/webservice.asmx，
        webservice = httplib.HTTP("116.236.180.116:44")
        #连接到服务器后的第一个调用。它发送由request字符串到到服务器
        webservice.putrequest("POST", "/WS_Tech/Webservice_Tech.asmx")
        webservice.putheader("Host", "116.236.180.116")
    #     webservice.putheader("User-Agent", "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)")
        webservice.putheader("Content-type", "text/xml")
        webservice.putheader("Content-Length", len(SoapMessage) )
        webservice.putheader("SOAPAction", '"http://tempuri.org/getSGFAWFStatus"')
        #发送空行到服务器，指示header的结束
        webservice.endheaders()
        #发送报文数据到服务器
        webservice.send(SoapMessage)
        #获取返回HTTP 响应信息
    
        statuscode, statusmessage, header = webservice.getreply()
        resmessage = webservice.getfile().read()
        OutXml = unicode(base64.b64decode(resmessage[resmessage.find('<getSGFAWFStatusResult>') + 23 :resmessage.find('</getSGFAWFStatusResult>')]), "gbk")
        root = ET.fromstring(OutXml.encode("utf-8","ignore"))  
        for child in root:
            if child.attrib:    
                return child.attrib["FlowCurrTaskName"] + "-" + child.attrib["FlowArriveTime"]
            
        return "暂无记录"     
    except:
        traceback.print_exc()
        return "暂无记录"

    return "暂无记录"

def getSGFAWFDealInfo(faid):
    ''' 获取指定施工方案的流程意见 '''   
    SoapMessage ='''<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <getSGFAWFDealInfo xmlns="http://tempuri.org/">
      <Account>''' + account +'''</Account>
      <FAID>'''+ str(faid) +'''</FAID>
    </getSGFAWFDealInfo>
  </soap:Body>
</soap:Envelope>'''
    try:
        spyjList = []
        #使用的WebService地址为sdk.entinfo.cn:8061/webservice.asmx，
        webservice = httplib.HTTP("116.236.180.116:44")
        #连接到服务器后的第一个调用。它发送由request字符串到到服务器
        webservice.putrequest("POST", "/WS_Tech/Webservice_Tech.asmx")
        webservice.putheader("Host", "116.236.180.116")
    #     webservice.putheader("User-Agent", "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)")
        webservice.putheader("Content-type", "text/xml")
        webservice.putheader("Content-Length", len(SoapMessage) )
        webservice.putheader("SOAPAction", '"http://tempuri.org/getSGFAWFDealInfo"')
        #发送空行到服务器，指示header的结束
        webservice.endheaders()
        #发送报文数据到服务器
        webservice.send(SoapMessage)
        #获取返回HTTP 响应信息
    
        statuscode, statusmessage, header = webservice.getreply()
        resmessage = webservice.getfile().read()
        OutXml = unicode(base64.b64decode(resmessage[resmessage.find('<getSGFAWFDealInfoResult>') + 25 :resmessage.find('</getSGFAWFDealInfoResult>')]), "gbk")
        root = ET.fromstring(OutXml.encode("utf-8","ignore"))  
        
        for child in root:
            if child.attrib:    
                spyjList.append(child.attrib)
            
        return spyjList     
    except:
        traceback.print_exc()
        return []

def getSGFAWFAttachInfo(faid):
    ''' 获取指定施工方案的附件信息 '''   
    SoapMessage ='''<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <getSGFAAttachment xmlns="http://tempuri.org/">
      <Account>''' + account +'''</Account>
      <FAID>'''+ str(faid) +'''</FAID>
    </getSGFAAttachment>
  </soap:Body>
</soap:Envelope>'''
    try:
        attachList = []
        #使用的WebService地址为sdk.entinfo.cn:8061/webservice.asmx，
        webservice = httplib.HTTP("116.236.180.116:44")
        #连接到服务器后的第一个调用。它发送由request字符串到到服务器
        webservice.putrequest("POST", "/WS_Tech/Webservice_Tech.asmx")
        webservice.putheader("Host", "116.236.180.116")
    #     webservice.putheader("User-Agent", "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)")
        webservice.putheader("Content-type", "text/xml")
        webservice.putheader("Content-Length", len(SoapMessage) )
        webservice.putheader("SOAPAction", '"http://tempuri.org/getSGFAAttachment"')
        #发送空行到服务器，指示header的结束
        webservice.endheaders()
        #发送报文数据到服务器
        webservice.send(SoapMessage)
        #获取返回HTTP 响应信息
    
        statuscode, statusmessage, header = webservice.getreply()
        resmessage = webservice.getfile().read()
        OutXml = unicode(base64.b64decode(resmessage[resmessage.find('<getSGFAAttachment>') + 25 :resmessage.find('</getSGFAAttachment>')]), "gbk")
        root = ET.fromstring(OutXml.encode("utf-8","ignore"))  
        
        for child in root:
            if child.attrib:    
                attachList.append(child.attrib)
            
        return attachList     
    except:
        traceback.print_exc()
        return []
            
if __name__ == "__main__":
    initJSFA()

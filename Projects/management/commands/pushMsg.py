# -*- coding: utf-8 -*-

from django.core.management.base import BaseCommand, CommandError
from TaskAndFlow.utility import *
from TaskAndFlow.models import *
from TaskAndFlow.config import *
from Scc4PM.settings import CURRENT_PROJECT_ID
from UserAndPrj.models import *
from top.config import DXObject

class message_template(object):

    #event_template="{{fromuser}} {{message}} \n <a href='{{projecturl}}/task/progress/problem/{{relateid}}/'>点击查看！</a>"
    event_template = u'{0}{1}<a href="{2}/task/progress/problem/{3}/">点击查看！</a>'
    event_template_watch = u'{0}{1}<a href="{2}/task/progress/problem/watch/{3}/">点击查看！</a>'
    event_template_huiyi = u'{0}发起{1}<a href="{2}/assist/meetnotice/?status=1&meetid={3}">点击确认是否参加！</a>'
    event_template_edithuiyi = u'{0}<a href="{1}/assist/meetnotice/?status=0&meetid={2}">点击查看！</a>'
    event_template_filenotify = u'{0}在目录"{1}"下：{2}'
    notice_template = u'{0}于{1}发布公告：{2}'

class Command(BaseCommand):
    def handle(self, *args, **options):
        for each in PushMessage.objects.filter(status=0):
            
            if send_txt_msg(convertMessage(each) , "" if not each.touser else each.touser.contract, "" if not each.toparty else str(each.toparty) ,\
                            "" if not each.totag else str(each.totag), each.agentid):
                each.status=1
                msgContent, msgType = getMsgInfo(each)
                if send_mobile_msg(each.fromuser.truename, msgContent, each.touser.contract, msgType):
                    each.status=2
                each.save()
            else:
                print "消息发送失败！"

        return

def convertMessage(msgObj):
    msg = "不支持的消息"
    try:
        if Project.objects.filter(id=CURRENT_PROJECT_ID):
            projecturl = Project.objects.get(id=CURRENT_PROJECT_ID).projecturl

        if msgObj.relatetype == "事件":
            msg = message_template.event_template
            msg = msg.format("" if not msgObj.fromuser else msgObj.fromuser.truename, msgObj.message,projecturl,str(msgObj.relateid))
        elif msgObj.relatetype == "事件查看":
            msg = message_template.event_template_watch
            msg = msg.format("" if not msgObj.fromuser else msgObj.fromuser.truename, msgObj.message,projecturl,str(msgObj.relateid))
        elif msgObj.relatetype == "会议":
            msg = message_template.event_template_huiyi
            msg = msg.format("" if not msgObj.fromuser else msgObj.fromuser.truename,msgObj.message,projecturl,str(msgObj.relateid))
        elif msgObj.relatetype == "会议修改":
            msg = message_template.event_template_edithuiyi
            msg = msg.format(msgObj.message,projecturl,str(msgObj.relateid))
        elif msgObj.relatetype == "不参加会议":
            msg = message_template.event_template_edithuiyi
            msg = msg.format(msgObj.message,projecturl,str(msgObj.relateid))
        elif msgObj.relatetype == "文件夹通知":
            msg = message_template.event_template_filenotify
            msg = msg.format(msgObj.fromuser.truename,Directory.objects.get(id=msgObj.relateid).name,msgObj.message)
        elif msgObj.relatetype == "公告":
            msg = message_template.notice_template
            msg = msg.format(msgObj.fromuser.truename,msgObj.createtime.strftime("%Y/%m/%d"),msgObj.message)
        else:
            msg = "不支持的消息"
    except:
        pass

    return msg

def getMsgInfo(msgObj):
    msgType,msgContent="",""
    if msgObj.relatetype == "会议":
        msgType = DXObject.DXID_huiyi
        msgContent = msgObj.message[:20]
        
    elif msgObj.relatetype == "会议修改":
        msgType = DXObject.DXID_huiyixiugai
        msgContent = msgObj.message[:20]
        
    elif msgObj.relatetype == "公告":
        msgType = DXObject.DXID_gonggao
        msgContent = msgObj.message[:20]
         
    elif "事件" in msgObj.relatetype and "发起安全" in msgObj.message:
        msgType = DXObject.DXID_anquan 
        try:
            msgContent = ": "+ msgObj.message[6:]
        except:
            msgContent = msgObj.message[:20]
        
    elif "事件" in msgObj.relatetype and "发起质量" in msgObj.message:
        msgType = DXObject.DXID_zhiliang 
        try:
            msgContent = ": "+ msgObj.message[6:]
        except:
            msgContent = msgObj.message[:20]
        
    elif "事件" in msgObj.relatetype and "问题" in msgObj.message:
        msgType = DXObject.DXID_wentiupdate
        try:
            msgContent = ": "+ msgObj.message[6:]
        except:
            msgContent = msgObj.message[:20]
    
    try:
        if Project.objects.filter(id=CURRENT_PROJECT_ID):
                projectName = Project.objects.get(id=CURRENT_PROJECT_ID).acronym
    except:
        projectName = ""
    
    return msgContent+"(" + projectName + ")", msgType    
        
        

# -*- coding: utf-8 -*-
import os,time,random, sys, datetime, calendar, traceback,zipfile
import json,thread, base64,codecs
from django.conf import settings
from BuildDiary.settings import UPLOAD_DIR
def handle_uploaded_file(f, name="",filepath=""):
    file_name = ""
    oldname = 'name'
    try:
        path=settings.UPLOAD_DIR
        print path
        if not os.path.exists(path):
            os.makedirs(path)
        if name !="":
            oldname = name
        else:
            oldname = os.path.splitext(f.name)[0]
        ext = os.path.splitext(f.name)[1]

        #定义文件名，年月日时分秒随机数
        fn = time.strftime('%Y%m%d%H%M%S')
        fn =  '_'+fn
        #重写合成文件名
        newname =oldname+fn + ext
        file_name = path + newname
        #print file_name
        destination = open(file_name, 'wb+')
        for chunk in f.chunks():
            destination.write(chunk)
        destination.close()
    except Exception, e:
        print e

    return oldname,newname

def getfilerealname(filename):
    realname = filename
    try:
        if "_" in filename:
            realname = filename.split("_")[0]+"."+filename.split(".")[-1]
    except:
        traceback.print_exc()
    return realname

def getfiletype(fileinfo):
    filetype = fileinfo.content_type
    try:
        print filetype
        if filetype=="application/octet-stream":
            ext = os.path.splitext(fileinfo.name)[1]
            if ext.upper()==".exe".upper():
                filetype="application/exe"
            elif ext.upper()==".dwg".upper():
                filetype="application/dwg"
            elif ext.upper()==".mpp".upper():
                filetype="application/mpp"
            elif ext.upper()==".rvt".upper():
                filetype="application/rvt"
            elif ext.upper()==".rfa".upper():
                filetype="application/rfa"
            elif ext.upper()==".nwc".upper():
                filetype="application/nwc"
    except:
        traceback.print_exc()
    return filetype



# -*- coding: utf-8 -*-
import os,urllib2, time, datetime, traceback

from uuid import uuid1
from BuildDiary import settings
from User.utility import fetch_ticket
from File.models import *
from Projects.models import Document,ProjectFile,JSFAFile,ProcedureFile,RecordFile

def uploadfile_weixin(mediaList, userid, relatetype, relateid, imgtype=1 ):
    try:
        path="upload/"

        if not os.path.exists(path):
            os.makedirs(path)
            
        tgtLink = []
        _, _, tk = fetch_ticket()
        
        for each in mediaList:
            tgtLink.append('https://qyapi.weixin.qq.com/cgi-bin/media/get?access_token=' + tk + '&media_id=' + each)
        
        index = 1
        docidList = []
        pathList = []
        for each in tgtLink:
            f = urllib2.urlopen(each) 
            data = f.read() 
            flag = time.strftime('%Y%m%d%H%M%S')
            # Content-disposition: attachment; filename="MEDIA_ID.jpg"
            tl = f.headers['Content-disposition'].split('filename=')
            hz=None
            if len(tl)==2:
                hz=tl[1].replace('"','').split('.')[-1]
            fn = "%s_%s_%d"%(relatetype,flag,index)
            index +=1
            if hz:
                filename = fn + "." +hz
            else:
                filename = fn + '.jpg'
            full_file_name = path + filename

            with open(full_file_name, "wb") as code:     
                code.write(data)
            doc = Document.objects.create(
                                          name = filename,
                                          shortname = filename,
                                          filepath = path,
                                        creator_id = userid,
                                          createtime = datetime.datetime.now(),
                                          filesize = f.headers['content-length'],
                                          filetype = relatetype
                                          )
            relateObj=None
            if doc:
                if relatetype == 'XM':
                    relateObj = ProjectFile.objects.create(project_id = relateid, file_id=doc.id, imgtype= imgtype)
                elif relatetype == 'WD':
                    relateObj = JSFAFile.objects.create(danger_id = relateid, file_id=doc.id, filetype= imgtype)
                elif relatetype == 'GX':
                    relateObj = ProcedureFile.objects.create(procedure_id = relateid, file_id=doc.id)
                elif relatetype == 'RD':
                    relateObj = RecordFile.objects.create(record_id = relateid, file_id=doc.id)
                if relateObj:
                    docidList.append(relateObj.id)
                    pathList.append(full_file_name)
                    
            print pathList        
        return docidList, pathList
    except Exception as e :
        traceback.print_exc()
        return 0
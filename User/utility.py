# -*- coding: utf-8 -*-
import urllib2,memcache, json, traceback, random, time
import top.api

from BuildDiary import settings
from User.models import *


initPassword= "111111"
class WXObj(object):
    corpid = "wxb371f9dc6da17778"
    contractSecret = "XAW9hMfvHdb_9iPtJXSKoR7EOw23r9qiN_SQcscae-A"
    appSecret = "qPhAucGXETnTbnT8Q22ov9DI5248ZHVa4h4kzBvexEY"
    appId=1000004
    
import string
import hashlib
class Sign:
    def __init__(self, jsapi_ticket, url):
        self.ret = {
            'nonceStr': self.__create_nonce_str(),
            'jsapi_ticket': jsapi_ticket,
            'timestamp': self.__create_timestamp(),
            'url': url
        }

    def __create_nonce_str(self):
        return ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(15))

    def __create_timestamp(self):
        return int(time.time())

    def sign(self):
        string = '&'.join(['%s=%s' % (key.lower(), self.ret[key]) for key in sorted(self.ret)])
        self.ret['signature'] = hashlib.sha1(string).hexdigest()
        return self.ret   

def updateInfo():
    accessToken = fetch_wxContract_token()
    updateDepartment(accessToken)

def fetch_wxContract_token():
    mc=memcache.Client(['127.0.0.1:11211'],debug=0)
    access_token = mc.get('sgrz_sijian_wxtoken')
    if not access_token:
        tkUrl = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=' + WXObj.corpid + '&corpsecret=' + WXObj.contractSecret
        
        tkReq = urllib2.Request(tkUrl)
        res_data = urllib2.urlopen(tkReq)
        access_token = json.load(res_data)['access_token']
        mc.set('sgrz_sijian_wxtoken',access_token,4000)
    
    return access_token

def checkMobile(request):
    import re
    userAgent = request.META['HTTP_USER_AGENT']
 
    _long_matches = r'googlebot-mobile|android|avantgo|blackberry|blazer|elaine|hiptop|ip(hone|od)|kindle|midp|mmp|mobile|o2|opera mini|palm( os)?|pda|plucker|pocket|psp|smartphone|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce; (iemobile|ppc)|xiino|maemo|fennec'
    _long_matches = re.compile(_long_matches, re.IGNORECASE)
    _short_matches = r'1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-'
    _short_matches = re.compile(_short_matches, re.IGNORECASE)
 
    if _long_matches.search(userAgent) != None:
        return True
    user_agent = userAgent[0:4]
    if _short_matches.search(user_agent) != None:
        return True
    return False     

def updateDepartmentUser(access_token, depId):
    try: 
        tkUrl = "https://qyapi.weixin.qq.com/cgi-bin/user/list?access_token=" + access_token + "&department_id=" + str(depId)
        req = urllib2.Request(tkUrl)
        res_data = urllib2.urlopen(req)
        jsonDic = json.load(res_data)
        if not jsonDic['errcode']:
            userList = jsonDic['userlist']
            for each in userList:
                if each['mobile'] and User.objects.filter(username=each['mobile']):
                    User.objects.filter(username=each['userid']).update(truename = each['name'], contract = each['mobile'],department_id=each["department"][-1])
                elif each['mobile']:
                    tgtObj = User.objects.create(username= each['mobile'], truename = each['name'],  contract = each['mobile'],department_id=each["department"][-1])
                    tgtObj.set_password(initPassword)
                    tgtObj.save()
                else:
                    pass
        else:
            print jsonDic
    except:
        traceback.print_exc()
        return False

def updateDepartment(access_token):
    try:
        tkUrl = "https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=" + access_token
        tkReq = urllib2.Request(tkUrl)
        res_data = urllib2.urlopen(tkReq)
        jsonDic = json.load(res_data)
        if not jsonDic['errcode']:
            departmentList = jsonDic['department']
            depId=0
            for each in departmentList: 
                if Department.objects.filter( id = each['id'] ):
                    Department.objects.filter( id = each['id']).update(name = each['name'], parent_id=None if not each['parentid'] else each['parentid'] )
                else:
                    Department.objects.create( id = each['id'], name = each['name'], parent_id=None if not each['parentid'] else each['parentid'] )
                updateDepartmentUser(access_token, each['id'])
            
        else:
            print jsonDic
        return True
    except:
        traceback.print_exc()
        return False

def getCoprInfo():
    return WXObj.corpid, WXObj.appSecret, "sgrz"

def fetch_ticket():
    corp_id, secret, corp_info = getCoprInfo()
  
    mc=memcache.Client(['127.0.0.1:11211'],debug=0)
    ticket=mc.get(corp_info+'_api_ticket')
    appid = ''
    access_token = mc.get(corp_info+'_qiye_token')
#    if access_token:
#        sys.stderr.write((access_token+"\n").encode('utf-8'))
    if settings.IS_LOCAL_DEBUG:
        print "loacl debug no need access_token"
        return ticket, appid, access_token

    if not ticket or not access_token:
        tkUrl = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=' + corp_id + '&corpsecret=' + secret
        
        tkReq = urllib2.Request(tkUrl)
        res_data = urllib2.urlopen(tkReq)
        access_token = json.load(res_data)['access_token']
        mc.set(corp_info+'_qiye_token',access_token,4000)
        
        ticketUrl = 'https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket?access_token=' + access_token
        
        ticketReq = urllib2.Request(ticketUrl)
        res_data = urllib2.urlopen(ticketReq)
        ticket = json.load(res_data)['ticket']
        
        mc.set(corp_info+"_api_ticket",ticket,4000)
    
    return ticket, corp_id, access_token

def fetch_qiye_token():
    corp_id, secret, corp_info = getCoprInfo()
    
    mc=memcache.Client(['127.0.0.1:11211'],debug=0)
    access_token=mc.get(corp_info+'_qiye_token')
#    if access_token:
#        sys.stderr.write((access_token+"\n").encode('utf-8'))
    
    if settings.IS_LOCAL_DEBUG:
        print "loacl debug no need access_token"
        return access_token

    if not access_token:
        tkUrl = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=%s&corpsecret=%s' % (corp_id, secret)
        
        tkReq = urllib2.Request(tkUrl)
        res_data = urllib2.urlopen(tkReq)
        access_token = json.load(res_data).get('access_token',False)
        if access_token:
            mc.set(corp_info+"_qiye_token",access_token,5000)
    
    return access_token

def send_txt_msg(content, to_user="", to_party="", to_tag="", application_id=0, safe=0):
    try:
        if not to_user and not to_party and not to_tag:
            return True
        
        data = {
            "touser": to_user,
            "toparty": to_party,
            "totag": to_tag,
            "msgtype": "text",
            "agentid": application_id,
            "text": {"content": content},
            "safe": safe
        }

        data = json.dumps(data, ensure_ascii=False).encode('UTF-8')
        token = fetch_qiye_token()

        if token:
            req = urllib2.Request('https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=%s' % (token,))
            resp = urllib2.urlopen(req, data)
            msg = u'返回值:' + resp.read()

    except Exception, ex:

        print ex
        return False
    
    return True

def send_mobile_msg(number, vcode, type='SMS_105935023'):
    req = top.api.AlibabaAliqinFcSmsNumSendRequest()
    req.set_app_info(top.appinfo('24656980','e87c693c4588919338164c256112f1a4'))
     
    req.extend = ""
    req.sms_type = "normal"
    req.sms_free_sign_name = "智慧建造平台"
    req.sms_param = "{code:'" + vcode + "'}"
    req.rec_num = number
    req.sms_template_code = 'SMS_105935023'
    try :
        resp = req.getResponse()
        if resp["alibaba_aliqin_fc_sms_num_send_response"]["result"]["success"]: 
            return True
        else:
            return False
    except Exception,e:
        print (e)
        return False

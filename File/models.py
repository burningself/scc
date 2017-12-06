# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from argparse import FileType

class WXfile(models.Model):
    media_id = models.CharField(max_length=128,verbose_name='微信文件id')
    relatetype = models.CharField(max_length=128,verbose_name='关联元素类型')
    relateid = models.CharField(max_length=128,verbose_name='关联元素id')
    remark = models.CharField(max_length=128,null=True,verbose_name='语音文字')
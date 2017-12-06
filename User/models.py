# -*- coding: utf-8 -*-

from django.db import models
from django.contrib.auth.models import AbstractUser
from Projects.models import Project,Engineering

class Department(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=200, verbose_name=u'部门名称')
    parent = models.ForeignKey("Department", verbose_name=u'所属公司', blank=True, null=True)
    class Meta:
        db_table = 'usermanagement_department'
        verbose_name = '部门'
        verbose_name_plural = '部门'

class User(AbstractUser):
    truename=models.CharField(max_length=20,verbose_name=u'实际姓名', blank=True, null=True)
    contract=models.CharField(max_length=40,verbose_name=u'联系方式', blank=True, null=True)
    department = models.ForeignKey(Department, blank=True, null=True, verbose_name=u'所属部门')
    class Meta:
        db_table = 'usermanagement_user'
        verbose_name = '用户'
        verbose_name_plural = '用户'

class UserProject(models.Model):
    user = models.ForeignKey(User,verbose_name=u'用户')
    project = models.ForeignKey(Project,verbose_name=u'关联项目',blank=True,null=True)
    class Meta:
        db_table = 'usermanagement_user_project'
        verbose_name = '用户-项目表'
        verbose_name_plural = '用户-项目表'

class Message(models.Model):
    MESTYPE_CHOICES = (
        (0, '系统消息'),               
        (1, '项目消息'),
        (2, '危大消息'),
        (3, '工序消息'),
        (4, '四令消息'),
        (5, '预警消息'),
    )
    
    MESSTATUS_CHOICES = (
        (0, '未读'),               
        (1, '已读'),
    )
    
    title = models.CharField(max_length=200,verbose_name=u'标题')
    content = models.CharField(max_length=1000,verbose_name=u'内容')
    touser = models.ForeignKey(User,verbose_name=u'所属用户')
    project = models.ForeignKey(Project,verbose_name=u'关联项目',blank=True,null=True)
    msgtype = models.IntegerField(choices=MESTYPE_CHOICES, default=0)
    opened = models.IntegerField(choices=MESSTATUS_CHOICES, default=0)
    createtime = models.DateTimeField(auto_now_add=True,verbose_name='创建时间',blank=True, null=True)
    class Meta:
        db_table = 'usermanagement_message'
        verbose_name = '消息'
        verbose_name_plural = '消息'

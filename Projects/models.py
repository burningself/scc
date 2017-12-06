# -*- coding: utf-8 -*-
from django.db import models

#Create your models here.
class Document(models.Model):
    DOCTYPE_CHOICES = (
        ('WD', '危大工程'),
        ('GX', '重点工序'),
        ('XM', '项目'),
    )
    name = models.CharField(max_length=128,verbose_name='文件名')
    shortname = models.CharField(max_length=128,verbose_name='简写')
    createtime = models.DateTimeField(auto_now_add=True,verbose_name='创建时间',blank=True, null=True)
    filepath = models.CharField(max_length=128,verbose_name='文件路径')
    creator = models.ForeignKey('User.User',verbose_name=u'上传者',null=True,blank=True)
    filesize = models.FloatField(verbose_name=u'文件大小',null=True,blank=True)
    filetype = models.CharField(max_length=20,choices=DOCTYPE_CHOICES)
    
    def __str__(self):
        return self.name
    class Meta:
        db_table = 'diary_document'
        verbose_name = '文件'
        verbose_name_plural = '文件'

class BranchEngineering(models.Model):
    """分部工程"""
    name = models.CharField(max_length=64,verbose_name=u'分部名称')
    parent = models.ForeignKey('self',verbose_name=u'父工程',null=True,blank=True)
    def __str__(self):
        return self.name
    class Meta:
        db_table = 'diary_branch_engineering'
        verbose_name = '分部工程'
        verbose_name_plural = '分部分项'

class City(models.Model):
    """城市"""
    name = models.CharField(max_length=64,verbose_name=u'城市名称')
    parent = models.ForeignKey('self',verbose_name=u'所属区域',null=True,blank=True)
    def project_count(self):
        return Project.objects.filter(city=self).count()
    def project_total_count(self):
        totalCount=Project.objects.filter(city=self).count()
        for eachChild in City.objects.filter(parent=self):
            totalCount += Project.objects.filter(city=eachChild).count()
        return totalCount
    
    def __str__(self):
        return self.name
    class Meta:
        db_table = 'diary_city'
        verbose_name = '省市县'
        verbose_name_plural = '城市'

class Company(models.Model):
    """公司单位"""
    name = models.CharField(max_length=64,verbose_name=u'公司名称')
    introduction = models.CharField(blank=True,max_length=256,verbose_name=u'公司简介')
    parent = models.ForeignKey('self',verbose_name=u'母公司',null=True,blank=True)
    def project_count(self):
        return Project.objects.filter(company=self).count()
    def __str__(self):
        return self.name
    class Meta:
        db_table = 'diary_company'
        verbose_name = '公司单位'
        verbose_name_plural = '公司'

class Project(models.Model):
    """项目"""
    PRJSTATE_TYPE_CHOICES = (
        (0,u'竣工'),
        (1,u'在建')
    )
    PRJLXSTATE_TYPE_CHOICES = (
        (0,u'未立项'),
        (1,u'已立项')
    )
    PrjId = models.CharField(null=True,blank=True, max_length=64,verbose_name=u'项目ID')
    PrjName = models.CharField(null=True,blank=True, max_length=128,verbose_name=u'项目名称')
    GCGS = models.CharField(null=True,blank=True,max_length=128,verbose_name=u'所属工程公司')
    GCGSID = models.CharField(null=True,blank=True,max_length=64,verbose_name=u'所属公司编号')
    PrjSFLX = models.IntegerField(verbose_name=u'是否立项',choices=PRJLXSTATE_TYPE_CHOICES, default=0)
    PrjState = models.IntegerField(null=True,blank=True,verbose_name=u'项目状态',choices=PRJSTATE_TYPE_CHOICES)
    gldw = models.CharField(null=True,blank=True,max_length=128,verbose_name=u'管理单位')
    jsdw = models.CharField(null=True,blank=True,max_length=128,verbose_name=u'建设单位')
    sjdw = models.CharField(null=True,blank=True,max_length=128,verbose_name=u'设计单位')
    kcdw = models.CharField(null=True,blank=True,max_length=128,verbose_name=u'勘察单位')
    jldw = models.CharField(null=True,blank=True,max_length=128,verbose_name=u'监理单位')
    zbdw = models.CharField(null=True,blank=True,max_length=128,verbose_name=u'总包单位')
    KGRQ = models.DateField(null=True,blank=True,verbose_name=u'开工日期')
    JGRQ = models.DateField(null=True,blank=True,verbose_name=u'竣工日期')
    XMGCS = models.CharField(null=True,blank=True,max_length=64,verbose_name=u'项目工程师')
    XMGCSID = models.CharField(null=True,blank=True,max_length=64,verbose_name=u'项目工程师ID')
    XMJL = models.CharField(null=True,blank=True,max_length=64,verbose_name=u'项目经理')
    XMJLID = models.CharField(null=True,blank=True,max_length=64,verbose_name=u'项目经理ID')
    company = models.ForeignKey(Company,null=True,verbose_name=u'公司单位',blank=True,related_name='projectlist', on_delete=models.CASCADE)
    city = models.ForeignKey('City',null=True,verbose_name=u'城市',blank=True)
    latitude = models.CharField(null=True,max_length=24,blank=True)
    longitude = models.CharField(null=True,max_length=24,blank=True)
    address = models.CharField(null=True,blank=True,max_length=128,verbose_name=u'项目地址')
    area = models.CharField(null=True,blank=True,verbose_name='面积',max_length=128,)
    price = models.CharField(null=True,blank=True,verbose_name='造价',max_length=128,)
    quality_target = models.CharField(null=True,blank=True,max_length=256,verbose_name=u'质量目标')
    safe_target = models.CharField(null=True,blank=True,max_length=256,verbose_name=u'安全目标')
    environment_target = models.CharField(blank=True,max_length=256,verbose_name=u'环境目标')
    pact_target = models.CharField(null=True,blank=True,max_length=256,verbose_name=u'合同目标')
    project_target = models.CharField(null=True,blank=True,max_length=256,verbose_name=u'项目目标')
    culture_target = models.CharField(null=True,blank=True,max_length=256,verbose_name=u'施工文明目标')
    deep = models.CharField(null=True,blank=True,verbose_name='深度',max_length=128,)
    height = models.CharField(null=True,blank=True,verbose_name='高度',max_length=128,)
    danti_nums = models.CharField(null=True,blank=True,verbose_name=u'单体数量',max_length=128)
    def __str__(self):
        return self.PrjName
    def engineering_count(self):
        return Engineering.objects.filter(project=self).count()
    class Meta:
        db_table = 'diary_project'
        verbose_name = '项目表'
        verbose_name_plural = '项目'

class ProjectFile(models.Model):
    """项目文件"""
    file = models.ForeignKey(Document,verbose_name=u'文件',null=True,blank=True)
    project = models.ForeignKey(Project,verbose_name=u'项目',null=True,blank=True)
    imgtype = models.IntegerField(blank=True,verbose_name=u'图片类型',default=1)
    def __str__(self):
        return self.project
    class Meta:
        db_table = 'diary_project_file'
        verbose_name = '项目文件'
        verbose_name_plural = '项目文件'

class Engineering(models.Model):
    """单位工程"""
    name = models.CharField(null=True,blank=True,max_length=64,verbose_name=u'名称')
    address = models.CharField(null=True,blank=True,max_length=256,verbose_name=u'地址')
    insert_dt = models.DateField(blank=True, null=True,verbose_name=u'记录日期')
    branchengineering = models.ForeignKey('BranchEngineering',verbose_name=u'分部工程',null=True,blank=True)
    project = models.ForeignKey(Project,verbose_name=u'所属项目',related_name="engineertlist")
    area = models.FloatField(null=True,blank=True,verbose_name='面积')
    height = models.FloatField(null=True,blank=True,verbose_name='高度')
    struct_type = models.IntegerField(null=True,blank=True,verbose_name=u'结构类型',default=1)
    shiji_schedule = models.CharField(null=True,blank=True,max_length=64,verbose_name=u'实际进度',default=0)
    design_schedule = models.IntegerField(null=True,blank=True,verbose_name=u'计划进度',default=0)
    duration=models.IntegerField(null=True,blank=True,verbose_name=u'工期',default=0)
    def __str__(self):
        return self.name
    def wxy_count(self):
        return JSFA.objects.filter(engineering=self).exclude(sfzdwxy="否").count()
    class Meta:
        db_table = 'diary_engineering'
        verbose_name = '单位工程'
        verbose_name_plural = '工程'

class JSFA(models.Model):
    """技术方案"""
    BEIAN_TYPE_CHOICES = (
        (0,u'否'),
        (1,u'是')
    )
    DANGER_TYPE_CHOICES = (
        (1,u'安全'),
        (2,u'危险'),
        (3,u'特别危险的')
    )
    DANGER_STATUS_CHOICES = (
        (1,u'安全'),
        (2,u'危险'),
        (3,u'特别危险的')
    )
    autoid = models.CharField(blank=True,max_length=64,verbose_name=u'业务编码')
    FAMC = models.CharField(blank=True,max_length=64,verbose_name=u'方案名称')
    FABH = models.CharField(blank=True,max_length=64,verbose_name=u'方案编号')
    FAID = models.CharField(blank=True,max_length=64,verbose_name=u'方案ID')
    FALB = models.CharField(blank=True,max_length=64,verbose_name=u'方案类别')
    PrjName = models.CharField(blank=True,max_length=200,verbose_name=u'项目名称')
    PrjId = models.CharField(blank=True,max_length=100,verbose_name=u'项目编号')
    PrjSys = models.ForeignKey(Project,verbose_name=u'所属项目',null=True,blank=True,related_name='jsfa') 
    GCGS = models.CharField(blank=True,max_length=64,verbose_name=u'工程公司')
    GCGSID = models.CharField(blank=True,max_length=64,verbose_name=u'工程公司编码')
    GCLB = models.CharField(blank=True,max_length=64,verbose_name=u'工程类别')
    sgzt = models.CharField(blank=True,max_length=64,verbose_name=u'施工状态')
    jhbzrq = models.DateTimeField(blank=True, null=True,verbose_name=u'计划编制日期')
    xcssrq = models.DateTimeField(blank=True, null=True,verbose_name=u'现场施工日期')
    xcjsrq = models.DateTimeField(blank=True, null=True,verbose_name=u'现场结束日期')
    BZRQ = models.DateTimeField(blank=True, null=True,verbose_name=u'编制日期')
    bzr = models.CharField(blank=True, null=True, max_length=64,verbose_name=u'编制人')
    BZ = models.CharField(blank=True, null=True, max_length=255,verbose_name=u'是否编制')
    
    xmgcs = models.CharField(blank=True,max_length=64,verbose_name=u'项目工程师')
    xmjl = models.CharField(blank=True,max_length=64,verbose_name=u'项目经理')
    JSDW = models.CharField(blank=True,max_length=64,verbose_name=u'建设单位')
    sfba1 = models.CharField(blank=True, max_length=64,verbose_name=u'是否备案',choices=BEIAN_TYPE_CHOICES)
    sfzdwxy = models.CharField(blank=True,max_length=64,verbose_name=u'是否重大危险源')
    sfzjlz = models.CharField(blank=True,max_length=64,verbose_name=u'是否专家认证')
    # status = models.IntegerField(verbose_name=u'危大状态',choices=DANGER_STATUS_CHOICES)
    C_BizRangeId = models.CharField(blank=True,max_length=64,verbose_name=u'工程编码')
    engineering = models.ForeignKey(Engineering,verbose_name=u'所属工程',null=True,blank=True,related_name='engineerdangers', on_delete=models.CASCADE)
    insert_dt = models.DateTimeField(blank=True, null=True,verbose_name=u'记录日期')
    branch_engeering = models.ForeignKey(BranchEngineering,verbose_name=u'所属分项',null=True,blank=True)
    schedule = models.CharField(max_length=64,verbose_name=u'进度',null=True,blank=True)
    jiaodi_status = models.CharField(blank=True,max_length=64,verbose_name=u'交底状态',default="否")
    def __str__(self):
        return self.FAMC
    class Meta:
        db_table = 'diary_JSFA'
        ordering = ('-insert_dt',)
        verbose_name = '危大工程'
        verbose_name_plural = '危大'

class Procedure(models.Model):
    """工序"""
    STATUS_TYPE_CHOICES = (
        (1,u'未审批'),
        (2,u'审核中'),
        (3,u'已结束')
    )
    PROCEDURE_TYPE_CHOICES = (
        (1,u'重点工序'),
        (2,u'关键工序'),
        (3,u'难点工序')
    )
    name = models.CharField(null=True,blank=True,max_length=64,verbose_name=u'名称')
    addtime = models.DateField(null=True,blank=True,verbose_name=u'日期')
    end_dt = models.DateField(null=True,blank=True,verbose_name=u'结束日期')
    gxtype = models.IntegerField(null=True,blank=True,verbose_name=u'工序类型',choices=PROCEDURE_TYPE_CHOICES)
    status = models.IntegerField(null=True,blank=True,verbose_name=u'审核状态',choices=STATUS_TYPE_CHOICES)
    bianzhi = models.CharField(null=True,blank=True,max_length=64,verbose_name=u'编制')
    jiankong = models.CharField(null=True,blank=True,max_length=64,verbose_name=u'监控')
    engineering = models.ForeignKey(Engineering,verbose_name=u'所属工程',related_name='engineerprocedures', on_delete=models.CASCADE)
    branch_engeering = models.ForeignKey(BranchEngineering,verbose_name=u'所属分项',null=True,blank=True)
    schedule = models.CharField(null=True,blank=True,max_length=64,verbose_name=u'进度')

    def __str__(self):
        return self.name
    class Meta:
        db_table = 'diary_procedure'
        ordering = ('-addtime',)
        verbose_name = '工序管控'
        verbose_name_plural = '工序'

class ProcedureFile(models.Model):
    """工序文件"""
    file = models.ForeignKey(Document,verbose_name=u'文件',null=True,blank=True)
    procedure = models.ForeignKey(Procedure,verbose_name=u'工序',null=True,blank=True)
    def __str__(self):
        return self.project
    class Meta:
        db_table = 'diary_procedure_file'
        verbose_name = '工序文件'
        verbose_name_plural = '工序文件'

class JSFAFile(models.Model):
    """技术方案文件"""
    file = models.ForeignKey(Document,verbose_name=u'文件',null=True,blank=True)
    danger = models.ForeignKey(JSFA,verbose_name=u'危大',null=True,blank=True)
    filetype = models.IntegerField(blank=True,verbose_name=u'图片类型',default=1)
    def __str__(self):
        return self.project
    class Meta:
        db_table = 'diary_JSFA_file'
        verbose_name = '危大文件'
        verbose_name_plural = '危大文件'

class Record(models.Model):
    """施工日记"""
    template = models.CharField(blank=True,max_length=64,null=True,verbose_name=u'温度')
    weather = models.CharField(blank=True, max_length=64,null=True,verbose_name=u'天气')
    qualitys = models.CharField(blank=True,null=True,max_length=256,verbose_name=u'质量')
    safetys = models.CharField(blank=True,null=True,max_length=256,verbose_name=u'安全')
    fieldcapacitys = models.CharField(blank=True,null=True,max_length=256,verbose_name=u'场容')
    mortars = models.CharField(blank=True,null=True,max_length=256,verbose_name=u'砂浆矼试块')
    checkworks = models.CharField(blank=True,null=True,max_length=256,verbose_name=u'复核记录')
    materialinfos = models.CharField(blank=True,null=True,max_length=256,verbose_name=u'进退场')
    overtimes = models.CharField(blank=True,null=True,max_length=256,verbose_name=u'加班与停工清空')
    others = models.CharField(blank=True,null=True,max_length=256,verbose_name=u'其他')
    curr_time = models.DateField(blank=True, null=True,verbose_name=u'日期')
    engineering = models.ForeignKey(Engineering,verbose_name=u'工程',null=True,blank=True)
    pdffilepath = models.CharField(blank=True,null=True,max_length=256,verbose_name=u'pdf文件路径')
    def __str__(self):
        return self.template
    class Meta:
        db_table = 'diary_record'
        ordering = ('-curr_time',)
        verbose_name = '施工日记'
        verbose_name_plural = '施工日记'

class RecordWork(models.Model):
    """分部内容"""
    name = models.CharField(max_length=64,verbose_name=u'分部名称',null=True,blank=True)
    designwork = models.CharField(max_length=256,verbose_name=u'预计工作量',null=True,blank=True)
    completework = models.CharField(max_length=256,verbose_name=u'实际工作量',null=True,blank=True)
    content = models.CharField(max_length=256,verbose_name=u'工作内容',null=True,blank=True)
    record = models.ForeignKey(Record,verbose_name=u'日记',null=True,blank=True,related_name='rewordworks', on_delete=models.CASCADE)
    def __str__(self):
        return self.name
    class Meta:
        db_table = 'diary_record_work'
        verbose_name = '分部内容'
        verbose_name_plural = '分部内容'


class RecordWorkType(models.Model):
    """工种"""
    name = models.CharField(max_length=64,verbose_name=u'名称',null=True,blank=True)
    monitor = models.CharField(max_length=64,verbose_name=u'班组',null=True,blank=True)
    peoples = models.IntegerField(blank=True,verbose_name=u'人数',default=0)
    recordwork = models.ForeignKey(RecordWork,verbose_name=u'分部',null=True,blank=True,related_name='rewordworktypes', on_delete=models.CASCADE)
    def __str__(self):
        return self.name
    class Meta:
        db_table = 'diary_record_work_type'
        verbose_name = '工种'
        verbose_name_plural = '工种'


class RecordFile(models.Model):
    """日记文件"""
    file = models.ForeignKey(Document,verbose_name=u'文件',null=True,blank=True)
    record = models.ForeignKey(Record,verbose_name=u'危大',null=True,blank=True)
    filetype = models.IntegerField(blank=True,verbose_name=u'图片类型',default=1)
    def __str__(self):
        return self.record
    class Meta:
        db_table = 'diary_Recordfile'
        verbose_name = '日记文件'
        verbose_name_plural = '日记文件'
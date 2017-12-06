# -*- coding: utf-8 -*-
from rest_framework import serializers
from Projects.models import *
from django.db.models import Q

class DocumentSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    class Meta:
        model = Document
        fields = '__all__'

class CitySerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    project_count = serializers.ReadOnlyField()
    project_total_count = serializers.ReadOnlyField()
    class Meta:
        model = City
        fields = '__all__'

class BranchEngineeringSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    class Meta:
        model = BranchEngineering
        fields = '__all__'

class JSFASerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    # insert_dt = serializers.DateField(format="%Y-%m-%d",read_only=False)#自定义格式
    companyname = serializers.ReadOnlyField(source='engineering.project.company.name')#扩张外键字段
    engeeringname = serializers.ReadOnlyField(source='engineering.name')#扩张外键字段
    projectname = serializers.ReadOnlyField(source='engineering.project.PrjName')#扩张外键字段
    project_id = serializers.ReadOnlyField(source='engineering.project.id')#扩张外键字段
    branch_engeering_name = serializers.ReadOnlyField(source='branch_engeering.name')#扩张外键字段
    branch_engeering_id = serializers.ReadOnlyField(source='branch_engeering.id')#扩张外键字段
    branch_engeering_parent_id = serializers.ReadOnlyField(source='branch_engeering.parent.id')
    branch_engeering_parent_parent_id = serializers.ReadOnlyField(source='branch_engeering.parent.parent.id')
    branch_engeering_parent_name = serializers.ReadOnlyField(source='branch_engeering.parent.name')
    branch_engeering_parent_parent_name = serializers.ReadOnlyField(source='branch_engeering.parent.parent.name')
    name = serializers.ReadOnlyField(source='fbfxgcmc')
    class Meta:
        model = JSFA
        fields = '__all__'

class ProcedureSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    # addtime = serializers.DateTimeField(format="%Y-%m-%d",read_only=True)#自定义格式
    companyname = serializers.ReadOnlyField(source='engineering.project.company.name')#扩张外键字段
    engeeringname = serializers.ReadOnlyField(source='engineering.name')#扩张外键字段
    projectname = serializers.ReadOnlyField(source='engineering.project.PrjName')#扩张外键字段
    project_id = serializers.ReadOnlyField(source='engineering.project.id')
    branch_engeering_name = serializers.ReadOnlyField(source='branch_engeering.name')#扩张外键字段
    branch_engeering_id = serializers.ReadOnlyField(source='branch_engeering.id')#扩张外键字段
    branch_engeering_parent_id = serializers.ReadOnlyField(source='branch_engeering.parent.id')
    branch_engeering_parent_parent_id = serializers.ReadOnlyField(source='branch_engeering.parent.parent.id')
    branch_engeering_parent_name = serializers.ReadOnlyField(source='branch_engeering.parent.name')
    branch_engeering_parent_parent_name = serializers.ReadOnlyField(source='branch_engeering.parent.parent.name')
    insert_dt = serializers.ReadOnlyField(source='addtime')
    class Meta:
        model = Procedure
        fields = '__all__'

class ProcedureFileSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    filename = serializers.ReadOnlyField(source='file.name')
    filepath = serializers.ReadOnlyField(source='file.filepath')
    fileid = serializers.ReadOnlyField(source='file.id')
    class Meta:
        model = ProcedureFile
        fields = '__all__'

class JSFAFileSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    filename = serializers.ReadOnlyField(source='file.name')
    filepath = serializers.ReadOnlyField(source='file.filepath')
    fileid = serializers.ReadOnlyField(source='file.id')
    class Meta:
        model = JSFAFile
        fields = '__all__'

class RecordFileSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    filename = serializers.ReadOnlyField(source='file.name')
    filepath = serializers.ReadOnlyField(source='file.filepath')
    fileid = serializers.ReadOnlyField(source='file.id')
    class Meta:
        model = RecordFile
        fields = '__all__'


class EngineeringSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    engineerprocedures = ProcedureSerializer(many=True,read_only=True)
    engineerdangers = JSFASerializer(many=True,read_only=True)
    wxy_count = serializers.ReadOnlyField()
    class Meta:
        model = Engineering
        fields = '__all__'

class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    name = serializers.ReadOnlyField(source='PrjName',read_only=True)
    cityname = serializers.ReadOnlyField(source='city.name')
    companyname = serializers.ReadOnlyField(source='company.name')
    # engineertlist = EngineeringSerializer(many=True,read_only=True)
    engineering_count = serializers.ReadOnlyField()
    class Meta:
        model = Project
        fields = '__all__'
        # fields = ('id','url','SSComName','PrjState','xmjl','jsdw','kgrq','jgrq','PrjName', 'latitude','longitude','FDeptID','city','cityname','companyname','company') #定义可编辑的

class CompanySerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    # projectlist = ProjectSerializer(many=True,read_only=True)
    project_count = serializers.ReadOnlyField()
    class Meta:
        model = Company
        fields = '__all__'

class ProjectFileSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    # file = DocumentSerializer(read_only=True)#扩张外键model
    filename = serializers.ReadOnlyField(source='file.name')
    fileid = serializers.ReadOnlyField(source='file.id')
    filepath = serializers.ReadOnlyField(source='file.filepath')
    projectid = serializers.ReadOnlyField(source='project.id')

    class Meta:
        model = ProjectFile
        fields = '__all__'

class RecordWorkTypeSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    class Meta:
        model = RecordWorkType
        fields = '__all__'

class RecordWorkSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    rewordworktypes = RecordWorkTypeSerializer(many=True,read_only=True)
    class Meta:
        model = RecordWork
        fields = '__all__'

class RecordSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    rewordworks = RecordWorkSerializer(many=True,read_only=True)
    class Meta:
        model = Record
        fields = '__all__'

    def create(self, validated_data):
       curr_time=validated_data.get('curr_time')
       engineering=validated_data.get('engineering')
       record=None
       try :
            record=Record.objects.get(Q(curr_time=curr_time),Q(engineering=engineering))
       except :
            pass
       if record:
           pass
       else :
           record=Record.objects.create(**validated_data)
       return record

    def update(self, instance, validated_data):
        instance.template = validated_data.get('template', instance.template)
        instance.weather = validated_data.get('weather', instance.weather)
        if len(validated_data.get('qualitys', instance.qualitys))>0 :
           instance.qualitys = validated_data.get('qualitys', instance.qualitys)
        else :
            pass
        if len(validated_data.get('safetys', instance.safetys))>0:
           instance.safetys = validated_data.get('safetys', instance.safetys)
        else :
            pass
        if len(validated_data.get('fieldcapacitys', instance.fieldcapacitys))>0 :
           instance.fieldcapacitys = validated_data.get('fieldcapacitys', instance.fieldcapacitys)
        else :
            pass
        if len(validated_data.get('mortars', instance.mortars))>0:
           instance.mortars = validated_data.get('mortars', instance.mortars)
        else :
            pass
        if len(validated_data.get('checkworks', instance.checkworks))>0:
           instance.checkworks = validated_data.get('checkworks', instance.checkworks)
        else :
            pass
        if len(validated_data.get('materialinfos',instance.materialinfos))>0:
           instance.materialinfos = validated_data.get('materialinfos',instance.materialinfos)
        else :
            pass
        if len(validated_data.get('overtimes',instance.overtimes))>0:
           instance.overtimes = validated_data.get('overtimes',instance.overtimes)
        else :
            pass
        if len(validated_data.get('others', instance.others))>0:
           instance.others = validated_data.get('others', instance.others)
        else :
            pass
        instance.save()
        return instance

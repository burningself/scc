# -*- coding: utf-8 -*-
from __future__ import absolute_import
import xadmin
from xadmin import views
from xadmin.layout import Main, TabHolder, Tab, Fieldset, Row, Col, AppendedText, Side, Field
from Projects.models import *

class BaseSetting(object):
    enable_themes=True
    use_bootswatch=True

xadmin.site.register(views.BaseAdminView,BaseSetting)

class GlobalSetting(object):
    site_title = "施工日记管理"
    site_footer = "上海建工四建集团有限公司"
    # menu_style = "default"
    global_models_icon = {
        BranchEngineering: "fa fa-laptop",
        City:"fa fa-laptop",
        Project:"fa fa-cloud"
    }
    global_search_models = [Project, BranchEngineering,City,Company]

    #菜单设置
    # def get_site_menu(self):
    #     return (
    #         {'title': '工程', 'perm': '', 'menus': (
    #             {'title': '分部工程', 'icon': 'fa fa-vimeo-square'
    #                 , 'url': BranchEngineering },

    #         )},
    #     )


xadmin.site.register(views.CommAdminView, GlobalSetting)

# @xadmin.site.register(BranchEngineering)
class BranchEngineeringAdmin(object):
    list_display = ['id','name','parent']
    search_fields = ['name','parent']
    list_filter =['parent']

xadmin.site.register(BranchEngineering,BranchEngineeringAdmin)

class CityAdmin(object):
    list_display = ['id','name','parent']
    search_fields = ['name']
    list_filter =['parent']
    show_bookmarks = False #隐藏标签

xadmin.site.register(City,CityAdmin)

class CompanyAdmin(object):
    # list_display = ['id','name','parent',]
    search_fields = ['name','parent']
    list_filter =['parent']
    show_bookmarks = False #隐藏标签

xadmin.site.register(Company,CompanyAdmin)

class ProjectAdmin(object):
    list_display = ['id','PrjName','company','city']
    search_fields = ['PrjName','company']
    list_filter =[('company')]
    show_bookmarks = False #隐藏标签

    form_layout = (
        Fieldset(u'',
            Row('FDeptID','SSComName'),
            Row('SSComName','SSComID'),
            Row('PrjName','PrjState'),
            Row('xmjl','jsdw'),
            Row('kgrq','jgrq'),
            Row('company','city'),
        )
    )

xadmin.site.register(Project,ProjectAdmin)

class EngineeringAdmin(object):
    list_display = ['id','name','branchengineering','project']
    search_fields = ['name']
    list_filter =['project']
    show_bookmarks = False #隐藏标签

xadmin.site.register(Engineering,EngineeringAdmin)

class JSFAAdmin(object):
    list_display = ['id','btmc','autoid','gcmc','jcdw']
    search_fields = ['btmc']
    show_bookmarks = False #隐藏标签

xadmin.site.register(JSFA,JSFAAdmin)

class ProcedureAdmin(object):
    list_display = ['id','name','engineering','addtime','gxtype','status','bianzhi','jiankong']
    search_fields = ['name','engineering']
    show_bookmarks = False #隐藏标签

xadmin.site.register(Procedure,ProcedureAdmin)

class RecordAdmin(object):
    list_display = ['id','template','weather','quality','safety','fieldcapacity','other','mortar']
    show_bookmarks = False #隐藏标签

xadmin.site.register(Record,RecordAdmin)

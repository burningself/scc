
# -*- coding: utf-8 -*-
from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from User.models import *
import sys;
reload(sys);
sys.setdefaultencoding("utf8")


# admin.site.register(User, UserAdmin)


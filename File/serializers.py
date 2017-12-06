# -*- coding: utf-8 -*-
from rest_framework import serializers
from .models import *

class WXfileSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    class Meta:
        model = WXfile
        fields = '__all__'
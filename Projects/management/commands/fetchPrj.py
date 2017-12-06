# -*- coding: utf-8 -*-

from django.core.management.base import BaseCommand, CommandError
from Projects.utility import getPrjInfo,getJSFA

class Command(BaseCommand):
    def handle(self, *args, **options):
#         getPrjInfo()
        getJSFA()
        return
        
        

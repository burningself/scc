# -*- coding: utf-8 -*-

from django.core.management.base import BaseCommand, CommandError
from User.utility import updateInfo

class Command(BaseCommand):
    def handle(self, *args, **options):
        updateInfo()
        return


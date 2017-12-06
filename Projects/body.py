# -*- coding: utf-8 -*-
class body(object):
    record=None
    recordWorkList =[]
    recordWorkTypeList =[]
    temperatureLow=0
    weekday=0
    def __init__(self,record,recordWorkList,recordWorkTypeList,temperatureLow,weekday):
        self.record=record
        self.recordWorkList=recordWorkList
        self.recordWorkTypeList=recordWorkTypeList
        self.temperatureLow=temperatureLow
        if weekday == 0:
            self.weekday="一"
        elif weekday == 1:
            self.weekday="二"
        elif weekday == 2:
            self.weekday="三"
        elif weekday == 3:
            self.weekday="四"
        elif weekday == 4:
            self.weekday="五"
        elif weekday == 5:
            self.weekday="六"
        elif weekday == 6:
            self.weekday="天"
        else :
            self.weekday="无"

       

      
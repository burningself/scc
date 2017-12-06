# -*- coding: utf-8 -*-

import xlrd, traceback, os

from Projects.models import *

def importData(rootdir):
    for each in os.listdir(rootdir):
        filename = os.path.join(rootdir,each)
        print filename
        data = xlrd.open_workbook(filename)
        
        table= data.sheets()[0]
        
        try:
            for i in range(1,table.nrows):
                print i
                if City.objects.filter(name=table.cell(i,2).value):
                    if City.objects.filter(name=table.cell(i,3).value):
                        if table.cell(i,3).value !=  table.cell(i,2).value:
                            City.objects.filter(name=table.cell(i,3).value).update(parent=City.objects.get(name=table.cell(i,2).value))
                    else:
                        print table.cell(i,3).value
                        tgtCity = City.objects.create(name=table.cell(i,3).value,parent=City.objects.get(name=table.cell(i,2).value))    
                else:
                    print table.cell(i,2).value
                    print table.cell(i,3).value
                    parentCity = City.objects.create(name=table.cell(i,2).value)
                    tgtCity = City.objects.create(name=table.cell(i,3).value,parent=parentCity)    
                
                if not Project.objects.filter(PrjName=table.cell(i,0).value):
                    print table.cell(i,0).value
                
                else:   
                    Project.objects.filter(PrjName=table.cell(i,0).value).update(
                        GCGS=table.cell(i,1).value,
                        city = City.objects.get(name = table.cell(i,3).value),
                        address=table.cell(i,4).value,
                        longitude = table.cell(i,5).value,
                        latitude = table.cell(i,6).value
                    )
                
        except:
            traceback.print_exc()
            print table.cell(i,0).value,table.cell(i,2).value,table.cell(i,3).value,table.cell(i,4).value,table.cell(i,5).value,table.cell(i,6).value


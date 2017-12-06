var router = new VueRouter({
    routes: [
        //首页
        { path: '/', redirect: '/index/wxIndex' },
        {
            path: '/viewpdf',
            name: 'pdf'
        },
        {
            path: '/index',
            component: index,
            children: [{
                    path: 'wxIndex',
                    component: wxIndex,
                }, {
                    path: 'message', //消息
                    name: message,
                    component: message,
                }, {
                    path: 'self_info', //个人信息
                    name: self_info,
                    component: self_info,
                }, {
                    path: 'weida', //首页危大
                    name: 'weida',
                    component: weida,
                    children: [{
                        path: 'danwei',
                        name: 'danwei',
                        component: danwei,
                    }, {
                        path: 'wd_time',
                        name: 'wd_time',
                        component: wd_time,
                    }, {
                        path: 'wd_list/:num', //单位轴下的项目列表
                        name: 'wd_list',
                        component: wd_list,
                    }, {
                        path: 'wd_list_gc/:num', //单位轴下的工程
                        name: 'wd_list_gc',
                        component: wd_list_gc,
                    }, {
                        path: 'wd_gc_sg/:num', //单位轴下的施工设计
                        name: 'wd_gc_sg',
                        component: wd_gc_sg,
                    }, {
                        path: 'wd_time_project/:num', //时间轴下的对应日期项目
                        name: 'wd_time_project',
                        component: wd_time_project,
                    }, {
                        path: 'wd_time_project_gc/:num', //时间轴下的对应日期项目下的工程
                        name: 'wd_time_project_gc',
                        component: wd_time_project_gc,
                    }, {
                        path: 'wd_time_project_gc_sg/:num', //时间轴下的对应日期项目下的工程
                        name: 'wd_time_project_gc_sg',
                        component: wd_time_project_gc_sg,
                    }]
                }, {
                    path: 'xxjd', //首页形象进度
                    component: xxjd,
                    children: [{
                        path: 'xx_danwei', //首页形象进度下的单位轴
                        name: 'xx_danwei',
                        component: xx_danwei,
                    }, {
                        path: 'xx_time', //首页形象进度下的时间轴
                        name: 'xx_time',
                        component: xx_time,
                    }, {
                        path: 'xx_list_gc/:num', //首页形象进度下单位轴下的项目列表下的工程列表
                        name: 'xx_list_gc',
                        component: xx_list_gc,
                    }, {
                        path: 'xx_list/:num', //首页形象进度下单位轴下的项目列表
                        name: 'xx_list',
                        component: xx_list,
                    }, {
                        path: 'xx_time_project/:num', //首页形象进度下时间轴下的对应日期项目下的项目
                        name: 'xx_time_project',
                        component: xx_time_project,
                    }, {
                        path: 'xx_time_project_gc/:num', //首页形象进度下时间轴下的对应日期项目下的项目下的工程
                        name: 'xx_time_project_gc',
                        component: xx_time_project_gc,
                    }]
                }, {
                    path: 'gxbk', //首页工序管控
                    component: gxbk,
                    children: [{
                        path: 'gxbk_danwei', //首页工序管控下的单位轴
                        name: 'gxbk_danwei',
                        component: gxbk_danwei,
                    }, {
                        path: 'gx_time', //首页工序管控下的时间轴
                        name: 'gx_time',
                        component: gx_time,
                    }, {
                        path: 'gx_list/:num', //首页工序管控下单位轴下的项目列表
                        name: 'gx_list',
                        component: gx_list,
                    }, {
                        path: 'gx_list_gc/:num', //首页工序管控下单位轴下的项目列表下的工程列表
                        name: 'gx_list_gc',
                        component: gx_list_gc,
                    }, {
                        path: 'gx_list_gc_gxList/:num', //首页工序管控下单位轴下的项目下的工程下的工序列表
                        name: 'gx_list_gc_gxList',
                        component: gx_list_gc_gxList,
                    }, {
                        path: 'gx_time_project/:num', //首页形象进度下时间轴下的对应日期项目下的项目
                        name: 'gx_time_project',
                        component: gx_time_project,
                    }, {
                        path: 'gx_time_project_gc/:num', //首页形象进度下时间轴下的对应日期项目下的项目下的工程
                        name: 'gx_time_project_gc',
                        component: gx_time_project_gc,
                    }, {
                        path: 'gx_time_project_gc_gxList/:num', //首页形象进度下时间轴下的对应日期项目下的项目下的工程
                        name: 'gx_time_project_gc_gxList',
                        component: gx_time_project_gc_gxList,
                    }]
                }, {
                    path: 'myTask', //首页我的任务
                    component: myTask,

                }, {
                    path: 'project_online', //项目在线
                    component: project_online,
                    children: [{
                        path: 'unit_list',
                        name: 'unit_list',
                        component: unit_list,
                    }, {
                        path: 'map_list',
                        name: 'map_list',
                        component: map_list,
                    }, ]
                }, {
                    path: 'projectList/:num',
                    component: projectList,
                    children: [{
                        path: 'project_list',
                        name: 'project_list',
                        component: project_list,
                    }, {
                        path: 'project_map_list',
                        name: 'project_map_list',
                        component: project_map_list,
                    }]
                }, {
                    path: 'a_project/:num',
                    component: a_project
                }, {
                    path: 'unit_project/:num', //单位工程
                    component: unit_project
                }, {
                    path: 'project_in_methods/:num', //单位工程下的具体工程
                    name: 'project_in_methods',
                    component: project_in_methods
                }, {
                    path: 'important_gx/:num', //单位工程下的重点工序
                    name: 'important_gx',
                    component: important_gx
                },
                {
                    path: 'add_important_gx/:num', //单位工程下的添加重点工序
                    name: 'add_important_gx',
                    component: add_important_gx
                },
                {
                    path: 'danger_project/:num', //单位工程下的危大工程
                    name: 'danger_project',
                    component: danger_project,
                    children: [{
                        path: 'danger_line',
                        name: 'danger_line',
                        component: danger_line,
                    }, {
                        path: 'danger_project_list',
                        name: 'danger_project_list',
                        component: danger_project_list,
                    }]
                }, {
                    path: 'graphic_index/:num', //形象进度
                    name: 'graphic_index',
                    component: graphic_index,
                    children: [{
                        path: 'graphic_project', //形象进度下的工程轴
                        name: 'graphic_project',
                        component: graphic_project,
                    }, {
                        path: 'graphic_time', //形象进度下的时间轴
                        name: 'graphic_time',
                        component: graphic_time,
                    }, , {
                        path: 'graphic_time_someone/:id', //形象进度下的某个月的工程
                        name: 'graphic_time_someone',
                        component: graphic_time_someone,
                    }]
                }, {
                    path: 'managementand_and_control/:num', //工序管控
                    component: managementand_and_control,
                    children: [{
                        path: 'procedure_line', //工序管控的工程轴
                        name: 'procedure_line',
                        component: procedure_line,
                    }, {
                        path: 'procedure_time_line', //工序管控的时间轴
                        name: "procedure_time_line",
                        component: procedure_time_line,
                    }, {
                        path: 'specific_gx/:date', //工序管控的时间轴下的日期工序
                        name: "specific_gx",
                        component: specific_gx,
                    }, {
                        path: 'procedure_project_line/:id', //工序管控的工程轴下的工序
                        name: "procedure_project_line",
                        component: procedure_project_line,
                    }]
                }, {
                    path: 'danger_control/:num', //危大管控
                    component: danger_control,
                    children: [{
                        path: 'project_line', //工程轴
                        name: 'project_line',
                        component: project_line,
                    }, {
                        path: 'time_line', //时间轴
                        name: "time_line",
                        component: time_line,
                    }, {
                        path: 'date_project/:id', //时间轴下的对应的日期工程
                        component: date_project
                    }, {
                        path: 'engineering_shaft/:id', //工程轴下的对应的设计
                        component: engineering_shaft
                    }, ]
                }, {
                    path: 'four_order', //四令管理
                    name: 'four_order',
                    component: four_order
                }, {
                    path: 'order_content/:num', //沉桩令
                    component: order_content
                }
            ]
        },
        { path: '/general_situation/:num', component: general_situation }, //工程概况
        { path: '/addProject/:num', component: addProject }, //工程概况
        { path: '/danger_info/:id', component: danger_info }, //危大详情
        { path: '/danger_argument/:id', component: danger_argument }, //危大论证
        {
            path: '/basic_content/:num', //单位工程下的基本内容
            name: 'basic_content',
            component: basic_content
        },
        {
            path: '/construction_diary/:num', //单位工程下的施工日记
            name: 'construction_diary',
            component: construction_diary
        },
        {
            path: '/graphic_progress/:num', //单位工程下的形象进度
            name: 'graphic_progress',
            component: graphic_progress
        },
        {
            path: '/work_map/:num', //单位工程下的形象进度
            name: 'work_map',
            component: work_map,
        },
        {
            path: '/process_details/:id', //工序详情
            name: 'process_details',
            component: process_details
        },
        {
            path: '/add_gx/:id', //添加工序
            name: 'add_gx',
            component: add_gx
        },
        {
            path: '/add_gx/:id', //首页危大
            name: 'add_gx',
            component: add_gx,
        },
        {
            path: '/add_diary/:id', //添加日记
            name: 'add_diary',
            component: add_diary,
        },
        {
            path: '/check_opinion/:id', //审批流程
            name: 'check_opinion',
            component: check_opinion,
        },
        {
            path: '/check_accessory/:id', //附件信息
            name: 'check_accessory',
            component: check_accessory,
        },
        {
            path: '/diary_pdf/:id', //pdf管理
            name: 'diary_pdf',
            component: pdf_show,
        }
    ]
})
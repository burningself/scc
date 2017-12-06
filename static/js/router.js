var router = new VueRouter({
    routes: [
        { path: '/', component: project },
        {
            name: 'project3',
            path: '/project3/',
            component: project3,
            children: [{
                name: 'diary_general',
                path: '/project3/diary_general', //工程概况
                component: diary_general
            }, {
                path: '/project3/unit_project/', //单位工程
                component: unit_project,
                children: [{
                        name: 'unit_project_index',
                        path: '/project3/unit_project/unit_project_index',
                        component: unit_project_index,
                    },
                    {
                        name: 'basic_content',
                        path: '/project3/unit_project/basic_content/:id', //单位工程下的基本内容
                        component: basic_content
                    },
                    {
                        name: 'graphic_progress',
                        path: '/project3/unit_project/graphic_progress/:num', //单位工程下的形象进度
                        component: graphic_progress
                    }, {
                        name: 'project_diary',
                        path: '/project3/unit_project/project_diary/:num', //单位工程下的施工日志
                        component: project_diary
                    }, {
                        name: 'project_list',
                        path: '/project3/unit_project/project_list/:num', //单位工程下的施工日志列表
                        component: project_list
                    }, {
                        name: 'project_control',
                        path: '/project3/unit_project/project_control/:num', //单位工程下的危大工程
                        component: project_control
                    }, {
                        name: 'important_pro',
                        path: '/project3/unit_project/important_pro/:num', //单位工程下的重点工序
                        component: important_pro
                    }, {
                        name: 'piling_order',
                        path: '/project3/unit_project/piling_order/:num', //四令管理下的沉桩令
                        component: piling_order
                    }, {
                        name: 'digging_order',
                        path: '/project3/unit_project/digging_order/:num', //四令管理下的挖土令
                        component: digging_order
                    }, {
                        name: 'Irrigation_order',
                        path: '/project3/unit_project/Irrigation_order/:num', //四令管理下的浇灌令
                        component: Irrigation_order
                    }, {
                        name: 'hoisting_order',
                        path: '/hoisting_order/:num', //四令管理下的吊装令
                        component: hoisting_order
                    }
                ]
            }, {
                name: 'management_and_control',
                path: '/project3/management_and_control/', //危大管控
                component: management_and_control
            }, {
                name: 'key_process',
                path: '/project3/key_process', //工序管控
                component: key_process
            }, {
                name: 'order_management',
                path: '/project3/order_management', //单位工程下的四令管理
                component: order_management
            }]
        }, //  施工日志
        { path: '/warning', component: warning }, //危大警示
        {
            path: '/graphic',
            component: graphic,
            children: [{
                name: 'changeList',
                path: '/graphic/changeList',
                component: changeList
            }, {
                name: 'danger',
                path: '/graphic/danger/:num',
                component: danger
            }, {
                name: 'changeProject',
                path: '/graphic/changeProject/:num',
                component: changeProject
            }]
        }, //形象进度
        { path: '/process_control', component: process_control }, //工序把控
        { path: '/four_order', component: four_order } //工序把控
    ]
})
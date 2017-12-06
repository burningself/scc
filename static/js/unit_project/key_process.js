var key_process = {
    template: `
        <div class="diary_unit">
            <projectContent @increment="incrementTotal"></projectContent>
            <div class="diary_unit_select">
                <div class="diary_unit_select_title">
                    <h4>{{ projectFirst }}</h4>
                </div>
                <div class="diary_unit_select_info">
                    <div class="piling_order_center">  
                        <Table border :columns="columns1" :data="data1"></Table>
                    </div>
                    <div class="piling_order_footer">
                        <Page :total="100"></Page>
                    </div>
                </div>
            </div>
        </div>
    `,


    data() {
        return {
            project_title: [
                '添加日期', '所属项目', '工序名称', '工程名称', '工程类型', '工程进度',
            ],
            columns1: [{
                title: '添加日期',
                key: 'addtime'
            }, {
                title: '所属项目',
                key: 'projectname'
            }, {
                title: '工序名称',
                key: 'name'
            }, {
                title: '工程名称',
                key: 'engeeringname'
            }, {
                title: '工程类型',
                key: 'gxtype'
            }, {
                title: '工程进度',
                key: 'schedule'
            }],
            data1: [],
            projectFirst: '',
            par: ''
        }
    },
    components: {
        projectContent
    },
    watch: {
        "$route": "fetchId"
    },
    methods: {
        fetchId() {
            this.par = localStorage.getItem('diary');
            this.ajaxCom();
        },
        incrementTotal(value) {
            this.projectFirst = value.split('-')[0];
        },
        ajaxCom() {
            const that = this;
            that.data1 = [];
            new Promise(reslove => {
                    $.ajax({
                        type: 'get',
                        url: '/projects/rest/ProcedureSet/?engineering_id=' + that.par,
                        success: function(data) {
                            reslove(data);
                        }
                    })
                })
                .then(data => {
                    console.log(data);
                    data.results.forEach((value, index) => {
                        if (index > 6) {
                            return false;
                        }
                        var obj = {};
                        obj.addtime = value.addtime;
                        obj.projectname = value.projectname;
                        obj.name = value.name;
                        obj.engeeringname = value.engeeringname;
                        obj.gxtype = value[value.gxtype];

                        obj.schedule = value.schedule;
                        that.data1.push(obj);

                    })
                })
        }
    },
    mounted() {
        var that = this;
        var project_type = {
                1: '特殊工序',
                2: '关键工序',
                3: '施工难点'
            }
            //获取工程id
        if (localStorage.getItem('diary')) {
            console.log(1);
            this.par = localStorage.getItem('diary'); //一进来获取工程id
            console.log(this.par);
            this.ajaxCom()
        } else {
            console.log(2);
            this.$store.dispatch('projectData').then(data => {
                that.par = data.results[0].id;
                that.ajaxCom()
            })

        }

    }
}
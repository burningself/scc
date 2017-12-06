var management_and_control = {
    template: `
       <div class="diary_unit">
            <projectContent @increment="incrementTotal"></projectContent>
            <div class="diary_unit_select">
                <div class="diary_unit_select_title">
                    <h4>{{ projectFirst }}</h4>
                </div>
                <div class="diary_unit_select_info">
                    <div class="unit_data_info">
                        <Table border :columns="columns6" :data="data5"></Table>
                    </div>
                    <div class="data_page">
                        <Page :total="100"></Page>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            theme3: 'light',
            project_info: [],
            projectFirst: '',
            showLoad: true,
            columns6: [{
                    title: '创建日期',
                    key: 'date'
                },
                {
                    title: '所属工程',
                    key: 'name'
                },
                {
                    title: '方案名称',
                    key: 'project',
                },
                {
                    title: '危大编制',
                    key: 'age',
                },
                {
                    title: '危大论证',
                    key: 'age',
                },
                {
                    title: '危大监控',
                    key: 'organization',
                },
                {
                    title: '危大级别',
                    key: 'jBie',
                }
            ],
            data5: [],
            par: null, //工程id    
        }
    },
    watch: {
        "$route": "fetchId"
    },
    components: {
        projectContent
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
            that.data5 = [];
            new Promise((resolve, reject) => {

                $.ajax({
                    url: '/projects/rest/dangerengineering/?engineering_id=' + that.par,
                    success: function(data) {
                        resolve(data);
                    }
                })
            }).then(data => {
                data.results.forEach(value => {
                    let obj = {};
                    obj.date = value.bzrq; //创建日期
                    obj.name = value.gcmc; //所属工程
                    obj.project = value.fbfxgcmc; //方案名称
                    obj.organization = value.bzr; //监控
                    obj.jBie = value.Sfzdwxy; //级别

                    that.data5.push(obj);
                })
            })
        }
    },
    mounted() {
        const that = this;
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
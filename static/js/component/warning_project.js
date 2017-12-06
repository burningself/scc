const warning_project = {
    template: `
        <Table border :columns="columns6" :data="data5"></Table>
    `,
    data() {
        return {
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
            proAll: [], //保存一进来的所有数据
        }
    },
    props: ["comeData"],
    watch: {
        "comeData": 'fetch'
    },
    methods: {
        //处理数据
        dataHandle(value) {
            const that = this;
            this.data5 = [];
            value.forEach(value => {
                let obj = {};
                obj.date = value.bzrq; //创建日期
                obj.name = value.gcmc; //所属工程
                obj.project = value.fbfxgcmc; //方案名称
                obj.organization = value.bzr; //监控
                obj.jBie = value.Sfzdwxy; //级别

                that.data5.push(obj);
            })
        },
        fetch() {
            let valuePro = this.comeData.split('-')[0]; //公司id
            let valuePro1 = this.comeData.split('-')[1]; //项目id
            let valuePro2 = this.comeData.split('-')[2]; //工程id

            if (valuePro === '0') { //对公司为空时转换为所有的项目
                this.dataHandle(this.proAll); //如果公司为空则转换为所有危大工程
                return false;
            }
            axios.get('/projects/rest/dangerengineering/?engineering__project__company_id=' + valuePro + '&engineering__project_id=' + valuePro1 + '&engineering_id=' + valuePro2)
                .then(res => {
                    this.dataHandle(res.data.results);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    },
    mounted() {
        let valuePro = ""; //公司id
        let valuePro1 = ""; //项目id
        let valuePro2 = ""; //工程id
        console.log(this.$route);
        if (this.$route.path.indexOf('project_control') >= 0) {
            valuePro1 = localStorage.getItem('prj').split('-')[1];
            valuePro2 = this.$route.params.num;
        }
        console.log(valuePro);
        console.log(valuePro1);
        console.log(valuePro2);
        axios.get('/projects/rest/dangerengineering/?engineering__project__company_id=' + valuePro + '&engineering__project_id=' + valuePro1 + '&engineering_id=' + valuePro2)
            .then(res => {
                console.log(res);
                const result = res.data.results
                this.proAll = result; //存储所有的危大
                this.dataHandle(result);
            })
            .catch(err => {
                console.log(err);
            })
    }
}
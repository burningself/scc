const danger = {
    template: `
            <div class="unit_data_info">
                <Table border :columns="columns1" :data="data1"></Table>
            </div>
    `,
    // <Page :total="100"></Page>
    // <Table border :columns="columns1" :data="data1"></Table>
    data() {
        return {
            columns1: [{
                    title: '添加日期',
                    key: 'data'
                },
                {
                    title: '所属项目',
                    key: 'project'
                },
                {
                    title: '名称',
                    key: 'proList'
                },
                {
                    title: '工程名称',
                    key: 'proName'
                },
                {
                    title: '工程类型',
                    key: 'type'
                }
            ],
            data1: []
        }
    },
    methods: {

    },
    mounted() {
        const project_type = {
            1: '特殊工序',
            2: '关键工序',
            3: '施工难点'
        }
        const param = this.$route.params.num //跳转页面的value值
        console.log(111111111);
        console.log(this.$route);
        console.log(param);
        const that = this;
        axios.get('/projects/rest/engineering/' + param)
            .then(res => {
                res.data.engineerdangers.forEach(data => {
                    that.data1.push({
                        data: data.insert_dt,
                        project: data.projectname,
                        proList: data.name,
                        proName: data.engeeringname,
                        type: '危大'
                    })
                });

                res.data.engineerprocedures.forEach(data => {
                    that.data1.push({
                        data: data.addtime,
                        project: data.projectname,
                        proList: data.name,
                        proName: data.engeeringname,
                        type: project_type[data.gxtype]
                    })
                });

                //按照时间进行排序
                this.data1.sort((a, b) => {
                    return new Date(a.data) > new Date(b.data);
                })
            })
            .catch(err => {
                console.log(err);
            })

    }
}
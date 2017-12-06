const gxbk = {
    template: `
        <Table border :columns="columns1" :data="data1"></Table>
    `,
    data() {
        return {
            data1: [],
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
            project_type: {
                1: '特殊工序',
                2: '关键工序',
                3: '施工难点'
            },
            proAll: [], //所有工序
        }
    },
    props: ["value"],
    watch: {
        'value': 'fetch'
    },
    methods: {
        fetch() {
            const that = this;
            this.data1 = [];
            let valuePro = this.value.split('-')[0]; //公司id
            let valuePro1 = this.value.split('-')[1]; //项目id
            let valuePro2 = this.value.split('-')[2]; //工程id
            console.log(valuePro1);
            console.log(valuePro2);
            if (valuePro === '0') { //对公司为空时转换为所有的项目
                this.data1(this.proAll); //如果公司为空则转换为所有危大工程
                return false;
            }
            axios.get('/projects/rest/engineering/?&project_id=' + valuePro1 + '&id=' + valuePro2)
                .then(res => {
                    console.log(res);
                    res.data.results.forEach(value => {
                            value.engineerprocedures.forEach((v, index) => {
                                that.data1.push({
                                    addtime: v.addtime,
                                    projectname: v.projectname,
                                    name: v.name,
                                    engeeringname: v.engeeringname,
                                    gxtype: that.project_type[v.gxtype],
                                    schedule: v.schedule + '%',
                                    oldIndex: index
                                })
                            })
                        })
                        // console.log(this.data1);
                    this.data1.sort(function(a, b) {
                        // console.log(new Date(a.addtime) - new Date(b.addtime) > 0);
                        return new Date(b.addtime) - new Date(a.addtime);
                    })
                })
                .catch(err => {
                    console.log(err);
                })
        }
    },
    mounted() {
        const that = this;
        let valuePro1 = "";
        let valuePro2 = "";
        if (this.$route.path.indexOf('important_pro') >= 0) {
            valuePro1 = localStorage.getItem('prj').split('-')[1];
            valuePro2 = this.$route.params.num;
        }
        console.log(valuePro1);
        console.log(valuePro2);
        axios.get('/projects/rest/engineering/?&project_id=' + valuePro1 + '&id=' + valuePro2)
            .then(res => {
                res.data.results.forEach(value => {
                        value.engineerprocedures.forEach((v, index) => {
                            that.data1.push({
                                addtime: v.addtime,
                                projectname: v.projectname,
                                name: v.name,
                                engeeringname: v.engeeringname,
                                gxtype: that.project_type[v.gxtype],
                                schedule: v.schedule + '%',
                                oldIndex: index
                            })
                        })
                    })
                    // console.log(this.data1);
                this.data1.sort(function(a, b) {
                    // console.log(new Date(a.addtime) - new Date(b.addtime) > 0);
                    return new Date(b.addtime) - new Date(a.addtime);
                })
                this.proAll = this.data1;
            })
            .catch(err => {
                console.log(err);
            })
    }
}
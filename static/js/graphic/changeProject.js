const changeProject = {
    template: `
        <Table  border :columns="columns1" :data="data1"></Table>
    `,
    data() {
        return {
            columns1: [{
                    title: '项目(工程)名称',
                    key: 'project'
                },
                {
                    title: '公司名称',
                    key: 'name'
                }, {
                    title: '施工日期',
                    key: 'data'
                }, {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.show(params.index);
                                    }
                                }
                            }, '查看'),
                        ]);
                    }
                }
            ],
            data1: [],
            dataListAll: [],
            gc: [],
        }
    },
    methods: {
        show(num) {
            console.log(this.gc);
            console.log(this.gc[this.$route.params.num].data[num].id);
            this.$router.push({ name: 'danger', params: { num: this.gc[this.$route.params.num].data[num].id } });
        }
    },
    mounted() {
        const that = this;
        axios.get('/projects/rest/company/')
            .then(res => {
                res.data.results.forEach((value, index) => { //处理三级数据
                    that.dataListAll[index] = {
                        label: value.name,
                        // value: value.id,
                        children: []
                    }
                    if (value.projectlist.length != 0) {
                        value.projectlist.forEach((dataValue, dataIndex) => {
                            that.dataListAll[index].children[dataIndex] = {
                                children: dataValue.engineertlist,
                                label: dataValue.name,
                                // value: dataValue.id,
                                companyname: dataValue.companyname,
                                kgrq: dataValue.kgrq
                            };
                            that.gc.push({
                                'company': dataValue.companyname,
                                'data': dataValue.engineertlist
                            })
                            console.log(that.gc)
                        })
                    }
                })
                this.gc[this.$route.params.num].data.forEach(value => {
                    this.data1.push({
                        project: value.name,
                        name: this.gc[this.$route.params.num].company,
                        data: value.insert_dt
                    })
                })
            })
    }
}
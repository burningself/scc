const changeList = {
    template: `
        <Table  border :columns="columns1" :data="data1"></Table>
    `,

    data() {
        return {
            loading: true,
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
            startData: [], //最开始的数据
            gc: [], //项目下面对应的工程
        }
    },
    props: ['proList'],
    methods: {
        change() { //改变公司对应的项目
            console.log(this.proList);
            const that = this;
            that.data1 = [];
            if (this.proList != undefined) {
                this.dataListAll[this.proList].children.forEach(value => {
                    that.data1.push({
                        project: value.label,
                        name: value.companyname,
                        data: value.kgrq
                    })
                })
            } else {
                // console.log(this.dataListAll);
                // console.log(this.proList);
                // this.dataListAll[this.proList].children.forEach(value => {
                //     that.data1.push({
                //         project: value.label,
                //         name: value.companyname,
                //         data: value.kgrq
                //     })
                // })
                this.data1 = this.startData;
            }
        },
        show(num) { //变成工程
            // this.data1 = [];
            // console.log(this.gc[num]);
            // this.gc[num].data.forEach(value => {
            //     console.log(value);
            //     this.data1.push({
            //         project: value.name,
            //         name: this.gc[num].company,
            //         data: value.insert_dt
            //     })
            // })
            this.$router.push({ name: 'changeProject', params: { num: num } })
        }
    },
    watch: {
        'proList': 'change'
    },
    mounted() {
        const that = this;
        axios.get('/projects/rest/company/')
            .then(res => {
                console.log(res);



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
                        })
                    }
                })
                console.log(this.gc);
                console.log(this.dataListAll);
                console.log(this.$route.params.num);
                this.data1 = [];
                if (this.$route.params.num == undefined) {
                    this.dataListAll.forEach(value => {

                        value.children.forEach(v => {
                                that.data1.push({
                                    project: v.label,
                                    name: v.companyname,
                                    data: v.kgrq
                                })
                            })
                            // console.log(value);
                            // this.data1.push({
                            //     project: value.label,
                            //     name: value.companyname,
                            //     data: value.kgrq
                            // })
                    })
                    this.startData = this.data1
                } else {
                    this.dataListAll[this.$route.params.num].children.forEach(value => {
                        that.data1.push({
                            project: value.label,
                            name: value.companyname,
                            data: value.kgrq
                        })
                    })
                }

            })

    }

}
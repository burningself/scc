const project_list = {
    template: `
        <div class=" marpad_info project_list diary_unit_select_info">
             <Table border :columns="columns4" :data="data1"></Table>
        </div>
    `,
    data() {
        return {
            columns4: [{
                    title: '日期',
                    key: 'date'
                },
                {
                    title: '温度',
                    key: 'temperature'
                },
                {
                    title: '天气',
                    key: 'weather'
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
                                        this.show(params.index)
                                    }
                                }
                            }, '查看'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.remove(params.index)
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }

            ],
            data1: [],
            proId: [], //单个日志的id值
        }
    },
    methods: {
        show(num) {
            router.push({ name: 'project_diary', params: { num: this.proId[num] + '-' + this.$route.params.num } });
        }
    },
    mounted() {
        const that = this;
        const num = this.$route.params.num;
        new Promise(resolve => {
            $.ajax({
                url: '/projects/rest/Records/?engineering_id=' + num,
                success: function(data) {
                    console.log(data);
                    resolve(data);
                }
            })
        }).then(data => {
            data.results.forEach(value => {
                that.proId.push(value.id)
                that.data1.push({
                    date: value.curr_time,
                    temperature: value.template,
                    weather: value.weather
                });
            })
            console.log(that.proId);
        })
    }
}
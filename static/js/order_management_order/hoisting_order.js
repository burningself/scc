var hoisting_order = {
    template: `
        <div class="piling_order marpad_info">
             <div class="piling_order_center">
                <Table border :columns="columns1" :data="data1"></Table>
             </div>
            <div class="piling_order_footer">
                   <Page :total="100"></Page>
            </div>
        </div>
    `,
    data() {
        return {
            columns1: [{
                    title: '时间',
                    key: 'data',
                },
                {
                    title: '部位',
                    key: 'name'
                },
                {
                    title: '数量',
                    key: 'project'
                }, {
                    title: '规格型号',
                    key: 'organization'
                }, {
                    title: '集团签发',
                    key: 'proof'
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
                            }, '查看详情'),
                        ]);
                    }
                }
            ],
            data1: [{
                    data: '2017/8/14',
                    name: '桩基试桩',
                    project: '12',
                    organization: '中型',
                    proof: '已签',
                },
                {
                    data: '2017/8/14',
                    name: '钢筋笼安放',
                    project: '12',
                    organization: '中型',
                    proof: '已签',
                    watch: '<Button type="info">查看详情</Button>'
                },
                {
                    data: '2017/8/14',
                    name: '混凝土浇筑',
                    project: '12',
                    organization: '中型',
                    proof: '已签',
                    watch: '<Button type="info">查看详情</Button>'
                },
                {
                    data: '2017/8/14',
                    name: '桩制作中张拉',
                    project: '12',
                    organization: '中型',
                    proof: '已签',
                    watch: '<Button type="info">查看详情</Button>'
                }, {
                    data: '2017/8/14',
                    name: '压浆',
                    project: '12',
                    organization: '中型',
                    proof: '已签',
                    watch: '<Button type="info">查看详情</Button>'
                }, {
                    data: '2017/8/14',
                    name: '沉桩施工',
                    project: '12',
                    organization: '中型',
                    proof: '已签',
                    watch: '<Button type="info">查看详情</Button>'
                }, {
                    data: '2017/8/14',
                    name: '管桩制作',
                    project: '12',
                    organization: '中型',
                    proof: '已签',
                    watch: '<Button type="info">查看详情</Button>'
                }
            ]
        }
    }
}
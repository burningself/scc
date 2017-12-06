const order_content = {
    template: `

        <div class="order_content common">
            <navigation :title="title" :address="back_address"></navigation>
            <scroll class="weui_panel weui_panel_access order_content overhid" >
                    <div>
                            <div class="weui_panel_bd" v-for="value in listData">
                                    <div class="weui-form-preview">
                                            <div class="weui-form-preview-hd">
                                                <label class="weui-form-preview-label size15">{{ value.name }}</label>
                                                <em class="weui-form-preview-value size15">{{value.sjdate}}</em>
                                            </div>
                                            <p>名称:{{ value.prname }}</p>
                                            <p>申报时间:{{ value.shbdate }}</p>
                                            <p>所属单位:{{ value.company}}</p>
                                            <p>申请人:{{value.person}}</p>
                                            <p class="last">状态:{{value.status}}</p>
                                    </div>
                            </div>
                    </div>
            </scroll>
        </div>

    `,
    data() {
        return {
            listData: 4,
            title: '工程四令',
            back_address: '',
            listData: [
                { name: '挖土令', prname: '测试挖土', sjdate: '2017-10-25', shbdate: '2017-10-25', company: '第一工程公司', person: '张铭', status: '未提交' },
                { name: '挖土令', prname: '挖土令1', sjdate: '2017-10-25', shbdate: '2017-10-25', company: '第一工程公司', person: '张铭', status: '未提交' },
                { name: '吊装令', prname: '测试1', sjdate: '2017-10-25', shbdate: '2017-10-25', company: '第一工程公司', person: '张铭', status: '未提交' }
            ]
        }
    },
    components: {
        navigation,
        scroll
    },
    methods: {},
    mounted() {
        $('.order_content').height($(window).height() - $('.navigation').height() - $('.weui-tabbar').height());
        const query = this.$route.params.num;
        console.log(query);
        if (query != 0) {
            this.back_address = '/index/four_order?val=' + query
                // this.$router.push({ path: '/index/four_order?val=' + query })
        } else {
            this.back_address = '/index/four_order?val=';
            // this.$router.push({ path: '/index/four_order?val=' })
        }
    }
}
const check_opinion = {
    template: `
        <div class="check_opinion h_all">
            <navigation :title="title" :address="address"></navigation>
            <div class="weui-loadmore" v-if="flagLoad">
                <i class="weui-loading"></i>
                <span class="weui-loadmore__tips">正在加载</span>
            </div>
            <scroll class="check_opinion" :data="flag">
                <div class="weui-flex pop">
                    <div class="weui-flex-item common">
                        <div class="placeholder white opinion_bac common">
                            <div class="op_line"></div>
                        </div>
                    </div>
                    <div class="weui-flex-item common">
                        <div class="placeholder common white">
                            <div class="opinion" v-for="(value,index) in dataList">
                                <div class="opinion_title">
                                    
                                    <div class="weui_cell no_access opinion_con">
                                        <div class="weui_cell_bd weui_cell_primary op_color">
                                            <strong>{{ value.TaskName }}</strong>
                                        </div>                           
                                    </div>
                                    <div class="weui_cell no_access opinion_con">
                                        
                                        <div class="weui_cell_ft op_flex op_color">
                                            {{ value.DealAdvice }}
                                        </div>                          
                                    </div>
                                    <div class="opinion_con">
                                        <div class="weui_cell no_access">
                                            <div class="weui_cell_bd weui_cell_primary">
                                                <p>人员:{{ value.EmployeeName }}</p>
                                            </div> 
                                            <div class="weui_cell_ft op_flex" >
                                                <span>时间:{{ value.DealTime | formatId }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p class="op_count" :class="value.class"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </scroll>
            <success_msg :content="'没有审批数据'" ref="c1"></success_msg>
        </div>
    `,
    data() {
        return {
            title: '审批状态',
            address: '',
            dataList: [],
            flag: true,
            flagLoad: false,
        }
    },
    components: {
        navigation,
        scroll,
        success_msg
    },
    filters: {
        formatId(value) {
            if (!value) {
                return '暂无数据';
            }
            const val = value.split('T');
            return val[0];
        },
        disagress(value) {
            return value.split('不同意,')[1];
        }
    },
    mounted() {

        const id = this.$route.query.val.split('|')[1],
            that = this;
        $.ajax({
                url: '/projects/getProjectSpyj/',
                data: {
                    'jsfa_id': id
                },
                type: 'post',
                success: function(res) {
                    console.log(res);
                    var result = res.spyj;
                    if (result.length != 0) {
                        result.reverse();
                        result.forEach(value => {
                            value.class = value.DealAdvice === "同意" ? 'green' : value.DealAdvice === "自动流转" ? 'yellow' : 'red_h';
                            console.log(value.class);
                        })
                        console.log(result);
                        that.dataList = result;

                        that.flagLoad = false;
                        that.$nextTick(() => {
                            var height = 0;
                            $('.opinion').forEach(value => {
                                console.log($(value).height());
                                height += $(value).height() + 20;
                            })
                            $('.op_line').height(height);
                            $('.pop').height(height + $('.weui-header').height());
                            that.flag = !that.flag;
                            // alert($('.opinion_bac').width() / 2);
                            // alert($('.op_count').width() / 2);
                            // var width = -($('.opinion_bac').width() / 2 + $('.op_count').width() / 2);
                            // $('.op_count').css({
                            //     'margin-left': width
                            // })
                        })
                    } else {
                        that.$refs.c1.showMsg();
                        that.flagLoad = false;
                    }

                }
            })
            // this.dataList = [{
            //     TaskName: '1111',
            //     DealAdvice: '同意',
            //     EmployeeName: '甘浩',
            //     DealTime: '00-00-00T00',
            //     class: 'green'
            // }]
            // $('.op_line').height(900);
            // var width = -($('.opinion_bac').width() / 2 + $('.op_count').width() / 2 + 2.5);
            // $('.op_count').css({
            //     'margin-left': width
            // })
            // console.log(this.$route);
        this.address = "/danger_info/" + this.$route.params.id + "?val=" + this.$route.query.val.split('|')[0];
    }
}
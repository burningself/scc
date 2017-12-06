var slide_left = {
    template: `
        <scroll class="procedure_project_line overhid" :data="listData">
            <p  class="text_hide size16" v-if="date"> {{ date }} </p>
            <div class="weui-loadmore" v-if="flagLoad">
                <i class="weui-loading"></i>
                <span class="weui-loadmore__tips">正在加载</span>
            </div>
            <router-link class="weui-panel weui-panel_access" v-for="(value,index) in listData" :to="{ path:value.address , query:{val:value.query} }" tag="div" :class="{ hui:value.PrjState }">
                <div class="weui-panel__ft">
                    <div class="weui-cell weui-cell_access weui-cell_link" >
                        <div class="weui-cell__bd text_hide size16" style="flex:8;-webkit-box-flex:8;-webkit-flex:8;">{{ value.time }}</div>
                        <p :style="{ background:value.color }">
                            {{value.value}}
                        </p>
                        <span class="weui-cell__ft"></span>                       
                    </div>    
                </div>
            </router-link>
            <success_msg :content=" '无工序' " ref="c1"></success_msg>
        </scroll>
    `,
    data() {
        return {
            listData: [], //时间
            flagLoad: true,
            date: '',
            timeLine: {},
            gx: [],
            gxType: {
                1: '重点',
                2: "关键",
                3: "难点"
            },
        }
    },
    components: {
        list,
        scroll,
        success_msg
    },
    mounted() {
        this.$store.commit('commonModules/getHeight', '.procedure_project_line');

        const par = this.$route.params,
            that = this,
            pId = par.num;
        console.log(this.$route);
        axios.get('/projects/rest/ProcedureSet/?engineering__project_id=' + pId.split('_')[1] + "&engineering_id=" + par.id)
            .then(res => {
                const result = res.data.results;
                if (result.length != 0) {
                    result.forEach(v => {
                        this.date = v.engeeringname;
                        this.listData.push({
                            time: v.name, //内容
                            address: '/process_details/' + pId.split('_')[0] + '_' + par.id,
                            query: v.id + '_1', //地址参数, 什么轴+工序id+项目id
                            value: that.gxType[v.gxtype],
                            color: v.gxtype == 1 ? "#327cda" : v.gxtype == 2 ? "purple" : "orange"

                        })
                    });
                    this.flagLoad = false;
                } else {
                    this.$refs.c1.showMsg();
                    this.flagLoad = false;
                }

            })
    }
}
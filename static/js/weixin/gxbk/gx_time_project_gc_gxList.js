const gx_time_project_gc_gxList = {
    template: `
        <scroll class="gx_time_project_gc_gxList overhid"  :data="listData">
            <list :listData="listData" :flagLoad="flagLoad" :date='date'>
                <div class="icon_fa weu_ssd" :slot="i+'star'" v-for="(value,i) in  listData">
                    <div class="del_gx" @click.stop="del_gx(value,i)" >
                        <span class="weui-badge procedure_sty">删除</span>
                    </div>
                </div>
                <p :slot="index" v-for="(value,index) in gx" :style="{ background:value.color }" class="pop_gx tran-y">
                    {{value.value}}
                </p>
            </list>
            <success_msg :content="content" ref="c1"></success_msg>
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
            date: '',
            content: ''
        }
    },
    components: {
        list,
        scroll,
        success_msg
    },
    methods: {
        del_gx(v, i) {
            console.log(i);
            var that = this;
            console.log(this.listData[i].id);

            console.log(this.listData);
            axios.delete('/projects/rest/ProcedureSet/' + that.listData[i].id)
                .then(res => {
                    this.listData.splice(i, 1);
                    this.content = "删除成功"
                    this.$refs.c1.showMsg();
                })
        }
    },
    mounted() {

        this.$store.commit('commonModules/getHeight', '.gx_time_project_gc_gxList');

        const par = this.$route.params,
            that = this,
            pId = par.num;
        this.$store.commit('moduleProsure/changeProsure', true);
        axios.get('/projects/rest/ProcedureSet/?engineering__project_id=' + pId.split('_')[0] + "&engineering_id=" + pId.split('_')[1])
            .then(res => {
                var results = res.data.results;
                if (results.length != 0) {
                    results.forEach(v => {
                        this.date = v.engeeringname;
                        that.gx.push({
                            value: that.gxType[v.gxtype],
                            color: v.gxtype == 1 ? "#327cda" : v.gxtype == 2 ? "purple" : "orange"
                        })
                        this.listData.push({
                            time: v.name, //内容
                            address: '/process_details/' + pId,
                            query: v.id + '_indexTime', //地址参数, 什么轴+工序id+项目id
                            id: v.id
                        })
                    });

                } else {
                    this.content = "无数据";
                    this.$refs.c1.showMsg();
                }

                this.flagLoad = false;
            })
            .catch(() => {
                this.content = "请求数据失败";
                this.$refs.c1.showMsg();
                this.flagLoad = false;
            })
    },
    beforeRouteLeave(to, from, next) {
        // alert(6);
        this.$store.commit('moduleProsure/changeProsure', false);
        next();
    }
}
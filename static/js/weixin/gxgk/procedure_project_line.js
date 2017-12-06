const procedure_project_line = {
    template: `
            <scroll class="procedure_project_line overhid" :data="listData">
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
                <success_msg :content=" content" ref="c1"></success_msg>
            </scroll>
    `,
    // <scroll class="procedure_project_line overhid" :data="listData">
    //         <list :listData="listData" :flagLoad="flagLoad" :date='date'>
    //             <p :slot="index" v-for="(value,index) in gx" :style="{ background:value.color }">
    //                 {{value.value}}
    //             </p>
    //         </list>
    //         <success_msg :content=" '无工序' " ref="c1"></success_msg>
    //     </scroll>
    //<i class="iconfont icon-star size19 icon_star"  :class="{ yellowColor:value.num }" @click.stop="add_collection(value,i)"></i>
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
            console.log(this.listData[i]);

            console.log(this.listData);
            axios.delete('/projects/rest/ProcedureSet/' + this.listData[i].id)
                .then(res => {
                    this.listData.splice(i, 1);
                    this.content = "删除成功"
                    this.$refs.c1.showMsg();
                })
        }
    },
    mounted() {
        this.$store.commit('moduleProsure/changeProsure', true);
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
                        console.log(v);
                        this.date = v.engeeringname;
                        that.gx.push({
                            value: that.gxType[v.gxtype],
                            color: v.gxtype == 1 ? "#327cda" : v.gxtype == 2 ? "purple" : "orange"
                        })
                        this.listData.push({
                            time: v.name, //内容
                            address: '/process_details/' + pId.split('_')[0] + '_' + par.id,
                            query: v.id + '_1', //地址参数, 什么轴+工序id+项目id
                            id: v.id
                        })
                        console.log(this.listData);
                    });
                    this.flagLoad = false;
                } else {
                    this.content = "无工序"
                    this.$refs.c1.showMsg();
                    this.flagLoad = false;
                }

            })
    }
}
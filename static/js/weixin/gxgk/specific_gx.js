const specific_gx = {
    template: `
        <scroll class="specific_gx overhid" :data="listData">
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
            <success_msg :content=" '无数据' " ref="c1"></success_msg>
        </scroll>
    `,
    data() {
        return {
            listData: [], //时间
            flagLoad: true,
            date: '',
            timeLine: {},
            gxType: {
                1: '重点',
                2: "关键",
                3: "难点"
            },
            gx: [],

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

        this.$store.commit('commonModules/getHeight', '.specific_gx');

        const paramsId = this.$route.params.num,
            that = this;
        this.date = this.$route.params.date;
        console.log(this.$route);
        axios.get('/projects/rest/ProcedureSet/?engineering__project_id=' + paramsId.split('_')[1])
            .then(res => {
                console.log(res);
                const result = res.data.results;
                if (result.length != 0) {
                    res.data.results.forEach(v => {
                        var dateArr = v.insert_dt.split('-');
                        var dateTitle = dateArr.slice(0, -1).join('-');
                        if (!that.timeLine[dateTitle]) {
                            that.timeLine[dateTitle] = [];
                        }
                        that.timeLine[dateTitle].push(v);
                    })
                    console.log(this.timeLine);

                    var arr = this.timeLine[this.date]; //时间列表
                    console.log(arr);
                    arr.forEach(v => {
                        console.log(that.gxType[v.gxtype]);
                        that.gx.push({
                            value: that.gxType[v.gxtype],
                            color: v.gxtype == 1 ? "#327cda" : v.gxtype == 2 ? "purple" : "orange"
                        })
                        this.listData.push({
                            time: v.name, //内容
                            address: '/process_details/' + paramsId,
                            query: v.id + '_' + this.date, //地址参数, 什么轴+工序id+项目id
                            id: v.id
                        })
                    })
                    this.flagLoad = false;
                } else {
                    this.$refs.c1.showMsg();
                    this.flagLoad = false;
                }

            })
    }
}
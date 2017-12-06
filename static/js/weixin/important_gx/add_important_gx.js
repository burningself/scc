const add_important_gx = {
    template: `
        <div class="unit_project add_important_gx">
            <div class="weui-header white" style="z-index:999"> 
                <div class="weui-header-left"  @click="index_back"> 
                    <a class="icon icon-109 f-white"></a>  
                </div>
                <h1 class="weui-header-title">重点工序</h1>
                <div class="weui-header-right" @click="addProject">
                        <i class="icon icon-jiahao f-white"></i>
                </div> 
            </div>
            <div class="project_online_content">
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
                <success_msg :content=" content " ref="c1"></success_msg>
            </div>
        </div>
    `,
    data() {
        return {
            listData: [],
            flagLoad: true,
            address: '',
            date: '',
            timeLine: {},
            gxType: {
                1: '特殊',
                2: '关键',
                3: '难点',
            },
            gx: [],
            proName: '',
            content: '',
        }
    },
    components: {
        list,
        scroll,
        success_msg
    },
    methods: {
        index_back() {
            this.$router.push({ path: '/index/project_in_methods/' + this.$route.params.num, query: { val: this.proName + '|' + this.$route.query.val.split('_')[1] } })
        },
        addProject() {
            this.$router.push({ path: '/add_gx/' + this.$route.params.num, query: { val: this.$route.query.val + '_1' } });
        },
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
        console.log(this.$route);
        this.$store.commit('commonModules/getHeight', '.add_important');

        const query = this.$route.query.val.split("_"),
            that = this,
            params = this.$route.params.num.split('_')[1];

        this.date = query[0];

        // var paramsId = this.$route.params.num.split('_');
        // console.log(this.$route);
        // this.address = '/index/a_project/' + this.$route.params.num;
        axios.get('/projects/rest/ProcedureSet/?engineering_id=' + query[1])
            .then(res => {
                if (res.data.results.length == 0) {
                    this.content = "没有工序"
                    this.$refs.c1.showMsg();
                    this.flagLoad = false;
                    return;
                }
                res.data.results.forEach(value => {
                    var dateArr = value.insert_dt.split('-');
                    var dateTitle = dateArr.slice(0, -1).join('-');
                    if (!that.timeLine[dateTitle]) {
                        that.timeLine[dateTitle] = [];
                    }

                    that.timeLine[dateTitle].push(value);
                })
                console.log(this.timeLine);
                var arr = this.timeLine[this.date]; //时间列表
                if (arr && arr.length != 0) {
                    arr.forEach(v => {
                        this.proName = v.engeeringname;
                        that.gx.push({
                            value: that.gxType[v.gxtype],
                            color: v.gxtype == 1 ? "#327cda" : v.gxtype == 2 ? "purple" : "orange"
                        })
                        console.log(v);
                        this.listData.push({
                            time: v.name, //内容
                            address: '/process_details/' + this.$route.params.num.split('_')[0] + '_' + query[1], //地址
                            query: v.id + '_0', //地址参数
                            id: v.id
                        })
                    })
                }
                this.flagLoad = false;
            })
    }
}
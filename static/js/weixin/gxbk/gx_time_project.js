const gx_time_project = {
    template: `
        <scroll class="gx_time_project overhid"  :data="listData">
            <list :listData="listData" :flagLoad="flagLoad" :date='date'>
                 <span :slot="index" v-for="(value,index) in projectNum" class="weui-badge" style="background:#04be02"> {{value}}</span>
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
            content: '',
            projectNum: [],
        }
    },
    components: {
        list,
        success_msg,
        scroll
    },
    mounted() {

        this.$store.commit('commonModules/getHeight', '.gx_time_project');

        const paramsId = this.$route.params.num,
            that = this;
        this.date = paramsId;
        axios.get('/projects/rest/project/?KGRQ__isnull!=True')
            .then(res => {
                var results = res.data.results;
                if (results.length != 0) {
                    results.forEach(value => {
                        console.log(value.KGRQ);
                        var dateTitle = value.KGRQ.slice(0, -3);
                        if (!that.timeLine[dateTitle]) {
                            that.timeLine[dateTitle] = [];
                        }

                        that.timeLine[dateTitle].push(value);
                    })
                    console.log(this.timeLine);
                    var arr = this.timeLine[this.date]; //时间列表
                    arr.forEach(v => {
                        that.projectNum.push(v.engineering_count);
                        this.listData.push({
                            PrjState: v.PrjState == 0 ? false : true,
                            time: v.PrjName, //内容
                            address: '/index/gxbk/gx_time_project_gc/' + v.id,
                            query: '时间轴' //地址参数
                        })

                    })
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
    }
}
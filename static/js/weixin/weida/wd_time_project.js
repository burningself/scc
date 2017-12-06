const wd_time_project = {
    template: `
        <scroll class="wd_time_project overhid"  :data="listData">
            <list :listData="listData" :flagLoad="flagLoad">
                 <span :slot="index" v-for="(value,index) in projectNum" class="weui-badge" style="background:#04be02"> {{value}}</span>
            </list>
            <success_msg :content="content" ref="c1"></success_msg>
        </scroll>
    `,
    data() {
        return {
            listData: [], //时间
            flagLoad: true,
            projectNum: [],
            timeLine: {},
            content: ''
        }
    },
    components: {
        list,
        scroll,
        success_msg
    },
    mounted() {

        this.$store.commit('commonModules/getHeight', '.wd_time_project');

        const par = this.$route,
            that = this,
            pId = par.params.num; //项目id
        this.date = pId;
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

                    var arr = this.timeLine[this.date]; //时间列表
                    arr.forEach(v => {
                        that.projectNum.push(v.engineering_count);
                        this.listData.push({
                            PrjState: v.PrjState == 0 ? false : true,
                            time: v.PrjName,
                            address: '/index/weida/wd_time_project_gc/' + v.id,
                            query: '时间轴',
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
    }
}
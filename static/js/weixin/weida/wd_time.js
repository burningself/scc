const wd_time = {
    template: `
         <scroll class="wd_time overhid"  :data="listData">
            <list :listData="listData" :flagLoad="flagLoad" :date='date'>
                <span :slot="index" v-for="(value,index) in projectNum" class="weui-badge" style="background:#04be02"> {{value}}</span>
            </list>
            <success_msg :content="content" ref="c1"></success_msg>
         </scroll>
    `,
    data() {
        return {
            listData: [], //时间
            flagLoad: true, //加载动画
            date: false, //时间标题
            timeLine: {}, // 数据处理
            projectNum: [],
            content: '',
        }
    },
    components: {
        list,
        success_msg,
        scroll
    },
    mounted() {

        this.$store.commit('commonModules/getHeight', '.wd_time');

        const paramsId = this.$route.params.num,
            that = this;
        axios.get('/projects/rest/project/?KGRQ__isnull!=True')
            .then(res => {
                var results = res.data.results;
                if (results.length != 0) {
                    results.forEach(value => {
                        var dateTitle = value.KGRQ.slice(0, -3);
                        if (!that.timeLine[dateTitle]) {
                            that.timeLine[dateTitle] = [];
                        }

                        that.timeLine[dateTitle].push(value);
                    })

                    var arr = Object.keys(this.timeLine); //时间列表

                    for (var attr in this.timeLine) {
                        that.projectNum.push(this.timeLine[attr].length);
                    }

                    arr.forEach(v => {
                        console.log(v);
                        this.listData.push({
                            time: v, //内容
                            address: '/index/weida/wd_time_project/' + v,
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
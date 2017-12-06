var gx_time = {
    template: `
        <scroll class="gx_time overhid"  :data="listData" style="height:100px">
                <list :listData="listData" :flagLoad="flagLoad" :date="date" >
                    <span :slot="index" v-for="(value,index) in projectNum" class="weui-badge" style="background:#04be02"> {{value}}</span>
                </list>
            <success_msg :content="content" ref="c1"></success_msg>
        </scroll>
    `,
    data() {
        return {
            listData: [], //数据
            flagLoad: true, //加载动画
            date: false, //是否有标题
            timeLine: {},
            projectNum: [],
            content: ''
        }
    },
    components: {
        list,
        success_msg,
        scroll
    },
    // props: ['listData'],
    mounted() {
        this.$store.commit('commonModules/getHeight', '.gx_time');

        var paramsId = this.$route.params.num;
        var that = this;
        axios.get('/projects/rest/project/?KGRQ__isnull!=True')
            .then(res => {
                var result = res.data.results;
                if (result.length != 0) {
                    result.forEach(value => {
                        var dateTitle = value.KGRQ.slice(0, -3);
                        if (!that.timeLine[dateTitle]) {
                            that.timeLine[dateTitle] = [];
                        }
                        that.timeLine[dateTitle].push(value);
                    })
                    var arr = [];
                    var count = [];

                    for (var attr in this.timeLine) {
                        arr.push(attr);
                        that.projectNum.push(this.timeLine[attr].length);
                    }
                    arr.forEach(v => {
                        console.log(v);
                        this.listData.push({
                            time: v, //内容
                            address: '/index/gxbk/gx_time_project/' + v,
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
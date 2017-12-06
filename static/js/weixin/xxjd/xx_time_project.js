const xx_time_project = {
    template: `
       <scroll class="xx_time_project overhid"  :data="listData">
  
                <list :listData="listData" :flagLoad="flagLoad" :date='date'>
                    <span :slot="index" v-for="(value,index) in projectNum" class="weui-badge" style="background:#04be02"> {{value}}</span>
                </list>
        
            <success_msg :content="'没有数据'" ref="c1"></success_msg>
        </scroll>
    `,
    data() {
        return {
            listData: [], //时间
            flagLoad: true,
            date: '',
            timeLine: {},
            projectNum: [],
        }
    },
    components: {
        list,
        success_msg,
        scroll
    },
    mounted() {

        this.$store.commit('commonModules/getHeight', '.xx_time_project');

        const paramsId = this.$route.params.num,
            that = this;
        this.date = paramsId;
        axios.get('/projects/rest/project/?KGRQ__isnull!=True')
            .then(res => {
                var result = res.data.results;
                if (result.length != 0) {
                    res.data.results.forEach(value => {
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
                        console.log(v);
                        this.listData.push({
                            PrjState: v.PrjState == 0 ? false : true,
                            time: v.PrjName, //内容
                            address: '/index/xxjd/xx_time_project_gc/' + v.id,
                            query: '时间轴' //地址参数
                        })
                    })

                } else {
                    this.$refs.c1.showMsg();
                }

                this.flagLoad = false;
            })
    }
}
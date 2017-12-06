const graphic_time = {
    template: `
        <scroll :data="listData" class="graphic_time overhid">    
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

        this.$store.commit('commonModules/getHeight', '.graphic_time');

        const paramsId = this.$route.params.num,

            that = this;
        console.log(this.$route);
        axios.get('/projects/rest/engineering/?project_id=' + paramsId.split('_')[1] + '&insert_dt__isnull!=True')
            .then(res => {
                console.log(res);
                if (res.data.results.length == 0) {
                    this.content = "没有工程";
                    this.$refs.c1.showMsg();
                    this.flagLoad = false;
                    return;
                }
                res.data.results.forEach(value => {
                    console.log(value.insert_dt);
                    var dateTitle = value.insert_dt.slice(0, -3);
                    if (!that.timeLine[dateTitle]) {
                        that.timeLine[dateTitle] = [];
                    }

                    that.timeLine[dateTitle].push(value);
                })
                console.log(this.timeLine);
                var arr = Object.keys(this.timeLine); //时间列表
                var count = [];
                for (var attr in this.timeLine) {
                    count.push(this.timeLine[attr].length);
                }
                count.forEach(val => {
                    that.projectNum.push(val)
                })
                arr.forEach(v => {
                    console.log(v);
                    this.listData.push({
                        time: v, //内容
                        address: '/index/graphic_index/' + paramsId + '/graphic_time_someone/' + v, //地址
                        query: this.$route.query.val //地址参数
                    })
                })
                this.flagLoad = false;
            })
    }
}
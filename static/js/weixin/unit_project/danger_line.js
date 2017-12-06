const danger_line = {
    template: `
        <scroll class="danger_line overhid" :data="listData">
            <list :listData="listData" :flagLoad="flagLoad" :date="date">
                 <span :slot="index" v-for="(value,index) in projectNum" class="weui-badge" style="background:#04be02"> {{value}}</span>
            </list>
            <success_msg :content=" '没有危大' " ref="c1"></success_msg>
        </scroll>
        
    `,
    // 

    data() {
        return {
            listData: [], //数据
            flagLoad: true, //加载动画
            date: false, //是否有标题
            timeLine: {}, // 数据处理
            projectNum: [],
        }
    },
    components: {
        list,
        scroll,
        success_msg
    },
    mounted() {

        this.$store.commit('commonModules/getHeight', '.danger_line');

        const paramsId = this.$route.params.num,
            that = this;
        console.log(this.$route.query.val.split('|')[1]);
        axios.get('/projects/rest/WXYSet/?engineering_id=' + this.$route.query.val.split('|')[1])
            .then(res => {
                console.log(res);
                if (res.data.results.length == 0) {
                    this.$refs.c1.showMsg();
                    this.flagLoad = false;
                    return;
                }
                res.data.results.forEach(val => {

                    console.log(val);
                    var dateArr = val.BZRQ.split('-');
                    var dateTitle = dateArr.slice(0, -1).join('-');
                    if (!that.timeLine[dateTitle]) {
                        that.timeLine[dateTitle] = [];
                    }
                    that.timeLine[dateTitle].push(val);
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
                    this.listData.push({
                        time: v, //内容
                        address: '/index/danger_project/' + paramsId + '/danger_project_list', //地址
                        query: this.$route.query.val + '_' + v

                    })
                })
                console.log(this.listData);
                this.flagLoad = false;
            })
    }
}
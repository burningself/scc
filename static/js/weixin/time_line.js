const time_line = {
    template: `
        <scroll :data="listData" class="time_line overhid">
                <list :listData="listData" :flagLoad="flagLoad" :date="date" >
                     <span :slot="index" v-for="(value,index) in projectNum" class="weui-badge" style="background:#04be02"> {{value}}</span>
                </list>
                <success_msg :content="'没有危大'" ref="c1"></success_msg>
        </scroll>
    `,
    data() {
        return {
            listData: [], //时间
            flagLoad: true, //加载动画
            date: false, //时间标题
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

        this.$store.commit('commonModules/getHeight', '.time_line');

        const paramsId = this.$route.params.num,
            that = this;
        console.log(paramsId.split('_')[1]);
        axios.get('/projects/rest/WXYSet/?engineering_id=&engineering__project__company_id=&engineering__project_id=' + paramsId.split('_')[1])
            .then(res => {
                const result = res.data.results;
                if (result.length != 0) {
                    result.forEach(v => {
                        var dateArr = v.BZRQ.split('-');
                        var dateTitle = dateArr.slice(0, -1).join('-');
                        if (!that.timeLine[dateTitle]) {
                            that.timeLine[dateTitle] = [];
                        }

                        that.timeLine[dateTitle].push(v);
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
                            address: '/index/danger_control/' + paramsId + '/date_project/' + v, //地址
                            query: this.$route.query.val //地址参数
                        })
                    })
                    console.log(this.listData);
                    this.flagLoad = false;
                } else {
                    this.$refs.c1.showMsg();
                    this.flagLoad = false;
                }

            })
    }
}
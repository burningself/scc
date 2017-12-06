const procedure_time_line = {
    template: `
        <scroll class="procedure_time_line overhid" :data="listData">
            <list :listData="listData" :flagLoad="flagLoad" :date='date'>
                <span :slot="index" v-for="(value,index) in projectNum" class="weui-badge" style="background:#04be02"> {{value}}</span>
            </list>
            <success_msg :content=" '无数据' " ref="c1"></success_msg>
        </scroll>
    `,
    data() {
        return {
            listData: [], //时间
            flagLoad: true, //加载动画
            date: false, //时间标题
            timeLine: {}, // 数据处理
            projectNum: []
        }
    },
    components: {
        list,
        success_msg,
        scroll
    },
    mounted() {

        this.$store.commit('commonModules/getHeight', '.procedure_time_line');

        const paramsId = this.$route.params.num,
            that = this;
        axios.get('/projects/rest/ProcedureSet/?engineering__project_id=' + paramsId.split('_')[1])
            .then(res => {
                const result = res.data.results;
                if (result.length != 0) {
                    res.data.results.forEach(v => {
                        console.log(v); //时间轴数据
                        var dateArr = v.insert_dt.split('-');
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


                    console.log(arr);
                    arr.forEach(v => {
                        this.listData.push({
                            time: v, //内容
                            address: '/index/managementand_and_control/' + paramsId + '/specific_gx/' + v, //地址
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

        setTimeout(function() {
            that.$store.commit('moduleProsure/changeProsure', false);
        }, 20)
    }
}
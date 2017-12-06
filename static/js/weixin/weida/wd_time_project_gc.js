const wd_time_project_gc = {
    template: `
            <scroll class="wd_time_project_gc overhid"  :data="listData">
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
            content: '',
            projectNum: []
        }
    },
    components: {
        list,
        scroll,
        success_msg
    },
    // props: ['listData'],
    mounted() {

        this.$store.commit('commonModules/getHeight', '.wd_time_project_gc');

        const paramsId = this.$route.params.num,
            that = this;
        axios.get('/projects/rest/engineering/?project_id=' + paramsId)
            .then(res => {
                var result = res.data.results;

                if (result.length != 0) {
                    result.forEach(value => {
                        console.log(value);
                        that.projectNum.push(value.wxy_count);
                        that.listData.push({
                            address: '/index/weida/wd_time_project_gc_sg/' + this.$route.params.num + '_' + value.id,
                            query: this.$route.query.val,
                            time: value.name
                        }); //工程轴数据

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
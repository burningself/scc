const gx_time_project_gc = {
    template: `
            <scroll class="gx_time_project_gc overhid"  :data="listData">
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
            projectNum: [],
        }
    },
    components: {
        list,
        success_msg,
        scroll
    },
    // props: ['listData'],
    mounted() {

        this.$store.commit('commonModules/getHeight', '.gx_time_project_gc');

        const paramsId = this.$route.params.num,
            that = this;
        axios.get('/projects/rest/engineering/?project_id=' + paramsId)
            .then(res => {
                console.log(res);
                var results = res.data.results;
                if (results.length != 0) {
                    results.forEach(value => {
                        that.projectNum.push(value.engineerprocedures.length);
                        that.listData.push({
                            address: '/index/gxbk/gx_time_project_gc_gxList/' + paramsId + '_' + value.id,
                            query: '时间轴',
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
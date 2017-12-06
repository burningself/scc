const wd_list_gc = {
    template: `
        <scroll class="wd_list_gc overhid"  :data="listData">
            <list :listData="listData" :flagLoad="flagLoad" :date='date'>
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
            projectNum: [],
            content: ''
        }
    },
    components: {
        list,
        success_msg,
        scroll
    },
    mounted() {
        // this.$store.commit('commonModules/changeTitle', '工程轴')
        this.$store.commit('commonModules/getHeight', '.wd_list_gc');

        const paramsId = this.$route.params.num.split('_'),
            that = this;

        axios.get('/projects/rest/engineering/?project_id=' + paramsId[1])
            .then(res => {
                var results = res.data.results;
                if (results.length != 0) {
                    results.forEach(value => {
                        that.projectNum.push(value.wxy_count);
                        that.listData.push({
                            address: '/index/weida/wd_gc_sg/' + this.$route.params.num + '_' + value.id,
                            query: this.$route.query.val,
                            time: value.name
                        }); //工程轴数据

                    })
                    console.log(this.listData);
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
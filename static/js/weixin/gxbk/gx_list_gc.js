const gx_list_gc = {
    template: `
            <scroll :data="listData" :pullup="pullup" @scrollToEnd="loadMore" class="gx_list_gc overhid">
                <list :listData="listData" :flagLoad="flagLoad" :date="date" >
                    <span :slot="index" v-for="(value,index) in projectNum" class="weui-badge" style="background:#04be02"> {{value}}</span>
                </list>
                <success_msg :content="'没有工程数据'" ref="c1"></success_msg>
            </scroll>
    `,
    data() {
        return {
            listData: [], //数据
            flagLoad: true, //加载动画
            date: false, //是否有标题
            projectNum: [],
            pullup: true,
        }
    },
    components: {
        list,
        scroll,
        success_msg

    },
    // props: ['listData'],
    methods: {
        loadMore() {
            const paramsId = this.$route.params.num.split('_');
            axios.get('/projects/rest/engineering/?project_id=' + paramsId[1])
                .then(res => {
                    const result = res.data.results;
                    if (result.length != 0) {
                        result.forEach(value => {
                            this.projectNum.push(value.engineerprocedures.length);
                            this.listData.push({
                                address: '/index/gxbk/gx_list_gc_gxList/' + paramsId[1] + '_' + value.id,
                                query: '单位轴',
                                time: value.name
                            }); //工程轴数据
                        })
                    } else {
                        this.$refs.c1.showMsg();
                    }
                    this.flagLoad = false;
                })
        }
    },
    mounted() {
        // this.$store.commit('commonModules/changeTitle', '工程轴');
        this.$store.commit('commonModules/getHeight', '.gxbk_danwei');
        this.$store.commit('moduleProsure/changeProsure', false); //去掉加号样式
        this.loadMore();


    }
}
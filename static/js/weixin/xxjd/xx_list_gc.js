const xx_list_gc = {
    template: `
            <scroll class="xx_list_gc overhid"  :data="listData">
                <list :listData="listData" :flagLoad="flagLoad" :date='date'>
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
        const paramsId = this.$route.params.num.split('_');
        this.$store.commit('commonModules/getHeight', '.xx_list_gc');
        console.log(paramsId);
        axios.get('/projects/rest/engineering/?project_id=' + paramsId[1])
            .then(res => {
                console.log(res);
                var result = res.data.results;
                if (result.length != 0) {
                    res.data.results.forEach(value => {
                        this.projectNum.push(value.shiji_schedule + '%');
                        this.listData.push({
                            address: '/graphic_progress/' + this.$route.params.num,
                            query: value.id + '_indexUnit',
                            time: value.name
                        }); //工程轴数据
                    })

                } else {
                    this.$refs.c1.showMsg();
                }

                console.log(this.listData);
                this.flagLoad = false;
            })
    }
}
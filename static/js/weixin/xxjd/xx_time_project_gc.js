const xx_time_project_gc = {
    template: `
        <scroll class="xx_time_project_gc overhid"  :data="listData">
            <list :listData="listData" :flagLoad="flagLoad" :date="date" >
                 <span :slot="index" v-for="(value,index) in projectNum" class="weui-badge" style="background:#04be02"> {{value}}</span>
            </list>
            <success_msg :content="'没有数据'" ref="c1"></success_msg>
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
        success_msg,
        scroll
    },
    // props: ['listData'],
    mounted() {
        this.$store.commit('commonModules/getHeight', '.xx_time_project_gc');
        const paramsId = this.$route.params.num;
        console.log(paramsId);
        axios.get('/projects/rest/engineering/?project_id=' + paramsId)
            .then(res => {
                console.log(res);
                var result = res.data.results;
                if (result.length != 0) {
                    res.data.results.forEach(value => {
                        this.projectNum.push(value.shiji_schedule + '%');
                        this.listData.push({
                            address: '/graphic_progress/' + this.$route.params.num,
                            query: value.id + '_indexTime',
                            time: value.name
                        }); //工程轴数据
                    })

                } else {
                    this.$refs.c1.showMsg();
                }


                this.flagLoad = false;
            })
    }
}
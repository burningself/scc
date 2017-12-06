const graphic_project = {
    template: `
         <scroll :data="listData" class="graphic_project overhid">
            <list :listData="listData" :flagLoad="flagLoad" :date="date" >
                <span :slot="index" v-for="(value,index) in projectNum" class="weui-badge" style="background:#04be02"> {{value}}</span>
            </list>
            <success_msg :content="'无数据'" ref="c1"></success_msg>
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

        this.$store.commit('commonModules/getHeight', '.graphic_project');

        const paramsId = this.$route.params.num;
        console.log(this.$route);
        axios.get('/projects/rest/engineering/?project_id=' + paramsId.split('_')[1] + '&id=')
            .then(res => {
                const result = res.data.results;
                if (result.length != 0) {
                    result.forEach(value => {
                        console.log(value);
                        this.projectNum.push(value.shiji_schedule + '%')
                        this.listData.push({
                            address: '/graphic_progress/' + paramsId,
                            query: value.id + '_1',
                            time: value.name
                        }); //工程轴数据
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
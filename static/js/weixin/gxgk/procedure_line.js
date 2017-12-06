const procedure_line = {
    template: `
            <scroll class="procedure_line overhid" :data="listData">
                <list :listData="listData" :flagLoad="flagLoad" :date="date" >
                    <span :slot="index" v-for="(value,index) in projectNum" class="weui-badge" style="background:#04be02"> {{value}}</span>
                </list>
                <success_msg :content=" '无数据' " ref="c1"></success_msg>
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

        this.$store.commit('commonModules/getHeight', '.procedure_line');
        const that = this;
        const paramsId = this.$route.params.num;
        axios.get('/projects/rest/engineering/?project_id=' + paramsId.split('_')[1] + '&id=')
            .then(res => {

                if (res.data.results.length == 0) {
                    this.$refs.c1.showMsg();
                    this.flagLoad = false;
                } else {
                    res.data.results.forEach(value => {
                        console.log(value);
                        this.projectNum.push(value.engineerprocedures.length);
                        this.listData.push({
                            address: '/index/managementand_and_control/' + paramsId + '/procedure_project_line/' + value.id,
                            query: this.$route.query.val,
                            time: value.name
                        }); //工程轴数据
                    })
                    console.log(this.listData);
                    this.flagLoad = false;
                }
            })
        setTimeout(function() {
            that.$store.commit('moduleProsure/changeProsure', false);
        }, 20)

    }
}
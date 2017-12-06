const project_line = {
    template: `
            <scroll :data="listData" class="project_line overhid">
                <list :listData="listData" :flagLoad="flagLoad" :date="date" >
                     <span :slot="index" v-for="(value,index) in projectNum" class="weui-badge" style="background:#04be02"> {{value}}</span>
                </list>
                <success_msg :content="'没有单位'" ref="c1"></success_msg>
            </scroll>
                
            
            
    `,


    data() {
        return {
            listData: [], //数据
            flagLoad: true, //加载动画
            date: false, //是否有标题
            projectNum: [],
        }
    },
    components: {
        list,
        scroll,
        success_msg
    },
    // props: ['listData'],
    mounted() {
        this.$store.commit('commonModules/getHeight', '.project_line');
        const paramsId = this.$route.params.num,
            that = this;
        console.log(paramsId);
        axios.get('/projects/rest/engineering/?project_id=' + paramsId.split('_')[1] + '&id=')
            .then(res => {
                var result = res.data.results;
                if (result.length != 0) {
                    res.data.results.forEach(value => {
                        that.projectNum.push(value.wxy_count);
                        that.listData.push({

                            address: '/index/danger_control/' + paramsId + '/engineering_shaft/' + value.id,
                            query: this.$route.query.val,
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
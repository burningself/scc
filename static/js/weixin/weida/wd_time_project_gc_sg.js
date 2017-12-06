const wd_time_project_gc_sg = {
    template: `
       <scroll class="wd_time_project_gc_sg overhid"  :data="listData">
            <list :listData="listData" :flagLoad="flagLoad" :date='date'></list>
            <success_msg :content="content" ref="c1"></success_msg>
        </scroll>
    `,
    data() {
        return {
            listData: [], //时间
            flagLoad: true,
            date: '',
            timeLine: {},
            content: ''
        }
    },
    components: {
        list,
        success_msg,
        scroll
    },
    mounted() {

        this.$store.commit('commonModules/getHeight', '.wd_time_project_gc_sg');

        const par = this.$route,
            that = this,
            pId = par.params.num;

        axios.get('/projects/rest/WXYSet/?engineering_id=' + pId.split('_')[1] + '&engineering__project_id=' + pId.split('_')[0])
            .then(res => {
                const results = res.data.results
                if (results.length == 0) {
                    this.content = "无数据";
                    this.$refs.c1.showMsg();
                    this.flagLoad = false;
                } else {
                    results.forEach(value => {
                        that.date = value.engeeringname;
                        $.ajax({
                            url: '/projects/getProjectSpStatus/',
                            data: {
                                'jsfa_id': value.FAID
                            },
                            type: 'post',
                            success: function(result) {
                                that.listData.push({
                                    time: value.FAMC,
                                    query: value.id + '_indexTime',
                                    address: '/danger_info/' + pId.split('_')[1],
                                    PrjState: result.spstatus.indexOf('结束') >= 0
                                })
                                that.flagLoad = false;
                            }
                        })



                    })
                }
            })
            .catch(() => {
                this.content = "请求数据失败";
                this.$refs.c1.showMsg();
                this.flagLoad = false;
            })
    }
}
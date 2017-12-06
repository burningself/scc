const engineering_shaft = {
    template: `
         <scroll :data="listData" class="engineering_shaft overhid">
            <list :listData="listData" :flagLoad="flagLoad" :date='date'></list>
            <success_msg :content="'没有危大'" ref="c1"></success_msg>
        </scroll>
       
    `,
    data() {
        return {
            listData: [], //时间
            flagLoad: true,
            date: '',
            timeLine: {},
        }
    },
    components: {
        list,
        success_msg,
        scroll
    },
    mounted() {
        const par = this.$route,
            that = this,
            pId = par.params.num;
        console.log(par);
        this.$store.commit('commonModules/getHeight', '.engineering_shaft');
        axios.get('/projects/rest/WXYSet/?engineering_id=' + par.params.id)
            .then(res => {
                console.log(res);
                if (res.data.results.length == 0) {
                    this.$refs.c1.showMsg();
                    this.flagLoad = false;
                } else {
                    res.data.results.forEach((value, index) => {
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
                                    query: value.id + '_1',
                                    address: '/danger_info/' + pId.split('_')[0] + '_' + that.$route.params.id,
                                    PrjState: result.spstatus.indexOf('结束') >= 0
                                })
                                that.flagLoad = false;
                            }
                        })


                    })


                }

            })
    }
}
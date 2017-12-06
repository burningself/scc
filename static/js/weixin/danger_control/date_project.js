const date_project = {
    template: `
       <scroll :data="listData" class="date_project overhid">
                <list :listData="listData" :flagLoad="flagLoad" :date="date" >
                </list>
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
        scroll,
        success_msg
    },
    mounted() {
        this.$store.commit('commonModules/getHeight', '.date_project');

        const par = this.$route,
            that = this,
            pId = par.params.num; //项目id
        this.date = par.params.id;
        console.log(pId);
        axios.get('/projects/rest/WXYSet/?engineering_id=&engineering__project__company_id=&engineering__project_id=' + pId.split('_')[1])
            .then(res => {
                console.log(res);
                const result = res.data.results;
                if (result.length != 0) {
                    res.data.results.forEach(v => {
                        var dateArr = v.BZRQ.split('-');
                        var dateTitle = dateArr.slice(0, -1).join('-');
                        if (!that.timeLine[dateTitle]) {
                            that.timeLine[dateTitle] = [];
                        }
                        that.timeLine[dateTitle].push(v);
                    })
                    console.log(this.timeLine);
                    var arr = this.timeLine[this.date]; //时间列表
                    arr.forEach(v => {
                        $.ajax({
                            url: '/projects/getProjectSpStatus/',
                            data: {
                                'jsfa_id': v.FAID
                            },
                            type: 'post',
                            success: function(result) {
                                that.listData.push({
                                    time: v.FAMC,
                                    address: '/danger_info/' + pId.split('_')[0],
                                    query: v.id + '_' + that.date, //头部参数
                                    PrjState: result.spstatus.indexOf('结束') >= 0
                                })
                                that.flagLoad = false;
                            }
                        })
                        console.log(v);

                    })

                } else {
                    this.$refs.c1.showMsg();
                    this.flagLoad = false;
                }

            })
    }
}
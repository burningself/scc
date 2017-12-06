const danger_project_list = {
    template: `
        <scroll class="danger_project_list overhid" :data="listData">
            <list :listData="listData" :flagLoad="flagLoad" :date="date"></list>
            <success_msg :content=" '没有危大' " ref="c1"></success_msg>
        </scroll>
    `,
    // 

    data() {
        return {
            listData: [], //数据
            flagLoad: true, //加载动画
            date: '', //是否有标题
            timeLine: {}
        }
    },
    components: {
        list,
        scroll,
        success_msg
    },
    mounted() {

        this.$store.commit('commonModules/getHeight', '.danger_project_list');

        const paramsId = this.$route.params.num,
            that = this,
            query = this.$route.query.val.split('|')[1];
        console.log(query);
        this.date = query.split('_')[1];
        axios.get('/projects/rest/WXYSet/?engineering_id=' + query.split('_')[0])
            .then(res => {
                if (res.data.results.length == 0) {
                    this.$refs.c1.showMsg();
                    this.flagLoad = false;
                    return;
                }
                res.data.results.forEach(val => {
                    var dateArr = val.BZRQ.split('-');
                    var dateTitle = dateArr.slice(0, -1).join('-');
                    if (!that.timeLine[dateTitle]) {
                        that.timeLine[dateTitle] = [];
                    }
                    that.timeLine[dateTitle].push(val);
                })
                this.timeLine[this.date].forEach(value => {
                    $.ajax({
                        url: '/projects/getProjectSpStatus/',
                        data: {
                            'jsfa_id': value.FAID
                        },
                        type: 'post',
                        success: function(result) {
                            that.listData.push({
                                time: value.FAMC, //内容
                                address: '/danger_info/' + paramsId.split('_')[0] + '_' + query.split('_')[0], //地址
                                query: value.id + '_0',
                                PrjState: result.spstatus.indexOf('结束') >= 0
                            })
                            that.flagLoad = false;
                        }
                    })

                })

            })
    }
}
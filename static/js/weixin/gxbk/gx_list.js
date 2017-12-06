const gx_list = {
    template: `
            <scroll :data="listData" :pullup="pullup" @scrollToEnd="loadMore" class="gx_list overhid" >
                <ul>
                    <list :listData ="listData" :flagLoad = "flagLoad" :date ='date' slot="content" >
                        <span :slot="index" v-for="(value,index) in projectNum" class="weui-badge" style="background:#04be02"> {{value}}</span>
                    </list>
                </ul>
                <success_msg :content="'没有单位数据'" ref="c1"></success_msg>
            </scroll>
    `,
    data() {
        return {
            flagLoad: true,
            date: '',
            listData: [],
            dataAll: [],
            projectNum: [],
            pullup: true,
            page: 1,
            next: true,
            flag: true,
        }
    },
    components: {
        list,
        scroll,
        success_msg
    },
    methods: {
        loadMore() {
            if (this.flag) {
                this.flag = false;

                if (this.next) {
                    const that = this,
                        route = this.$route.params.num;
                    axios.get('/projects/rest/project/?page=' + this.page + '&company_id=' + this.$route.params.num)
                        .then(res => {
                            const results = res.data.results;
                            this.next = res.data.next;
                            this.flag = true;
                            if (results.length != 0) {
                                results.forEach((value, index) => { //处理三级数据
                                    that.projectNum.push(value.engineering_count);
                                    that.listData.push({
                                        PrjState: value.PrjState == 1 ? true : false,
                                        address: '/index/gxbk/gx_list_gc/' + this.$route.params.num + '_' + value.id,
                                        time: value.PrjName,
                                        query: '单位轴',
                                    })
                                })
                            } else {
                                this.$refs.c1.showMsg();
                            }
                            this.flagLoad = false;
                            this.page++;
                        })
                }
            }
        }
    },
    mounted() {

        // this.$store.commit('commonModules/changeTitle', '项目轴')

        this.$store.commit('commonModules/getHeight', '.gx_list');
        this.loadMore();
    }
}
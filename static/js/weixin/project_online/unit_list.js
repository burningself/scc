const unit_list = {
    template: `
                <scroll :data="listData" :pullup="pullup" @scrollToEnd="loadMore" class="unit_list overhid" >
                    <ul>
                        <list :listData ="listData" :flagLoad = "flagLoad" :date ='date' slot="content" >
                            <span :slot="index" v-for="(value,index) in projectNum" class="weui-badge" style="background:#04be02"> {{value}}</span>
                        </list>
                    </ul>
                    <success_msg :content="'没有公司数据'" ref="c1"></success_msg>
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
                    const that = this;
                    axios.get('/projects/rest/company/?page=' + this.page)
                        .then(res => {
                            console.log(res);
                            this.next = res.data.next;
                            this.flag = true;
                            if (res.data.results.length != 0) {
                                res.data.results.forEach((value, index) => { //处理三级数据
                                    console.log(value);
                                    that.projectNum.push(value.project_count);
                                    that.listData.push({
                                        address: '/index/projectList/' + value.id + '/project_list',
                                        time: value.name,
                                        query: '项目列表',
                                    })

                                })
                            } else {
                                this.$refs.c1.showMsg();
                            }

                            this.page++;
                            that.flagLoad = false;
                        })
                }
            }
        }
    },
    mounted() {
        this.$store.commit('commonModules/getHeight', '.unit_list');
        this.loadMore();
    }
}
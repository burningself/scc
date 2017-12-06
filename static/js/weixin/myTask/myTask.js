const myTask = {
    template: `
        <div class="common">
            <navigation :title="title" :address="back_address"></navigation>
            <div class="project_online_content">
                <scroll class="overhid myTask" :data="listData">
                    <ul>
                        <list :listData ="listData" :flagLoad = "flagLoad"  slot="content" >
                            <span :slot="index" v-for="(value,index) in listData" class="weui-badge" style="background:red" @click.stop="del(value.id,index)">删除</span>
                        </list>
                    </ul>
                    <success_msg :content="content" ref="c1"></success_msg>
                </scroll>
            </div>
        </div>
    `,
    data() {
        return {
            title: '收藏项目列表',
            back_address: '/index/wxIndex',
            listData: [],
            flagLoad: true,
            page: 1,
            busy: false,
            projectNum: [],
            userName: '',
            content: '',
        }
    },
    components: {
        navigation,
        list,
        scroll,
        success_msg
    },
    methods: {
        loadMore() {
            axios.get('/user/rest/user/?username=' + this.userName)
                .then(res => {
                    const id = res.data[0].id;
                    return axios.get('/user/rest/userProject/?user_id=' + id);
                })
                .then(res => {
                    this.flagLoad = false;
                    console.log(res);
                    const count = res.data,
                        cLeng = count.length;
                    if (cLeng != 0) {
                        res.data.forEach(val => {
                            axios.get(val.project)
                                .then(data => {
                                    console.log(data);
                                    const result = data.data;
                                    this.listData.push({
                                        address: '/index/a_project/0_' + result.id,
                                        time: result.PrjName,
                                        query: '收藏项目',
                                        id: val.id
                                    })
                                })
                        })
                    } else {
                        this.content = "没有收藏项目";
                        this.$refs.c1.showMsg();
                    }
                })
                .catch(() => {
                    this.content = "请求失败";
                    this.$refs.c1.showMsg();
                })
        },
        del(idCount, index) {
            console.log(idCount);
            // if (this.id !== "") {
            this.$store.commit('commonModules/getCookie', 'csrftoken');
            axios.delete('/user/rest/userProject/' + idCount, {
                    'csrftoken': this.$store.state.commonModules.cs_cookie
                })
                .then(res => {
                    this.listData.splice(index, 1);
                    this.content = "删除成功";
                    this.$refs.c1.showMsg();
                })
                // } else {
                //     this.content = "请稍后"
                //     this.$refs.c1.showMsg();
                // }

        }
    },
    mounted() {
        this.userName = localStorage.getItem('login_name');
        $('.myTask').height($(window).height() - $('.weui-header').height() - $('.weui-tabbar').height());
        this.loadMore();
    }
}
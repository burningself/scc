const project_list = {
        template: `
            <scroll :data="listData" :pullup="pullup" @scrollToEnd="loadMore" class="overhid project_list unit_list">
                <ul>
                    <list :listData ="listData" :flagLoad = "flagLoad" :date ='date' slot="content" >
                        <div class="icon_fa" :slot="i+'star'" v-for="(value,i) in  listData">
                            <i class="iconfont icon-star size19 icon_star"  :class="{ yellowColor:value.num }" @click.stop="add_collection(value,i)"></i>
                        </div>
                        <span :slot="index" v-for="(value,index) in projectNum" class="weui-badge" style="background:#04be02;"> {{value}}</span>
                    </list>
                </ul>
                <success_msg :content="content" ref="c1"></success_msg>
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
                collection: [],
                results: '',
                id: '',
                content: ''
            }
        },
        //没收藏黄色，收藏了灰色
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
                                this.next = res.data.next;
                                console.log(res);
                                const results = res.data.results;
                                if (results.length != 0) {
                                    this.results = results;
                                    const userName = localStorage.getItem('login_name');
                                    return axios.get('/user/rest/user/?username=' + userName);
                                } else {
                                    this.content = "没有项目数据";
                                    this.$refs.c1.showMsg();
                                    this.flagLoad = false;
                                }

                            })
                            .then(data => {
                                console.log(data);
                                const id = data.data[0].id;
                                this.id = id;
                                return axios.get('/user/rest/userProject/?user_id=' + id)
                            })
                            .then(dat => {
                                let num;
                                this.results.forEach((value, index) => { //处理三级数据
                                    var scId; //收藏id
                                    dat.data.every(val => {
                                        console.log(val);
                                        const pro = val.project.split('/project/')[1],
                                            id = pro.slice(0, -1);
                                        if (value.id == id) {
                                            num = true;
                                            scId = val.id;
                                            return false;
                                        }
                                        num = false;
                                        return true;
                                    })

                                    that.projectNum.push(value.engineering_count);
                                    that.listData.push({
                                        PrjState: value.PrjState == 1 ? true : false,
                                        address: '/index/a_project/' + route + '_' + value.id,
                                        time: value.PrjName,
                                        query: '单位轴',
                                        num: num,
                                        id: value.id,
                                        scId: scId
                                    })
                                })
                                this.flag = true;
                                this.page++;
                                this.flagLoad = false;
                                console.log(dat);
                            })
                            .catch(() => {

                            })
                    }
                }
            },
            add_collection(value, index) {
                console.log(value);
                if (this.id !== "") {
                    this.$store.commit('commonModules/getCookie', 'csrftoken');
                    if (this.listData[index].num == true) {

                        this.listData[index].num = false;
                        console.log(value);
                        axios.delete('/user/rest/userProject/' + value.scId, {
                                'csrftoken': this.$store.state.commonModules.cs_cookie
                            })
                            .then(res => {

                                this.content = "取消收藏";
                                this.$refs.c1.showMsg();
                            })
                    } else {
                        axios.post('/user/rest/userProject/?user_id=' + this.id, {
                                'csrftoken': this.$store.state.commonModules.cs_cookie,
                                'project': '/projects/rest/project/' + value.id + '/',
                                'user': '/user/rest/user/' + this.id + '/'
                            })
                            .then(res => {
                                console.log(res);



                                this.content = "收藏成功";
                                this.$refs.c1.showMsg();
                                this.listData[index].num = true;
                                this.listData[index].scId = res.data.id;
                            })
                    }
                } else {
                    this.content = "正在加载数据"
                    this.$refs.c1.showMsg();
                }

            }
        },
        mounted() {
            $('.project_list').height($(window).height() - $('.weui-header').height() - $('.weui-tabbar').height());
            this.loadMore();
        }
    }
    // '/index/a_project/' + route + '_' + value.id
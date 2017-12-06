const xx_time = {
        template: `
        <scroll class="xx_time overhid"  :data="listData">
            <list :listData="listData" :flagLoad="flagLoad" :date="date" >
                <span :slot="index" v-for="(value,index) in projectNum" class="weui-badge" style="background:#04be02"> {{value}}</span>
            </list>
            <success_msg :content="content" ref="c1"></success_msg>
        </scroll>
    `,
        data() {
            return {
                listData: [], //数据
                flagLoad: true, //加载动画
                date: false, //是否有标题
                timeLine: {},
                projectNum: [],
                content: '',
            }
        },
        components: {
            list,
            scroll,
            success_msg
        },
        mounted() {

            this.$store.commit('commonModules/getHeight', '.xx_time');

            const paramsId = this.$route.params.num,
                that = this;
            axios.get('/projects/rest/project/?KGRQ__isnull!=True')
                .then(res => {
                    var results = res.data.results;
                    if (results.length != 0) {
                        res.data.results.forEach(value => {
                            var dateTitle = value.KGRQ.slice(0, -3);
                            if (!that.timeLine[dateTitle]) {
                                that.timeLine[dateTitle] = [];
                            }
                            that.timeLine[dateTitle].push(value);
                        })
                        const arr = Object.keys(this.timeLine); //时间列表

                        var count = [];
                        for (var attr in this.timeLine) {
                            that.projectNum.push(this.timeLine[attr].length);
                        }

                        arr.forEach(v => {
                            console.log(v);
                            this.listData.push({

                                time: v, //内容
                                address: '/index/xxjd/xx_time_project/' + v,
                                query: '时间轴' //地址参数
                            })
                        })

                    } else {
                        this.content = "无数据";
                        this.$refs.c1.showMsg();
                    }
                    this.flagLoad = false;
                })
                .catch(() => {
                    this.content = "请求数据失败";
                    this.$refs.c1.showMsg();
                    this.flagLoad = false;
                })
        }
    }
    // '/index/xxjd/xx_time_project/' + v
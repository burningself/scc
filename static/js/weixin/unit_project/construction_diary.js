const construction_diary = {
    template: `
        <div class="construction_diary unit_project" >
            <div class="weui-header white"> 
                <div class="weui-header-left"  @click="index_back"> 
                    <i class="icon icon-109 f-white"></i>  
                </div>
                <h1 class="weui-header-title">施工日记</h1>
                <div class="weui-header-right" @click="addProject(true)">
                        <i class="icon icon-jiahao f-white"></i>
                </div> 
            </div>
            <div class="date_diary wrapper" id="date_diary">
         
                    <div class="date_diary_title" id="date_diary_title">
                        <p v-for="(value,index) in dataList" :class="{f_white:value==date } " @click="changeFontColor(value,index)">{{ value }}</p>
                    </div>
             
            </div>

            <scroll class="date_diary_content"  :data="dataFlag" v-if="flag" :scrollX="'true'">
                <diary :val="val" @resetData="resetData" @msg="msg"></diary>
            </scroll>
            <div class="weui-loadmore" v-if="flagLoad">
                <i class="weui-loading"></i>
                <span class="weui-loadmore__tips">正在加载</span>
            </div>
            <success_msg :content="content" ref="c1"></success_msg>
        </div>
    `,
    data() {
        return {
            dataList: [],
            val: '', //传到子组件的ajax请求值
            date: '',
            diary_data: [],
            dataFlag: true,
            content: '',
            flagLoad: true,
            flag: false,
            fla: false,
        }
    },
    methods: {
        msg(value) {
            this.content = value;
            this.$refs.c1.showMsg();
        },
        index_back() {
            if (this.flag) {
                if (this.$route.params.num == 0) {
                    this.$router.push({ path: '/index/myTask' })
                } else {
                    this.$router.push({ path: '/index/project_in_methods/' + this.$route.params.num, query: { val: this.$route.query.val } })
                }
            }
        },
        addProject(pro) {
            if (this.fla) {
                this.fla = false;
                // this.dataList.push('');
                localStorage.setItem('data_list', JSON.stringify(this.dataList));
                // const newDate = new Date();
                // let mon = newDate.getMonth() + 1,
                //     date = newDate.getDate(),
                //     curr_time;
                // if (mon < 10) {
                //     mon = '0' + mon;
                // }
                // if (date < 10) {
                //     date = '0' + date;
                // }
                // curr_time = newDate.getFullYear() + '-' + mon + '-' + date; //获取本地时间
                // console.log(curr_time);
                // axios.post('/projects/rest/Records/', {
                //         "template": "12",
                //         "weather": "",
                //         "qualitys": "",
                //         "safetys": "",
                //         "fieldcapacitys": "",
                //         "mortars": "",
                //         "checkworks": "",
                //         "materialinfos": "",
                //         "overtimes": "",
                //         "others": "",
                //         "curr_time": curr_time,
                //         "engineering": "/projects/rest/engineering/" + this.$route.query.val.split('|')[1] + '/'
                //     })
                //     .then(res => {
                var result = pro ? 1 : 0;
                this.flagLoad = false;
                this.$router.push({ path: '/add_diary/' + this.$route.params.num, query: { val: this.$route.query.val + '_' + result } }); //+ '_' + res.data.id 
                // })
            }


        },
        changeFontColor(value, index) {
            this.date = value;
            this.val = this.diary_data[index];
            // console.log(this.diary_data[index]);

        },
        resetData() {
            this.dataFlag = !this.dataFlag;
        },
    },
    components: {
        diary,
        scroll,
        success_msg
    },
    mounted() {
        var myScroll



        const that = this;
        axios.get('/projects/rest/Records/?engineering_id=' + this.$route.query.val.split('|')[1])
            .then(res => {
                const result = res.data.results;
                if (result.length == 0) {
                    this.fla = true;
                    this.addProject(false);
                    return false;
                } else {
                    this.diary_data = result; //存储请求值
                    this.flagLoad = false;
                    this.flag = true;
                    this.fla = true;
                    result.forEach(value => {
                        that.dataList.push(value.curr_time);
                    })
                    this.$nextTick(function() {
                        $('.date_diary_title').width(($('.date_diary_title p').width() + 12) * result.length);
                        setTimeout(function() {
                            console.log(that.$IScroll);
                            myScroll = new that.$IScroll('#date_diary', { scrollX: true, scrollY: false, click: true });
                        }, 100)




                        this.val = result[0];
                        console.log(result[0]);
                        this.resetData();
                        this.date = result[0].curr_time || ''; //第一个日期
                        console.log(this.val);

                        localStorage.setItem('data_list', JSON.stringify(this.dataList));
                    })

                }
            })


    },
}
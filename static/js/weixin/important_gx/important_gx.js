const important_gx = {
    template: `
        <div class="unit_project" style="height:100%">
            <div class="weui-header white" style="z-index:999"> 
                <div class="weui-header-left"  @click="index_back"> 
                    <a class="icon icon-109 f-white"></a>  
                </div>
                <h1 class="weui-header-title">重点工序</h1>
                <div class="weui-header-right" @click="addProject">
                        <i class="icon icon-jiahao f-white"></i>
                </div> 
            </div>
            <div class="project_online_content">
                <scroll class="danger_line overhid" :data="listData">
                    <list :listData="listData" :flagLoad="flagLoad" :date="date">
                        <span :slot="index" v-for="(value,index) in projectNum" class="weui-badge" style="background:#04be02"> {{value}}</span>
                    </list>
                </scroll>
                <success_msg :content=" '没有工序' " ref="c1"></success_msg>
            </div>   
        </div>
    `,
    data() {
        return {
            listData: [],
            flagLoad: true,
            address: '',
            date: '',
            title: '重点工序',
            timeLine: {},
            projectNum: []
        }
    },
    components: {
        list,
        scroll,
        navigation,
        success_msg
    },
    methods: {
        index_back() {
            console.log(this.$route.params.num);
            this.$router.push({ path: '/index/project_in_methods/' + this.$route.params.num + '?val=' + this.$route.query.val });
        },
        addProject() {
            this.$router.push({ path: '/add_gx/' + this.$route.params.num, query: { val: this.$route.query.val + '_2' } });
        }
        ///add_gx/65_226?val=2017-08_142_1
    },
    mounted() {

        this.$store.commit('commonModules/getHeight', '.danger_line');

        const query = this.$route.query.val.split('|')[1],
            that = this;
        this.address = '/index/project_in_methods/' + this.$route.params.num + '?val=' + this.$route.query.val;
        axios.get('/projects/rest/ProcedureSet/?engineering_id=' + query)
            .then(res => {
                if (res.data.results.length == 0) {
                    this.$refs.c1.showMsg();
                    this.flagLoad = false;
                    return;
                }
                res.data.results.forEach(value => {
                    var dateArr = value.insert_dt.split('-');
                    var dateTitle = dateArr.slice(0, -1).join('-');
                    if (!that.timeLine[dateTitle]) {
                        that.timeLine[dateTitle] = [];
                    }

                    that.timeLine[dateTitle].push(value);
                })
                var arr = Object.keys(this.timeLine); //时间列表

                console.log(this.timeLine);
                // this.timeLine.forEach(val => {
                //         console.log(val);
                //     })
                let count = [];
                for (var attr in this.timeLine) {
                    count.push(this.timeLine[attr].length);
                }
                count.forEach(value => {
                    that.projectNum.push(value);
                })
                arr.forEach(v => {
                    this.listData.push({
                        time: v, //内容
                        address: '/index/add_important_gx/' + this.$route.params.num, //地址
                        query: v + '_' + query //地址参数
                    })
                })
                this.flagLoad = false;
            })
    }
}
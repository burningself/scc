const unit_project = {
    template: `
        <div class="unit_project">
            <div class="weui-header white"> 
                <div class="weui-header-left"  @click="index_back"> 
                    <a class="icon icon-109 f-white"></a>  
                </div>
                <h1 class="weui-header-title">单位工程</h1>
                <div class="weui-header-right" @click="addProject">
                    <i class="icon icon-jiahao f-white"></i>
                </div> 
            </div>
            <scroll :data="listData" class="unit_project_con overhid">
                <list :listData="listData" :flagLoad="flagLoad" :date="date" >
                     <span :slot="index" v-for="(value,index) in projectNum" class="weui-badge" style="background:#04be02"> {{value}}</span>
                </list>
            </scroll>
            
            <success_msg :content="'没有单位数据'" ref="c1"></success_msg>
        </div>
    `,
    data() {
        return {
            listData: [],
            flagLoad: true,
            address: '',
            date: '',
            projectNum: [],
        }
    },
    components: {
        list,
        success_msg,
        scroll
    },
    methods: {
        index_back() {
            console.log(this.$route.params.num);
            this.$router.push({ path: '/index/a_project/' + this.$route.params.num, query: { val: this.$route.query.val } })
        },
        addProject() {
            this.$router.push({ path: '/addProject/' + this.$route.params.num, query: { val: this.$route.query.val } });
        },
        add_collection() {
            console.log(5);
            this.$router.beforeEach((to, from, next) => {
                next(false);
            })
            console.log(6);
        }
    },
    mounted() {
        this.$store.commit('commonModules/getHeight', '.unit_project_con');
        var paramsId = this.$route.params.num.split('_');
        console.log(this.$route);
        this.address = '/index/a_project/' + this.$route.params.num;
        axios.get('/projects/rest/engineering/?project_id=' + paramsId[1]) //?project_id=' + paramsId[1] + '&id='
            .then(res => {
                console.log(res);
                const results = res.data.results;
                if (results.length != 0) {
                    res.data.results.forEach(value => {
                        this.projectNum.push(value.shiji_schedule + '%')
                        this.listData.push({
                            time: value.name,
                            query: value.name + '|' + value.id,
                            address: '/index/project_in_methods/' + this.$route.params.num,
                        });
                    })
                } else {
                    this.$refs.c1.showMsg();
                }

                this.flagLoad = false;
            })

    }
}
const changeTab = {
    template: `
            <div class="weui-header white"> 
                <div class="weui-header-left"> <a class="icon icon-109 f-white" @click="index_back"></a>  </div>
                <div class="online_navbar">
                    <router-link class="online__item" v-for="value in infoData" :class="{ 'online_navbar_on':value.title==changeValue}" @click.native="changeData(value.title)" tag="div" :to="{name:value.link,query:{val:value.title}}">
                       {{value.title}}
                    </router-link>
                </div>
                <div @click="add" style="height:46px;width:46px;position:absolute;right:0;margin-top:-2px;">
                    <i class="iconfont icon-jiahao tran-y" style="right:10px;" v-if="addProsure"></i>
                </div>
            </div>  
    `,
    //  
    data() {
        return {
            changeTable: true,
            changeValue: '',
            id: '', //公司id
        }
    },
    computed: {
        addProsure() {
            return this.$store.state.moduleProsure.addProsure;
        }
    },
    props: ['infoData', 'backAddress'],
    methods: {
        changeData(value) {
            if (this.$route.name == "gxbk_danwei" || this.$route.name == "gx_time") {
                this.$store.commit('moduleProsure/changeProsure', false);
            }
            this.changeValue = value;
            localStorage.setItem('title', value);
            if (value === this.infoData[1]) {
                this.changeTable = false;
            } else {
                this.changeTable = true;
            }
        },
        index_back() {
            if (this.$route.name == "gx_list_gc_gxList") {
                this.$store.commit('moduleProsure/changeProsure', false);
            }
            this.$router.push({ path: this.backAddress });
        },
        change() {
            this.changeValue = this.$route.query.val;
        },
        //跳转到添加工序页面
        add() {
            const num = this.$route.params.num.split('_');
            let par = this.$route.query.val == '单位轴' ? 0 : 1; //0则是返回单位轴,1则是返回时间轴
            if (this.$route.query.val == '单位轴') {
                par = 0;
            } else if (this.$route.query.val == '工程轴') {
                par = this.$route.params.id;
            } else {
                par = 1;
            }
            this.$router.push({ path: '/add_gx/' + num[0], query: { val: par + '_' + num[1] } });
        }
    },
    watch: {
        '$route': 'change'
    },
    mounted() {
        console.log(this.$route);
        this.changeValue = this.$route.query.val;
    },

}
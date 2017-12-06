const gxbk = {
    template: `
        <div class="common">
            <change-tab :infoData="infoData" :backAddress="backAddress"></change-tab>
            <div class="project_online_content">
                <router-view></router-view>
            </div>
        </div>
    `,
    data() {
        return {
            dataAll: {},
            flagLoad: true, //加载动画
            cityProject: {}, //对应的城市对应的项目
            date: '',
            listData: [],
            backAddress: '/index/wxIndex',
        }
    },
    computed: {
        infoData() {
            return this.$store.state.commonModules.infoData;
        }
    },
    components: {
        changeTab
    },
    mounted() {
        // alert();
        // this.$store.commit('commonModules/changeTitle', this.$route.query.val);
    }
}
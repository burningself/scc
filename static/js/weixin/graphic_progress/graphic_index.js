const graphic_index = {
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
            infoData: [{
                title: '工程轴',
                link: 'graphic_project'
            }, {
                title: '时间轴',
                link: 'graphic_time',
            }],
            listData: [],
            backAddress: ''
        }
    },
    components: {
        list,
        changeTab
    },
    mounted() {
        this.backAddress = "/index/a_project/" + this.$route.params.num;
    }
}
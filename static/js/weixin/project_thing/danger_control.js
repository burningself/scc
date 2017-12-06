const danger_control = {
    template: `
        <div class="danger_control">
            <change-tab :infoData="infoData" :backAddress="backAddress"> 
            </change-tab>
            <router-view></router-view>
        </div>
    `,
    data() {
        return {
            infoData: [{
                title: '工程轴',
                link: 'project_line'
            }, {
                title: '时间轴',
                link: 'time_line'
            }],
            backAddress: ''
        }
    },
    components: {
        changeTab,
    },
    mounted() {
        const paramsId = this.$route.params.num;

        this.backAddress = "/index/a_project/" + paramsId + "?val=";
    }
}
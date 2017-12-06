const managementand_and_control = {
    template: `
        <div class="danger_control managementand_and_control common">
            <change-tab :infoData="infoData" :backAddress="backAddress"> 
            </change-tab>
            <div class="project_online_content">
                <router-view></router-view>
            </div>
        </div>
    `,
    data() {
        return {
            infoData: [{
                title: '工程轴',
                link: 'procedure_line'
            }, {
                title: '时间轴',
                link: 'procedure_time_line'
            }],
            backAddress: ''
        }
    },
    components: {
        changeTab,
    },
    mounted() {
        // this.$store.commit('moduleProsure/changeProsure', true);
        const paramsId = this.$route.params.num;

        this.backAddress = "/index/a_project/" + paramsId + "?val=";
    },
    beforeRouteLeave(to, from, next) {
        this.$store.commit('moduleProsure/changeProsure', false);
        next();
    }
}
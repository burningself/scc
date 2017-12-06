const xxjd = {
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
                title: '单位轴',
                link: 'xx_danwei'
            }, {
                title: '时间轴',
                link: 'xx_time',
            }],
            dataAll: {},
            flagLoad: true, //加载动画
            cityProject: {}, //对应的城市对应的项目
            date: '',
            listData: [],
            backAddress: '/index/wxIndex'

        }
    },
    components: {
        changeTab
    },
    mounted() {

    }
}
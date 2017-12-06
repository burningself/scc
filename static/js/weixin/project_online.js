const project_online = {
    template: `
        <div class="common">
            <change-tab :infoData="infoData" :backAddress="backAddress"></change-tab>
            <div>
                <router-view></router-view>
            </div>
        </div>
    `,
    data() {
        return {
            infoData: [{
                title: '单位列表',
                link: 'unit_list'
            }, {
                title: '地图列表',
                link: 'map_list',
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
        list,
        changeTab
    },
    mounted() {

    }
}
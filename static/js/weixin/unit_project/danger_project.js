const danger_project = {
    template: `
        <div class="danger_project">
            <navigation :title="title" :address="address"></navigation>
            <router-view></router-view>
        </div>
    `,
    // <list :listData="listData" :flagLoad="flagLoad" :date="date"></list>
    data() {
        return {
            title: '危大工程',
            address: '',
            value: '111'
        }
    },
    components: {
        navigation,
    },
    methods: {

    },
    mounted() {
        var route = this.$route;
        console.log(route);
        var routeArr = route.query.val.split('|');
        console.log(routeArr);
        this.address = "/index/project_in_methods/" + route.params.num + "?val=" + routeArr[0] + '|' + routeArr[1].split('_')[0];
    }
}
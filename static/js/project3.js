var project3 = {
    template: `
            <div class="diary">
                <div class="diary-title">
                    <span>{{PrjName}}</span>
                </div>
                 <Menu mode="horizontal" :theme="theme1"   @on-select="route">
                    <MenuItem :name="value.id" :key="value.id" v-for="value in diaryInfo">
                        <Icon type="ios-paper"></Icon>
                        {{ value.title }}
                    </MenuItem>
                </Menu>
                <router-view></router-view>
            </div>
    `,
    data() {
        return {
            theme1: 'light',
            diaryInfo: [{
                'title': '工程概况',
                'img': '../img/工程概况.png',
                'link': '/project3/diary_general',
                'id': '0'
            }, {
                'title': '单位工程',
                'img': '../img/单位工程.png',
                'link': '/project3/unit_project/unit_project_index',
                'id': '1'
            }, {
                'title': '危大管控',
                'img': '../img/危大管控.png',
                'link': '/project3/management_and_control',
                'id': '2'
            }, {
                'title': '工序管控',
                'img': '../img/工序管控.png',
                'link': '/project3/key_process',
                'id': '3'
            }, {
                'title': '四令管控',
                'img': '../img/四令管控.png',
                'link': '/project3/order_management',
                'id': '4'
            }],
            PrjName: ''
        }
    },
    methods: {
        route(name) {
            localStorage.setItem('index', name);
            this.$router.push({ path: this.diaryInfo[name].link });
            console.log(name);
            $('.diary .ivu-menu li').eq(name).addClass('ivu-menu-item-active ivu-menu-item-selected').siblings().removeClass('ivu-menu-item-active ivu-menu-item-selected')
        }
    },
    mounted() {
        console.log(this.$route.params);
        const index = localStorage.getItem('index') || 0;
        console.log($('.diary .ivu-menu li').eq(index).addClass('ivu-menu-item-active').siblings());

        const prj = localStorage.getItem('prj') ? localStorage.getItem('prj').split('-')[0] : undefined || this.$route.params.name;
        const param = localStorage.getItem('prj') ? localStorage.getItem('prj').split('-')[1] : undefined || this.$route.params.num;
        localStorage.setItem('prj', prj + '-' + param);



        this.PrjName = prj;
    },
    destroyed() {
        localStorage.setItem('index', 0);
    }
}
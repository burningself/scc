const four_order = {
    template: `
        <div class="four_order ">
            <navigation :title="title" :address="address"></navigation>
            <div class="weui_grids">
                <router-link :to="value.href" class="weui_grid js_grid" v-for="value in dataList">
                    <div class="weui_grid_icon">
                        <img :src="value.img" alt="">
                    </div>
                    <p class="weui_grid_label size16">
                        {{ value.title }}
                    </p>
                </router-link>
            </div>
        </div>   
    `,
    data() {
        return {
            dataList: [{
                img: '/img/chenzhuangling_icon.png',
                title: '沉桩令',
                href: '/index/order_content'
            }, {
                img: '/img/watuling_icon.png',
                title: '挖土令',
                href: '/index/order_content'
            }, {
                img: '/img/jiaoguanling_icon.png',
                title: '浇灌令',
                href: '/index/order_content'
            }, {
                img: '/img/diaozhuangling_icon.png',
                title: '吊装令',
                href: '/index/order_content'
            }],
            projectId: '',
            title: '四令管理',
            address: '',
        }
    },
    components: {
        navigation
    },
    mounted() {
        this.address = '/index/a_project/' + this.$route.params.num
        const query = this.$route.query.val;
        if (query) {
            this.address = "/index/a_project/" + query
        } else {
            this.address = "/index/wxIndex";
        }

        console.log(this.$route);
        const que = query ? query : 0;
        this.dataList.forEach(value => {
            value.href += '/' + que;
        })
    }
}
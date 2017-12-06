const wxIndex = {
    template: `
        <div id="tab1" class="weui_tab_bd_item weui_tab_bd_item_active">
        <img src="/img/index.jpg " alt="">
        <div class="weui-grids">
            <router-link v-for="value in listData" :to="{name:value.link,query:{val:value.query}}" class="weui-grid" >
                <div class="weui-grid__icon">
                    <img :src="value.img" alt="">
                </div>
                <p class="weui-grid__label size15">{{value.content}}</p>
            </router-link>
        </div>
    </div>
    `,
    data() {
        return {
            listData: [{
                    img: '/img/logo_prjonline.png',
                    content: '项目在线',
                    link: 'unit_list',
                    query: '单位列表'
                },
                {
                    img: '/img/logo_danger.png',
                    content: '危大警示',
                    link: 'danwei',
                    query: '单位轴'
                },
                {
                    img: '/img/logo_schedule.png',
                    content: '形象进度',
                    link: 'xx_danwei',
                    query: '单位轴'
                },
                {
                    img: '/img/logo_procontrol.png',
                    content: '工序把控',
                    link: 'gxbk_danwei',
                    query: '单位轴'
                },
                {
                    img: '/img/logo_sign.png',
                    content: '四令签发',
                    link: 'four_order',
                    query: '',
                },
            ]
        }
    },
    mounted() {
        this.$emit('first');
    }
}
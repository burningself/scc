var unit_project_main = {
    template: `
                    
                    <div class="pro-map">
                        <div class="diary_unit_info diary_li">
                            <ul class="diary-info clearfix">
                                <li v-for="value in unit_info">
                                    <router-link :to="value.link">
                                        <div class="changImg center-xy">
                                            <img :src="value.img">
                                            <p class="sL">{{value.title}}</p>
                                        </div>
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
    `,
    data() {
        return {
            unit_info: [{
                'title': '基本内容',
                'img': '../img/基本内容.png',
                'link': '/unit_project/basic_content',
            }, {
                'title': '形象进度',
                'img': '../img/形象进度.png',
                'link': '/unit_project/graphic_progress',
            }, {
                'title': '危大工程',
                'img': '../img/危大工程.png',
                'link': '/management_and_control',
            }, {
                'title': '重点工序',
                'img': '../img/重点工序.png',
                'link': '/unit_project/key_process',
            }, {
                'title': '四令管理',
                'img': '../img/四令管理.png',
                'link': '/unit_project/order_management',
            }, {
                'title': '检验检测',
                'img': '../img/检验检测.png',
                'link': '/unit_project/inspection_and_inspection',
            }, {
                'title': '同条件养护',
                'img': '../img/同条件养护.png',
                'link': 'javascript:void(0)',
            }, {
                'title': '标准养护',
                'img': '../img/标准养护.png',
                'link': 'javascript:void(0)',
            }, {
                'title': '检查整改',
                'img': '../img/检查整改.png',
                'link': 'javascript:void(0)',
            }, {
                'title': '技术核定',
                'img': '../img/技术核定.png',
                'link': 'javascript:void(0)',
            }, {
                'title': '',
                'img': '',
                'link': 'javascript:void(0)',
            }, {
                'title': '',
                'img': '',
                'link': 'javascript:void(0)',
            }, {
                'title': '',
                'img': '',
                'link': 'javascript:void(0)',
            }, {
                'title': '',
                'img': '',
                'link': 'javascript:void(0)',
            }, {
                'title': '',
                'img': '',
                'link': 'javascript:void(0)',
            }, {
                'title': '',
                'img': '',
                'link': 'javascript:void(0)',
            }, {
                'title': '',
                'img': '',
                'link': 'javascript:void(0)',
            }, {
                'title': '',
                'img': '',
                'link': 'javascript:void(0)',
            }, {
                'title': '',
                'img': '',
                'link': 'javascript:void(0)',
            }, {
                'title': '',
                'img': '',
                'link': 'javascript:void(0)',
            }, {
                'title': '',
                'img': '',
                'link': 'javascript:void(0)',
            }, ],
        }
    }
}
var inspection_and_inspection = {
    template: `
                    <div class="diary_unit_info diary_li">
                        <ul class="diary-info clearfix">
                            <li v-for="value in inspection_info">
                            <router-link :to="value.link">
                                <div class="changImg center-xy">
                                    <img :src="value.img">
                                    <p class="sL">{{value.title}}</p>
                                </div>
                            </router-link>
                            </li>
                        </ul>
                    </div>
    `,
    data() {
        return {
            inspection_info: [{
                'title': '隐蔽验收',
                'img': '../img/隐蔽验收.png',
                'link': 'javascript:void(0)',
            }, {
                'title': '分项验收',
                'img': '../img/分项验收.png',
                'link': 'javascript:void(0)',
            }, {
                'title': '分部验收',
                'img': '../img/分部验收.png',
                'link': 'javascript:void(0)',
            }, {
                'title': '单位工程验收',
                'img': '../img/单位工程验收.png',
                'link': 'javascript:void(0)',
            }, {
                'title': '原材料取样',
                'img': '../img/原材料取样.png',
                'link': 'javascript:void(0)',
            }, {
                'title': '现场试验',
                'img': '../img/现场试验.png',
                'link': 'javascript:void(0)',
            }]
        }
    }
}
var diary_general = {
    template: `
        <div class="projectName">
            <div class="diary_general_left fr">
                <div class="pic-file">
                    <Carousel
                        v-model="value3"
                        :autoplay="setting.autoplay"
                        :autoplay-speed="setting.autoplaySpeed"
                        :dots="setting.dots"
                        :trigger="setting.trigger"
                        :arrow="setting.arrow" 
                        >
                        <CarouselItem>
                            <div class="demo-carousel">
                                <img src="../../img/u=2271931502,4281312115&fm=200&gp=0.jpg">
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div class="demo-carousel">
                                <img src="../../img/u=3542322648,1435922467&fm=27&gp=0.jpg">
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div class="demo-carousel">
                                <img src="../../img/asdfas.jpg">
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div class="demo-carousel">
                                <img src="../../img/u=1521685853,619148146&fm=27&gp=0.jpg">
                            </div>
                        </CarouselItem>
                    </Carousel>
                </div>
                <div class="build-info">
                    <div class="build-info-building">
                        <div class="build-title">
                            <div class="center-y">
                                <img src="../img/webwxget.jpg">
                                <span class="center-y">建筑概况</span>
                            </div>
                        </div>
                        <div class="build-information hid">
                            <ul>
                                <li v-for="value in building_info">
                                    <span class="center-y">{{value.title}}</span>
                                    <span class="center-y">{{value.com}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="build-info-structure">
                        <div class="build-title">
                            <div class="center-y">
                                <img src="../img/webwxget.jpg">
                                <span class="center-y">结构概况</span>
                            </div>
                        </div>
                        <div class="build-information hid">
                            <ul>
                                <li v-for="value in building_info">
                                    <span class="center-y">{{value.title}}</span>
                                    <span class="center-y">{{value.com}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
            </div>
            <div class="diary_general_right fl">
                <div class="cooperation-unit">
                    <div class="cooperation-unit-title ">
                        <div class="center-y">
                            <img src="../img/webwxget.jpg">
                            <span class="center-y">合作单位</span>
                        </div>
                    </div>
                    <div class="cooperation-unit-list hid">
                        <ul>
                            <li v-for="value in cooperationUnit">
                                <span class="center-y">{{value.title}}</span>
                                <span class="center-y">{{value.com}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="diary_general_information">
                    <div class="general_information-title cooperation-unit-title">
                        <div class="center-y">
                            <img src="../img/webwxgetmsgimg.jpg">
                            <span class="center-y">基本信息</span>
                        </div>
                    </div>
                     <div class="cooperation-unit-list general_information-list hid">
                        <ul>
                            <li v-for="value in generalInformation">
                                <span class="center-y">{{value.title}}</span>
                                <span class="center-y">{{value.com}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            value3: 0,
            setting: {
                autoplay: true,
                autoplaySpeed: 2000,
                dots: 'inside',
                trigger: 'click',
                arrow: 'hover',
            },
            cooperationUnit: [ //合作单位信息
                { title: '建设单位', com: '上海四建集团有限公司' },
                { title: '设计单位', com: '上海四建集团有限公司' },
                { title: '勘察单位', com: '上海四建集团有限公司' },
                { title: '监理单位', com: '上海四建集团有限公司' },
                { title: '总包单位', com: '上海四建集团有限公司' },
                { title: '建设单位', com: '上海四建集团有限公司' },
                { title: '合作单位', com: '上海四建集团有限公司' },
                { title: '管理单位', com: '上海四建集团有限公司' },
            ],
            // 基本信息
            generalInformation: [
                { title: '面积', com: '1233345645m²' },
                { title: '深度', com: '5645m²' },
                { title: '高度', com: '5645m²' },
                { title: '开竣工时间', com: '2015.6.1-2017.7.7' },
                { title: '单体数量', com: '12个' },
                { title: '质量目标', com: '安全' },
                { title: '安全目标', com: '安全' },
                { title: '环保目标', com: '安全' },
                { title: '质量目标', com: '安全' },
                { title: '安全目标', com: '安全' },
                { title: '环保目标', com: '安全' },
            ],
            //建筑概况
            building_info: [
                { title: '面积', com: '1233345645m²' },
                { title: '深度', com: '5645m²' },
                { title: '高度', com: '5645m²' },
                { title: '单体数量', com: '12个' },
                { title: '质量目标', com: '安全' },
            ]
        }
    },
    mounted() {
        const that = this;
        var idNum = this.$route.params.num || localStorage.getItem('projectId');
        this.$store.commit('changeId', idNum);

        localStorage.setItem('projectId', idNum);

        $('.projectName').css('height', $(window).height() - $('.title').height() - $('.diary-title').height() - $('.ivu-menu-horizontal').height());

        $('.pic-file').on('mouseover', function() {
            that.setting.autoplay = false;
        })
        $('.pic-file').on('mouseout', function() {
            that.setting.autoplay = true;
        })
    }
}
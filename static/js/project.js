var project = {
    template: `
            <div class="pro-right pro_index" @click="toggleProject($event)">
                <Row :gutter="32">
                    <Col span="12" class="demo-tabs-style2">
                        <Tabs type="card" :animated="false">
                            <TabPane label="全部项目">
                                <div class="project-list">
                                    <span v-for="(value,index) in cityAll" :class="{blue:value===point}" @click="toggleCity(value)">{{ value }}</span>
                                </div>
                            </TabPane>
                            <TabPane label="公司名称">
                                <div class="project-list">
                                    <span v-for="value in companyList" :class="{blue:value===point}" @click="toggleCity(value)">{{ value }}</span>
                                </div>
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
                <div class="project-info-title">
                    <loading v-if="showLoad"></loading>
                    <Row>
                        <Col span="4">
                            <strong>全部项目</strong>
                        </Col>
                        <Col span="20" class="inputText">
                              <div class="fr inputText">
                                <Input placeholder="请输入..." style="width: 300px"></Input>
                                <Button type="primary" icon="ios-search" @click="search">搜索</Button>
                              </div>
                        </Col>
                    </Row>
                    <div class="project-info">
                        <ul class="project-infoshow">
                            
                            <router-link  v-for="(value,index) in projectShow" tag="li" :to="{name:'diary_general',params:{num:value.id,name:value.PrjName}}">
                                <Row >
                                    <Col span="2">
                                        <img src="../img/u=3542322648,1435922467&fm=27&gp=0.jpg" class="center-xy">
                                    </Col>
                                    <Col span="22" >
                                        <div class="project-information">
                                            <span>{{ value.PrjName }}</span>
                                            <p class="fr">
                                                <span class="text-info start-date">开始日期:</span>
                                                <span class="text-info  start-date date">2017-9-7</span>
                                                <span>|</span>
                                                <span>截止日期:</span>
                                                <span class="date">2018-9-7</span>
                                            </p>
                                        </div>
                                        <p>
                                           <span class="text-info text-describe" title="长江三峡二期围堰坝高140米,建筑物防水按I级设计,于2001年4月开始应用了XYPEX(赛波斯)浓缩剂对其缺陷部位进行了处理。施工面积4000平米施工部分长江三峡二期围堰坝高140米,建筑物防水按I级设计,于2001年4月开始应用了XYPEX(赛波斯)浓缩剂对其缺陷部位进行了处理。施工面积4000平米施工部分">
                                            长江三峡二期围堰坝高140米,建筑物防水按I级设计,于2001年4月开始应用了XYPEX(赛波斯)浓缩剂对其缺陷部位进行了处理。施工面积4000平米施工部分长江三峡二期围堰坝高140米,建筑物防水按I级设计,于2001年4月开始应用了XYPEX(赛波斯)浓缩剂对其缺陷部位进行了处理。施工面积4000平米施工部分</span>
                                        </p>  
                                    </Col>
                                </Row>
                            </router-link>
                        </ul>
                    </div>
                </div>
            </div>
        `,

    data() {
        return {
            projectAll: [], //所有的项目
            projectShow: [], //展示的项目列表
            companyList: [], //公司列表  
            companyinfo: null, //对应的公司对应的项目
            companyCount: null, //公司总数
            timer: 1, //请求次数
            point: '',
            cityProject: null, //对应的城市对应的项目
            cityAll: [],
            showLoad: true
        }
    },
    components: {
        loading
    },
    methods: {
        toggleProject(event) {
            // console.log(event.target);
            if (event.target.innerText === '全部项目') {
                this.projectShow = this.projectAll;
                this.point = "";
            }
        },
        // 搜索
        search() {
            const that = this;
            const content = $('.inputText .ivu-input').val().trim();
            if (content === "") {
                return false;
            }
            this.projectShow = [];
            this.projectAll.forEach(value => {
                console.log(content);
                console.log(value.PrjName);
                console.log(value.PrjName.indexOf(content));
                if (value.PrjName.indexOf(content) >= 0) {
                    that.projectShow.push(value);
                }
            })
            console.log(this.projectAll);
            $('.inputText .ivu-input').val('');
        },
        //点击项目切换
        toggleCity(value) {
            this.point = value;

            this.projectShow = this.cityProject[value] || this.companyinfo[value] || [];

            this.$nextTick(function() {
                if ($('.text-describe').height() > $('.project-infoshow .ivu-col>p ').height()) {
                    $('.text-describe').dotdotdot({
                        ellipsis: '...',
                        height: 42,
                        wrap: 'letter',
                        fallbackToLetter: true,
                    });
                }
            });
        },
    },
    mounted() {
        // $('.ivu-tabs-tab').click(function() {
        //         alert(5);
        //         console.log($(this).html());
        //         if ($(this).html() === '全部项目') {
        //             alert(6);
        //         }
        //     })
        //渲染公司名
        var that = this;
        $.ajax({
            url: '/projects/rest/company',
            success: function(data) {
                console.log(data);
                that.companyCount = data.count;
                data.results.forEach(value => {
                    that.companyList.push(value.name);
                })
            }
        })

        //渲染公司名对应的项目
        $.ajax({
            url: '/projects/rest/project',
            success: function(data) {
                that.projectShow = data.results;
                console.log(that.projectShow);
                that.projectAll = data.results;
                that.companyinfo = {};
                that.cityProject = {};
                console.log(data);
                data.results.forEach(value => {
                    //对应的公司对应的项目
                    if (!that.companyinfo[value.companyname]) {
                        that.companyinfo[value.companyname] = []
                    }
                    that.companyinfo[value.companyname].push({
                        PrjName: value.PrjName,
                        longitude: value.longitude,
                        latitude: value.latitude
                    })
                    console.log(that.companyinfo);
                    //对应的城市对应的项目
                    if (!that.cityProject[value.cityname]) {
                        that.cityProject[value.cityname] = []
                    }
                    that.cityProject[value.cityname].push(value);
                })

                that.$store.commit('changeCompanyProje', that.companyinfo);
                that.cityAll = Object.keys(that.cityProject);
                console.log(that.cityAll);
                that.$nextTick(function() {
                    //算中间包含多个信息展示单位的高度
                    $('.project-info-title').height($(window).height() - $('.title').height() - 40 - $('.pro_index>.ivu-row').height());
                    $('.project-info').height($('.project-info-title').height() - $('.project-info-title>.ivu-row').outerHeight());

                    //多行隐藏

                    if ($('.text-describe').height() > $('.project-infoshow .ivu-col>p ').height()) {
                        $('.text-describe').dotdotdot({
                            ellipsis: '... ',
                            height: 42,
                            wrap: 'letter',
                            fallbackToLetter: true,
                        });
                    }
                })
                that.showLoad = false;
            }
        })
    }
}
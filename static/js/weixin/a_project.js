const a_project = {
    template: `
        <div class="common a_project">
            <navigation :title="title" :address="back_address"></navigation>
            <div class="page-bd">
                <div class="weui-flex">
                    <div class="weui-flex-item">
                        <div class="placeholder"  @click="show_ditu" id="ditu_go">
                            <i class="iconfont icon-ditu"></i>
                        </div>
                    </div>
                    <div class="weui-flex-item" style="width:60%;">
                        <div class="placeholder">
                            {{address}}
                        </div>
                    </div>
                    <div class="weui-flex-item text_center" @click="add_point">
                        <div class="placeholder">
                            <span class="icon icon-34 size22" ></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="weui_grids">
                <router-link :to="value.href" class="weui_grid js_grid" v-for="value in dataList">
                    <div class="weui_grid_icon">
                        <img :src="value.img" alt="">
                    </div>
                    <p class="weui_grid_label">
                        {{ value.title }}
                    </p>
                </router-link>
            </div>   
            <success_msg :content="content" ref="c1"></success_msg>
        </div>
    `,
    data() {
        return {
            prjName: '',
            address: '',
            projectId: '',
            dataResult: '',
            dataList: [{
                img: '/img/pro_detail_icon.png',
                title: '工程概况',
                href: '/general_situation'
            }, {
                img: '/img/pro_unitpro_icon.png',
                title: '单位工程',
                href: '/index/unit_project'
            }, {
                img: '/img/pro_wdgk_icon.png',
                title: '危大管控',
                href: '/index/danger_control'
            }, {
                img: '/img/pro_gggx_icon.png',
                title: '工序管控',
                href: '/index/managementand_and_control'
            }, {
                img: '/img/pro_slgk_icon.png',
                title: '四令管控',
                href: '/index/four_order'
            }, {
                img: '/img/graphic.png',
                title: '形象进度',
                href: '/index/graphic_index'
            }],

            title: '',
            back_address: '',
            currurl: '',
            presentPoint: [],
            target_point: [],
            content: '',
            wxconfig: {
                appid: '',
                timestamp: '',
                nonceStr: '',
                signature: '',
                jsapi_ticket: '',
            },
        }
    },
    components: {
        navigation,
        success_msg,
    },
    methods: {
        add_point() { //获取位置
            this.getlocation();
        },
        post_point() { //提交位置  "112.586965", "23.186095"
            const that = this;
            var obj = {
                longitude: this.presentPoint[0],
                latitude: this.presentPoint[1],
            }
            axios.put('/projects/rest/project/' + this.projectId[1] + '/', obj)
                .then(res => {
                    this.content = "坐标录入成功";
                    this.$refs.c1.showMsg();
                })
                // $.ajax({
                //     url: '/projects/rest/project/' + that.projectId[1],
                //     type: 'put',
                //     data: {
                //         longitude: '112.586965',
                //         latitude: '23',
                //     },
                //     success: function() {
                //         alert('成功')
                //     }
                // })
        },
        show_ditu() {
            if (this.target_point.length == 0) {
                this.content = "正在加载数据中";
                this.$refs.c1.showMsg();
            } else {
                this.getlocation(true); //获取位置并调取高德地图
            }
        },
        dhStart() {
            if (this.presentPoint.length != 0 && this.target_point[0] != "" && this.target_point[0] != null && this.target_point[1] != "" && this.target_point[1] != null) {
                this.clickTrue = false;
                var that = this,
                    button = document.getElementById('ditu_go');
                AMap.plugin(["AMap.Driving"], function() {
                    var drivingOption = {
                        policy: AMap.DrivingPolicy.LEAST_TIME,
                        map: that.map
                    };
                    var driving = new AMap.Driving(drivingOption); //构造驾车导航类
                    //根据起终点坐标规划驾车路线
                    driving.search(that.presentPoint, that.target_point, function(status, result) {
                        driving.searchOnAMAP({
                            origin: result.origin,
                            destination: result.destination
                        });
                    });
                });
            } else if (this.target_point[0] == "" || this.target_point[0] == null || this.target_point[1] == "" || this.target_point[1] == null) {
                this.content = "没有项目坐标";
                this.$refs.c1.showMsg();
            } else {
                this.content = "定位失败";
                this.$refs.c1.showMsg();
            }
        },
        showInfo() {
            this.content = "用户拒绝授权获取地理位置";
            this.$refs.c1.showMsg();
        },
    },
    mounted() {
        const id = this.$route.params.num, //公司id+项目id
            query = this.$route.query.val;
        this.projectId = id.split('_');

        this.dataList.forEach((value, index) => {
            if (index != 4) {
                value.href += '/' + id + '/';
            }
        })

        if (this.projectId[0] == 0) { //返回收藏页面
            this.back_address = "/index/myTask";
        } else if (this.projectId[0] == 'mes') {
            this.back_address = "/index/message"; //返回消息页面
        } else { //返回项目列表的项目信息页面
            this.back_address = '/index/projectList/' + this.projectId[0] + '/project_list?val=' + '项目列表';
        }

        this.dataList[2].href += 'project_line?val=工程轴';
        this.dataList[3].href += "procedure_line?val=工程轴";
        this.dataList[4].href += "?val=" + id;
        this.dataList[5].href += "graphic_project?val=工程轴";

        const that = this;
        axios.get('/projects/rest/project/' + this.projectId[1])
            .then(res => {
                console.log(res);
                var result = res.data;
                this.dataResult = result;
                console.log(result);
                this.target_point = [].concat([result.longitude, result.latitude]);
                this.title = result.PrjName;
                that.address = '地址: ' + (res.data.address || '暂无地址信息');
            })

        this.currurl = window.location.href;

        axios.get('http://sgrz.bimsheng.com/user/fetchTK/?urlpath=' + that.currurl).then(res => {
            const data = res.data.config;
            this.wxconfig.appid = data.appid;
            this.wxconfig.timestamp = data.timestamp;
            this.wxconfig.signature = data.signature;
            this.wxconfig.nonceStr = data.nonceStr;
            this.wxconfig.jsapi_ticket = data.jsapi_ticket;
            this.wxinit();
        })

        that.$store.commit('moduleProsure/changeProsure', false); //去掉加号样式
    }
}
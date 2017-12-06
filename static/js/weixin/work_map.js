const work_map = {
    template: `
        <div class="work_map">
            <navigation :title="title" :address="address"></navigation>
            <div id="allmap" :style="style" >
            </div>
            <div class="work_map_footer">
                <input-look :left_title="left_title" :right_title="right_title" >
                        <p slot="dis">{{ distance }}</p>
                        <p slot="jd" v-if="flag" id="bt" @click="dh">
                            导航
                        </p>
                </input-look>
            </div>
            <success_msg :content="content" ref="c1"></success_msg>
        </div>
    `,
    data() {
        return {
            title: '施工地图',
            address: '',
            cityProject: {},
            style: {
                height: ''
            },
            left_title: '',
            right_title: '',
            flag: false,
            target_point: '', //点击的标注点
            distance: '', //距离
            map: '', //地图实例
            presentPoint: [], //当前位置坐标点
            myLabel: '', //地图标注
            content: '',
            geolocation: '',
            clickTrue: true,
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
        inputLook,
        success_msg,
    },

    methods: {
        dh() {
            this.getlocation(true);
        },
        dhStart() {
            if (this.presentPoint.length != 0 && this.target_point[0] != "" && this.target_point[0] != null && this.target_point[1] != "" && this.target_point[1] != null) {
                this.clickTrue = false;
                var that = this,
                    button = document.getElementById('bt');
                AMap.plugin(["AMap.Driving"], function() {
                    var drivingOption = {
                        policy: AMap.DrivingPolicy.LEAST_TIME,
                        map: that.map
                    };
                    var driving = new AMap.Driving(drivingOption); //构造驾车导航类
                    //根据起终点坐标规划驾车路线
                    driving.search(that.presentPoint, that.target_point, function(status, result) {
                        button.onclick = function() {
                            driving.searchOnAMAP({
                                origin: result.origin,
                                destination: result.destination
                            });
                        }
                    });
                });
                this.map.addControl(new AMap.ToolBar());
            } else if (this.target_point[0] == "" || this.target_point[0] == null || this.target_point[1] == "" || this.target_point[1] == null) {
                this.content = "没有项目坐标";
                this.$refs.c1.showMsg();
            } else {
                this.content = "定位失败";
                this.$refs.c1.showMsg();
            }
        },
        msg(marker) {
            this.left_title = marker.pro;
            this.target_point = marker.point;
        },
        showInfo() {
            this.content = "用户拒绝授权获取地理位置";
            this.$refs.c1.showMsg();
        },
    },
    mounted() {
        this.address = this.$route.query.val.split('_')[1] == 0 ? '/index/project_online/map_list?val=地图列表' : '/index/projectList/' + this.$route.query.val.split('_')[1] + '/project_map_list?val=地图列表'
        this.style.height = $(window).height() - $('.weui-header').height() - $('.work_map_footer').height() + 'px';
        const center = this.$route.query.val.split('_')[0],
            that = this;
        this.map = new AMap.Map("allmap", {
            resizeEnable: true,
            zoom: 8
        }); // 创建Map实例

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




        axios.get('/projects/rest/project?city_id=' + this.$route.params.num)
            .then(res => {
                console.log(res);
                const result = res.data.results;
                if (result.length != 0) {

                    const first = result[0];
                    let point = [first.longitude, first.latitude]; // 创建点
                    let arr = [],
                        cent = false;
                    this.target_point = point;
                    this.left_title = first.name;
                    this.flag = true;

                    result.forEach((val, i) => {
                        var marker;
                        marker = new AMap.Marker({
                            position: [val.longitude, val.latitude]
                        }); // 创建点
                        marker.pro = val.PrjName;
                        marker.point = point;
                        arr.push(marker);
                    })
                    arr.forEach(value => {
                        if (!(value.point[0] == "" || value.point[1] == "" || value.point[0] == null || value.point[1] == null)) {
                            value.setMap(that.map);
                            cent = true;
                        }
                        AMap.event.addListener(value, 'click', function() {
                            that.msg(value);
                        });
                    })
                    if (!cent) {
                        this.map.setCity(center.slice(0, -1));
                    }
                    this.map.setFitView();
                } else {
                    this.map.setCity(center.slice(0, -1));
                    this.left_title = '该地区还没有项目';
                    this.flag = false;
                    this.distance = "请选择其他";
                }
            })
    }
}
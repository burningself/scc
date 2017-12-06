const add_diary = {
    template: `
        <div class="add_diary auto_content">
                <navigation :title="title" :address="back_address"></navigation>
                <scroll class="add_diary_content  construction_diary unit_project overhid" :data="dataFlag" > 
                    <div class="diary">
                        <div class="weui-flex">
                            <div class="weui-flex-item">
                                <div class="placeholder">
                                    <date-select :con="con" :date="date" :sel="0"  :id=" 'add_diary_date' "></date-select>
                                </div>
                            </div>
                            <div class="weui-flex-item">
                                <div class="placeholder">
                                    <input type="number" class="weui_input"  v-model.trim="template" pattern="[0-9]*" style="text-align:center" placeholder="温度">℃
                                </div>
                            </div>
                            <div class="weui-flex-item"><div class="placeholder">
                                    <input class="weui_input  text_center " type="text"  id="weather"  name="weather" v-model="value.weather" placeholder="天气">  
                            </div></div>
                        </div>
                        <div class="fb">
                            <div class="weui_cells">
                                <div class="weui_cell no_access">
                                    <div class="weui_cell_bd weui_cell_primary">
                                        <p class="">分部</p>
                                    </div>
                                    <div class="weui_cell_ft font_color" @click="getFbData">
                                        <span>添加分部</span>
                                    </div>
                                </div>
                                <div class="fb_info" v-for="(val,index) in value.rewordworks">
                                    <div class="weui_cell">
                                        <div class="weui_cell_hd"><label for="" class="weui_label">分部名称</label></div>
                                        <div class="weui_cell_bd weui_cell_primary">
                                            <input class="weui_input" type="text" :value="val.name" name="name" autocomplete="off"  v-model="val.name">  
                                        </div>     
                                    </div>
                                    <div class="weui_cell">
                                        <div class="weui_cell_hd"><label for="" class="weui_label">预算工作量m³/(m²)</label></div>
                                        <div class="weui_cell_bd weui_cell_primary">
                                            <input class="weui_input" type="text" :value="val.designwork" name="designwork" autocomplete="off"   v-model="val.designwork"> 
                                        </div>     
                                    </div>  
                                    <div class="weui_cell">
                                        <div class="weui_cell_hd"><label for="" class="weui_label">实际工作量m³/(m²)</label></div>
                                        <div class="weui_cell_bd weui_cell_primary">
                                            <input class="weui_input" type="text" :value="val.completework" name="completework" autocomplete="off"   v-model="val.completework">  
                                        </div>     
                                    </div> 
                                    <table class="weui-table weui-border-tb">
                                        <thead>
                                            <tr>
                                                <th @click="add_type(index,val.id)">
                                                    工种
                                                    <i  class="icon icon-jiahao"></i>
                                                </th>
                                                <th>班组</th>
                                                <th>人数</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for=" (v,i) in val.rewordworktypes">
                                                <td v-for="(res,res_index) in type_value">
                                                    <input class="weui_input" type="text"  :value="v[res]"  v-model="v[res]">
                                                </td>
                                                <td>
                                                    <input class="weui_input" type="number"  :value="v.peoples"  v-model.number.trim="v.peoples" pattern="[0-9]*">
                                                </td>
                                                <td style="position:relative;" @click="dele_gz(v,i,index)">
                                                    <a href="javascript:;" class="weui_btn weui_btn_warn delet_gz tran-xy" >删除</a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <a href="javascript:;" class="weui_btn weui_btn_warn delet_gz dele_fb" @click="dele_fb(val,index)">删除分部</a>
                                </div>
                                <form class="sub">
                                    <div class="diary_record_content">
                                        <div v-for="(text,index) in text_all">
                                            <input-look :left_title="text.title">
                                                <p slot="jd">
                                                    <i class="iconfont icon-luyinjieshu size24 stop_luyin"  @click="stopVoice(index)" style="color:red" v-show="showvoiceIndex===index"></i>
                                                
                                                    <i class="iconfont icon-luyin size24 luyin"  @click="addVoice(index)"></i>
                                                </p>
                                            </input-look>
                                            <div class="weui_cells">
                                                <div class="weui_cell">
                                                    <div class="weui_cell_bd weui_cell_primary">
                                                        <textarea class="weui_input" :value="text.value" type="text" :name="text.name" autocomplete="off" v-model="text_all[index].value"></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <a href="javascript:;" class="weui_btn" @click="keep" style="margin-top:10px">添加日记</a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </scroll>
            <success_msg :content="content" ref="c1"></success_msg>
        </div>
    `,
    data() {
        return {
            title: '添加日记',
            back_address: "",
            con: '',
            dataFlag: true,
            add_rji: true,
            text_all: [
                { title: "质量", value: '', name: 'qualitys' },
                { title: "安全", value: '', name: 'safetys' },
                { title: "场容", value: '', name: 'fieldcapacitys' },
                { title: "砂浆、矼试块", value: '', name: 'mortars' },
                { title: "隐藏工程验收及技术复核记录", value: '', name: 'checkworks' },
                { title: "材料、构件、机具进退场", value: '', name: 'materialinfos' },
                { title: "加班与停工情况", value: '', name: 'overtimes' },
                { title: "其他", value: '', name: 'others' },
            ],
            date: '', //今天的日期
            dayWeather: '', //今天天气
            dayTemplate: '', //今天温度
            dateArr: [], //所有日记的集合
            preserve_rji: false, //是否获取到日记列表
            pId: '',
            id: '',
            // rewordworks: [], //分部内容
            value: {
                rewordworks: [],
            }, //请求回来的总数据
            type_value: ['name', 'monitor'], //工种，班组
            template: '', //温度
            weather: '', //天气
            content: '',
            presentPoint: [], //当前坐标
            tzFlag: false,
            wxsuccess: 1,
            showuploadvoice: 0,
            showvoiceIndex: '',
            quesdesc: '', //录音内容
            currurl: '',
            wxvoices: {
                localId: '',
                serverId: '',
                translateDesc: '',
                showuploadvoice: 0,
            },
            picUrl: '',
            wximages: {
                localId: [],
                serverId: [],
                showId: []
            },
            wxconfig: {
                appid: '',
                timestamp: '',
                nonceStr: '',
                signature: '',
                jsapi_ticket: '',
            }
        }
    },
    components: {
        navigation,
        dateSelect,
        add_fb,
        success_msg,
        inputLook,
        scroll

    },
    methods: {
        //添加工种
        add_type(index, id) {
            var length = 0;
            this.value.rewordworks.forEach(value => {
                length += value.rewordworktypes.length;
            })
            if (length < 8) {
                this.content = "添加成功";
                this.$refs.c1.showMsg();
                this.value.rewordworks[index].rewordworktypes.push({
                    name: '',
                    monitor: '',
                    peoples: '',
                });
                this.dataFlag = !this.dataFlag;
            } else {
                this.content = "最多只能添加8个工种";
                this.$refs.c1.showMsg();
            }


        },
        dele_fb(val, index) {
            this.value.rewordworks.splice(index, 1);

            this.content = "删除成功";
            this.$refs.c1.showMsg();
            this.dataFlag = !this.dataFlag;

        },
        dele_gz(v, i, index) {
            // console.log(v, i);
            // console.log(this.value.rewordworks[i])
            this.value.rewordworks[index].rewordworktypes.splice(i, 1);

            this.content = "删除成功";
            this.$refs.c1.showMsg();
            this.dataFlag = !this.dataFlag;

        },
        back_construction() {
            this.$router.push("/construction_diary/" + this.$route.params.id + '?val=' + this.$route.query.val.split('|')[0] + '|' + this.pId);
        },
        keep() {

            axios.get('/projects/rest/Records/?engineering_id=' + this.pId)
                .then(res => {
                    var result = res.data.results;
                    if (result.length != 0) {
                        result.forEach(value => {
                            this.dateArr.push(value.curr_time);
                        })
                    }
                    this.preserve_rji = true;
                    this.getlocation(false); //获取天气
                })

        },
        keep_diary() {

            if (this.add_rji) {
                this.add_rji = false;
                var flag;
                if (this.preserve_rji) {
                    flag = true;
                    var that = this;
                    var curr_time = $('#add_diary_date').val();
                    var dataList = this.dateArr;
                    if (dataList) {
                        dataList.forEach(value => {
                            if (curr_time == value) {
                                this.add_rji = true;
                                that.content = '日期已存在,请重新选择';
                                this.$refs.c1.showMsg();
                                flag = false;
                                return false;
                            }
                        })
                    }
                } else {
                    this.content = "正在加载数据";
                    this.$refs.c1.showMsg();
                    this.add_rji = true;
                    return false;
                }
                //如果不重复则添加
                if (flag) {
                    var dataArr = $('.sub').serializeArray(),
                        obj = {},
                        id = this.$route.query.val.split('|')[1].split('_')[0],
                        reword = this.value.rewordworks,
                        length,
                        i = 0; //总共提交几次，提交完才跳转页面
                    dataArr.forEach((value, index) => { //只拿质量以后的数据，质量以下的数据和分部提交是不同的接口
                        console.log(value);
                        obj[value.name] = value.value;
                    })

                    if (!this.weather && curr_time == this.date) { //是否有写天气，是否是添加当天日志来决定录入的天气
                        if (this.dayWeather) {
                            obj.weather = this.dayWeather;
                        } else {
                            this.content = "正在获取今天天气";
                            this.$refs.c1.showMsg();
                            this.add_rji = true;
                            return false;
                        }
                    } else {
                        obj.weather = this.weather;
                    }

                    if (!this.template && curr_time == this.date) {
                        if (this.dayTemplate) {
                            obj.template = this.dayTemplate;
                        } else {
                            this.content = "正在获取今天气温";
                            this.$refs.c1.showMsg();
                            this.add_rji = true;
                            return false;
                        }
                    } else {
                        obj.template = this.template;
                    }
                    // obj.weather=!this.weather && curr_time == this.date ? 


                    obj.curr_time = curr_time;
                    obj.engineering = "http://127.0.0.1:8000/projects/rest/engineering/" + id + '/';
                    console.log(obj);
                    // obj.rewordworks = this.value.rewordworks;

                    axios.post('/projects/rest/Records/', obj)
                        .then(res => {
                            var id = res.data.id;
                            length = reword.length || 0;
                            if (reword.length != 0) {
                                console.log(length);
                                reword.forEach(value => {
                                    // console.log(value);
                                    value.record = "http://127.0.0.1:8000/projects/rest/Records/" + id + '/';
                                    axios.post('/projects/rest/RecordWorks/', value)
                                        .then(res_rd => {
                                            i++;

                                            var obj = value.rewordworktypes;
                                            length += obj.length;

                                            if (i == length) { //如果提交的次数等于工种的次数加上分部的次数，则跳转页面
                                                this.back_construction();
                                            }
                                            if (obj.length != 0) {

                                                obj.forEach(val => {
                                                        val.recordwork = "http://127.0.0.1:8000/projects/rest/RecordWorks/" + res_rd.data.id + '/';
                                                        val.peoples = val.peoples || 0;
                                                        axios.post('/projects/rest/RecordWorkTypes/', val)
                                                            .then(res => {
                                                                i++;
                                                                if (i == length) { //如果提交的次数等于工种的次数加上分部的次数，则跳转页面
                                                                    this.back_construction();
                                                                }
                                                            })
                                                            .catch(res => {
                                                                that.content = '提交工种失败';
                                                                this.$refs.c1.showMsg();
                                                            })
                                                    })
                                                    // console.log(length);
                                            } else {
                                                this.back_construction();
                                            }
                                        })
                                        .catch(res => {
                                            that.content = '提交分部失败';
                                            this.$refs.c1.showMsg();
                                        })
                                })
                            } else {
                                this.back_construction();
                            }
                        })
                        .catch(res => {
                            this.content = '添加日记失败';
                            this.$refs.c1.showMsg();
                        })
                }
            } else {

                this.content = "正在添加日记,请勿重复提交";
                this.$refs.c1.showMsg();
            }
        },
        //添加分项之后直接在页面中显示
        getFbData(res) {
            if (this.value.rewordworks.length < 9) {
                this.value.rewordworks.push({
                    rewordworktypes: [],
                    name: "",
                    designwork: "",
                    completework: "",
                    content: null,
                })
                this.dataFlag = !this.dataFlag;
                this.content = "添加成功";
                this.$refs.c1.showMsg();
            } else {
                this.content = "最多只能添加9个分项";
                this.$refs.c1.showMsg();
            }

            // })


        },
        addVoice(index) {
            var that = this;
            this.showvoiceIndex = index;
            that.wxsuccess = 0;
            that.wxstartRecord();
        },
        stopVoice() {
            var id = this.$route.query.val.split('|')[1].split('_')[1];
            this.wxstopRecord(id);
        },
        post_point() {
            const that = this;
            AMap.service('AMap.Geocoder', function() { //回调函数

                //实例化Geocoder
                geocoder = new AMap.Geocoder();

                var lnglatXY = that.presentPoint;
                geocoder.getAddress(lnglatXY, function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        //获得了有效的地址信息:
                        axios.get('/getWeatherToday/?cityName=' + result.regeocode.addressComponent.province) // + result.regeocode.addressComponent.province
                            .then(res => {
                                that.dayWeather = res.data.weather;
                                that.dayTemplate = res.data.temphigh;
                                that.keep_diary();
                            })
                    } else {
                        //获取地址失败
                        that.content = "获取地址失败";
                        that.$refs.c1.showMsg();
                    }
                });
                //TODO: 使用geocoder 对象完成相关功能
            })
        },
        showInfo() {

        }
    },
    mounted() {


        $("#weather").picker({
            title: '天气',
            toolbarCloseText: '确定',
            cols: [{
                textAlign: 'center',
                values: ['晴', '雨', '雪'], //this.val
                displayValues: ['晴', '雨', '雪'], //this.val
            }]
        });

        console.log(this.$route);
        const newDate = new Date(),
            that = this,
            route = this.$route,
            query = route.query.val,
            params = route.params.id;
        this.pId = query.split('|')[1].split('_')[0];

        $('.add_diary_content').height($(window).height() - $('.navigation').height());

        let mon = newDate.getMonth() + 1,
            date = newDate.getDate();
        if (mon < 10) {
            mon = '0' + mon;
        }
        if (date < 10) {
            date = '0' + date;
        }
        this.date = newDate.getFullYear() + '-' + mon + '-' + date; //获取本地时间


        if (this.$route.query.val.split('|')[1].split('_')[1] == 1) {
            this.back_address = "/construction_diary/" + params + '?val=' + query.split('|')[0] + '|' + this.pId;
        } else {
            this.back_address = "/index/project_in_methods/" + this.$route.params.id + '?val=' + query.split('|')[0] + '|' + this.pId
        }


        this.currurl = window.location.href;


        axios.get('http://sgrz.bimsheng.com/user/fetchTK/?urlpath=' + that.currurl).then(res => {
            const data = res.data.config;
            this.access_token = res.data.access_token;
            this.wxconfig.appid = data.appid;
            this.wxconfig.timestamp = data.timestamp;
            this.wxconfig.signature = data.signature;
            this.wxconfig.nonceStr = data.nonceStr;
            this.wxconfig.jsapi_ticket = data.jsapi_ticket;
            this.wxinit();

        })
    }
}
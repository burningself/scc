const diary = {
    template: `
        <div class="diary scroll">
            <div class="weui-flex">
                <div class="weui-flex-item"><div class="placeholder">{{ content_date }}</div></div>
                <div class="weui-flex-item">
                    <div class="placeholder">
                        <input  class="weui_input text_center" type='text' v-model="value.template" pattern="[0-9]*"  placeholder="温度" name="template">℃
                    </div>
                </div>
                <div class="weui-flex-item">
                    <div class="placeholder">
                        <input class="weui_input  text_center " type="text"  id="weather"  name="weather" v-model="value.weather"  placeholder="天气">  
                    </div>
                </div>
            </div>
            <form class="fb">
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
                            <div class="weui_cell_hd"><label for="" class="weui_label" >分部名称</label></div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <input class="weui_input" type="text" :value="val.name" name="name" autocomplete="off" @blur="blur($event,index)">  
                            </div>     
                        </div>   
                        <div class="weui_cell">
                            <div class="weui_cell_hd"><label for="" class="weui_label">预算工作量m³/(m²)</label></div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <input class="weui_input" type="text" :value="val.designwork" name="designwork" autocomplete="off"  @blur="blur($event,index)"> 
                            </div>     
                        </div>  
                        <div class="weui_cell">
                            <div class="weui_cell_hd"><label for="" class="weui_label">实际工作量m³/(m²)</label></div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <input class="weui_input" type="text" :value="val.completework" name="completework" autocomplete="off"  @blur="blur($event,index)">  
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
                                        <input class="weui_input" type="text"  :value="v[res]" @blur="keepData($event,res_index,v.id,index,i)">
                                    </td>
                                    <td>
                                        <input class="weui_input" type="number"  :value="v.peoples"  v-model.number.trim="v.peoples" pattern="[0-9]*" @blur="keepData($event,2,v.id,index,i)">
                                    </td>
                                    <td style="position:relative;" @click="dele_gz(v,i,index)">
                                       <a href="javascript:;" class="weui_btn weui_btn_warn delet_gz tran-xy" >删除</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <a href="javascript:;" class="weui_btn weui_btn_warn delet_gz dele_fb" @click="dele_fb(val,index)">删除分部</a>
                    </div>
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
                                        <textarea class="weui_input" :value="text.value " type="text" :name="text.name" autocomplete="off" v-model="text_all[index].value"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <a href="javascript:;" class="weui_btn" @click="pdf_manage" style="margin-top:10px;">PDF管理</a>
                        <a href="javascript:;" class="weui_btn" @click="keep" style="margin-top:10px;">保存修改</a>
                        <a href="javascript:;" class="weui_btn" @click="dele_diary" style="margin-top:10px;">删除日记</a>
                    </div>
                    
                </div>
            </form>
            
        </div>
    `,
    // <input class="weui_input" :value="text.value " type="text" :name="text.name" autocomplete="off" v-model="text_all[index].value">
    data() {
        return {
            value: '',
            content_date: '', //标题日期加时间
            template: '', //温度
            type_value: ['name', 'monitor'], //工种，班组，人数
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
            id: '',
            content: '',
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
    props: ['val'], //接受父级传递过来的数据
    watch: {
        'val': 'change'
    },
    // filters: {
    //     filt(value) {
    //         return value + '℃';
    //     }
    // },
    components: {
        add_fb,
        success_msg,
        inputLook,
    },
    methods: {
        pdf_manage() {
            if (this.value) {
                console.log(this.$router);
                var router = this.$route;
                this.$router.push('/diary_pdf/' + router.params.num + '?val=' + router.query.val + '_' + this.value.id);
            }

        },
        te_all(obj) {
            this.text_all[0].value = obj.qualitys;
            this.text_all[1].value = obj.safetys;
            this.text_all[2].value = obj.fieldcapacitys;
            this.text_all[3].value = obj.mortars;
            this.text_all[4].value = obj.checkworks;
            this.text_all[5].value = obj.materialinfos;
            this.text_all[6].value = obj.overtimes;
            this.text_all[7].value = obj.others;
        },
        change() {
            const date_week = ["星期天", '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            this.value = this.val;
            // this.value.template += '℃';

            this.template = this.value ? this.value.template + '℃' : '';

            this.id = this.value.id;
            this.te_all(this.val);
            console.log(this.text_all);
            var date = this.val.curr_time ? new Date(this.val.curr_time) : '';
            this.content_date = date ? this.val.curr_time + date_week[date.getDay(date)] : '';
            this.$emit('resetData'); //重置滚动
        },
        dele_gz(v, i, index) {
            console.log(v);
            this.value.rewordworks[index].rewordworktypes.splice(i, 1);
            axios.delete('/projects/rest/RecordWorkTypes/' + v.id)
                .then(res => {
                    this.$emit('msg', '删除成功');
                    this.$emit('resetData');
                })
        },
        dele_fb(val, index) {
            console.log(val, index);
            this.value.rewordworks.splice(index, 1);
            axios.delete('/projects/rest/RecordWorks/' + val.id)
                .then(res => {
                    this.$emit('msg', '删除成功');
                    this.$emit('resetData');
                })
        },
        //保存质量以下的填写数据
        keep() {
            console.log(this.value);
            if (this.id != "") {
                var dataArr = $('.fb').serializeArray();
                var obj = {};
                dataArr.forEach((value, index) => { //只拿质量以后的数据，质量以下的数据和分部提交是不同的接口
                    obj[value.name] = value.value;
                })
                console.log(obj);

                obj.template = this.value.template;
                console.log(this.value.weather);
                obj.weather = this.value.weather;
                console.log(obj);
                axios.put('/projects/rest/Records/' + this.id + '/', obj) //带上日记id的参数
                    .then(res => {
                        console.log(res.data);
                        this.value = res.data;
                        // console.log(this.value);
                        this.te_all(res.data);
                        // this.value.template += '℃';
                        this.$emit('msg', '修改成功');
                    })
                    // console.log(this.value);
            } else {
                this.$emit('msg', '没有日记')
            }


        },
        //失去焦点时修改数据
        blur(event, index) {

            console.log(this.val);
            const target = event.target;
            axios.put('/projects/rest/RecordWorks/' + this.val.rewordworks[index].id + '/', { //
                    [target.name]: target.value
                })
                .then(res => {
                    this.value.rewordworks[index][target.name] = target.value;
                    this.$emit('msg', '修改成功')
                })
                .catch(res => {

                })

        },
        //添加工种
        add_type(index, id) {

            var length = 0;
            this.value.rewordworks.forEach(value => {
                length += value.rewordworktypes.length;
            })

            if (length < 8) {
                let type_id;
                axios.post('/projects/rest/RecordWorkTypes/', {
                        name: '',
                        monitor: '',
                        peoples: 0,
                        recordwork: "/projects/rest/RecordWorks/" + id + '/'
                    }).then(res => {
                        type_id = res.data.id;
                        console.log(index);

                        this.value.rewordworks[index].rewordworktypes.push({
                            name: '',
                            monitor: '',
                            peoples: '',
                            id: type_id
                        });
                        this.$emit('resetData'); //重置滚动
                        this.$emit('msg', '修改成功')
                    })
                    .catch(res => {

                    })

            } else {
                this.$emit('msg', '最多只能添加8个工种');
            }
        },
        //工种,班组,人数保存修改
        keepData(event, i, id, index, num) { //num是修改rewordworktypes的下标  i是修改哪个属性的下标 index第几个rewordworks下标
            const target = event.target,
                data_list = ['name', 'monitor', 'peoples'];
            axios.put('/projects/rest/RecordWorkTypes/' + id + '/', {
                [data_list[i]]: target.value
            }).then(res => {
                this.value.rewordworks[index].rewordworktypes[num][data_list[i]] = res.data[data_list[i]];
                this.$emit('msg', '修改成功')
            })
        },
        //添加分项之后直接在页面中显示
        getFbData(res) {
            if (this.value.rewordworks.length < 9) {
                var obj = {};
                obj.name = '';
                obj.designwork = '';
                obj.completework = '';
                obj.record = "/projects/rest/Records/" + this.id + '/';

                axios.post('/projects/rest/RecordWorks/', obj)
                    .then(res => {
                        this.value.rewordworks.push({
                            id: res.data.id,
                            rewordworktypes: res.data.rewordworktypes,
                            name: res.data.name,
                            designwork: res.data.designwork,
                            completework: res.data.completework,
                            content: res.data.content,
                        })
                        this.$emit('resetData');
                        this.$emit('msg', '添加成功');
                    })
            } else {
                this.$emit('msg', '最多只能添加9个分项');
            }

        },
        addVoice(index) {
            var that = this;
            this.showvoiceIndex = index;
            that.wxsuccess = 0;
            that.wxstartRecord();
        },
        stopVoice: function() {
            // this.showvoiceIndex = "";
            var id = this.$route.query.val.split('|')[1].split('_')[1];
            this.wxstopRecord(id);
        },
        //删除日记
        dele_diary() {
            if (this.val.id) {
                axios.delete("/projects/rest/Records/" + this.val.id)
                    .then(res => {
                        location.reload();
                    })
            } else {
                this.$emit('msg', '没有日记');
            }

        },
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

        // console.log(this.value);
        $('.date_diary_content').height($(window).height() - $('.weui-header').height() - $('.date_diary').height());
        this.currurl = window.location.href; //获取当前地址,提交到后台获取签名
        var that = this;
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
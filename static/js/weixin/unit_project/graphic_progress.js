const graphic_progress = {
    template: `
        <div class="graphic_progress unit_project">
             <navigation :title="title" :address="address"></navigation>
             <div class="weui_cells weui_top"> 
                <input-look :left_title="dataList[0].left_title" :right_title="dataList[0].right_title">            
                </input-look>

                <div class="weui-flex weui_cell write"> 
                    <div class="weui-flex-item size15">
                        实际进度
                    </div>
                    <div class="weui-flex-item">
                        <div class="weui_cell_bd weui_cell_primary size ">
                            <input class="weui_input rig"  type="number" v-model.trim="shiji_schedule"   pattern="[0-9]*"  name="shiji_schedule" autocomplete="off" @blur="sub_data">
                        </div>
                    </div>
                </div> 
                <input-look :left_title="dataList[2].left_title" :right_title="dataList[2].right_title">
                    <div class="weui-slider-box" slot="jd">
                        <div class="weui-slider">
                            <div id="sliderInnerjh" class="weui-slider-inner">
                                <div id="sliderTrackjh" :style="jHstyleW" class="weui-slider-track"></div>
                                <div id="sliderHandlerjh" :style="jHstyleL" class="weui-slider-handler"></div>
                            </div>
                        </div>
                        <div id="sliderValuejh" class="weui-slider-box-value f-white size16">{{ jHstyleW.width.split('%')[0] }}</div>
                    </div>
                </input-look>
            </div> 
            <div class="weui-loadmore" v-if="flagLoad">
                <i class="weui-loading"></i>
                <span class="weui-loadmore__tips">正在加载</span>
            </div>
            <scroll :data="gx" class="graphic_progress_gx overhid gc">
                <div class="weui_cells">                   
                     <input-look :left_title="value[0]" :right_title="value[1]" v-for="(value,index) in gx" :class="value[2]" @click.native="gx_go(value,index)">            
                     </input-look>          
                </div>
            </scroll>
            <success_msg :content="content" ref="c1"></success_msg>
        </div>
    `,
    data() {
        return {
            title: '形象进度',
            shiji_schedule: '',
            address: '',
            dataList: [
                { left_title: '工程名称', right_title: '' },
                { left_title: '实际进度', right_title: '' },
                { left_title: '计划进度', right_title: '' },
            ],
            gx: [], //工序名称
            styleW: {
                width: '',
            },
            styleL: {
                left: '',
            },
            jHstyleW: {
                width: '',
            },
            jHstyleL: {
                left: '',
            },
            styleColor: { //红绿背景颜色
                background: '',
            },
            gxType: {
                1: '重点',
                2: "关键",
                3: "难点"
            },
            flagLoad: true,
            content: '',
        }
    },
    components: {
        list,
        navigation,
        inputLook,
        success_msg,
        scroll
    },
    methods: {
        sub_data() {
            var obj = {
                shiji_schedule: this.shiji_schedule,
                project: '/projects/rest/project/' + this.$route.params.num.split('_')[1] + '/'
            }
            axios.put('/projects/rest/engineering/' + this.$route.query.val.split('_')[0] + '/', obj)
                .then(res => {
                    this.content = "修改成功";
                    this.$refs.c1.showMsg();
                })
        },
        jdt(id1, id2, id3, id4) {
            //进度条
            const that = this;
            var $sliderTrack = $(id1), //'#sliderTrack'
                $sliderHandler = $(id2), //'#sliderHandler'
                $sliderValue = $(id3); //'#sliderValue'

            var totalLen = $(id4).width(), //'#sliderInner'
                startLeft = 0,
                startX = 0;

            $sliderHandler
                .on('touchstart', function(e) {
                    startLeft = parseInt($sliderHandler.css('left')) * totalLen / 100;
                    startX = e.changedTouches[0].clientX;
                })
                .on('touchmove', function(e) {
                    var dist = startLeft + e.changedTouches[0].clientX - startX,
                        percent;
                    dist = dist < 0 ? 0 : dist > totalLen ? totalLen : dist;
                    percent = parseInt(dist / totalLen * 100);
                    $sliderTrack.css('width', percent + '%');
                    $sliderHandler.css('left', percent + '%');
                    $sliderValue.text(percent);

                    e.preventDefault();
                })
                .on('touchend', function() {
                    // console.log(this);
                    // const result = $(this).attr('style').split(':')[1].slice(0, -2);
                    // const attr = id1.slice(-2) == 'jh' ? 'design_schedule' : 'shiji_schedule';
                    // let obj = {};
                    // obj[attr] = result;
                    // obj.project = '/projects/rest/project/' + that.$route.params.num.split('_')[1] + '/';
                    // console.log(result);


                    // // obj.shiji_schedule
                    // axios.put('/projects/rest/engineering/' + that.$route.query.val.split('_')[0] + '/', obj)
                    //     .then(res => {
                    //         that.content = "修改成功"
                    //         that.$refs.c1.showMsg();
                    //     })
                })
        },
        gx_go(index, num) {
            var value = index[1];
            console.log(index);
            if (value == '危大') {
                this.$router.push({
                    path: '/danger_info/' + this.$route.params.num.split('_')[0] + '_' + this.$route.query.val.split('_')[0],
                    query: { val: index[3] + '_graphic' }
                })
            } else {
                this.$router.push({
                        path: '/process_details/' + this.$route.params.num.split('_')[0] + '_' + this.$route.query.val.split('_')[0],
                        query: { val: index[3] + '_' + this.$route.params.num.split('_')[1] + '_graphic-progress' }
                    })
                    // this.$router.push({ path: '/process_details/' + this.$route.params.num, query: { val: index + '_' + this.$route.query.val.split('_')[0] + '_graphic-progress' } })
            }

        }
    },
    mounted() {
        const that = this;
        $('.gc').height($(window).height() - $('.navigation').height() - $('.weui_top').height() - 8); //动态计算gc的高
        axios.get(' /projects/rest/engineering/' + this.$route.query.val.split('_')[0])
            .then(res => {
                console.log(res);

                var result = res.data;


                //返回地址
                if (this.$route.query.val.split('_')[1] == 1) {
                    this.address = '/index/graphic_index/' + this.$route.params.num + '/graphic_project?val=工程轴'; //返回地址
                } else if (this.$route.query.val.split('_')[1].indexOf('-') > 0) {
                    // /index/graphic_index/1_4/graphic_time_someone/2017-09?val=%E6%97%B6%E9%97%B4%E8%BD%B4
                    this.address = '/index/graphic_index/' + this.$route.params.num + '/graphic_time_someone/' + this.$route.query.val.split('_')[1] + '?val=时间轴'; //返回地址
                } else if (this.$route.query.val.split('_')[1] == 0) {
                    this.address = "/index/project_in_methods/" + this.$route.params.num + "?val=" + result.name + "|" + result.id;
                } else if (this.$route.query.val.split('_')[1] == 'indexUnit') {
                    this.address = "/index/xxjd/xx_list_gc/" + this.$route.params.num + "?val=单位轴";
                } else if (this.$route.query.val.split('_')[1] == 'indexTime') {
                    this.address = "/index/xxjd/xx_time_project_gc/" + this.$route.params.num + "?val=时间轴";
                }


                this.dataList[0].right_title = result.name;
                this.shiji_schedule = result.shiji_schedule;

                var engineerprocedures = result.engineerprocedures; //普通工序


                var percent = 0;
                console.log(result.insert_dt);
                if (result.duration != 0 && result.insert_dt) {

                    var nowDate = +new Date();
                    var beforeDate = +new Date(result.insert_dt);
                    if (nowDate > beforeDate) {
                        var dayAll = Math.ceil((nowDate - beforeDate) / 1000 / 86400);
                        percent = (dayAll / result.duration * 100).toFixed(2);
                        percent = percent >= 100 ? 100 : percent;
                    }

                } else {
                    percent = 0;
                }
                this.jHstyleW.width = this.jHstyleL.left = percent + '%';

                axios.get('/projects/rest/WXYSet/?engineering_id=' + this.$route.query.val.split('_')[0])
                    .then(res => {
                        console.log(res);
                        var engineerdangers = res.data.results;
                        var len = engineerprocedures.length > engineerdangers.length ? engineerprocedures.length : engineerdangers.length; //穿插放置
                        for (let i = 0; i < len; i++) { //穿插放置
                            if (engineerdangers[i]) {
                                engineerdangers[i].danger = "危大";
                                engineerdangers[i].background = "red";
                                engineerdangers[i].name = engineerdangers[i].FAMC; //普通工序与危大工序字段不一样
                                if (engineerprocedures[2 * (i + 1) - 1]) {
                                    engineerprocedures.splice(2 * (i + 1) - 1, 0, engineerdangers[i]);
                                } else {
                                    engineerprocedures.push(engineerdangers[i]);
                                }
                            } else {
                                break;
                            }
                        }
                        // console.log(engineerprocedures);
                        if (engineerprocedures.length != 0) {
                            engineerprocedures.forEach(value => {
                                console.log(value);
                                var col = value.background || 'gre';
                                this.gx.push(
                                    // left_title: value.name,
                                    // right_title: value.danger || '工序'
                                    [value.name, value.danger || '工序', col, value.id]
                                );

                            })

                        } else {
                            that.content = "无数据"
                            that.$refs.c1.showMsg();
                        }
                        that.flagLoad = false;

                    })

                // var engineerdangers = result.engineerdangers; //危大工序
            })
        this.jdt('#sliderTracksj', '#sliderHandlersj', '#sliderValuesj', '#sliderInnersj');
        this.jdt('#sliderTrackjh', '#sliderHandlerjh', '#sliderValuejh', '#sliderInnerjh');




    }
}
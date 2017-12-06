const general_situation = {

    template: `
        <div class="general_situation h_all">
            <navigation :title="title" :address="back_address"></navigation>
            <scroll :data="flagCh" class="center_content overhid">
                <div>
                    <form class="form_submit">
                        <div class="weui_panel">
                            <div class="weui_panel_hd white size17">合作单位</div>
                            <div class="weui-flex" v-for="(value,index) in unit_info">
                                <div class="weui-flex-item size15 white">
                                    {{value.unit}}
                                </div>
                                <div class="weui-flex-item white">
                                    <div class="weui_cell_bd weui_cell_primary">
                                        <input class="weui_input rig"  type="text"   :name="value.name" autocomplete="off" :value="value.company" v-model="unit_info[index].company"> 
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                        <div class="weui_cells">
                            <div class="weui_cell trans decor" >
                                <div class="weui_cell_bd weui_cell_primary">
                                    <p >基本信息</p>
                                </div>
                            </div>
                            <div class="weui-flex decor" v-for="value in infomation">
                                <div class="weui-flex-item size15">
                                    {{value.title}}
                                </div>
                                <div class="weui-flex-item">
                                    <div class="weui_cell_bd weui_cell_primary">
                                        <input class="weui_input rig"  type="text"  v-model.trim="value.result" :name="value.name" autocomplete="off" > 
                                        
                                    </div>
                                </div>
                            </div>
                            <date-select :date="end_value" :sel="0" :sec_title="'开工时间'" :con="'开工时间'"  :id="'startTime'" :name=" 'KGRQ' "></date-select>
                            <div class="weui-flex decor write" v-for="(value,index) in infomation_rest" > 
                                <div class="weui-flex-item size15">
                                    {{value.title}}
                                </div>
                                <div class="weui-flex-item">
                                    <div class="weui_cell_bd weui_cell_primary size15 ">
                                        <input class="weui_input rig"  type="text"  v-model.trim="value.result"  :name="value.name" autocomplete="off">
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="weui_btn_area">
                            <a href="javascript:" id="btn" class="weui_btn weui_btn_primary"  @click="keep_data">保存修改</a>
                        </div>
                    </form>

                    <div class="weui_panel">
                        <div class="weui_panel_hd white size17">建筑概况</div>
                        <div class="weui_panel_bd">
                            <div class="weui_media_box weui_media_text white">
                                <p class="weui_media_desc space size15">建筑学是研究建筑及其环境的学科,建筑学是一门横跨工程技术和人文艺术的学科。</p>
                            </div>
                        </div>
                    </div>
                    <div class="weui_panel">
                        <div class="weui_panel_hd size17">结构概况</div>
                        <div class="weui_panel_bd">
                            <div class="weui_media_box weui_media_text">
                                <p class="weui_media_desc space size15">建筑学是研究建筑及其环境的学科,建筑学是一门横跨工程技术和人文艺术的学科。</p>
                            </div>
                        </div>
                    </div>
                    <div class="white_color">
                            <submit-img :name="'效果图' "  :relatetype="'XM'" :relateid="project_id" :id=" 'xg' " :imgValue="xgImg" :imgtype="'1'"></submit-img>

                            <submit-img :name="'场布图' " :relatetype="'XM'" :relateid="project_id" :id=" 'cb' " :imgValue="cbImg" :imgtype="'2'"></submit-img>

                            <submit-img  :name="'结构图' "  :relatetype="'XM'" :relateid="project_id"  :id=" 'jg' " :imgValue="jgImg" :imgtype="'3'"></submit-img>
                                
                    </div>
                   
                </div>
            </scroll>
            <success_msg :content="content" ref="c1"></success_msg>
        </div>
    `,

    data() {
        return {
            name: '效果图',
            end_value: '',
            imgValue: {
                ['效果图']: [],
                ['场布图']: [],
                ['结构图']: []
            },
            imageTypeOne: '1',
            title: '工程概况', //标题
            back_address: '', //回退地址
            unit_info: [{
                unit: '管理单位',
                company: '',
                name: 'gldw'
            }, {
                unit: '建设单位',
                company: '',
                name: 'jsdw'
            }, {
                unit: '设计单位',
                company: '',
                name: 'sjdw'
            }, {
                unit: '勘察单位',
                company: '',
                name: 'kcdw'
            }, {
                unit: '监理单位',
                company: '',
                name: 'jldw'
            }, {
                unit: '总包单位',
                company: '',
                name: 'zbdw'
            }],
            infomation: [{ title: '面积(m²)', result: '', name: 'area' },
                { title: '造价(万元)', result: '', name: 'price' },
                { title: '深度(m)', result: '', name: 'deep' },
                { title: '高度(m)', result: '', name: 'height' }
            ],
            infomation_rest: [{
                title: '单体数量',
                result: '',
                name: 'danti_nums',
            }, {
                title: '安全目标',
                result: '',
                moRen: '请填写安全目标',
                name: 'safe_target'
            }, {
                title: '质量目标',
                result: '',
                moRen: '请填写质量目标',
                name: 'quality_target'
            }, {
                title: '环保目标',
                result: '',
                moRen: '请填写环保目标',
                name: 'environment_target'
            }, {
                title: '合同目标',
                result: '',
                moRen: '请填写合同目标',
                name: 'pact_target'
            }, {
                title: '文明目标',
                result: '',
                moRen: '请填写文明施工目标',
                name: 'culture_target'
            }, {
                title: '项目目标',
                result: '',
                moRen: '请填写项目目标',
                name: 'project_target'
            }, ],
            // id: 1, //工程id
            project_id: '',
            submitImg: '',
            submit_address: '/projects/rest/projectfile/',
            content: '',
            xgImg: [],
            cbImg: [],
            jgImg: [],

        }
    },
    components: {
        navigation,
        submitImg,
        dateSelect,
        success_msg,
        scroll
    },
    computed: {
        flagCh() {
            return this.$store.state.commonModules.flagCh;
        }
    },
    methods: {
        keep_data() {
            const dataArr = $('.form_submit').serializeArray();
            console.log(dataArr);
            let obj = {};
            dataArr.forEach((value, index) => {
                obj[value.name] = value.value;
            })
            if (obj.area == "") {
                this.content = "请填写面积";
                this.$refs.c1.showMsg();
                return;
            } else if (obj.price == "") {
                this.content = "请填写造价";
                this.$refs.c1.showMsg();
                return;
            } else if (obj.KGRQ == "") {
                this.content = "请填写开工时间";
                this.$refs.c1.showMsg();
                return;
            } else if (obj.danti_nums == "") {
                this.content = "请填写单体数量";
                this.$refs.c1.showMsg();
                return;
            }
            console.log(obj);
            axios.put('/projects/rest/project/' + this.$route.params.num.split('_')[1] + '/', obj)
                .then(res => {
                    this.content = "修改成功";
                    this.$refs.c1.showMsg();
                })
        },
        getData(address) {
            axios.get(address)
                .then(res => {
                    console.log(res);
                    var count = res.data.results;
                    console.log(count);
                    if (count.length != 0) {
                        count.forEach(value => {
                            console.log(value);
                            if (value.imgtype == 1) {
                                this.xgImg.push({
                                    src: '/' + value.filepath + value.filename,
                                    id: value.id
                                });
                            } else if (value.imgtype == 2) {
                                this.cbImg.push({
                                    src: '/' + value.filepath + value.filename,
                                    id: value.id
                                });
                            } else {
                                this.jgImg.push({
                                    src: '/' + value.filepath + value.filename,
                                    id: value.id
                                });
                            }
                        })
                    }
                    this.$store.commit('commonModules/changeFlag');
                })
        },
    },
    mounted() {
        // console.log(this.$route);
        const no_data = this.$store.state.commonModules.no_data,
            that = this;
        this.back_address = '/index/a_project/' + this.$route.params.num;
        $('.center_content').height($(window).height() - $('.weui-header').height());
        var id = this.$route.params.num.split('_')[1];
        this.project_id = id;
        console.log(this.$route);
        axios.get('/projects/rest/project/' + id + '/')
            .then(res => {
                this.$store.commit('commonModules/changeFlag');
                const result = res.data;
                this.infomation[0].result = result.area;
                this.infomation[1].result = result.price;
                this.infomation[2].result = result.deep;
                this.infomation[3].result = result.height;
                this.infomation_rest[0].result = result.danti_nums;
                this.infomation_rest[1].result = result.safe_target;
                this.infomation_rest[2].result = result.quality_target;
                this.infomation_rest[3].result = result.environment_target;
                this.infomation_rest[4].result = result.pact_target;
                this.infomation_rest[5].result = result.culture_target;
                this.infomation_rest[6].result = result.project_target;
                this.unit_info[0].company = result.gldw;
                this.unit_info[1].company = result.jsdw;
                this.unit_info[2].company = result.sjdw;
                this.unit_info[3].company = result.kcdw;
                this.unit_info[4].company = result.jldw;
                this.unit_info[5].company = result.zbdw;
                console.log(this.unit_info);
                this.end_value = result.KGRQ; //开工时间
            })


        this.getData('/projects/rest/projectfile/?project=' + id);
    }
}
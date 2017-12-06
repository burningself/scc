const danger_info = {
    template: `
        <div class="danger_info h_all">
            <navigation :title="title" :address="address"></navigation>
            <scroll class="danger_info_content overhid" :data="flagCh">
                <div>
                    <form class="weui_cells sub_data">                  
                        <div class="weui_cell no_access right_project">
                            <div class="weui_cell_bd weui_cell_primary">
                                <p class="size15">方案名称</p>
                            </div>
                            <div class="size15 weui_cell_ft">{{scheme}}</div>
                        </div> 

                        <date-select :date="project" :sel="1" :sec_title="'所属工程'" :con="'所属工程'" :id=" 'engeeringname' " :name="'engeeringname'" :type_selector="engeeringname_array"></date-select>

                        <date-select :date="subentry" :sel="1" :sec_title="'下拉分项'" :con="'下拉分项'" :id=" 'subentry_all' " :name="'subentry'" :type_selector="subentry_array"></date-select>
                        <date-select :date="submit_result" :sel="1" :sec_title="'是否交底'" :con="'是否交底'" :id=" 'jiaodi' " :type_selector="result_selector" :name="'jiaodi_status'"></date-select> 
                        <date-select :date="date" :sel="0" :sec_title="'实施日期'" :con="'实施日期'" :id=" 'data_insert' " :name="'xcssrq'"></date-select>   
                        <date-select :date="jsdate" :sel="0" :sec_title="'结束日期'" :con="'结束日期'" :id=" 'js_insert' " :name="'xcjsrq'"></date-select>   
                        <div class="weui_cell no_access">
                            <div class="weui_cell_bd weui_cell_primary">
                                <p class="size15">危大论证</p>
                            </div>
                            <div class="weui_cell_ft size15" @click="check">(点击查看)</div>
                        </div> 
                        <date-select :date="danger_level" :sel="1" :sec_title="'危大级别'" :con="'危大级别'" :id=" 'level' " :type_selector="result_level" :name="'sfzjlz'"></date-select>
                        <div class="weui_cell no_access">
                            <div class="weui_cell_bd weui_cell_primary">
                                <p class="size15">编制人</p>
                            </div>
                            <div class="weui_cell_ft size15">{{ compiling_personnel }}</div>
                        </div>
                        <div class="weui_cell no_access right_project">
                            <div class="weui_cell_bd weui_cell_primary">
                                <p class="size15">流程审批状态</p>
                            </div>
                            <div class="weui_cell_ft size15">{{process_approval}}</div>
                        </div> 
                        <div class="weui_cell no_access">
                            <div class="weui_cell_bd weui_cell_primary">
                                <p class="size15">审批意见</p>
                            </div>
                            <div class="weui_cell_ft size15" @click="check_opinion">(点击查看)</div>
                        </div>
                        <div class="weui_cell no_access">
                            <div class="weui_cell_bd weui_cell_primary">
                                <p class="size15">附件信息</p>
                            </div>
                            <div class="weui_cell_ft size15" @click="check_accessory">(点击查看)</div>
                        </div>  


                        <div class="weui_btn_area" @click="keep_data"><a href="javascript:" id="btn" class="weui_btn weui_btn_primary">保存修改</a></div>
                        <div class="white_color">
                            <submit-img :name="'上传监控' "  :relatetype="'WD'"  :relateid="project_id" :id=" 'jk'" :imgtype="'2'" :imgValue="jkImg"></submit-img>
                            <submit-img :name="'上传附件' "  :relatetype="'WD'" :relateid="project_id" :id=" 'fj'"  :imgtype="'1'" :imgValue="fjImg"></submit-img>
                        </div>
                    </form>
                </div>              
            </scroll>
            <success_msg :content=" content " ref="c1"></success_msg>
        </div>
    `,
    data() {
        return {
            title: "危大详情",
            danger_name: '', //危大名称
            scheme: '', //方案
            project: '', //所属工程
            subentry: '', //分项
            submit_result: '', //是否提交
            date: '', //日期
            jsdate: "", //结束日期
            danger_argument: '', //危大论证
            danger_level: '', //危大级别
            compiling_personnel: '', //编制人
            result_level: ['重大危险源', '一般危险源'],
            subentry_all: {}, //所有的分项
            subentry_array: [],
            jiaodi_status: '',
            result_selector: ['否', '是'], //交底未交底
            danger_level_selector: { //等级制
                '是': '重大危险源',
                '否': '一般危险源'
            },
            engeeringname_array: [],
            engeeringname_obj: {},
            address: '', //顶部返回地址
            schedule: '',
            sfzdwxy: '',
            branch_engeering_id: '',
            submitImg: '',
            imgValue: {
                1: [],
                2: []
            },
            submit_address: '/projects/rest/projectfile/',
            project_id: '',
            content: '',
            process_approval: '', //流程审批状态
            FAID: '',
            jkImg: [],
            fjImg: [],
        }
    },
    components: {
        navigation,
        submitImg,
        success_msg,
        dateSelect,
        scroll
    },
    computed: {
        flagCh() {
            return this.$store.state.commonModules.flagCh;
        }
    },
    methods: {
        check() {
            const query = this.$route.query.val; //请求危大详情的id
            this.$router.push({ path: '/danger_argument/' + this.$route.params.id, query: { val: query } })
        },
        check_opinion() { //查看审批意见
            if (!this.FAID) {
                this.content = "正在加载中";
                this.$refs.c1.showMsg();
                return;
            } else {
                this.$router.push({ path: '/check_opinion/' + this.$route.params.id, query: { val: this.$route.query.val + '|' + this.FAID } });
            }

        },
        check_accessory() { //查看附件信息
            if (!this.FAID) {
                this.content = "正在加载中";
                this.$refs.c1.showMsg();
                return;
            } else {
                this.$router.push({ path: '/check_accessory/' + this.$route.params.id, query: { val: this.$route.query.val + '|' + this.FAID } });
            }
        },
        keep_data() {
            const dataArr = $('.sub_data').serializeArray(),
                that = this,
                danger = this.danger_level_selector,
                att = ['所属工程', '下拉分项', '是否交底', '实施日期', '结束日期', '危大级别'];
            let obj = {},
                id,
                subentry_all = that.subentry_all,
                flag = true;


            // var attr = ['subentry', 'jiaodi_status', 'xcssrq', 'xcjsrq', 'sfzjlz']
            dataArr.every((value, index) => {
                if (value.value == "") {
                    this.content = '请填写' + att[index];
                    this.$refs.c1.showMsg();
                    flag = false;
                    return false;
                }
                obj[value.name] = value.value;
                return true;
            })

            if (flag) {
                console.log(obj);
                obj['xcssrq'] = obj['xcssrq'] + 'T00:00:00';
                obj['xcjsrq'] = obj['xcjsrq'] + 'T00:00:00';
                for (var attr in danger) {
                    if (danger[attr] == obj['sfzjlz']) {
                        obj['sfzjlz'] = attr;
                    }
                }
                obj.schedule = this.schedule;
                for (var attr in subentry_all) {
                    if (subentry_all[attr] == obj.subentry) {
                        id = attr;
                    }
                }
                obj.engineering = this.engeeringname_obj[obj.engeeringname];
                obj.branch_engeering = "/projects/rest/branchengineering/" + id + "/";
                console.log(obj);
                axios.put('/projects/rest/WXYSet/' + this.$route.query.val.split('_')[0] + '/', obj)
                    .then(res => {
                        this.content = "保存成功";
                        this.$refs.c1.showMsg();
                    })
                    .catch(() => {
                        this.content = "保存失败"
                        this.$refs.c1.showMsg();
                    })
            }


        }
    },
    mounted() {

        console.log(this.$route);

        $('.danger_info_content').height($(window).height() - $('.weui-header').height());
        const that = this,
            spl = this.$route.query.val.split('_'),
            paramsId = this.$route.params.id.split('_'),
            queryId = spl[0], //请求危大详情的id
            date = spl[1]; //返回对应日期
        let reg = /^[0-9]+.?[0-9]*$/; //判断返回对应的日期或者工程名称是否包含数字
        this.project_id = queryId;


        axios.get('/projects/rest/WXYSet/' + queryId)
            .then(res => {
                console.log(res);
                var result = res.data || '';
                this.danger_name = result.btmc || ''; //危大名称
                this.scheme = result.FAMC || ''; //方案
                this.project = result.engeeringname || ''; //所属工程
                this.branch_engeering_id = result.branch_engeering_id || '';
                this.subentry = result.branch_engeering_name || result.branch_engeering_parent_name || result.branch_engeering_parent_parent_name || ''; //分项
                this.submit_result = result.jiaodi_status || ''; //交底是否
                this.jiaodi_status = result.jiaodi_status || '';
                this.date = result.xcssrq ? result.xcssrq.split('T')[0] : ''; //日期
                this.jsdate = result.xcjsrq ? result.xcjsrq.split('T')[0] : ""; //结束日期
                this.sfzdwxy = result.sfzdwxy || '';
                this.danger_level = result.sfzjlz ? this.danger_level_selector[result.sfzjlz] : '一般危险源'; //
                this.compiling_personnel = result.bzr || ''; //编制人
                this.schedule = result.schedule || '';
                this.FAID = result.FAID || '';
                axios.get('/projects/rest/engineering/?project_id=' + result.project_id)
                    .then(res => {
                        console.log(res);
                        var result = res.data.results;
                        if (result.length != 0) {
                            result.forEach(value => {
                                console.log(value);
                                this.engeeringname_array.push(value.name);
                                this.engeeringname_obj[value.name] = value.url;
                            })
                        }
                    })
                $.ajax({
                    url: '/projects/getProjectSpStatus/',
                    data: {
                        'jsfa_id': result.FAID
                    },
                    type: 'post',
                    success: function(res) {
                        that.process_approval = res.spstatus || '暂无数据';
                    }
                })

                // $.ajax({
                //     url: '/projects/getProjectSpyj/',
                //     data: {
                //         'jsfa_id': result.FAID
                //     },
                //     type: 'post',
                //     success: function(res) {
                //         console.log(res);
                //     }
                // })
                if (spl[1] == 0) {
                    this.address = "/index/danger_project/" + this.$route.params.id.split('_')[0] + '_' + result.project_id + '/danger_project_list/?val=' + result.engeeringname + '|' + this.$route.params.id.split('_')[1] + '_' + result.BZRQ.split('T')[0].slice(0, -3); //头部返回地址
                } else if (spl[1] == 1) {
                    this.address = "/index/danger_control/" + this.$route.params.id.split('_')[0] + '_' + result.project_id + "/engineering_shaft/" + this.$route.params.id.split('_')[1] + "?val=工程轴";
                } else if (spl[1].indexOf('-') > 0) {
                    this.address = "/index/danger_control/" + this.$route.params.id.split('_')[0] + '_' + result.project_id + "/date_project/" + this.$route.query.val.split('_')[1] + "?val=时间轴"
                } else if (spl[1] == "indexUnit") {
                    this.address = "/index/weida/wd_gc_sg/" + this.$route.params.id.split('_')[0] + '_' + result.project_id + '_' + this.$route.params.id.split('_')[1] + "?val=单位轴"
                } else if (spl[1] == "indexTime") {
                    this.address = "/index/weida/wd_time_project_gc_sg/" + result.project_id + '_' + this.$route.params.id + "?val=时间轴";
                } else if (spl[1] == "graphic") {
                    this.address = "/graphic_progress/" + this.$route.params.id.split('_')[0] + '_' + result.project_id + '?val=' + this.$route.params.id.split('_')[1] + '_0'
                }

            })
            //所属分项
        axios.get('/projects/loadBranchEngineerings/', { dataType: 2 })
            .then(res => {
                res.data.engineerlist.forEach(value => {
                    this.subentry_all[value.id] = value.name;
                })
                for (var attr in this.subentry_all) {
                    this.subentry_array.push(this.subentry_all[attr])
                }
            })

        axios.get('/projects/rest/dangerengineeringfile/?danger_id=' + queryId)
            .then(res => {
                var count = res.data.results;
                if (count.length != 0) {
                    count.forEach(value => {
                        if (value.filetype == 2) {
                            this.jkImg.push({
                                src: '/' + value.filepath + value.filename,
                                id: value.id
                            });
                            console.log(this.jkImg);
                        } else {
                            this.fjImg.push({
                                src: '/' + value.filepath + value.filename,
                                id: value.id
                            });
                        }
                    })

                }
                this.$store.commit('commonModules/changeFlag');
            })

    }
}
const add_gx = {
    template: `
        <div class="process_details unit_project addProject">
             <navigation :title="title" :address="address" ref="c2"></navigation>
             <scroll class="add_gx overhid">
                <form class="form_data">
                    <div class="weui_cells">       
                        <div class="weui_cell">
                            <div class="weui_cell_hd" style="font-size:15px !important"><label for="" class="weui_label">名称</label></div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <input class="weui_input" type="text"   name="name" autocomplete="off" v-model.trim="name">  
                            </div>     
                        </div>   
                        <date-select 
                            :name="value.name"
                            :sel="value.sel" 
                            :sec_title="value.title" 
                            :con="value.title"  
                            :id="value.start_name" 
                            :type_selector=" value.type_selector "
                            v-for="value in selector">
                        </date-select>  
                        <div class="weui_cell" v-for="value in sec_other">
                            <div class="weui_cell_hd size15"><label for="" class="weui_label" >{{ value.title }}</label></div>
                            <div class="weui_cell_bd weui_cell_primary">
                                <input class="weui_input" type="text"  :name="value.name" autocomplete="off" v-model.trim="value.value">  
                            </div>     
                        </div> 

                        <date-select 
                            :name=" fxName "
                            :sel="fx.sel" 
                            :sec_title="fx.title" 
                            :con="fx.title"  
                            :id="fx.start_name" 
                            :type_selector="fx.type_selector ">
                        </date-select>  

                    </div>
                    <div class="weui_btn_area">
                        <a class="weui_btn weui_btn_primary" href="javascript:" id="btn" @click="keep_data">添加新工序</a>
                    </div>
                </form>
             </scroll>
            <success_msg :content=" content " ref="c1"></success_msg>
        </div>
    `,
    data() {
        return {
            name: '',
            title: '添加工序',
            address: '',
            content: '',
            selector: [
                { name: 'addtime', sel: 0, title: '开始日期', start_name: 'gx_start_name', type_selector: '' },
                { name: 'end_dt', sel: 0, title: '结束日期', start_name: 'gx_end_name', type_selector: '' },
                { name: 'gxtype', sel: 1, title: '类型', start_name: 'gx_type', type_selector: [] },
                { name: 'status', sel: 1, title: '状态', start_name: 'shig_type', type_selector: [] }
            ],
            sec_other: [
                { title: '编制', name: 'bianzhi', value: '' },
                { title: '监控', name: 'jiankong', value: '' },
            ],
            fx: {
                sel: 1,
                sec_title: '绑定分项',
                title: "分项设置",
                start_name: 'gx_fx',
                type_selector: []
            },
            fxName: 'branch_engeering',
            subentry_all: {}, //分项
            flagBack: true, //是否跳转回去
        }
    },
    methods: {
        keep_data() {
            if (this.flagBack) {
                this.flagBack = false;
                const result = $('.form_data').serializeArray(),
                    att = ['名称', '开始日期', '结束日期', '类型', '状态', '编制', '监控', '分项设置'],
                    gxType = this.$store.state.moduleProsure.gx;

                let flag = true,
                    obj = {},
                    fenx;
                result.every((v, i) => {
                    if (v.value == "") {
                        console.log(i);
                        this.content = att[i] + '不能为空';
                        this.$refs.c1.showMsg();
                        this.flagBack = true;
                        flag = false;
                        return false;
                    }
                    return true;
                })

                if (flag) {
                    const shig = this.$store.state.moduleProsure.sg;
                    result.forEach(value => {
                        obj[value.name] = value.value
                    });

                    for (var a in gxType) {
                        if (gxType[a] == obj['gxtype']) {
                            obj['gxtype'] = a;
                        }
                    }
                    for (var b in shig) {
                        if (shig[b] == obj['status']) {
                            obj['status'] = b;
                        }
                    }
                    for (var attr in this.subentry_all) {
                        if (this.subentry_all[attr] == obj.branch_engeering) {
                            fenx = "/projects/rest/branchengineering/" + attr + "/";
                        }
                    }
                    console.log(fenx);
                    obj.branch_engeering = fenx;
                    console.log(this.$route.query.val.split('|')[1]);
                    if (this.$route.query.val.indexOf('|') >= 0) {
                        obj.engineering = "/projects/rest/engineering/" + this.$route.query.val.split('|')[1].split('_')[0] + "/"
                    } else if (this.$route.query.val.split('_')[0] == 0 || this.$route.query.val.split('_')[0] == 1) {
                        obj.engineering = "/projects/rest/engineering/" + this.$route.query.val.split('_')[1] + "/"
                    } else if (this.$route.query.val.split('_')[0].indexOf('-') >= 0) {
                        obj.engineering = "/projects/rest/engineering/" + this.$route.query.val.split('_')[1] + "/"
                    } else {
                        obj.engineering = "/projects/rest/engineering/" + this.$route.query.val.split('_')[0] + "/"
                    }
                    axios.post('/projects/rest/ProcedureSet/', obj)
                        .then(res => {
                            this.content = "添加成功";
                            this.$refs.c1.showMsg();
                            this.$refs.c2.index_back();
                        })
                        .catch(() => {
                            this.content = "添加失败";
                            this.$refs.c1.showMsg();
                        })
                }
            } else {
                this.content = "请勿重复提交";
                this.$refs.c1.showMsg();
            }

        }
    },
    components: {
        navigation,
        dateSelect,
        inputLook,
        success_msg,
        scroll
    },
    mounted() {
        console.log(this.$route.query);
        this.$store.commit('commonModules/getHeight', '.add_gx');
        this.selector[2].type_selector = this.$store.state.moduleProsure.gxArr;
        this.selector[3].type_selector = this.$store.state.moduleProsure.sgArr;
        const route = this.$route,
            query = route.query.val.split('_'),
            params = route.params.id,
            query0 = query[0],
            query1 = query[1];
        console.log(query0);
        console.log(route.query.val.indexOf('|') >= 0);
        if (query0 == 0) { //最外层工序单位轴跳转过来的
            this.address = "/index/gxbk/gx_list_gc_gxList/" + params + '_' + query1 + '?val=单位轴';
        } else if (query0 == 1) { //最外层工序时间轴跳转过来的
            this.address = "/index/gxbk/gx_time_project_gc_gxList/" + params + '_' + query1 + '?val=时间轴';
        } else if (route.query.val.indexOf('|') >= 0) { //返回单位工程下重点工序中的时间轴中的
            this.address = "/index/important_gx/" + params + '?val=' + route.query.val.split('|')[0] + '|' + route.query.val.split('|')[1].split('_')[0];
        } else if (query0.indexOf('-') >= 0) { //返回单位工程下重点工序
            this.address = "/index/add_important_gx/" + params + '?val=' + query[0] + '_' + query[1];
        } else { //返回项目下的工序管控的工程轴
            this.address = "/index/managementand_and_control/" + params + '_' + query[1] + "/procedure_project_line/" + query[0] + '?val=工程轴';
        }

        axios.get('/projects/loadBranchEngineerings/', { dataType: 2 })
            .then(res => {
                res.data.engineerlist.forEach(value => {
                    this.fx.type_selector.push(value.name);
                    this.subentry_all[value.id] = value.name;
                })
            })
            .catch(() => {
                this.content = "请求数据失败";
                this.$refs.c1.showMsg();
            })
    }
}
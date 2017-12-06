const process_details = {
    template: `
        <div class="process_details unit_project addProject ">
             <navigation :title="'工序详情'" :address="address"></navigation>
             <scroll class="process_deta overhid">
                <form class="sub_mit">
                    <div class="weui_cells"> 
                        <input-look :left_title="dataList[0].left_title" :right_title="dataList[0].right_title" class="size15"></input-look>
                        <input-look :left_title="dataList[1].left_title" :right_title="dataList[1].right_title" class="right_project size15"></input-look>
                        <input-look :left_title="dataList[2].left_title" :right_title="dataList[2].right_title" class="right_project size15"></input-look>
                        <date-select :date="type_value" :sel="1" :sec_title="'所属分项'" :con="'所属分项'" :type_selector="type_selector" :id="'type_name'" :name="fxName"></date-select>  
                        <date-select :date="stateValue" :sel="1" :sec_title="'工序状态'" :con="'工序状态'"  :type_selector="result_state_select" :id="'state_name'" :name=" 'status' "></date-select>  
                        <input-look :left_title="dataList[3].left_title" :right_title="dataList[3].right_title" class="size15"></input-look>
                        <date-select :date="start_value" :sel="0" :sec_title="'开始日期'" :con="'开始日期'"  :id="'start_name'" :name="'insert_dt'"></date-select>
                        <date-select :date="end_value" :sel="0" :sec_title=" '结束日期'" :con=" '结束日期'"  :id="'end_name'" :name="'end_dt'"></date-select>  
                        <date-select :date="gx_value" :sel="1" :sec_title="'工序类型'" :con="'工序类型'"  :id=" 'gx_name'" :type_selector="result_gxType" :name="'gxtype'"></date-select>  
                    </div>
                    <div class="weui_btn_area">
                        <a class="weui_btn weui_btn_primary" href="javascript:" id="btn" @click="keep_data">保存修改</a>
                    </div>
                </form>
            </scroll>
            <success_msg :content=" content " ref="c1"></success_msg>
        </div>
    `,
    data() {
        return {
            address: '',
            dataList: [
                { left_title: '工序名称', right_title: '' },
                { left_title: '所属项目', right_title: '' },
                { left_title: '所属工程', right_title: '' },
                { left_title: '项目公司', right_title: '' },
            ],
            type_value: [],
            fxName: '',
            stateValue: '',
            state_select: {
                1: '未施工',
                2: '施工中',
                3: '已施工'
            },
            result_gxType: [],
            result_state_select: [],
            type_selector: [], //所属分项下面的值
            start_value: '',
            end_value: '', //结束日期默认值
            gx_value: '',
            gxType: {
                1: '重点',
                2: "关键",
                3: "难点"
            },
            subentry_all: {},
            content: '',
        }
    },
    components: {
        navigation,
        inputLook,
        dateSelect,
        success_msg,
        scroll
    },
    methods: {
        keep_data() {
            const result = $('.sub_mit').serializeArray(),
                obj = {},
                that = this,

                type = ['分项', '工序状态', '开始日期', '结束日期', '工序类型'];
            let flag = true;
            result.every((value, index) => {
                if (value.value == "") {
                    this.content = '请填写' + type[index];
                    this.$refs.c1.showMsg();
                    flag = false;
                    return false;
                }
                return true;
            })
            if (flag) {
                result.forEach(value => {
                    obj[value.name] = value.value;
                })
                for (var attr in this.state_select) {
                    if (this.state_select[attr] == obj['status']) {
                        obj['status'] = attr;
                    }
                }
                console.log(result);
                for (var attr in this.gxType) {
                    if (this.gxType[attr] == obj['gxtype']) {
                        obj['gxtype'] = attr;
                    }
                }
                // alert(this.fxName == "")
                // if (this.fxName == "") {
                //     obj.branch_engeering_name = $('#type_name').val();
                // }

                for (var attr in this.subentry_all) {
                    if (this.subentry_all[attr] == $('#type_name').val()) {
                        obj.branch_engeering = "/projects/rest/branchengineering/" + attr + "/";
                    }
                }
                obj.engineering = '/projects/rest/engineering/' + this.$route.params.id.split('_')[1] + '/';

                axios.put('/projects/rest/ProcedureSet/' + this.$route.query.val.split('_')[0] + '/', obj)
                    .then(res => {
                        this.content = '保存成功';
                        this.$refs.c1.showMsg();
                    })
            }


        }
    },
    mounted() {
        $('.process_deta').height($(window).height() - $('.navigation').height());
        for (var attr in this.state_select) {
            this.result_state_select.push(this.state_select[attr]);
        }
        for (var attr in this.gxType) {
            this.result_gxType.push(this.gxType[attr]);
        }
        const route = this.$route.query.val;
        routeArr = route.split('_');

        axios.get('/projects/loadBranchEngineerings/', { dataType: 2 })
            .then(res => {
                res.data.engineerlist.forEach(value => {
                    this.subentry_all[value.id] = value.name;
                })
                for (var attr in this.subentry_all) {
                    this.type_selector.push(this.subentry_all[attr]);
                }
            })

        axios.get('/projects/rest/ProcedureSet/' + routeArr[0])
            .then(res => {

                const result = res.data;
                this.dataList[0].right_title = result.name; //工序名称
                this.dataList[1].right_title = result.projectname; //所属项目
                this.dataList[2].right_title = result.engeeringname; //所属工程
                this.dataList[3].right_title = result.companyname; //项目公司
                this.type_value = result.branch_engeering_name || result.branch_engeering_parent_name || result.branch_engeering_parent_parent_name; //分项默认值
                this.fxName = result.branch_engeering_name ? 'branch_engeering_name' : (result.branch_engeering_parent_name ? 'branch_engeering_parent_name' : (result.branch_engeering_parent_parent_name ? 'branch_engeering_parent_parent_name' : ''));
                this.stateValue = this.state_select[result.status]; //施工状态
                this.start_value = result.insert_dt; //开始日期
                this.end_value = result.end_dt; //结束日期  
                this.gx_value = this.gxType[result.gxtype];
                if (routeArr[1] == 1) {
                    this.address = "/index/managementand_and_control/" + this.$route.params.id.split('_')[0] + '_' + result.project_id + "/procedure_project_line/" + this.$route.params.id.split('_')[1] + "?val=工程轴"
                } else if (routeArr[1].indexOf('-') > 0) {

                    this.address = "/index/managementand_and_control/" + this.$route.params.id + "/specific_gx/" + routeArr[1] + "?val=时间轴";
                } else if (routeArr[1] == 0) {
                    this.address = "/index/add_important_gx/" + this.$route.params.id.split('_')[0] + '_' + result.project_id + "?val=" + result.insert_dt.slice(0, -3) + '_' + this.$route.params.id.split('_')[1];
                } else if (routeArr[1] == "indexUnit") {
                    this.address = "/index/gxbk/gx_list_gc_gxList/" + this.$route.params.id + "?val=单位轴";
                } else if (routeArr[1] == "indexTime") {
                    this.address = "/index/gxbk/gx_time_project_gc_gxList/" + this.$route.params.id + "?val=时间轴";
                } else if (routeArr[2] == "graphic-progress") {
                    this.address = "/graphic_progress/" + this.$route.params.id.split('_')[0] + '_' + routeArr[1] + "?val=" + this.$route.params.id.split('_')[1] + '_0';
                }
            })
    }
}
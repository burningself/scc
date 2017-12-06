const basic_content = {
    template: `
        <div class="basic_content unit_project">
            <navigation :title="title" :address="address"></navigation>
            <form class="form_sub"> 
                <div class="weui_cells size15"> 
                    <date-select :date="name" :sel="1" :sec_title="'名称'" :con="'名称'" :id=" 'name' " :name="'name'" :type_selector="engeeringname_array"></date-select>
                    <date-select :date="date" :sel="0" :sec_title="sec_title" :con="sel" :id=" fName " :name="'insert_dt'"></date-select>
                    <div class="weui-flex  write" v-for="(value,index) in dataList" > 
                        <div class="weui-flex-item size">
                            {{value.title}}
                        </div>
                        <div class="weui-flex-item">
                            <div class="weui_cell_bd weui_cell_primary size ">
                                <input class="weui_input rig"  type="number"  v-model.trim="value.result" pattern="[0-9]*" :name="value.name" autocomplete="off">
                            </div>
                        </div>
                    </div>
                    <date-select :date="type_value" :sel="1" :sec_title="type_title" :con="type" :id=" typeName " :type_selector="type_selector" :name="'struct_type'"></date-select>
                    <div class="weui-flex  write"> 
                        <div class="weui-flex-item size">
                            工期
                        </div>
                        <div class="weui-flex-item">
                            <div class="weui_cell_bd weui_cell_primary size ">
                                <input class="weui_input rig"  type="number" v-model.trim="gq"   pattern="[0-9]*"  name="duration" autocomplete="off">
                            </div>
                        </div>
                    </div>  
                </div>
                <div class="weui_btn_area">
                    <a class="weui_btn weui_btn_primary" href="javascript:" id="btn" @click="keep_data">保存修改</a>
                </div>
            </form>
            <success_msg :content=" content " ref="c1"></success_msg>
        </div>
    `,
    data() {
        return {
            gq: '',
            title: '工程内容',
            address: '',
            sel: '日期',
            fName: 'date', //日期选择的id
            name: '',
            dataList: [
                { title: '面积', result: '', name: 'area' },
                { title: '高度', result: '', name: 'height' },
            ],
            engeeringname_array: [],
            engeeringname_obj: {},
            name: '', // 名称
            date: '', //日期
            type: '结构类型', //结构类型
            sec_title: '选择日期', //级联选择器表头
            type_value: '', //结构类型默认值
            type_title: '结构类型',
            typeName: 'typeName',
            type_all: {
                1: '砖木结构',
                2: '砖混结构',
                3: '钢筋混凝土结构',
                4: '钢结构'
            },
            type_selector: ['砖木结构', '砖混结构', '钢筋混凝土结构', '钢结构'],
            content: ''
        }
    },
    components: {
        navigation,
        inputLook,
        dateSelect,
        success_msg
    },
    methods: {
        keep_data() {

            const dataArr = $('.form_sub').serializeArray();
            console.log(dataArr);
            let obj = {};
            dataArr.forEach((value, index) => {
                if (value.name == "struct_type") {
                    let num = 0;
                    Object.keys(this.type_all).forEach((v, i) => {
                        if (this.type_all[v] == value.value) {
                            num = v;
                        }
                    })
                    obj['struct_type'] = num
                } else {
                    obj[value.name] = value.value;
                }
            })
            obj.project = '/projects/rest/project/' + this.$route.params.num.split('_')[1] + '/';
            obj.url = this.engeeringname_obj[obj.name];
            console.log(obj);

            if (obj.insert_dt == '请选择') {
                this.content = "请选择日期"
                this.$refs.c1.showMsg();
            } else if (obj.area == "") {
                this.content = "请填写面积";
                this.$refs.c1.showMsg();
            } else if (obj.height == "") {
                this.content = "请填写高度";
                this.$refs.c1.showMsg();
            } else {
                this.$route.query.val = obj.name + '|' + this.$route.query.val.split('|')[1];
                this.address = '/index/project_in_methods/' + this.$route.params.num + '?val=' + this.$route.query.val;

                console.log(obj);

                axios.put('/projects/rest/engineering/' + this.$route.query.val.split('|')[1] + '/', obj)
                    .then(res => {
                        this.content = "保存成功";
                        this.$refs.c1.showMsg();
                    })
            }

        }
    },
    mounted() {
        console.log(this.$route);
        this.address = '/index/project_in_methods/' + this.$route.params.num + '?val=' + this.$route.query.val; //返回地址
        axios.get(' /projects/rest/engineering/' + this.$route.query.val.split('|')[1])
            .then(res => {
                console.log(res);
                var result = res.data;
                this.name = result.name;
                console.log(result.duration);
                this.gq = result.duration;
                this.date = result.insert_dt || '请选择';
                this.dataList[0].result = result.area;
                this.dataList[1].result = result.height;
                this.type_value = result.struct_type ? this.type_all[result.struct_type] : '';
                var project_id = result.project.split('/project/')[1].slice(0, -1);
                return axios.get('/projects/rest/engineering/?project_id=' + project_id)
            })
            .then(res => {
                var resu = res.data.results;
                if (resu.length != 0) {
                    resu.forEach(value => {
                        this.engeeringname_array.push(value.name);
                        this.engeeringname_obj[value.name] = value.url;
                    })
                }
            })
    }
}
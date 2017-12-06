const addProject = {
    template: `
        <div class="addProject">
            <div class="weui-header white">
                <div class="weui-header-left" @click="index_back">
                    <a class="icon icon-109 f-white"></a>
                </div> 
                <h1 class="weui-header-title">添加工程</h1> 
            </div>
            <form id="form" >
                <div class="weui_cells weui_cells_form ">              
                            <div class="weui_cell">
                                <div class="weui_cell_hd"><label for="" class="weui_label">名称</label></div>
                                <div class="weui_cell_bd weui_cell_primary">
                                    <input class="weui_input" type="text" placeholder="请填写工程名称" v-model.trim="project_id" name="name" autocomplete="off">  
                                </div>     
                            </div>   
                        <div class="weui_cell">
                                <div class="weui_cell_hd"><label for="date" class="weui_label">日期</label></div>
                                <div class="weui_cell_bd weui_cell_primary">
                                    <input class="weui_input" type="text" v-model="project_time" id="date" placeholder="点击选择日期" name="insert_dt">                        
                                </div>                       
                            </div>       
                
                        <div class="weui_cell">
                                <div class="weui_cell_hd"><label for="" class="weui_label">面积</label></div>
                                <div class="weui_cell_bd weui_cell_primary">
                                    <input class="weui_input" type="number" pattern="[0-9]*" placeholder="请填写面积" v-model.trim="project_area" name="area"  autocomplete="off">                              
                                </div>                       
                        </div> 
                
                        <div class="weui_cell">
                                <div class="weui_cell_hd"><label for="" class="weui_label">高度</label></div>
                                <div class="weui_cell_bd weui_cell_primary">
                                    <input class="weui_input" type="number" pattern="[0-9]*" placeholder="请填写高度" v-model.trim="project_height" name="height"  autocomplete="off">                                 
                                </div>
                        </div>                
                        <div class="weui_cell">
                                <div class="weui_cell_hd"><label for="binding" class="weui_label">结构类型</label></div>
                                <div class="weui_cell_bd weui_cell_primary">
                                    <input class="weui_input" type="text"  id="binding" placeholder="点击绑定分项" name="binding" v-model="project_type"  autocomplete="off">                        
                                </div>   
                        </div>   
                        <div class="weui_cell">
                                <div class="weui_cell_hd"><label for="" class="weui_label">工期</label></div>
                                <div class="weui_cell_bd weui_cell_primary">
                                    <input class="weui_input" type="number" pattern="[0-9]*" placeholder="请填写工期" v-model.trim="duration" name="duration"  autocomplete="off">                                 
                                </div>
                        </div>   
                </div>
            
                <div class="weui_btn_area">
                    <a id="reset" href="javascript:" class="weui_btn weui_btn_primary" @click="add">添加新工程</a>
                </div>
            </form>
            <success_msg :content="content" ref="c1"></success_msg>
        </div>
    `,
    data() {
        return {
            duration: '',
            project_id: '',
            project_area: '',
            project_height: '',
            project_type: '',
            project_time: '',
            content: '', //添加或失败
            flag: true,
        }
    },
    methods: {
        index_back() {

            this.$router.push({ path: '/index/unit_project/' + this.$route.params.num, query: { val: this.$route.query.val } });
        },
        add() {
            if (this.flag) {
                this.flag = false;
                if (this.project_id == "") {
                    this.content = "名称不能为空"
                    this.$refs.c1.showMsg();
                    this.flag = true;
                    return false;
                } else if (this.project_time == "") {
                    this.content = "日期不能为空";
                    this.$refs.c1.showMsg();
                    this.flag = true;
                    return false;
                } else if (this.project_area == "") {
                    this.content = "面积不能为空";
                    this.$refs.c1.showMsg();
                    this.flag = true;
                    return false;
                } else if (this.project_height == "") {
                    this.content = "高度不能为空";
                    this.$refs.c1.showMsg();
                    this.flag = true;
                    return false;
                } else if (this.project_type == "") {
                    this.content = "类型不能为空";
                    this.$refs.c1.showMsg();
                    this.flag = true;
                    return false;
                }
                var obj = {};
                $('form').serializeArray().forEach(value => {
                    obj[value.name] = value.value;
                    obj.project = "http://sgrz.bimsheng.com/projects/rest/project/" + this.$route.params.num.split('_')[1] + '/';
                })
                obj.duration = obj.duration || 0;
                axios.post('/projects/rest/engineering/', obj)
                    .then(res => {
                        this.content = "添加成功";
                        this.$refs.c1.showMsg();
                        this.index_back();
                    })
                    .catch(function() {
                        this.content = "添加失败";
                        this.$refs.c1.showMsg();
                    })
            }

        }
    },
    components: {
        msg,
        success_msg
    },
    mounted() {
        $("#date").datetimePicker({ title: "选择日期", m: 1 });
        $("#time").datetimePicker({ title: "选择日期时间", min: '2015-12-10', max: '2050-10-01' });
        $("#time2").picker({
            title: "选择时间",
            cols: [{
                    textAlign: 'center',
                    values: (function() {
                        var arr = [];
                        for (var i = 0; i <= 23; i++) { arr.push(i < 10 ? '0' + i : i); }
                        return arr;
                    })()

                },
                {
                    textAlign: 'center',
                    values: (function() {
                        var arr = [];
                        for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                        return arr;
                    })(),
                }
            ]
        });

        $("#binding").picker({
            title: "结构类型",
            toolbarCloseText: '确定',
            cols: [{
                textAlign: 'center',
                values: ['砖木结构', '砖混结构', '钢筋混凝土结构', '刚结构'],
                displayValues: ['砖木结构', '砖混结构', '钢筋混凝土结构', '刚结构'],
            }]
        });
    }
}
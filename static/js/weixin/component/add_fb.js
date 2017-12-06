const add_fb = {
    template: `
         <div class="weui_msg_img hide add_fb" id="msg4">
            <div class="weui_msg_com">
                    <div onclick="$('#msg4').fadeOut();" class="weui_msg_close">
                        <i class="icon icon-95"></i>
                    </div>
                    <div class="weui_msg_src">
                        <div class="weui_cells">
                            <form class="fb_title fb">
                                <div class="weui_cell">
                                    <div class="weui_cell_hd"><label for="" class="weui_label">分部名称</label></div>
                                    <div class="weui_cell_bd weui_cell_primary">
                                        <input class="weui_input" type="text" placeholder="请输入" name="name" autocomplete="off" v-model.trim="name">  
                                    </div>     
                                </div>   
                                <div class="weui_cell">
                                    <div class="weui_cell_hd"><label for="" class="weui_label">预算工作量m³/(m²)</label></div>
                                    <div class="weui_cell_bd weui_cell_primary">
                                        <input class="weui_input" type="text" placeholder="请输入" name="designwork" autocomplete="off" v-model.trim="designwork" > 
                                    </div>     
                                </div>  
                                <div class="weui_cell">
                                    <div class="weui_cell_hd"><label for="" class="weui_label">实际工作量m³/(m²)</label></div>
                                    <div class="weui_cell_bd weui_cell_primary">
                                        <input class="weui_input" type="text" placeholder="请输入" name="completework" autocomplete="off"  v-model.trim="completework">  
                                    </div>     
                            </div>   
                            </form> 
                            <a href="javascript:;" class="weui_btn" @click="addData">提交分部</a>
                        </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            name: "", //名称
            designwork: '', //预算工作量
            completework: '', //实际工作量
        }
    },
    props: ['id'],
    methods: {
        addData() {
            var obj = {};
            obj.name = this.name;
            obj.designwork = this.designwork;
            obj.completework = this.completework;
            obj.record = "/projects/rest/Records/" + this.id + '/';

            axios.post('/projects/rest/RecordWorks/', obj)
                .then(res => {
                    this.$emit('getFbData', res);
                })
            this.name = "";
            this.designwork = "";
            this.completework = "";
            $('#msg4').fadeOut();
        }
    },
}
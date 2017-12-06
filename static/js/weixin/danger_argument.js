const danger_argument = {
    template: `
        <div class=" danger_argument">
            <navigation :title="title" :address="address"></navigation>
            <div class="danger_argument_content">
                <div class="weui_cells">                  
                    <div class="weui_cell no_access">
                        <div class="weui_cell_bd weui_cell_primary">
                            <p>
                              <span>论证内容</span>
                            </p>
                        </div>
                    </div> 
                </div>
                <div class="danger_introduce">
                    <p>
                      <span>第一条</span>
                      <span>方案完整性</span>
                    </p>
                    <p>专项方案内容是否完整、可行;</p>
                    <p>
                      <span>第二条</span>
                      <span>方案书规范</span>
                    </p>
                    <p>专项方案计算书和验算依据是否符合有关标准规范;</p>
                    <p>
                      <span>第三条</span>
                      <span>方案符合实际</span>
                    </p>
                    <p>安全施工的基本条件是否满足现场实际情况</p>
                    <p>专项方案经论证后,专家组应当提交论证报告,对论证内容提出明确的意见,并在论证报告上签字。该报告作为专项方案修改完善的指导意见</p>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            title: '危大论证',
            address: '', //返回地址
        }
    },
    components: {
        navigation
    },
    mounted() {
        const query = this.$route.query.val; //id
        this.address = '/danger_info/' + this.$route.params.id + '?val=' + query;
    }
}
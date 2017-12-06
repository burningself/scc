const check_accessory = {
    template: `
        <div class="check_opinion h_all">
            <navigation :title="title" :address="address"></navigation>
            <success_msg :content="'没有关联附件数据'" ref="c1"></success_msg>
        </div>
    `,
    data() {
        return {
            title: '附件信息',
            address: '',
        }
    },
    components: {
        navigation,
        success_msg
    },
    mounted() {
        this.address = "/danger_info/" + this.$route.params.id + "?val=" + this.$route.query.val.split('|')[0];
        this.$refs.c1.showMsg();
    }
}
const myTask = {
    template: `
        <di class="message">
            <navigation :title="title" :address="address"></navigation>
            <div class="project_online_content message_content">
                
            </div>
        </di>
    `,
    data() {
        return {
            title: '填写日志',
            address: '/index/wxIndex',
        }
    },
    components: {
        navigation,
        inputLook
    }
}
const message = {
    template: `
        <div class="message">
            <navigation :title="title" :address="address"></navigation>
            <scroll :data="cont" class="message_title overhid">
                <div class="message_content" >
                    <div v-for="value in cont" @click="message_show(value)">
                        <div class="weui-flex">
                            <div class="weui-flex-item">
                                <div class="placeholder">
                                <div :style="{ backgroundImage:'url(/img/message_'+ value.message.type +'.png)' }" class="type_icon" >
                                </div>
                                </div>
                            </div>
                            <div class="weui-flex-item">
                                <div class="placeholder">
                                    <p class="size15 f-white">{{ value.message.left_title }}</p>
                                    
                                </div>
                            </div>
                            <div class="weui-flex-item">
                                <div class="placeholder size15 f-white ">
                                    {{ value.message.right_title }}
                                    <i class="iconfont size15" :class="{ 'icon-weidu':value.message.read===0,'icon-ready':value.message.read===1}" slot="jd"></i>
                                </div>
                            </div>
                        </div>
                        <div class="cont">
                            {{value.content}}
                        </div>
                    </div>
                </div>
                <success_msg :content="'没有消息'" ref="c1"></success_msg>
            </scroll>
        </di>
    `,
    // <input-look :left_title="value.left_title" :right_title="value.right_title" v-for="value in message" :icon="value.type"  @click.native="message_show(value)" >
    //                     <p slot="dis">{{ value.mes }}</p>
    //                     <i class="iconfont size15" :class="{ 'icon-weidu':value.read===0,'icon-ready':value.read===1}" slot="jd"></i>
    //                 </input-look>
    data() {
        return {
            title: '我的消息',
            address: '',
            message: [],
            content: '',
            cont: []
        }
    },
    components: {
        navigation,
        inputLook,
        success_msg,
        scroll,
    },
    methods: {
        message_show(value, event) {
            var value = value.message;
            this.content = value.mes;
            value.read = 1;
            this.$store.commit('commonModules/getCookie', 'csrftoken');
            axios.put('/user/rest/message/' + value.id + '/', {
                    csrftoken: this.$store.state.commonModules.cs_cookie,
                    opened: 1,
                    content: value.content,
                    title: value.title,
                    touser: value.touser
                })
                .then(res => {
                    this.$router.push('/index/a_project/mes_' + value.projectId)
                })
        }
    },
    mounted() {
        this.$store.commit('commonModules/getHeight', '.message_title')
        axios.get('/user/rest/message/')
            .then(res => {
                var result = res.data;
                console.log(result);
                if (result.length != 0) {

                    result.forEach(val => {
                        axios.get(val.project)
                            .then(dat => {
                                this.cont.push({
                                    message: {
                                        mes: val.content,
                                        right_title: val.createtime.split('T')[0],
                                        left_title: dat.data.PrjName,
                                        type: val.msgtype,
                                        read: val.opened,
                                        id: val.id,
                                        content: val.content,
                                        title: val.title,
                                        touser: val.touser,
                                        projectId: dat.data.id
                                    },
                                    content: val.content
                                })
                            })
                    })

                } else {
                    this.$refs.c1.showMsg();
                }
            })
    }
}
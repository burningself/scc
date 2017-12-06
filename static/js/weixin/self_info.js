const self_info = {
    template: `
        <div class="self_info">
            <div class=" self_info_title ">
                <p class="tran-xy"></p>
            </div>
            <div class="self_info_content">
                <div class="weui_cells">
                    <input-look :left_title="value.left_title" :right_title="value.right_title" v-for="value in info">
                    </input-look>
                </div>
                <div class="weui_cells">
                    <input-look :left_title="value.left_title" :right_title="value.right_title" v-for="value in info_talk">
                    </input-look>
                </div>
                <div class="weui_cells">
                    <input-look :left_title="value.left_title" :right_title="value.right_title" v-for="value in info_work">
                    </input-look>
                </div>
                <a href="/user/logout/" class="weui_btn backBtn">退出登录</a>
            </div>
        </div>
    `,
    data() {
        return {
            info: [
                { left_title: '登录名:', right_title: '' },
                { left_title: '真实姓名:', right_title: '' },
            ],
            info_talk: [
                { left_title: '电话:', right_title: '' },
            ],
            info_work: [

                { left_title: '所属部门:', right_title: '' },
            ]
        }
    },
    components: {
        inputLook
    },
    mounted() {
        var userName = localStorage.getItem('login_name');
        console.log(userName);
        axios.get('/user/rest/user/?username=' + userName)
            .then(res => {
                console.log(res);
                const result = res.data[0];
                this.info[0].right_title = userName;
                this.info[1].right_title = result.truename;
                this.info_talk[0].right_title = result.contract;
                return axios.get(result.department)
            })
            .then(res => {
                this.info_work[0].right_title = res.data.name;
            })
    }
}
const submitImg = {
    template: `
            <div class="weui_cell">
                <div class="weui_cell_bd weui_cell_primary">
                    <div class="weui_uploader">
                        <div class="weui_uploader_hd weui_cell">
                            <div class="weui_cell_bd weui_cell_primary size17">{{name}}</div>
                            <div class="weui_cell_ft"></div>
                        </div>
                        <div class="weui_uploader_bd">
                            <ul class="weui_uploader_files" id="img2">
                                <li  class="weui_uploader_file weui_uploader_status" v-for="(value,index) in wximages.showId" :style="styleObject(value.src)" @click="showImg(value.src)">
                                    <div class="weui_uploader_status_content" @click.stop="dele(value,index)"><i class="weui_icon_cancel"></i></div>
                                </li>
                            </ul>
                            <div class="weui_uploader_input_wrp" :id="idName" @click="sub_img">
                                    
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    `,
    data() {
        return {
            currurl: '',
            wxvoices: {
                localId: '',
                serverId: '',
                translateDesc: '',
                showuploadvoice: 0,
            },
            picUrl: '',
            wximages: {
                localId: [],
                serverId: [],
                showId: []
            },
            wxconfig: {
                appid: '',
                timestamp: '',
                nonceStr: '',
                signature: '',
                jsapi_ticket: '',
            },
            srcArr: [],
            path: 'http://sgrz.bimsheng.com'
        }
    },
    props: ['name', 'imgtype', 'relateid', 'relatetype', 'imgValue', 'submit_address', 'idName'], //relatetype是属于哪个页面的上传图片，relateid='s属于哪个项目',imgtype=属于哪种类型的上传图片
    watch: {
        'imgValue': 'change',
    },
    methods: {
        styleObject(value) {
            return {
                backgroundSize: '100%',
                backgroundImage: 'url(' + this.path + value + ')'
            }
        },
        change() {
            const that = this;
            this.wximages.showId = this.imgValue;
            if (this.imgValue.length != 0) {
                this.imgValue.forEach(value => {
                    this.srcArr.push(that.path + value.src);
                })
            }
            console.log(this.imgValue);
        },
        showImg(src) {
            const that = this;
            this.wxpreviewImage(that.path + src, that.srcArr);
        },
        //提交图片
        sub_img() {
            this.wxChooseImage(this.imgtype, this.relateid, this.relatetype);
        },
        //删除图片
        dele: function(e, i) {
            var that = this;
            that.wximages.serverId.splice(i, 1);
            that.wximages.showId.splice(i, 1);
            var address;
            if (this.$route.path.indexOf('danger_info') > 0) {
                address = "/dangerengineeringfile/";
            } else {
                address = "/projectfile/";
            }
            axios.delete("/projects/rest" + address + e.id + '/ ')
                .then(res => {
                    this.$store.commit('commonModules/changeFlag');
                })

        },
        //获取签名等必须参数
        wxcall() {
            // console.log(this);
            // console.log(this.wxChooseImage);
            this.currurl = window.location.href;
            // console.log(this.currurl);
            var that = this;
            axios.get('http://sgrz.bimsheng.com/user/fetchTK/?urlpath=' + that.currurl).then(res => {
                const data = res.data.config;
                console.log(data);
                this.wxconfig.appid = data.appid;
                this.wxconfig.timestamp = data.timestamp;
                this.wxconfig.signature = data.signature;
                this.wxconfig.nonceStr = data.nonceStr;
                this.wxconfig.jsapi_ticket = data.jsapi_ticket;
                console.log(this.wxconfig);
                this.wxinit();
            })
        },

    },
    mounted() {
        this.wxcall();
    }
}
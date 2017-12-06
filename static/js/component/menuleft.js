const menuleft = {
    template: `
        <div class="pro-left">
            <Menu :theme="theme3" active-name="1" @on-select="route">   
              
                    <MenuItem :name="index" v-for="(value,index) in titleLeft">
                        <Icon :type="value.img"></Icon>
                            {{ value.title }}
                    </MenuItem>
            </Menu>
        </div>
    `,
    // <Icon type="arrow-graph-up-right"></Icon>
    data() {
        return {
            theme3: 'dark',
            companyList: [], //公司列表
            titleLeft: [{ //左侧栏信息
                'title': '项目在线',
                'img': 'android-desktop',
                'href': '/'
            }, {
                'title': '危大警示',
                'img': 'android-warning',
                'href': '/warning'
            }, {
                'title': '形象进度',
                'img': 'arrow-graph-up-right',
                'href': '/graphic/changeList'
            }, {
                'title': '工序把控',
                'img': 'calendar',
                'href': '/process_control'
            }, {
                'title': '质量检验',
                'img': 'checkmark-circled',
                'href': '/test'
            }, {
                'title': '四令签发',
                'img': 'edit',
                'href': '/four_order'
            }]
        }
    },
    methods: {
        route(name) {
            this.$router.push(this.titleLeft[name].href);
        }
    },
    mounted() {
        // var that = this;
        // $.ajax({
        //     url: '/projects/rest/company',
        //     success: function(data) {
        //         that.companyCount = data.count;
        //         data.results.forEach(value => {
        //             that.companyList.push(value.name);
        //         })
        //     }
        // })
    }
}
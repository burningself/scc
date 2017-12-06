const index = {
    template: `
        <div class="page tabbar js_show">
            <div class="page__bd" style="height: 100%;">
                <div class="weui-tab">
                    <div class="weui_tab_bd">
                        <router-view @first="pop"></router-view>
                    </div>
                    <div class="weui-tabbar">
                        <router-link :to="{path:value.link}" class="weui-tabbar__item" v-for="value in footValue" @click.native="changeFoot(value.name)" 
                                     :class="{ 'weui-bar__item_on':value.name==footChange }">
                            <span style="display: inline-block;position: relative;">
                                <i class="iconfont size19" :class="[value.class]"></i>
                              
                            </span>
                            <p class="weui-tabbar__label size14">{{value.name}}</p>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            footValue: [{
                class: 'icon-home',
                showFlag: false,
                name: '主页',
                count: "",
                link: '/'
            }, {
                class: 'icon-xiaoxi',
                showFlag: true,
                name: '消息',
                count: 8,
                link: '/index/message'
            }, {
                class: 'icon-woderenwu',
                showFlag: false,
                name: '我的收藏',
                count: "",
                link: '/index/myTask'
            }, {
                class: 'icon-gerenxinxi',
                showFlag: false,
                name: '个人信息',
                count: "",
                link: '/index/self_info'
            }],
            footChange: '主页', //切换底部高亮显示
        }
    },
    methods: {
        changeFoot(value) {
            console.log(value);
            this.footChange = value
        },
        pop() {
            this.footChange = '主页';
        }
    },
}
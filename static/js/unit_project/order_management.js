const order_management = {
    template: `
                    <div class="diary_unit">
                        <projectContent @increment="incrementTotal"></projectContent>
                        <div class="diary_unit_select">
                            <div class="diary_unit_select_title">
                                <h4>{{ projectFirst }}</h4>
                            </div>
                            <div class="diary_unit_select_info key_process">
                                <div class="stop" v-if="flag">
                                    <loading></loading>
                                </div>
                                <ul class="clearfix">
                                    <li v-for="value in order_management_info">
                                    <router-link :to="value.link">
                                        <div class="changImg center-xy">
                                            <img :src="value.img">
                                            <p class="sL">{{value.title}}</p>
                                        </div>
                                    </router-link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
    `,
    data() {
        return {
            order_management_info: [{
                'title': '沉桩令',
                'img': '../img/沉桩令.png',
                'link': '/project3/unit_project/piling_order/',
            }, {
                'title': '挖土令',
                'img': '../img/挖土令.png',
                'link': '/project3/unit_project/digging_order/',
            }, {
                'title': '浇灌令',
                'img': '../img/浇灌令.png',
                'link': '/project3/unit_project/Irrigation_order/',
            }, {
                'title': '吊装令',
                'img': '../img/吊装令.png',
                'link': '/project3/unit_project/Irrigation_order/',
            }],
            projectFirst: '',
            par: '',
            flag: true
        }
    },
    methods: {
        fetchId() {
            const par = this.$route.query.num;
            console.log(this.flag);
            this.order_management_info.forEach(value => {
                // value.link += '/' + par;
                const valueArr = value.link.split('/'); //可以用正则匹配替换优化
                valueArr[valueArr.length - 1] = par
                value.link = valueArr.join('/');
            })
        },
        incrementTotal(value) {
            this.projectFirst = value.split('-')[0];
            console.log(!this.flag);
            if (this.flag === false) {
                console.log(this.flag);
                return false;
            }
            this.flag = !value.split('-')[1];
            console.log(this.flag);
        },
    },
    components: {
        projectContent, //左边工程组件
        loading
    },
    watch: {
        "$route": "fetchId"
    },
    mounted() {
        const that = this;
        if (localStorage.getItem('diary')) {
            par = localStorage.getItem('diary');
            console.log(par);
            that.order_management_info.forEach(value => {
                // value.link += '/' + par;
                const valueArr = value.link.split('/'); //可以用正则匹配替换优化
                valueArr[valueArr.length - 1] = par
                value.link = valueArr.join('/');
            })
        } else {
            this.$store.dispatch('projectData').then(data => {
                console.log(data);
                par = data.results[0].id;
                // localStorage.setItem('diaryId', par)  
                that.order_management_info.forEach(value => {
                    // value.link += '/' + par;
                    const valueArr = value.link.split('/'); //可以用正则匹配替换优化
                    valueArr[valueArr.length - 1] = par
                    value.link = valueArr.join('/');
                })

            })
        }
    }
}
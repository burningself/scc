const unit_project_index = {
    template: `
        <div class="diary_unit_select_info">
                    <div class="stop" v-if="flag">
                        <loading></loading>
                    </div>
                    <ul>
                       <li v-for="value in unit_info">
                            <router-link :to="value.link">
                                        <div class="changImg center-xy">
                                            <img :src="value.img">
                                            <p class="sL">{{value.title}}</p>
                                        </div>
                            </router-link>
                       </li> 
                    </ul>
        </div>
    `,
    data() {
        return {
            unit_info: [{
                'title': '基本内容',
                'img': '../img/content.png',
                'link': '/project3/unit_project/basic_content/',
            }, {
                'title': '形象进度',
                'img': '../img/graphic.png',
                'link': '/project3/unit_project/graphic_progress/',
            }, {
                'title': '危大工程',
                'img': '../img/danger.png',
                'link': '/project3/unit_project/project_control/',
            }, {
                'title': '重点工序',
                'img': '../img/important.png',
                'link': '/project3/unit_project/important_pro/',
            }, {
                'title': '四令管理',
                'img': '../img/manage.png',
                'link': '/project3/unit_project/order_management/',
            }, {
                'title': '施工日志',
                'img': '../img/diary.png',
                'link': '/project3/unit_project/project_diary/',
            }],
        }
    },
    components: {
        loading
    },
    props: ['flag'],
    methods: {
        fetchId() {
            const par = this.$route.query.num;
            console.log(par);
            // localStorage.setItem('diaryId', par);
            // this.unit_info[this.unit_info.length - 1].link = '/project3/unit_project/project_list/' + par;
            this.unit_info.forEach(value => {
                // value.link += '/' + par;
                const valueArr = value.link.split('/'); //可以用正则匹配替换优化
                valueArr[valueArr.length - 1] = par
                value.link = valueArr.join('/');
            })
        },
        // flagChange() {
        //     console.log(this.flag);
        //     this.flag = this.$store.state.flag
        // }
    },
    watch: {
        "$route": "fetchId",
        // "this.$store.state.flag": "flagChange"
    },
    computed: {
        // flag() {
        //     return this.$store.getters.flagChange;
        // }
    },
    mounted() {
        console.log(this.flag);
        const that = this;
        let par;
        // console.log(localStorage.getItem('diaryId'));
        if (localStorage.getItem('diary')) {
            par = localStorage.getItem('diary');
            console.log(par);
            that.unit_info.forEach(value => {
                // value.link += '/' + par;
                const valueArr = value.link.split('/'); //可以用正则匹配替换优化
                valueArr[valueArr.length - 1] = par
                value.link = valueArr.join('/');
            })
        } else {
            console.log(1);
            this.$store.dispatch('projectData').then(data => {
                console.log(data);
                par = data.results[0].id;
                // localStorage.setItem('diaryId', par)  
                that.unit_info.forEach(value => {
                    // value.link += '/' + par;
                    const valueArr = value.link.split('/'); //可以用正则匹配替换优化
                    valueArr[valueArr.length - 1] = par
                    value.link = valueArr.join('/');
                })

            })
        }


    }
}
var unit_project = {
    template: `
        <div class="diary_unit">
            <projectContent @increment="incrementTotal"></projectContent>

            <div class="diary_unit_select">
                <div class="diary_unit_select_title">
                   <h4>{{ projectFirst }}</h4>
                </div>
                <router-view :flag="flag"></router-view>
            </div>
        </div>
    `,
    // <div class="project-map-list">
    //                                 <ul class="center-y">
    //                                     <li>A工程</li>
    //                                 </ul>
    //                             </div>
    data() {
        return {
            projectFirst: '',
            flag: true //遮罩层状态
        }
    },
    components: {
        projectContent
    },
    methods: {
        incrementTotal(value) {
            this.projectFirst = value.split('-')[0];
            if (this.flag === false) { //因为点击会多次触发，只是第一次触发时调用
                console.log(this.flag);
                return false;
            }
            this.flag = !value.split('-')[1]; //让路由遮罩层隐藏的变量
            console.log(this.flag);
        }
    },

    // methods: {
    //     route(name) {
    //         this.projectFirst = name.split('-')[0];
    //         this.$router.push({ name: 'unit_project_index', query: { num: name.split('-')[1] } })
    //         this.$store.commit('changeProject', name.split('-')[1]);
    //         localStorage.setItem('diary', name.split('-')[1]);
    //     }
    // },
    // created() {
    //     const that = this;
    //     this.$store.dispatch('projectData').then(data => {
    //         console.log(data);
    //         that.projectFirst = data.results[0].name || '';
    //         that.project_List = data.results;
    //         // const idCount = data.results[0].id || 0;
    //         // this.$store.commit('changeProject', idCount)
    //     })
    // },
    mounted() {
        $('.diary_unit').css('height', $(window).height() - $('.title').height() - $('.diary-title').height() - $('.ivu-menu-horizontal').height());
    }
}
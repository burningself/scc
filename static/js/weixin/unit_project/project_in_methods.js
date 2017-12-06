const project_in_methods = {
    template: `
        <div class="project_in_methods">
           <navigation :title="title" :address="address"></navigation>
           <div class="project_in_methods_content">
                <div class="weui_grids">
                    <router-link :to="{name:value.href,query:{ val:index!=1?projectName:xxjd }}" class="weui_grid js_grid" v-for="(value,index) in dataList">
                        <div class="weui_grid_icon"><img :src="value.img" alt=""></div>
                        <p class="weui_grid_label size15">
                            {{ value.title }}
                        </p>
                    </router-link>
                </div>
           </div>  
        </div>
    `,
    // 
    data() {
        return {
            title: '',
            address: '',
            dataList: [{
                img: '/img/pro_detail_icon.png',
                title: '基本内容',
                href: 'basic_content'
            }, {
                img: '/img/pro_unitpro_icon.png',
                title: '形象进度',
                href: 'graphic_progress'
            }, {
                img: '/img/pro_wdgk_icon.png',
                title: '危大工程',
                href: 'danger_line'
            }, {
                img: '/img/pro_gggx_icon.png',
                title: '重点工序',
                href: 'important_gx'
            }, {
                img: '/img/graphic.png',
                title: '施工日记',
                href: 'construction_diary'
            }],
            projectName: '', // 工程名称
            xxjd: '', //形象进度
        }
    },
    components: {
        navigation
    },
    mounted() {
        this.title = this.$route.query.val.split('|')[0];
        this.address = "/index/unit_project/" + this.$route.params.num + '?val=';
        console.log(this.$route);
        this.projectName = this.$route.query.val;
        this.xxjd = this.$route.query.val.split('|')[1] + '_0';
    }
}
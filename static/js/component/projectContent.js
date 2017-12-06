const projectContent = {
    template: `
        <div class="diary_unit_title">
            <div class="diary_unit_search">
                    <input type="text" placeholder="请输入关键字">
                    <Icon type="search"></Icon>
            </div>
            <div class="diary_unit_company">
                <loading v-if="flag"></loading>
                <Menu :theme="theme3" active-name="0" @on-select="route">
                        <MenuItem :name="value.name+'-'+value.id+'-'+index" :key="value.id" v-for="(value,index) in project_List" :title="value.name">
                            <Icon type="document-text"></Icon>
                            {{ value.name }}
                        </MenuItem>
                </Menu>
            </div>
        </div>
    `,
    data() {
        return {
            theme3: 'light',
            project_List: [],
            projectFirst: '',
            flag: true,
            proId: '', //工程id
            proInit: '' //初始化id
        }
    },
    components: {
        loading
    },
    methods: {
        route(name) {
            this.$emit('increment', name.split('-')[0])
                // this.projectFirst = name.split('-')[0];
            console.log(this.$route);
            if (this.$route.path.indexOf('unit_project') >= 0) {
                this.$router.push({ name: 'unit_project_index', query: { num: this.$route.params.num } })
            }


            this.$router.push({ name: this.$route.name, query: { num: name.split('-')[1] } })
            this.$store.commit('changeProject', name.split('-')[1]);

            localStorage.setItem('diary', name.split('-')[1]);

            const index = localStorage.getItem('indexPro') || 0;

            $('.diary_unit_title .ivu-menu li').eq(index).removeClass('ivu-menu-item-active');

            localStorage.setItem('indexPro', name.split('-')[2]); //设置当前高亮的id

        }
    },
    mounted() {
        const that = this;
        this.$store.dispatch('projectData').then(data => {
            console.log(data);
            // that.projectFirst = data.results[0].name || '';
            const index = localStorage.getItem('indexPro') || 0;
            const pro = that.projectFirst = data.results[index].name || '';
            that.proInit = data.results[0].id; //初始化工程id
            that.proId = localStorage.getItem('diary') || data.results[0].id; //从本地获取的id
            console.log(that.proId);
            localStorage.setItem('diary', that.proId); //设置工程id

            that.project_List = data.results;

            that.$emit('increment', pro + '-' + false); //向父级提交工程名称

            that.flag = false;

            // that.$store.dispatch('stop', false); //切换遮罩层状态 

            // that.$emit('increment', false);

            // const idCount = data.results[0].id || 0;
            // this.$store.commit('changeProject', idCount)
            that.$nextTick(function() {
                //刷新保存
                $('.diary_unit_title .ivu-menu li').eq(index).addClass('ivu-menu-item-active');
            })
        });
    },
    beforeDestroy() {
        localStorage.setItem('indexPro', 0)
        localStorage.setItem('diary', this.proInit);
    }
}
const warning = {
    template: `
        <div class="pro_index">
            <search-pro @dataRefresh="changeData"></search-pro>
            <div class="warning_center">
                 <warning_project :comeData="comeData"></warning_project> 
            </div>
        </div>
    `,
    data() {
        return {
            comeData: "",
        }
    },
    components: {
        searchPro,
        warning_project
    },
    methods: {
        //数据处理
        dataHandle(value) {
            const that = this;
            this.data5 = [];
            value.forEach(value => {
                let obj = {};
                obj.date = value.bzrq; //创建日期
                obj.name = value.gcmc; //所属工程
                obj.project = value.fbfxgcmc; //方案名称
                obj.organization = value.bzr; //监控
                obj.jBie = value.Sfzdwxy; //级别

                that.data5.push(obj);
            })
        },
        //子组件项目改变时触发
        changeData(value) {
            console.log(value);
            this.comeData = value;
            // let valuePro = value.split('-')[0]; //公司id
            // let valuePro1 = value.split('-')[1]; //项目id
            // let valuePro2 = value.split('-')[2]; //工程id

            // if (valuePro === '0') { //对公司为空时转换为所有的项目
            //     this.dataHandle(this.proAll); //如果公司为空则转换为所有危大工程
            //     return false;
            // }
            // axios.get('/projects/rest/dangerengineering/?engineering__project__company_id=' + valuePro + '&engineering__project_id=' + valuePro1 + '&engineering_id=' + valuePro2)
            //     .then(res => {
            //         console.log(res.data.results);
            //         this.dataHandle(res.data.results);
            //     })
            //     .catch(err => {
            //         console.log(err);
            //     })
        }
    },
    mounted() {
        // const that = this;
        // axios.get('/projects/rest/dangerengineering/')
        //     .then(res => {
        //         const result = res.data.results
        //         that.proAll = result; //存储所有的危大
        //         that.dataHandle(result);
        //     })
    }

}
const graphic = {
    template: `
        <div class="pro_index graphic">
            <div class="warning_title" >
                <Cascader :data="data0" v-model="value0" @on-change="companyChange"></Cascader> 
            </div>
            <div class="warning_center">
                <router-view :proList="proList"></router-view>
            </div>
        </div>
    `,
    // <search-pro @dataRefresh="changeData" @dataAll="getData"></search-pro>  
    data() {
        return {
            data0: [],
            value0: [],
            proList: "",
            columns6: [{
                    title: '创建日期',
                    key: 'date'
                },
                {
                    title: '所属工程',
                    key: 'name'
                },
                {
                    title: '方案名称',
                    key: 'project',
                },
                {
                    title: '危大编制',
                    key: 'age',
                },
                {
                    title: '危大论证',
                    key: 'age',
                },
                {
                    title: '危大监控',
                    key: 'organization',
                },
                {
                    title: '危大级别',
                    key: 'jBie',
                }
            ],
            dataListAll: {}, //三层数据关系(公司，项目，工程)
            dataAll: null, //保留传过来所有的数据
            dataStart: [], //保留初始化数据
        }
    },
    components: {
        loading,
        searchPro
    },
    methods: {
        // //一进来生成所有的项目
        // getData(value) {
        //     // console.log(value);
        //     this.dataAll = value;
        //     const that = this;
        //     console.log(value);
        //     this.dataListAll = value;


        //         if (result.length != 0) {
        //             result.forEach(value => {
        //                 that.proList.push(value.label);
        //             })
        //         }
        //     })
        //     this.dataStart = that.proList; //保存初始化数据
        // },
        changeData(value) {
            // const that = this;
            // let valuePro = value.split('-')[0]; //公司id
            // let valuePro1 = value.split('-')[1]; //项目id
            // let valuePro2 = value.split('-')[2]; //工程id
            // console.log(valuePro);
            // console.log(valuePro1 != "");
            // this.proList = [];
            // console.log(2222222222222222222);
            // if (valuePro != "" && valuePro1 == "") {
            //         that.proList.push(v.label);
            //     })
            // } else if (valuePro != "" && valuePro1 != "") { //选中公司和项目后显示对应的工程
            //     console.log(this.dataListAll);
            //     this.dataListAll[valuePro].children[valuePro1].children.forEach(value => {
            //         that.proList.push(value.name)
            //     })
            // } else if (valuePro == "" && valuePro1 == "") {
            //     console.log(1111111111111111111111);
            //     console.log(this.dataStart);
            //     this.proList = this.dataStart;
            // }

            // if (valuePro2 != "") {
            //     console.log(value);
            //     this.$router.push({ name: 'danger', params: { num: value } });
            // } else {
            //     this.$router.push({ name: 'changeList', params: { num: value } })
            // }
            // console.log(valuePro);
            // console.log(valuePro1);
            // console.log(valuePro2);
            // if (valuePro === '0') { //对公司为空时转换为所有的项目
            //     this.dataHandle(this.proAll); //如果公司为空则转换为所有危大工程
            //     return false;
            // }


        },

        companyChange(num) {
            this.proList = num[0];
            this.$router.push({ name: 'changeList', params: { num: num[0] } });

        }
        // changeData() {
        //     let valuePro1 = value.split('-')[0]; //项目id
        //     let valuePro2 = value.split('-')[1]; //工程id
        //     if (this.presentProId !== valuePro1) {
        //         this.presentProId = valuePro1;
        //         this.changeProData = true;
        //     } else {
        //         this.changeProData = false;
        //     }
        //     console.log(valuePro1);

        //     if (valuePro1 === '0') { //对项目为空时转换为所有的项目
        //         console.log(999);
        //         this.dataHandle(this.proAll.results); //如果项目为空则转换为所有危大工程
        //         return false;
        //     }
        //     if (valuePro2 === '0') { //对工程为空时转换为项目对应的所有危大工程
        //         console.log(this.proDataList.data.results);
        //         this.dataHandle(this.proDataList.data.results);
        //         return false;
        //     }
        //     //获取相对应的项目下数据
        //     console.log('/projects/rest/dangerengineering/?engineering__project_id=' + valuePro1 + '&engineering_id=' + valuePro2);
        //     axios.get('/projects/rest/dangerengineering/?engineering__project_id=' + valuePro1 + '&engineering_id=' + valuePro2)
        //         .then(res => {
        //             // this.proDataList = res; //存储当前项目下的data数据
        //             if (this.changeProData) {
        //                 this.proDataList = res; //存储当前项目下的data数据
        //             }
        //             // this.proId = value[0]; //存储当前项目id
        //             const that = this;
        //             this.dataHandle(res.data.results);
        //         })
        //         .catch(err => {
        //             console.log(err);
        //         })
        // },
        // progressChange(val, index) {
        //     this.proCli = val; //p标签对应的背景色切换
        //     this.clickIndex = index;
        // },
        // //点击切换不同的第一个p标签背景
        // selectOne(obj) {
        //     var child = obj.currentTarget.parentNode.children[1].children[0].children[0].children[0].children;
        //     console.log(child);
        //     if (child) var firstP = child[0];
        //     console.log(firstP);
        //     this.proCli = firstP.innerText;
        //     this.clickIndex = 0;
        // }
    },
    mounted() {
        const that = this;
        axios.get('/projects/rest/company/')
            .then(res => {
                res.data.results.forEach(value => { //处理三级数据
                    that.dataListAll[value.id] = {
                        label: value.name,
                        value: value.id,
                        children: {}
                    }
                    if (value.projectlist.length != 0) {
                        value.projectlist.forEach(dataValue => {
                            that.dataListAll[value.id].children[dataValue.id] = {
                                children: dataValue.engineertlist,
                                label: dataValue.name,
                                value: dataValue.id
                            };
                        })
                    }
                })
                console.log(this.dataListAll);
                Object.values(this.dataListAll).forEach((value, index) => {
                    const dataList = value.children; //data的数据结构
                    that.data0.push({ //渲染公司
                        label: value.label,
                        value: index
                    })
                })
            })
    }
}
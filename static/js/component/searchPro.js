const searchPro = {
    template: `
        <div class="warning_title" >
            <Cascader :data="data0" v-model="value0" @on-change="companyChange"></Cascader> 
            <Cascader :data="data" v-model="value1" @on-change="change"></Cascader>    
            <Cascader :data="data1" v-model="value2" @on-change="gcChange"></Cascader>
        </div>
    `,
    data() {
        return {
            value0: [],
            value1: [],
            value2: [],
            data0: [],
            data: [],
            data1: [],
            companyId: "", //公司id
            proId: '', //项目Id
            dataListAll: {} //三层数据关系(公司，项目，工程)
        }
    },
    methods: {
        //公司改变数据对应项目发生变化
        companyChange(num) {
            this.data = [];
            console.log(num);
            const that = this;
            that.data = []; //清空工程和项目已选择的
            that.data1 = [];
            this.value1 = [];
            this.value2 = [];
            // console.log(Object.values(this.dataListAll[num].children));
            if (num.length != 0) {
                this.companyId = num[0];
                Object.values(this.dataListAll[num].children).forEach(value => {
                    that.data.push({
                        label: value.label,
                        value: value.value
                    })
                });
            }
            let valueGo = num.length === 0 ? "--" : num[0] + '--'; //选择时对空的处理
            console.log(valueGo.split('-'));
            this.$emit('dataRefresh', valueGo) //改变项目时调用父组件的方法

        },
        //项目改变数据对应发生变化
        change(value) {
            console.log(value[0]);
            const that = this;
            this.data1 = []; //重置工程
            this.value2 = []; //若是项目选择空，则工程也为空
            if (value.length != 0 && this.companyId) {
                this.proId = value[0];
                const results = Object.values(this.dataListAll[this.companyId].children[value[0]].children); //对应项目下的工程
                console.log(results);
                if (results.length != 0) {
                    results.forEach(value => {
                        that.data1.push({
                            label: value.name,
                            value: value.id
                        })
                    })
                }
            }
            let valueGo = value.length === 0 ? this.companyId + '-' + '-' : this.companyId + '-' + value[0] + '-'; //选择时对空的处理 
            this.$emit('dataRefresh', valueGo) //改变项目时调用父组件的方法

        },

        //工程改变对应数据发生变化
        gcChange(value) {
            let valueGo = value.length === 0 ? this.companyId + '-' + this.proId + '-' : this.companyId + '-' + this.proId + '-' + value[0]; //选择时对空的处理
            this.$emit('dataRefresh', valueGo);
        }
    },
    mounted() {
        // console.log(this.$store.state);
        const that = this;
        // const companyList = this.$store.state.companyProje || JSON.parse(localStorage.getItem('companyList'));
        // localStorage.setItem('companyList', JSON.stringify(companyList)); //拿到对应公司对应项目数据，并存储到本地
        // // console.log(Object.keys(companyList));
        // Object.keys(companyList).forEach((value, index) => { //渲染所有的公司
        //     that.data0.push({
        //         label: value,
        //         value: index
        //     });
        // })

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
                this.$emit('dataAll', this.dataListAll);
                Object.values(this.dataListAll).forEach(value => {
                    const dataList = value.children; //data的数据结构
                    that.data0.push({ //渲染公司
                        label: value.label,
                        value: value.value
                    })
                    if (dataList.length != 0) { //渲染项目
                        Object.values(dataList).forEach(v => {
                            that.data.push({
                                label: v.label,
                                value: v.value
                            });
                            if (v.children.length != 0) { //渲染工程
                                v.children.forEach(val => {
                                    that.data1.push({
                                        label: val.name,
                                        value: val.id
                                    })
                                })
                            }
                        })
                    }

                })
            })
    }
}
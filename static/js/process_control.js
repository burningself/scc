const process_control = {
    template: `
        <div class="pro_index">
            <searchPro @dataRefresh="changeData"></searchPro>
            <div class="warning_center">
                    <div class="graphic_check">
                         <gxbk :value="value"></gxbk>
                    </div>
            </div>
        </div>
    `,
    data() {
        return {
            // data1: [],
            // columns1: [{
            //     title: '添加日期',
            //     key: 'addtime'
            // }, {
            //     title: '所属项目',
            //     key: 'projectname'
            // }, {
            //     title: '工序名称',
            //     key: 'name'
            // }, {
            //     title: '工程名称',
            //     key: 'engeeringname'
            // }, {
            //     title: '工程类型',
            //     key: 'gxtype'
            // }, {
            //     title: '工程进度',
            //     key: 'schedule'
            // }],
            // project_type: {
            //     1: '特殊工序',
            //     2: '关键工序',
            //     3: '施工难点'
            // },
            // proAll: [], //所有工序
            value: ""
        }
    },
    components: {
        searchPro,
        gxbk
    },
    methods: {
        changeData(value) {
            console.log(value);
            this.value = value;
            // const that = this;
            // this.data1 = [];
            // let valuePro = value.split('-')[0]; //公司id
            // let valuePro1 = value.split('-')[1]; //项目id
            // let valuePro2 = value.split('-')[2]; //工程id
            // console.log(valuePro1);
            // console.log(valuePro2);
            // if (valuePro === '0') { //对公司为空时转换为所有的项目
            //     this.data1(this.proAll); //如果公司为空则转换为所有危大工程
            //     return false;
            // }
            // axios.get('/projects/rest/engineering/?&project_id=' + valuePro1 + '&id=' + valuePro2)
            //     .then(res => {
            //         console.log(res);
            //         res.data.results.forEach(value => {
            //                 value.engineerprocedures.forEach((v, index) => {
            //                     that.data1.push({
            //                         addtime: v.addtime,
            //                         projectname: v.projectname,
            //                         name: v.name,
            //                         engeeringname: v.engeeringname,
            //                         gxtype: that.project_type[v.gxtype],
            //                         schedule: v.schedule + '%',
            //                         oldIndex: index
            //                     })
            //                 })
            //             })
            //             // console.log(this.data1);
            //         this.data1.sort(function(a, b) {
            //             // console.log(new Date(a.addtime) - new Date(b.addtime) > 0);
            //             return new Date(b.addtime) - new Date(a.addtime);
            //         })
            //     })
            //     .catch(err => {
            //         console.log(err);
            //     })
        }
        // change(value) {

        //     if (value.length == "") {
        //         return false;
        //     }
        //     this.data1 = [];
        //     const that = this;
        //     new Promise(resolve => {
        //         $.ajax({
        //             url: '/projects/rest/engineering/?project_id=' + value[0],
        //             success: function(data) {
        //                 resolve(data);
        //             }
        //         })
        //     }).then((data) => {
        //         console.log(data);
        //         data.results.forEach(value => {
        //             that.data1.push({
        //                 label: value.name,
        //                 value: value.id
        //             })
        //         })
        //     })
        // }
    },
    mounted() {
        // const that = this;
        // axios.get('/projects/rest/engineering/')
        //     .then(res => {
        //         res.data.results.forEach(value => {
        //                 value.engineerprocedures.forEach((v, index) => {
        //                     that.data1.push({
        //                         addtime: v.addtime,
        //                         projectname: v.projectname,
        //                         name: v.name,
        //                         engeeringname: v.engeeringname,
        //                         gxtype: that.project_type[v.gxtype],
        //                         schedule: v.schedule + '%',
        //                         oldIndex: index
        //                     })
        //                 })
        //             })
        //             // console.log(this.data1);
        //         this.data1.sort(function(a, b) {
        //             // console.log(new Date(a.addtime) - new Date(b.addtime) > 0);
        //             return new Date(b.addtime) - new Date(a.addtime);
        //         })
        //         this.proAll = this.data1;
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })
        // var that = this;

        // new Promise(resolve => {
        //     $.ajax({
        //         url: '/projects/rest/project',
        //         success: function(data) {
        //             resolve(data);
        //         }
        //     })
        // }).then(data => {
        //     console.log(data);
        //     data.results.forEach(value => {
        //         let pro = {
        //             label: value.PrjName,
        //             value: value.id
        //         };
        //         that.data.push(pro);
        //     })
        // })

        // var project_type = {
        //     1: '特殊工序',
        //     2: '关键工序',
        //     3: '施工难点'
        // }
        // new Promise(reslove => {
        //         $.ajax({
        //             type: 'get',
        //             url: '/projects/rest/ProcedureSet/',
        //             success: function(data) {
        //                 reslove(data);
        //             }
        //         })
        //     })
        //     .then(data => {
        //         console.log(data);
        //         data.results.forEach((value, index) => {
        //             if (index > 6) {
        //                 return false;
        //             }
        //             var obj = {};
        //             obj.addtime = value.addtime;
        //             obj.projectname = value.projectname;
        //             obj.name = value.name;
        //             obj.engeeringname = value.engeeringname;
        //             obj.gxtype = project_type[value.gxtype];

        //             obj.schedule = value.schedule;
        //             that.data3.push(obj);

        //         })
        //     })
    }
}
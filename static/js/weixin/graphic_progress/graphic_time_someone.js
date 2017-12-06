const graphic_time_someone = {
    template: `
        <scroll :data="listData" class="graphic_time_someone overhid">
            <list :listData="listData" :flagLoad="flagLoad" :date='date'>
                  <span :slot="index" v-for="(value,index) in projectNum" class="weui-badge" style="background:#04be02"> {{value}}</span>
            </list>
            <success_msg :content="'无数据'" ref="c1"></success_msg>
        </scroll>
    `,
    data() {
        return {
            listData: [], //时间
            flagLoad: true,
            date: '',
            timeLine: {},
            projectNum: []
        }
    },
    components: {
        list,
        scroll,
        success_msg
    },
    mounted() {

        this.$store.commit('commonModules/getHeight', '.graphic_time_someone');

        const par = this.$route,
            that = this,
            pId = par.params.num; //项目id
        this.date = par.params.id;
        console.log(this.date);
        axios.get('/projects/rest/engineering/?project_id=' + pId.split('_')[1] + '&insert_dt__isnull!=True')
            .then(res => {
                const result = res.data.results;
                if (result.length != 0) {
                    res.data.results.forEach(value => {
                        var dateArr = value.insert_dt.split('-');
                        var dateTitle = dateArr.slice(0, -1).join('-');
                        if (!that.timeLine[dateTitle]) {
                            that.timeLine[dateTitle] = [];
                        }

                        that.timeLine[dateTitle].push(value);
                    })
                    console.log(this.timeLine);
                    var arr = that.timeLine[this.date];
                    arr.forEach(v => {
                        console.log(v);
                        this.projectNum.push(v.shiji_schedule + '%')
                        this.listData.push({
                            time: v.name, //内容
                            address: '/graphic_progress/' + pId, //地址
                            query: v.id + '_' + this.date //地址参数
                        })
                    })
                    this.flagLoad = false;
                } else {
                    this.$refs.c1.showMsg();
                    this.flagLoad = false;
                }

            })
    }
}
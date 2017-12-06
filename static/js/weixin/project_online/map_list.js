const map_list = {
    template: `
        <scroll :data="flag"  :pullup="pullup"  class="overhid project_map_list unit_list">
            <div style="border:0.5px solid #eaeaea">
                <div class="weui-loadmore" v-if="flagLoad">
                    <i class="weui-loading"></i>
                    <span class="weui-loadmore__tips">正在加载</span>
                </div>
                <div v-for="value,index in listArr" class="p_map">
                    <p class="showAll" @click="showList(value,index)" style="position:relative">
                        {{ value.value }}     
                        <i class="iconfont" style="float:right;margin-right:20px" :class="{'icon-zhankai':value.show,'icon-een':!value.show}"></i>
                        <span class="weui-badge  gre_mum tran-y" >{{value.pNum}}</span>
                    </p>
                    <div class="list_box">
                        <list :listData="value.city"  :date='date'>
                            <span :slot="index" v-for="(value,index) in value.projectNum" class="weui-badge" style="background:#04be02"> {{value}}</span>
                        </list>
                    </div>
                </div>
               
            </div>
            <success_msg :content="content" ref="c1"></success_msg>
        </scroll>
    `,
    data() {
        return {
            boxshow: '',
            date: '',
            listData: [],
            dataAll: {},
            pullup: true,
            page: 1,
            next: true,
            flag: true,
            content: '',
            listArr: [],
            clickFlag: true,
            flagLoad: true
        }
    },
    components: {
        list,
        scroll,
        success_msg
    },
    methods: {
        showList(val, index) {
            console.log(val);
            if (this.clickFlag) {
                this.clickFlag = false;
                const that = this;
                if (val.getData) {
                    this.listArr[index]['getData'] = false;
                    this.listArr[index]['show'] = false;
                    axios.get('/projects/rest/city/?parent__isnull=false&parent=' + val.id)
                        .then(res => {
                            console.log(res);
                            var re = res.data.results;
                            if (re.length != 0) {
                                $('.list_box')[index].style.height = (re.length + 1) * 55 + 'px';
                                this.listArr[index].getData = false;
                                setTimeout(function() {
                                    that.flag = !that.flag;
                                }, 500)
                                this.listArr[index]['count'] = re.length + 1;
                                this.listArr[index]['projectNum'] = [val.quNum];
                                this.listArr[index]['city'] = [];
                                this.listArr[index]['city'].push({
                                    address: '/work_map/' + val.id,
                                    time: val.value + '区',
                                    query: val.value + '_' + 0,
                                })
                                re.forEach(value => {
                                    this.listArr[index]['projectNum'].push(value.project_count);
                                    this.listArr[index]['city'].push({
                                        address: '/work_map/' + value.id,
                                        time: value.name,
                                        query: value.name + '_' + 0,
                                    })
                                })

                            }

                            this.clickFlag = true;
                        })
                } else {
                    if (val.show) {
                        this.clickFlag = false;
                        this.listArr[index]['show'] = false;
                        $('.list_box')[index].style.height = val.count * 55 + 'px';
                        this.listArr[index].getData = false;
                        setTimeout(function() {
                            that.flag = !that.flag;
                        }, 500)
                        this.clickFlag = true;
                    } else {
                        this.clickFlag = false;
                        this.listArr[index]['show'] = true;
                        $('.list_box')[index].style.height = '0px';
                        setTimeout(function() {
                            that.flag = !that.flag;
                        }, 500)
                        this.clickFlag = true;
                    }
                }
            }

        },
        loadMore() {
            var length;
            axios.get('/projects/rest/city?parent__isnull=true&pagesize=1000')
                .then(res => {
                    this.next = res.data.next;
                    console.log(res);
                    const results = res.data.results;
                    if (results.length != 0) {
                        length = results.length;
                        var num = 0;
                        results.forEach((value, index) => {
                            if (!value.parent) {
                                this.listArr.push({
                                    value: value.name,
                                    id: value.id,
                                    city: [],
                                    projectNum: [],
                                    getData: true,
                                    show: true,
                                    pNum: value.project_total_count,
                                    quNum: value.project_count
                                });
                            }
                        })
                        this.flag = !this.flag;
                        this.flagLoad = false;
                    } else {
                        this.content = "没有项目数据";
                        this.$refs.c1.showMsg();
                    }
                })
        }
    },
    mounted() {
        $('.project_map_list').height($(window).height() - $('.weui-header').height() - $('.weui-tabbar').height());
        this.loadMore();
    }
}
const projectList = {
    template: `
        <div class="common">
            <change-tab :infoData="infoData" :backAddress="backAddress"></change-tab>
            <div class="project_online_content">
                <router-view></router-view>
            </div>
        </div>
    `,

    // <div class="common">
    //              <div class=" weui-header "> 
    //                 <div class="weui-header-left"> <a class="icon icon-109 f-white" @click="index_back"></a>  </div>
    //                 <div class="online_navbar">
    //                     <div class="online__item" v-for="value in infoData" :class="{ 'online_navbar_on':value===changeValue}" @click="changeData(value)">
    //                         {{ value }}
    //                     </div>
    //                 </div>
    //             </div>
    //             <div class="project_online_content" >
    //                 <div class=" project_online_first " v-show="show">
    //                     <div class="weui-panel weui-panel_access" v-for="value in listData">
    //                         <div class="weui-panel__ft">
    //                             <router-link :to=" '/index/a_project/'+value.value" class="weui-cell weui-cell_access weui-cell_link" >
    //                                 <i class="iconfont icon-xiangmu"></i>
    //                                 <div class="weui-cell__bd text_hide" >{{ value.label }}</div>
    //                                 <span class="weui-cell__ft"></span>
    //                             </router-link>    
    //                         </div>
    //                     </div>
    //                 </div>
    //                 <div class="project_online_second" v-show='!show'>
    //                 </div>
    //             </div>
    //         </div>
    data() {
        return {
            infoData: [{
                title: '项目列表',
                link: 'project_list'
            }, {
                title: '地图列表',
                link: 'project_map_list',
            }],
            dataAll: {},
            flagLoad: true, //加载动画
            cityProject: {}, //对应的城市对应的项目
            date: '',
            listData: [],
            backAddress: '/index/project_online/unit_list?val=单位列表'
        }
    },
    components: {
        list,
        changeTab
    },
    mounted() {

    },
}
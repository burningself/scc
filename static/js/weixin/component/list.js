const list = {
    template: `
        <div class="list">
            <p  class="text_hide size16" v-if="date"> {{ date }} </p>
            <div class="weui-loadmore" v-if="flagLoad">
                <i class="weui-loading"></i>
                <span class="weui-loadmore__tips">正在加载</span>
            </div>
            
            <router-link class="weui-panel weui-panel_access" v-for="(value,index) in listData" :to="{ path:value.address , query:{val:value.query} }" tag="div" :class="{ hui:value.PrjState }">
                <div class="weui-panel__ft">
                    <div class="weui-cell weui-cell_access weui-cell_link" >
                        <slot :name="index+'star'"></slot>
                        <div class="weui-cell__bd text_hide size16" style="flex:8;-webkit-box-flex:8;-webkit-flex:8;">{{ value.time }}</div>
                        <slot :name="index"></slot>
                        <span class="weui-cell__ft"></span>                       
                    </div>    
                </div>
                
            </router-link>
        </div>
    `,
    data() {
        return {

        }
    },
    props: {
        'showFlag': {
            type: null,
            default: true,
        },
        'listData': {
            type: null
        },
        'flagLoad': {
            type: null
        },
        'date': {
            type: null,
        },
        'PrjState': {
            type: null
        }
    } //PrjState 单位工程中是否竣工
}
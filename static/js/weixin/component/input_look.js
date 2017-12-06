const inputLook = {
    template: `
        <div class="weui_cell no_access">
            <div :style="{ backgroundImage:'url(/img/message_'+ icon +'.png)' }" class="type_icon" v-if=" typeof icon=='number' ">
            </div>
            <div class="weui_cell_bd weui_cell_primary size15"  style="width:80%;">
                <p class="text_hide">{{ left_title }}</p>
                <slot name="dis"></slot>
            </div>
            <div class="weui_cell_ft">
                <span>{{right_title}}</span>
                <slot name="jd">
                </slot>
            </div>
        </div> 
    `,
    data() {
        return {
            type: '',
            type_danger: {
                0: '系统',
                1: '项目',
                2: '危大',
                3: '工序',
                4: '四令',
                5: '预警'
            }
        }
    },
    props: ['left_title', 'right_title', 'icon'],
    mounted() {

    }
}
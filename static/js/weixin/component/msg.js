const msg = {
    template: `
        <div class="weui_msg hide" id="msg1">
            
            <div class="weui_text_area weui_msg_com white">
                <div onclick="$('#msg1').fadeOut();" class="weui_msg_close"><i class="icon icon-chahao"></i></div>
                <p class="weui_msg_desc size17">
                    <slot></slot>
                </p>
            </div>
        </div>
    `
}
var basic_content = {
    template: `
                    <div class="marpad_info  basic_content-info">
                        <Row>
                            <Col span="8"> 
                                <span class="center-y">时间</span>
                                <p class="center-y sL" title="2017-8-10 星期四">2017-8-10 星期四</p>
                                <i class="center-y content-time">
                                    <img src="../../img/时间.jpg" class="center-xy">
                                </i>
                            </Col>
                            <Col span="8"> 
                                <span class="center-y">温度</span>
                                <p class="center-y sL"  title="-5℃ ~ 16℃">-5℃ ~ 16℃</p>
                                <i class="center-y">
                                     <img src="../../img/温度.jpg" class="center-xy">
                                </i>
                            </Col>
                            <Col span="8"> 
                                <span class="center-y">气候</span>
                                <p class="center-y sL" title="-5℃ ~ 16℃">-5℃ ~ 16℃</p>
                                <i class="center-y">
                                     <img src="../../img/气候.jpg" class="center-xy">
                                </i>
                            </Col>
                        </Row>
                        <div class="basic_content_list hid">
                            <ul>
                              <li v-for="value in basic_content_info">
                                <span class="center-y">{{value.tit}}</span>
                                <span class="center-y">{{value.com}}</span>
                              </li>
                            </ul>
                        </div>
                    </div>
    `,
    data() {
        return {
            basic_content_info: [
                { tit: "分项分部名称", com: "A项目" },
                { tit: "轴线/楼层具体位置", com: "5#12层" },
                { tit: "工种", com: "A" },
                { tit: "作业内容", com: "安装" },
                { tit: "班长", com: "张三" },
                { tit: "人数", com: "12人" },
                { tit: "计划进度", com: "安装完成" },
                { tit: "实际进度", com: "监理验收台" },

            ]
        }
    }
}
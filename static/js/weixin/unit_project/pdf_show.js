var pdf_show = {
    template: `
        <div class="pdf_show">
            <navigation :title="'PDF管理'" :address="address"></navigation>
            <div class="weui_cells  white_color" > 
                <input-look :left_title="'工程名称'" :right_title="name"></input-look>
                <a href="javascript:;" class="weui_btn" @click="present_pdf">当前日期日志PDF</a>  
                <a href="javascript:;" class="weui_btn" @click="project_pdf">当前工程所有日志PDF</a>  
                <date-select :date="''" :sel="0" :sec_title="'工程PDF开始日期'" :con="'工程PDF开始日期'" :id=" 'data_start' " :name="'data_start'"></date-select>
                <date-select :date="''" :sel="0" :sec_title="'工程PDF结束日期'" :con="'工程PDF结束日期'" :id=" 'data_end' " :name="'data_end'"></date-select>    

                <a href="javascript:;" class="weui_btn" @click="time_pdf">预览时间段PDF</a>  
            </div>
            <success_msg :content="content" ref="c1"></success_msg>
        </div>
    `,
    data() {
        return {
            address: '',
            name: '',
            date: '',
            content: ''
        }
    },
    components: {
        navigation,
        inputLook,
        dateSelect,
        success_msg
    },
    methods: {
        slide() { //左滑

            var listItem = $('.weui_cell_bd'),
                listOpts = $('.slideleft');
            var onthel = false, // 是否处于最左端
                isScroll = false, // 列表是否滚动状态
                initX = 0, // 初始X坐标
                initY = 0, // 初始Y坐标
                endX = 0, // 结束时X坐标
                endY = 0, // 结束时Y坐标
                moveX = 0, // listItem 移动的距离
                expandLi = null; // 是否存在展开的list

            var slideMaxWid = listOpts.width();

            var handleSlide = (function() {

                listItem.on('touchstart', function(e) {
                    // 判断有无已经展开的li，如果有，是否是当前的li，如果不是，将展开的li收起
                    if (expandLi) {
                        if (expandLi.parent().index() !== $(this).parent().index()) {
                            // 判断当前list是左滑还是上下滑
                            if (Math.abs(endY - initY) < Math.abs(endX - initX)) {
                                e.preventDefault();
                            }
                            expandLi.css('-webkit-transform', 'translateX(' + 0 + 'px)');
                        }
                    }

                    initX = e.targetTouches[0].pageX;
                    initY = e.targetTouches[0].pageY;

                    moveX = $(this).offset().left;

                    $(this).on('touchmove', function(e) {

                        var curY = e.targetTouches[0].pageY;
                        var curX = e.targetTouches[0].pageX;
                        var X = curX - initX; // 不断获取移动的距离

                        $(this).removeClass('animated');

                        if (Math.abs(endY - initY) < Math.abs(endX - initX)) {

                            e.preventDefault();
                            if (moveX == 0) {
                                if (X > 0) {
                                    $(this).css('-webkit-transform', 'translateX(' + 0 + 'px)');
                                } else if (X < 0) {
                                    if (X < -slideMaxWid) X = -slideMaxWid;
                                    $(this).css('-webkit-transform', 'translateX(' + X + 'px)');
                                }
                            }
                            // 已经处于最左
                            else if (moveX < 0) {
                                onthel = true;
                                if (X > 0) { // 向右滑
                                    if (X - slideMaxWid > 0) {
                                        $(this).css('-webkit-transform', 'translateX(' + 0 + 'px)');
                                    } else {
                                        $(this).css('-webkit-transform', 'translateX(' + (X - slideMaxWid) + 'px)');
                                    }
                                } else { // 左滑
                                    $(this).addClass('animated');
                                    $(this).css('-webkit-transform', 'translateX(' + 0 + 'px)');
                                }
                            }
                        } else {
                            isScroll = true;
                        }

                    })
                })

                listItem.on('touchend', function(e) {

                    endX = e.changedTouches[0].pageX;
                    endY = e.changedTouches[0].pageY;
                    var X = endX - initX;

                    $(this).addClass('animated');
                    //Slide to right or the distance of slide to left less than 20;
                    if (X > -20 || onthel || isScroll) {
                        $(this).css('-webkit-transform', 'translateX(' + 0 + 'px)');
                        onthel = false;
                        isScroll = false;
                    } else {
                        $(this).css('-webkit-transform', 'translateX(' + (-slideMaxWid) + 'px)');
                        expandLi = $(this);
                    }
                })

            })();
        },
        present_pdf() {
            var id = this.$route.query.val.split('|')[1].split('_')[1];
            window.location.href = "/shigongriji/?id=" + id + '&aim=preview';
        },
        project_pdf() {
            var id = this.$route.query.val.split('|')[1].split('_')[0];
            window.location.href = "/shigongrijiByProject/?projectId=" + id + '&aim=preview';
        },
        time_pdf() {
            var id = this.$route.query.val.split('|')[1].split('_')[0];
            var start = $('#data_start').val();
            var end = $('#data_end').val();
            if (start == "") {
                this.content = "没有开始日期";
                this.$refs.c1.showMsg();
                return false;
            } else if (end == "") {
                this.content = "没有结束日期";
                this.$refs.c1.showMsg();
                return false;
            }
            window.location.href = "/shigongrijiByDate/?projectId=" + id + "&beginDate=" + start + "&endDate=" + end + "&aim=preview";
        }
    },
    mounted() {
        var result = this.$route.query.val.split('|')
        this.address = "/construction_diary/" + this.$route.params.id + '?val=' + result[0] + '|' + result[1].split('_')[0];
        this.name = result[0];
        this.slide();
        console.log(this.$route);
    }
}
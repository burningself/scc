const dateSelect = {
    template: `
        <div class="weui_cell no_access">
            <div class="weui_cell_bd weui_cell_primary">
                <p class="size15">{{ con }}</p>
            </div>
            <div class="weui_cell_ft">
                <input class="weui_input rig size15 text_hide " type="text"  :id="id"  :name="name" :value="date">  
            </div>
        </div> 
    `,
    data() {
        return {
            // date: ''
        }
    },
    props: ['con', 'date', 'sel', 'sec_title', 'type_selector', 'id', 'name'], //date=表单默认值//name input的name名//传过来的默认值  con=左边标题, sel=0是日期其他单选 sec_title=级联选择器的头 type_selector=级联选择器的内容
    watch: {
        ['type_selector']() {
            this.setData();
        }
    },
    methods: {
        pop() {
            alert(55);
        },
        setData() {
            const that = this,
                nowDate = new Date(),
                max = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();


            if (this.sel == 0) {
                console.log($("#" + this.id));
                $("#" + this.id).datetimePicker({ title: this.title, m: 1 }); //日期选择
                $("#time").datetimePicker({ title: "选择日期时间", min: '2015-12-10', max: max });
                $("#time2").picker({
                    title: "选择时间",
                    cols: [{
                            textAlign: 'center',
                            values: (function() {
                                var arr = [];
                                for (var i = 0; i <= 23; i++) { arr.push(i < 10 ? '0' + i : i); }
                                return arr;
                            })()

                        },
                        {
                            textAlign: 'center',
                            values: (function() {
                                var arr = [];
                                for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                                return arr;
                            })(),
                        }
                    ]
                });
            } else {
                console.log(this.type_selector);
                if (this.type_selector.length != 0) {
                    console.log(this.type_selector);
                    $("#" + this.id).picker({
                        title: this.sec_title,
                        toolbarCloseText: '确定',
                        cols: [{
                            textAlign: 'center',
                            values: that.type_selector, //this.val
                            displayValues: that.type_selector, //this.val
                        }]
                    });
                }
            }
        }
    },
    mounted() {
        this.setData();
    }
}
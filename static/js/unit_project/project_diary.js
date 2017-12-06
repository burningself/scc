const project_diary = {
    template: `
        <div class="marpad_info">
            <div class="tablePaint">
                <canvas id="canv" style="display:none" width='900px' height="300px"></canvas>
                <div class="marpad_info_title center-x">
                    <h4>施工日记</h4>
                    <div class="weather">
                        <Row>
                            <Col span="18">
                                {{ date }}
                            </Col>
                            <Col span="3">
                                <span>气温最高  ℃</span><br>
                                <span>气温最低  ℃</span>
                            </Col>
                            <Col span="3">
                                <span>气候上午</span><br>
                                <span>气候下午</span>
                            </Col>
                        </Row>
                    </div>
                </div>
                <table class="canvTable center-x">
                    <tBody>
                        <tr>
                            <td colspan='3' rowspan="5" class="canvTable_title" style="width:20%"></td>
                            <td rowspan="2"  v-for="value in workType">{{ value.name }}</td>
                            <td colspan='2' rowspan="5" class="workCount" style="width:13.3%">

                            </td>
                            <td colspan='2' rowspan="5" style="width:13.3%"></td>
                        </tr>
                        <tr></tr>
                        <tr>
                            <td rowspan="2" v-for=" value in  workType">{{ 
                                value.monitor
                             }}</td>
                        </tr>
                        <tr></tr>
                        <tr>
                            <td colspan='8'>实际工作人数</td>
                        </tr>
                        <tr v-for=" (value,index) in proJectList">
                            <td colspan='3'> {{value.name}} </td>
                            <td v-for="value in proJectList[index].workType">
                                {{value.peoples}}
                            </td>
                            <td colspan='2'></td>
                            <td colspan='2'></td>
                        </tr>
                        <tr>
                            <td colspan='3'>质量</td>
                            <td colspan='8' class="allTd"> {{ quality }}</td>
                            <td colspan='2'></td>
                            <td colspan='2'></td>
                        </tr>
                        <tr>
                            <td colspan='3'>安全</td>
                            <td colspan='8'>{{ safetys }}</td>
                            <td colspan='2'></td>
                            <td colspan='2'></td>
                        </tr>
                        <tr>
                            <td colspan='3'>场容</td>
                            <td colspan='8'>{{ fieldcapacitys }}</td>
                            <td colspan='2'></td>
                            <td colspan='2'></td>
                        </tr>
                        <tr>
                            <td colspan='3'>砂浆、砼试块</td>
                            <td colspan='8'>{{mortars}}</td>
                            <td colspan='2'></td>
                            <td colspan='2'></td>
                        </tr>
                        <tr>
                            <td colspan='3'>材料、构件、机具进退场</td>
                            <td colspan='8'>{{materialinfos}}</td>
                            <td colspan='2'></td>
                            <td colspan='2'></td>
                        </tr>
                        <tr>
                            <td colspan='3'> 隐蔽工程验收及技术复核记录</td>
                            <td colspan='8'>{{checkworks}}</td>
                            <td colspan='2'></td>
                            <td colspan='2'></td>
                        </tr>
                        <tr>
                            <td colspan='3'>加班与停工情况</td>
                            <td colspan='8'>{{ overtimes }}</td>
                            <td colspan='2'></td>
                            <td colspan='2'></td>
                        </tr>
                        <tr>
                            <td colspan='3'>其它</td>
                            <td colspan='8'></td>
                            <td colspan='2'></td>
                            <td colspan='2'></td>
                        </tr>

                    </tBody>
                </table>
            </div>
         </div>
    `,
    data() {
        return {
            proJectList: [],
            workType: [],
            workCount: [], //人数
            date: '', //显示日期
            quality: '', //质量
            safetys: '', //安全
            fieldcapacitys: '', //场容
            checkworks: '', //复核
            materialinfos: '', //材料
            mortars: "", //砂浆
            overtimes: '', //超时
            others: '', //其他

        }
    },
    mounted() {
        const that = this;
        const num = this.$route.params.num;
        new Promise(resolve => {
            $.ajax({
                url: '/projects/rest/Records/?engineering_id=' + num,
                success: function(data) {
                    resolve(data);
                }

            }).then(data => {
                console.log(data);
                if (data.results.length != 0) {
                    const dataPresent = data.results[0];

                    that.quality = dataPresent.qualitys || ''; //质量
                    that.safetys = dataPresent.safetys || ''; //安全
                    that.fieldcapacitys = dataPresent.fieldcapacitys || ''; //场容
                    that.checkworks = dataPresent.checkworks || '' //复核记录
                    that.materialinfos = dataPresent.materialinfos || '' //材料
                    that.mortars = dataPresent.mortars || ''; //砂浆
                    that.overtimes = dataPresent.overtimes || ''; //加班
                    that.others = dataPresent.others || ''; //其他

                    const dateArr = dataPresent.curr_time.split('-');
                    that.date = dateArr[0] + '年' + dateArr[1] + '月' + dateArr[2] + '日'; //日期
                    let listName = that.proJectList;
                    dataPresent.rewordworks.forEach((value, index) => {

                        if (value.rewordworktypes.length < 8) { //判断工种是否小于8条
                            for (var i = 0, j = 8 - value.rewordworktypes.length; i < j; i++) {
                                value.rewordworktypes.push({ //填满8条工种数据
                                    monitor: '',
                                    name: '',
                                    peoples: '',
                                })
                            }
                        }
                        listName[index] = {
                            name: value.name,
                            workType: value.rewordworktypes
                        }

                    })
                    const allCount = listName.length; //从后台获取数据的总条数

                    var newArr = []; //动态创建一个长度为8的数组填补空白
                    for (var i = 0; i < 8; i++) {
                        var obj = {};
                        obj.proples = "";
                        newArr.push(obj);
                    }

                    if (allCount < 9) {
                        const len = 9 - allCount //距离9条的差数
                        for (var i = 0, j = len; i < j; i++) { //补全剩余的7条
                            listName.push({
                                name: '',
                                workType: newArr
                            });
                        }
                    };
                    console.log(listName);
                    this.workType = listName[0].workType;
                }
            })
        })

        let tdWidth = 60; //单个表格的宽
        if ($(window).width() < 1417) {

            $('.marpad_info_title').width($('.tablePaint').width() - 20);
            $('.canvTable').width($('.tablePaint').width() - 20);
            $('#canv').attr('width', $('.tablePaint').width() - 20);
        }
        var canv = document.querySelector('#canv');
        var table = document.querySelector('.canvTable');
        var title = document.querySelector('.canvTable_title');
        var xpos = title.clientWidth;
        console.log(xpos);
        var ypos = title.clientHeight;


        if (canv.getContext) {
            var ctx = canv.getContext('2d');
            ctx.clearRect(0, 0, xpos, ypos); //清空画布，多个表格时使用  
            ctx.fill();

            ctx.moveTo(0, 0);
            console.log(xpos);
            ctx.lineTo(xpos, 0.4 * ypos);

            ctx.moveTo(0, 0);
            ctx.lineTo(xpos, 0.8 * ypos);

            ctx.moveTo(0, 0);
            ctx.lineTo(xpos, ypos);

            ctx.stroke();

            //设置字体样式

            //从坐标点(50,50)开始绘制文字

            function drawText(t, x, y, w) {

                var chr = t.split("");
                var temp = "";
                var row = [];
                // let fontSize = $('.canvTable_title').outerWidth() / 158 * 16;
                ctx.font = "16px Arial";
                ctx.fillStyle = "black";
                ctx.textBaseline = "middle";

                for (var a = 0; a < chr.length; a++) {
                    if (ctx.measureText(temp).width < w) {;
                    } else {
                        row.push(temp);
                        temp = "";
                    }
                    temp += chr[a];
                }

                row.push(temp);

                for (var b = 0; b < row.length; b++) {
                    ctx.fillText(row[b], x, y + (b + 1) * 20);
                }
            }


            drawText("工种", $('.canvTable_title').outerWidth() * 100 / 158, 10, 100);

            drawText("分部分项工程名              称", 10, 150, 90);

            let workWidth = $('.canvTable').width() * 0.805;
            drawText("预算工作量", workWidth - 5, 20, 5);
            drawText("M(M)", workWidth - 10, 120, 100);

            const actualWidth = $('.canvTable').width() * 0.938; //实际工作量宽度

            drawText("实际工作量", actualWidth - 5, 20, 5);
            drawText("M(M)", actualWidth - 10, 120, 100);


            ctx.translate(100, -45);
            ctx.rotate(45 * Math.PI / 180);

            let name = (158 / $('.canvTable_title').outerWidth() - 1) * 55 + 55
            drawText("班组长姓    名", 85, name, 40);



            ctx.translate(50, 43);
            var contenrHeight = (158 / $('.canvTable_title').outerWidth() - 1) * 55 + 55;
            console.log($(window).width() < 1417 && $(window).width() < 1250);
            if ($(window).width() < 1417) {

                contenrHeight = (158 / $('.canvTable_title').outerWidth() - 1) * 50 + 50 + 5;
            } else {
                contenrHeight = 40
            }
            drawText("内容", 100, contenrHeight, 30);




            // hanzi.translate(60, 235);

            // ctx.fillText("班组长姓名", 100, 80);
        }
        table.style.background = 'url("' + ctx.canvas.toDataURL() + '") no-repeat';


    }
}
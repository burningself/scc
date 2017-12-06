var process_control = {
    template: `
        <div class="all  management_and_control diary_unit process_control">
             <div class="project-list fl">
                <div class="diary_unit_search">
                        <div class="input-group">
                            <input type="text" placeholder="请输入关键字">
                            <span class="input-group-btn glyphicon glyphicon-search center-y"></span>
                        </div>
                     </div>
                    <div class="unitList">
                            <div class="list-info">
                                <ul class="unitCity">
                                    <li v-for="n in unit_project" @click="change_unit(n)" @mouseover="showBg($event)" @mouseout="reBack($event,'#ebebeb')">{{n}}</li>
                                </ul>
                                <span>查看更多</span>
                            </div>
                     </div>
            </div>
            <div class="project-map fl management_and_control_info">
                <div class="project-map-title">
                    <div class="project-map-position">
                        <p class="fl">
                            <img src="../img/home.svg">
                            您当前的位置: 单位列表
                        </p>
                        <div class="fr">
                            <span>2017年8月29日</span>
                            <span>10:18:10</span>
                            <span>星期四</span>
                        </div>   
                    </div>
                </div>
                <div class="pro-map">
                   <div class="highIndex">
                    <table class="table-bordered tableShow">
                        <thead>
                            <tr>
                                <td v-for="value in project_title" class="sL">{{value}}</td>  
                            </tr>
                        </thead>
                        <tBody>
                            <loading v-if="showLoad" class="center-x"></loading>
                            <tr v-for="value in project_info">
                                <td class="sL">{{value.addtime}}</td>
                                <td class="sL">{{value.projectname}}</td>
                                <td class="sL">{{value.name}}</td>
                                <td class="sL">{{value.engeeringname}}</td>
                                <td class="sL">{{value.gxtype}}</td>
                                <td class="sL">{{value.schedule}}</td>
                            </tr>
                        </tBody>
                    </table>
                    <div class="management_footer">
                        <p class="center-y">
                        <img src="../../img/refresh.jpg">
                        <span>刷新一下</span>
                        </p>
                        <nav aria-label="Page navigation" class="center-xy">
                            <ul class="pagination">
                                <li>
                                <a href="#" aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                                </li>
                                <li><a href="#">1</a></li>
                                <li><a href="#">2</a></li>
                                <li><a href="#">3</a></li>
                                <li><a href="#">4</a></li>
                                <li><a href="#">5</a></li>
                                <li>
                                <a href="#" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                                </li>
                            </ul>
                        </nav>
                        
                    </div>
                    </div> 
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            unit_project: [
                '第一工程', '第二工程', '第三工程', '第四工程', '第五工程', '第六工程',
            ],
            project_title: [
                '添加日期', '所属项目', '工序名称', '工程名称', '工程类型', '工程进度',
            ],
            project_info: [],
            showLoad: true,
        }
    },
    methods: {
        showBg(obj) {
            var hObj = obj.currentTarget;
            $(hObj).css('background', '#d3d8e0');
        },
        reBack(obj, col) {
            var hObj = obj.currentTarget;
            $(hObj).css('background', col);
        },
    },
    mounted() {
        var that = this;
        var project_type = {
            1: '特殊工序',
            2: '关键工序',
            3: '施工难点'
        }
        new Promise(reslove => {
                $.ajax({
                    type: 'get',
                    url: '/projects/rest/ProcedureSet/',
                    success: function(data) {
                        reslove(data);
                    }
                })
            })
            .then(data => {
                console.log(data);
                data.results.forEach((value, index) => {
                    if (index > 6) {
                        return false;
                    }
                    var obj = {};
                    obj.addtime = value.addtime;
                    obj.projectname = value.projectname;
                    obj.name = value.name;
                    obj.engeeringname = value.engeeringname;
                    obj.gxtype = project_type[value.gxtype];

                    obj.schedule = value.schedule;
                    that.project_info.push(obj);
                    that.showLoad = false;
                })
            })
    }
}
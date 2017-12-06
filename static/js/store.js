var store = new Vuex.Store({
    state: {
        projectId: 0,
        project_data: [],
        diaryId: 0, //工程id  
        companyProje: null, //对应的公司对应的项目
    },
    mutations: {

        changeId(state, payload) {
            state.projectId = payload;
        },

        changeProject(state, payload) {
            state.diaryId = payload;
        },
        changeCompanyProje(state, payload) {
            state.companyProje = payload;
        },
    },
    actions: {

        projectData(state) {
            console.log(state.projectId);
            let that = this,
                num = state.projectId || localStorage.getItem('projectId');
            console.log(num);


            $('.diary_unit').css('height', $(window).height() - $('.title').height() - $('.diary-title').height() - $('.ivu-menu-horizontal').height());


            //渲染公司名
            // $.ajax({
            //     url: '/projects/rest/engineering/?project_id=' + num,
            //     success: function(data) {
            //         state.project_List = data.results;
            //         console.log(5);
            //     }
            // })
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: '/projects/rest/engineering/?project_id=' + num,
                    success: function(data) {
                        resolve(data);
                    }
                })
            })
        },
    }
})
const moduleProsure = {
    namespaced: true,
    state: {
        addProsure: false,
        gx: {
            1: '重点工序',
            2: '关键工序',
            3: '难点工序',
        },
        gxArr: ['重点工序', '关键工序', '难点工序'],
        sg: {
            1: '未施工',
            2: '施工中',
            3: '已施工',
        },
        sgArr: ['未施工', '施工中', '已施工']
    },
    mutations: {
        changeProsure(state, res) { //工序把控决定是否显示添加按钮
            console.log(res);
            console.log(state);
            state.addProsure = res;
        }
    }
}
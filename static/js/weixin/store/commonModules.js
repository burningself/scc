const commonModules = {
    namespaced: true,

    state: {
        cs_cookie: '',
        userId: '',
        flagCh: true,
        infoData: [{
            title: '单位轴',
            link: 'gxbk_danwei'
        }, {
            title: '时间轴',
            link: 'gx_time',
        }],
    },
    mutations: {
        getHeight(state, obj) {
            $(obj).height($(window).height() - $('.weui-header').height() - $('.weui-tabbar').height());
        },
        //getCSRFTOKE
        getCookie(state, name) {
            var cookieValue = null;

            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = $.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            console.log(cookieValue);
            state.cs_cookie = cookieValue;
        },
        userData(state, id) {
            state.userId = id;
        },
        changeFlag(state) {
            state.flagCh = !state.flagCh;
        },
        changeTitle(state, value) {
            state.infoData = [{
                title: value,
                link: 'gxbk_danwei'
            }, {
                title: '时间轴',
                link: 'gx_time',
            }]
        }
    },
    actions: {
        getUserId({ commit }) {
            const useName = localStorage.getItem('login_name');
            axios.get('/user/rest/user/?username=' + userName)
                .then(res => {
                    commit('userData', res.data[0].id);
                })
        }
    }
}
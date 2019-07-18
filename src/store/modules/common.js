const common = {
    namespaced: true,
    state: {
        isLogin: false,
        token: '',
        userInfo: {}
    },
    mutations: {
        updateLogin(state, newStatus){
            state.isLogin = newStatus;
            localStorage.setItem('isLogin', newStatus);
            // 登出时，清除localStorage信息
            if (!newStatus) {
                localStorage.setItem('token', ''); //以后考虑多用户，localStorage的token名字可以加上用户的唯一标识
                state.token = '';
                localStorage.setItem('userInfo', '');
                state.userInfo = {};
            }
        },
        updateToken(state, newToken){
            state.token = newToken;
            localStorage.setItem('token', newToken);
        },
        updateUserInfo(state, newUserInfo){
            state.userInfo = newUserInfo;
            localStorage.setItem('userInfo', newUserInfo);
        }
    },
    actions: {
        updateLogin(context, payload) {
            context.commit('updateLogin', payload);
        },
        updateToken(context, payload) {
            context.commit('updateToken', payload);
        },
        updateUserInfo(context, payload) {
            context.commit('updateUserInfo', payload);
        },
    },
    getters: {

    }
};

export default common;

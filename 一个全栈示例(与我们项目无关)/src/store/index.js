//store/index.js
import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      token: null,
      user: null,
    };
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setUser(state, user) {
      state.user = user;
    },
    clear(state) {
      state.token = null;
      state.user = null;
    }
  },
  actions: {
    login({ commit }, { token, user }) {
      
      commit('setToken', token);
      commit('setUser', user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout({ commit }) {
      commit('clear');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});
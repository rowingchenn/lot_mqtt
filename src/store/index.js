import Vue from 'vue';
import Vuex from 'vuex';
import { Notification } from 'element-ui';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
      client: null, // 初始状态为 null
    },
    mutations: {
      SET_CLIENT(state, client) {
        state.client = client; // 设置 state 中的 client
      },
    },
    actions: {
      disconnectClient({ commit, getters }) {
        return new Promise((resolve, reject) => {
          const client = getters.getClient;
          if (client && client.connected) {
            try {
              client.end(false, () => {
                commit('SET_CLIENT', null); // 重置 Vuex 中的 client
                Notification({
                  title: 'Success',
                  message: `Disconnected to MQTT Broker!`,
                  type: 'success',
                  duration: 5000 // 显示时长(毫秒)
                });
                console.log('qwqSuccessfully disconnected!');
                resolve(); // 成功时调用 resolve
              });
            } catch (error) {
              console.log('Disconnect failed', error.toString());
              reject(error); // 失败时调用 reject
            }
          } else {
            resolve(); // 如果没有连接，则直接 resolve
          }
        });
      },
      setClient({ commit }, client) {
        commit('SET_CLIENT', client); // 调用 mutation 设置 client
      },
    },
    getters: {
      getClient: (state) => state.client, // 定义 getter 获取 client
    },
});
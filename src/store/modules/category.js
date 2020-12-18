import { Message } from "element-ui";

import * as API from "@/api";

export default {
  namespaced: true,
  state: {
    category: {
      category1Id: "",
      category2Id: "",
      category3Id: ""
    },
    category1List: [],
    category2List: [],
    category3List: []
  },
  actions: {
    // 获取1级分类列表
    async getCategory1List ({ commit }) {
      const result = await API.attrs.getCategorys1();
      if (result.code === 200) {
        commit("GET_CATEGORY1_LIST", result.data);
      } else {
        Message.error(result.message);
      }
    },
    async getCategory2List ({ commit }, category1Id) {
    

      const result = await API.attrs.getCategorys2(category1Id);
      if (result.code === 200) {
        commit("GET_CATEGORY2_LIST_SUCCESS", {
          category1Id,
          category2List: result.data
        });
      } else {
        commit("GET_CATEGORY2_LIST_ERROR", category1Id);
        Message.error(result.message);
      }
    },
    async getCategory3List ({ commit }, category2Id) {

      const result = await API.attrs.getCategorys3(category2Id);
      if (result.code === 200) {
        commit("GET_CATEGORY3_LIST_SUCCESS", {
          category2Id,
          category3List: result.data
        });
      } else {
        commit("GET_CATEGORY3_LIST_ERROR", category2Id);
        Message.error(result.message);
      }
    }
  },
  mutations: {
    GET_CATEGORY1_LIST (state, category1List) {
      // 获取1级分类列表
      state.category1List = category1List;
    },
    GET_CATEGORY2_LIST_SUCCESS (state, { category2List, category1Id }) {
      // 获取2级分类列表 清空2级和3级分类
      state.category2List = category2List;
      state.category.category1Id = category1Id;
      state.category3List = [];
      state.category.category2Id = "";
      state.category.category3Id = "";
    },
    GET_CATEGORY2_LIST_ERROR (state, category1Id) {
      state.category.category1Id = category1Id;
      state.category2List = [];
      state.category3List = [];
      state.category.category2Id = "";
      state.category.category3Id = "";
    },
    GET_CATEGORY3_LIST_SUCCESS (state, { category3List, category2Id }) {
      // 获取3级分类列表 清空3级分类
      state.category.category2Id = category2Id;
      state.category3List = category3List;
      state.category.category3Id = "";
    },
    GET_CATEGORY3_LIST_ERROR (state, category2Id) {
      state.category.category2Id = category2Id;
      state.category3List = [];
      state.category.category3Id = "";
    },
    SET_CATEGORY3_ID (state, category3Id) {
      state.category.category3Id = category3Id;
    }
  },
  getters: {}
};

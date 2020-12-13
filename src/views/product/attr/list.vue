<template>
  <div>
    <Category @change="getAttrList" />
    <el-card style="margin-top: 20px" v-show="isShowList">
      <el-button type="primary" icon="el-icon-plus">添加属性</el-button>
      <el-table :data="attrList" border style="width: 100%; margin: 20px 0">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              style="margin-left: 5px"
              v-for="attrVal in row.attrValueList"
              :key="attrVal.id"
              >{{ attrVal.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="{ row }">
            <el-button
              @click="update(row)"
              type="warning"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card v-show="!isShowList" style="margin-top: 20px">
      <el-form :model="attr" inline>
        <el-form-item label="属性名" prop="attrName">
          <el-input v-model="attr.attrName"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" icon="el-icon-plus"></el-button>
      <el-table
        :data="attr.attrValueList"
        border
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column
          type="index"
          label="序号1111"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column label="属性值名称">
          <template v-slot="{ row }">
            <el-input
              size="mini"
              v-if="row.edit"
              v-model="row.valueName"
              @blur="row.edit = false"
              @keyup.enter.native="row.edit = false"
              antofocus
              ref="input"
            ></el-input>
            <!-- antofocus聚集焦点 -->
            <!-- 事件修饰符.native专门给组件绑定事件使用
            会给组件中的第一个标签绑定相应的DOM事件
             -->
            <span
              v-else
              @click="edit(row)"
              style="display: block; width: 100%"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作aaaaa">
          <template>
            <el-button
              type="warning"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary">保存</el-button>
      <el-button>取消</el-button>
    </el-card>
  </div>
</template>


<script>
/*
0:Object
attrName:"言情小说"
attrValueList:Array[4]
0:Object
attrId:3559
id:19660
valueName:"我与富婆不得不说的二三事"
1:Object
2:Object
3:Object
categoryId:1
categoryLevel:3
id:3559
*/
import { methods } from 'v-charts/lib/core';
import Category from './category';
export default {
  name: 'AttrList',
  data() {
    return {
      attrList: [],
      isShowList: true,
      attr: {
        attrName: '',
        attrValueList: [],
      },
    };
  },
  //绑定的自定义事件
  methods: {
    edit(row) {
      this.$set(row, 'edit', true); //通过this.$set添加的属性才是响应式
      this.$nextTick(() => {
        this.$refs.input.focus(); //聚集焦点
      });
    },

    update(attr) {
      this.attr = {
        ...attr,
      };
      this.isShowList = false;
    },

    getAttrList(attrList) {
      this.attrList = attrList;
    },
  },

  components: {
    Category,
  },
};
</script>

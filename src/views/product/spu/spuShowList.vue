<template>
  <el-card style="margin-top: 20px">
    <el-button
      type="primary"
      icon="el-icon-plus"
      :disabled="!category.category3Id"
      >添加SPU</el-button
    >

    <el-table
      :data="spuList"
      v-loading="loading"
      border
      style="width: 100%; margin: 20px 0"
    >
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
      <el-table-column prop="description" label="SPU描述"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="primary" icon="el-icon-plus" size="mini"></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="$emit('showUpdateList', row)"
          ></el-button>
          <el-button type="info" icon="el-icon-info" size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @size-change="getPageList(page, $event)"
      @current-change="getPageList($event, limit)"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page="page"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
/*
{records: Array(2), total: 2, size: 3, current: 1, pages: 1}
data:
current: 1
pages: 1
records: Array(2)
0:
category3Id: 1
description: "1231541"
id: 2192
spuImageList: null
spuName: "校长"
spuSaleAttrList: null
tmId: 245
*/
export default {
  name: 'SpuShowList',
  data() {
    return {
      page: 1, //当前页
      limit: 3, //每页显示条数
      total: 0, //分页器总数
      category: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
      spuList: [],
      loading: false, 
    };
  },
  methods: {
    //获取spu分页列表
    async getPageList(page, limit) {
      this.loading = true;
      const { category3Id } = this.category;
      const result = await this.$API.spu.getSpuList({
        page,
        limit,
        category3Id,
      });
      console.log(result);
      if (result.code === 200) {
        this.$message.success('获取SPU分页列表成功！！！');
        this.spuList = result.data.records;
        this.total = result.data.total;
      } else {
        this.$message.error(result.message);
      }
      this.loading = false;
    },
    //处理category的change(当选中三级分类时触发)
    handleCategoryChange(category) {
      this.category = category;
      this.getPageList(this.page, this.limit);
      //
    },
    //当选中1级或2级分类触发
    clearList() {
      this.spuList = [];
      this.page = 1;
      this.limit = 3;
      this.category.category3Id = '';
    },
  },
  mounted() {
    this.$bus.$on('change', this.handleCategoryChange);
    this.$bus.$on('clearList', this.clearList);
  },
  //清楚绑定的全局事件
  beforeDestroy() {
    this.$bus.$off('change', this.handleCategoryChange);
    this.$bus.$off('clearList', this.clearList);
  },
};
</script>

<style>
</style>

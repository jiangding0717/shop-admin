<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <el-table
      :data="trademarkList"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column
        fixed
        type="index"
        label="序号"
        width="80"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img class="trademark-img" :src="scope.row.logoUrl" alt="logo" />
          <!-- scope 代表所有数据
          scope.row代表当前行所有的数据
           -->
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template>
          <el-button type="warning" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="trademark-pagination"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page="page"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'TrademarkList',
  data() {
    return {
      trademarkList: [],
      total: 0, //总数
      page: 1, //页码
      limit: 3, //每页显示条数
    };
  },
  methods: {
    //改变的是每页条数
    handleSizeChange(limit) {
      //page是之前的page limit是传过来的limit
      this.getpageList(this.page, limit);
    },
    //改变的是page当前页码了
    handleCurrentChange(page) {
      this.getpageList(page, this.limit);
    },

    //请求分页列表数据
    async getpageList(page, limit) {
      try {
        const result = await this.$API.trademark.getPageList(page, limit);
        console.log(result);
        if (result.code === 200) {
          this.$message.success('获取品牌分页列表成功');
          //获取到成功的信息
          this.trademarkList = result.data.records; //总数据

          this.limit = result.data.size; //代表显示的条数
          this.page = result.data.page; //代表第几页
          this.total = result.data.total; //总数
        } else {
          this.$message.error('获取品牌分页列表失败');
        }
      } catch (e) {
        console.log(e);
        this.$message.error('获取品牌列表失败');
      }
    },
  },

  //发送请求
  mounted() {
    //代表一上来传的page与limit
    this.getpageList(this.page, this.limit);
  },
};
</script>
<style lang="sass">
.trademark-img
  width: 100px
.trademark-pagination
  text-align: right
.el-pagination__sizes
  margin-left: 250px
</style>

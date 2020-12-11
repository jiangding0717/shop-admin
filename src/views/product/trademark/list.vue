<template>
  <div>
    <el-button type="primary" @click="visible = true" icon="el-icon-plus"
      >添加</el-button
    >
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

    <el-dialog
      title="添加品牌"
      :visible.sync="visible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        :model="trademarkForm"
        :rules="rules"
        ref="trademarkForm"
        label-width="100px"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademarkForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGo" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkForm.logoUrl"
              :src="trademarkForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件,且不超过50kb</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('trademarkForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
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
      visible: false, //上传图片开关显示
      trademarkForm: {
        tmName: '',
        logoUrl: '',
      },
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
        ],
        logoUrl: [{ required: true, message: '请输入品牌LOGO' }],
      },
    };
  },
  methods: {
    //提交表单
    submitForm(form) {
      //校验表单
      this.$refs[form].validate((valid) => {
        if (valid) {
          //表单校验通过
          console.log(this.trademarkForm);
        }
      });
    },
    //上传图片成功的回调
    handleAvatarSuccess() {},
    //上传图片之前触发的回调
    beforeAvatarUpload() {},

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
<style lang="sass" scoped>
.trademark-img
  width: 150px

.trademark-pagination
  text-align: right

>>>.el-pagination__sizes
  margin-left: 250px

>>>.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
  &:hover
    border-color: #409EFF

>>>.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center

>>>.avatar
  width: 178px
  height: 178px
  display: block
</style>

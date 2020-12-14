<template>
  <div>
    <el-button type="primary" @click="add" icon="el-icon-plus">添加</el-button>
    <el-table
      :data="trademarkList"
      v-loading="loading"
      border
      style="width: 100%; margin: 20px 0"
    >
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template v-slot="scope">
          <img class="trademark-img" :src="scope.row.logoUrl" alt="logo" />
          <!-- scope 代表所有数据
          scope.row代表当前行所有的数据
           -->
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="warning" icon="el-icon-edit" @click="update(row)"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" @click="del(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      class="trademark-pagination"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page="page"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
    >
    </el-pagination> -->

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

    <el-dialog
      :title="`${trademarkForm.id ? '修改' : '添加'}品牌`"
      :visible.sync="visible"
      width="30%"
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
            :action="`${$BASE_API}/admin/product/fileUpload`"
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
      trademarkList: [], //所有数据
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
          // 必填项、错误信息、触发表单校验时机
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
        ],
        logoUrl: [{ required: true, message: '请输入品牌LOGO' }],
      },
      loading: true, //区域加载
    };
  },
  methods: {
    //添加
    add() {
      this.visible = true;
      this.trademarkForm = {};
    },
    //修改
    update(row) {
      //显示对话框
      this.visible = true;

      this.trademarkForm = { ...row };
    },

    //删除功能
    async del(row) {
      this.$confirm(`确定删除${row.tmName}吗?`, '提示', {
        type: 'warning',
      }).then(async () => {
        const result = await this.$API.trademark.deleteTrademark(row.id);
        this.$message({
          type: 'success',
          message: '删除成功',
        });
      });
    },
    //提交表单
    submitForm(form) {
      //校验表单
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          const { trademarkForm } = this;
          //代表是否更新
          const isUpdate = !!trademarkForm.id;
          console.log(11111111);
          // 如果是修改需要验证
          if (isUpdate) {
            const tm = this.trademarkList.find(
              (tm) => tm.id === trademarkForm.id
            );
            console.log(222);
            if (
              tm.tmName === trademarkForm.tmName &&
              tm.logoUrl === trademarkForm.logoUrl
            ) {
              this.$message.warning('不能提交与之前一样的数据');
              return;
            }
          }
          let result;
          if (isUpdate) {
            result = await this.$API.trademark.updateTrademark(trademarkForm);
          } else {
            result = await this.$API.trademark.addTrademark(trademarkForm);
          }
          //表单校验通过
          // console.log(this.trademarkForm);
          //发送请求
          // const result = await this.$API.trademark.addTrademark(
          //   this.trademarkForm
          // );

          if (result.code === 200) {
            // this.$.message.success('添加品牌数据成功');
            this.$message.success(`${isUpdate ? '修改' : '添加'}品牌数据成功~`);
            //隐藏对话框
            this.visible = false;
            this.getPageList(this.page, this.limit); //请求加载新数据否则没有数据显示
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },
    //上传图片成功的回调
    handleAvatarSuccess(res) {
      // console.log(res);
      this.trademarkForm.logoUrl = res.data;
    },

    //上传图片之前触发的回调
    beforeAvatarUpload(file) {
      //定义图片类型
      const imgTypes = ['image/jpg', 'image/png', 'image/jpeg'];
      //检测文件类型
      const isValidType = imgTypes.indexOf(file.type) > -1;
      //检测文件大小
      const isLt = file.size / 1024 < 1024;

      if (!imgTypes) {
        this.$message.error('上传品牌LOGO只能是 JPG 或 PNG 格式!');
      }
      if (!isLt) {
        this.$message.error('上传品牌LOGO大小不能超过 50kb!');
      }
      //返回值为true，代表可以上传false不能
      return isValidType && isLt;
    },
    //请求分页列表数据
    async getPageList(page, limit) {
      this.loading = true; //请求之前加载
      const result = await this.$API.trademark.getPageList(page, limit);
      // console.log(result);
      if (result.code === 200) {
        this.$message.success('获取品牌分页列表成功');
        //获取到成功的信息
        this.limit = result.data.size; //代表显示的条数
        this.page = result.data.current; //代表第几页
        this.trademarkList = result.data.records; //总数据
        this.total = result.data.total; //总数
      } else {
        this.$message.error('获取品牌分页列表失败');
      }
      this.loading = false; //请求结束关闭
    },
  },

  /*  //改变的是每页条数
  handleSizeChange(limit) {
    //page是之前的page limit是传过来的limit
    this.getpageList(this.page, limit);
  },
  //改变的是page当前页码了
  handleCurrentChange(page) {
    this.getpageList(page, this.limit);
  }, */

  //发送请求
  mounted() {
    //代表一上来传的page与limit
    this.getPageList(this.page, this.limit);
  },
  // components: {
  //   Test,
  // },
};
</script>
<style lang="sass" scoped>
.trademark-img
  width: 150px

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

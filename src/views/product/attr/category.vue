<template>
  <div>
    <el-card>
      <el-form inline :model="category">
        <el-form-item label="一级分类">
          <el-select
            v-model="category.category1Id"
            placeholder="请选择"
            @change="handleSelectChange1"
            :disabled="disabled"
          >
            <el-option
              v-for="c1 in category1List"
              :label="c1.name"
              :value="c1.id"
              :key="c1.id"
            ></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="category.category2Id"
            placeholder="请选择"
            @change="handleSelectChange2"
            :disabled="disabled"
          >
            <el-option
              v-for="c2 in category2List"
              :label="c2.name"
              :value="c2.id"
              :key="c2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            v-model="category.category3Id"
            placeholder="请选择"
            @change="handleSelectChange3"
            :disabled="disabled"
          >
            <el-option
              v-for="c3 in category3List"
              :key="c3.id"
              :label="c3.name"
              :value="c3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import result from 'autoprefixer/data/prefixes';

export default {
  name: 'Category',
  props: ['disabled'],
  data() {
    return {
      category: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
      category1List: [], //数据
      category2List: [],
      category3List: [],
    };
  },

  methods: {
    //请求getCategorys2
    async handleSelectChange1(category1Id) {
      this.category2List = [];
      this.category3List = [];
      this.category.category2Id = '';
      this.category.category3Id = '';
      const result = await this.$API.attrs.getCategorys2(category1Id);
      if (result.code === 200) {
        this.category2List = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    //请求getCategorys3
    async handleSelectChange2(category2Id) {
      this.category3List = [];
      this.category.category3Id = '';
      const result = await this.$API.attrs.getCategorys3(category2Id);
      if (result.code === 200) {
        this.category3List = result.data;
      } else {
        this.$message.error(result.message);
      }
    },

    async handleSelectChange3(category3Id) {
      const category = {
        ...this.category,
        category3Id,
      };
      this.$emit('change', category);
    },
  },

  //发送请器
  async mounted() {
    //请求getCategorys1
    const result = await this.$API.attrs.getCategorys1();
    if (result.code === 200) {
      this.category1List = result.data;
      // console.log(result);
    } else {
      this.$message.error(result.message);
    }
  },
};
</script>

<style lang="less" scoped>
</style>

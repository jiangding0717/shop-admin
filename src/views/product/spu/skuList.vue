<template>
  <el-card>
    <el-form label-width="100px" :model="sku" :rules="rules" ref="spuForm">
      <el-form-item label="SPU名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称" prop="skuName">
        <el-input placeholder="请输入SKU名称" v-model="sku.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input-number
          align="left"
          style="width: 300px"
          placeholder="请输入价格"
          controls-position="right"
          v-model="sku.price"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)" prop="weight">
        <el-input-number
          style="width: 300px"
          placeholder="请输入重量"
          controls-position="right"
          v-model="sku.weight"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="规格描述" prop="description">
        <el-input
          type="textarea"
          placeholder="请输入规格描述"
          v-model="sku.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <div
          class="skulist-select-container"
          v-for="(attr, index) in attrList"
          :key="attr.id"
        >
          <span>{{ attr.attrName }}</span>
          <el-form-item prop="skuAttrValueList">
            <el-select
              placeholder="请选择"
              v-model="sku.skuAttrValueList[index]"
            >
              <el-option
                v-for="value in attr.attrValueList"
                :key="value.id"
                :label="value.valueName"
                :value="`${attr.id}-${value.id}`"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="销售属性">
        <div
          class="skulist-select-container"
          v-for="(sale, index) in spuSaleAttrList"
          :key="sale.id"
        >
          <span>{{ sale.saleAttrName }}</span>
          <el-form-item
            style="display: inline-block"
            prop="skuSaleAttrValueList"
          >
            <el-select
              placeholder="请选择"
              v-model="sku.skuSaleAttrvalueList[index]"
            >
              <el-option
                v-for="value in sale.spuSaleAttrValueList"
                :key="value.id"
                :label="value.saleAttrValueName"
                :value="`${sale.id}-${value.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          ref="multipleTable"
          border
          :data="imageList"
          tooltip-effect="dark"
          style="width: 100%; margin: 20px 0"
          @selection-change="handleSelectionChange"
          row-key="id"
        >
          <!-- row-key="id"遍历会生成key自己回去 -->
          <el-table-column type="selection" reserve-selection width="55">
          </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope"
              ><img
                style="display: inline-block; width: 100%; height: 100px"
                :src="scope.row.imgUrl"
                :alt="scope.row.imgName"
            /></template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"> </el-table-column>
          <el-table-column prop="address" label="操作">
            <template v-slot="{ row, $index }">
              <el-button
                v-if="!row.isDefault"
                type="primary"
                size="mini"
                @click="setDefault($index)"
                >设为默认</el-button
              >
              <el-tag v-else type="success">默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'SkuList',

  props: {
    spuItem: Object,
  },
  data() {
    return {
      rules: {}, //校验规则
      spu: this.spuItem,
      imageList: [], //图片列表
      spuSaleAttrList: [], //销售属性数据
      attrList: [], //平台数据列表
      // sku数据
      sku: {
        //初始化一个空数组
        skuAttrValueList: [],
        skuSaleAttrvalueList: [],
        skuImageList: [],
      },
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  methods: {
    setDefault(i) {
      this.imageList = this.imageList.map((img, index) => {
        return {
          ...img,
          isDefault: i === index ? true : false,
        };
      });
    },
    handleSelectionChange(skuImageList) {
      this.sku.skuImageList = skuImageList;
    },
    //获取平台属性值列表
    async getAttrList() {
      const result = await this.$API.attrs.getAttrList(this.category);
      if (result.code === 200) {
        this.$message.success('获取平台数据列表成功');
        // console.log(result);
        this.attrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    //获取图片数据
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      if (result.code === 200) {
        this.$message.success('图片获取成功');
        this.imageList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    //获取SPU销售属性数据
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      if (result.code === 200) {
        this.$message.success('获取SPU销售属性列表成功');
        this.spuSaleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    this.getSpuImageList();
    this.getSpuSaleAttrList();
    this.getAttrList();
  },
};
</script>

<style lang="sass" scoped>
>>>.el-input-number .el-input__inner
  text-align: left

.skulist-select-container
  display: inline-block
  margin-right: 20px

  .skulist-select-container
    display: inline-block
    width: 30%
    text-align: right
    margin-bottom: 10px
</style>

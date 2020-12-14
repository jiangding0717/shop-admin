<template>
  <div>
    <!-- 自定义事件 -->
    <!-- <Category
      @change="getAttrList"
      @clearList="clearList"
      :disabled="!isShowList"
    /> -->
    <!-- 换成全局事件总线 -->
    <Category :disabled="!isShowList" />
    <el-card style="margin-top: 20px" v-show="isShowList">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!category.category3Id"
        @click="addShuXing"
        >添加属性</el-button
      >
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
              @click="del(row)"
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
      <el-button type="primary" icon="el-icon-plus" @click="addAttrValue"
        >添加属性值</el-button
      >
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
          <template v-slot="{ row, $index }">
            <el-input
              size="mini"
              v-if="row.edit"
              v-model="row.valueName"
              @blur="editComplted(row, $index)"
              @keyup.enter.native="editComplted(row, $index)"
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
          <template v-slot="{ row, $index }">
            <el-popconfirm
              :title="`确定删除吗？${row.valueName}`"
              @onConfirm="delAttrValue($index)"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                slot="reference"
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="isShowList = true">取消</el-button>
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
import Category from '@/components/Category';

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
      category: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
    };
  },
  //绑定的自定义事件
  methods: {
    //
    clearList() {
      //让数据为空
      this.attrList = [];
      this.category.category3Id = ''; //禁用按钮
    },
    //添加属性
    addShuXing() {
      this.attr.attrValueList = [];
      this.attr.attrName = '';
      this.isShowList = false;
      this.attr.id = '';
    },
    //保存数据
    async save() {
      // const result = await this.$API.attrs.saveAttrInfo(this.attr);
      //判断是否添加
      const isAdd = !this.attr.id;
      const data = this.attr;
      if (isAdd) {
        data.categoryId = this.category.category3Id;
        data.categoryLevel = 3;
      }
      //修改
      const result = await this.$API.attrs.saveAttrInfo(data);
      if (result.code === 200) {
        this.$message.success('更新数据成功');
        this.$API.attrs.saveAttrInfo(this.attr);
        this.getAttrList(this.category);
        this.isShowList = true;
      } else {
        this.$message.error(result.message);
      }
    },
    //
    editComplted(row, index) {
      if (!row.valueName) {
        this.attr.attrValueList.splice(index, 1);
        return;
      }
      row.edit = false;
    },
    //删除属性值
    delAttrValue(index) {
      this.attr.attrValueList.splice(index, 1);
    },
    //添加属性值
    addAttrValue() {
      this.attr.attrValueList.push({ edit: true });
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //删除属性
    async del(row) {
      if (window.confirm('确认删除?')) {
        const result = await this.$API.attrs.deleteAttr(row.id);
        if (result.code === 200) {
          this.$message.success('数据删除成功');
          this.getAttrList(this.category);
          //更新数据
        } else {
          this.$message.error(result.message);
        }
      }
    },

    edit(row) {
      this.$set(row, 'edit', true); //通过this.$set添加的属性才是响应式
      /* $nextTick等Dom元素渲染完成在调用 */
      this.$nextTick(() => {
        this.$refs.input.focus(); //聚集焦点
      });
    },
    //修改
    update(attr) {
      //浅度克隆
      // this.attr = {
      //   ...attr,
      // };
      //深度克隆
      this.attr = JSON.parse(JSON.stringify(attr));
      this.isShowList = false;
    },

    async getAttrList(category) {
      this.category = category;
      const result = await this.$API.attrs.getAttrList(category);
      if (result.code === 200) {
        this.attrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  //触发全局自定义事件
  mounted() {
    this.$bus.$on('change', this.getAttrList);
    this.$bus.$on('clearList', this.clearList);
  },
  //销毁全局自定义事件防止多次发送请求
  beforeDestroy() {
    this.$bus.$off('change', this.getAttrList);
    this.$bus.$off('clearList', this.clearList);
  },
  components: {
    Category,
  },
};
</script>

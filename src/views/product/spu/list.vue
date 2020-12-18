<template>
  <div>
    <SkuList v-if="isShowSkuList" :spuItem="spuItem" />
    <div v-else>
      <Category />
      <SpuShowList
        v-if="isShowList"
        @showUpdateList="showUpdateList"
        @showSpuList="showSpuList"
      />
      <SpuUpdateList v-else :item="item" @showList="showList" />
    </div>
  </div>
</template>

<script>
import Category from '@/components/Category';
import SpuShowList from './spuShowList';
import SpuUpdateList from './spuUpdateList';
import SkuList from './skuList';
export default {
  name: 'SpuList',
  data() {
    return {
      isShowList: true,
      item: {},
      isShowSkuList: false,
      spuItem: {},
    };
  },
  methods: {
    showSpuList(row) {
      this.isShowSkuList = true;
      this.spuItem = { ...row };
    },
    showUpdateList(row) {
      this.isShowList = false;
      this.item = { ...row };
    },

    showList(category3Id) {
      this.isShowList = true;
      //等ShowList组件加载完成，在触发事件
      // this.$nextTick(() => {
      //   this.$bus.$emit('change', { category3Id });
      // });
    },
  },

  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
    SkuList,
  },
};
</script>

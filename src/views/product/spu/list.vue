<template>
  <div>
    <Category />
    <SpuShowList v-if="isShowList" @showUpdateList="showUpdateList" />
    <SpuUpdateList v-else :item="item" />
  </div>
</template>

<script>
import Category from '@/components/Category';
import SpuShowList from './spuShowList';
import SpuUpdateList from './spuUpdateList';
import { methods } from 'v-charts/lib/core';
export default {
  name: 'SpuList',
  data() {
    return {
      isShowList: true,
      item: {},
    };
  },
  methods: {
    showUpdateList(row) {
      this.isShowList = false;
      this.item = { ...row };
    },
  },

  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
  },
};
</script>

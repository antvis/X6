<template>
  <el-progress type="dashboard" :percentage="percentage" :width="80">
    <template #default="{ percentage }">
      <span class="percentage-value">{{ percentage }}%</span>
    </template>
  </el-progress>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Node } from '@antv/x6';

export default defineComponent({
  name: 'ProgressNode',
  inject: ['getNode'],
  data() {
    return {
      percentage: 80
    }
  },
  mounted() {
    const node = (this as any).getNode() as Node
    node.on('change:data', ({ current }) => {
      const { progress } = current;
      this.percentage = progress;
    })
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-progress {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #8f8f8f;
  border-radius: 6px;
}
.percentage-value {
  display: block;
  font-size: 20px;
}
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  width: 350px;
}
.demo-progress .el-progress--circle {
  margin-right: 15px;
}
</style>

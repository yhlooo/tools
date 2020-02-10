<template>
  <div id="divination" class="tool-main-normal">
    <h1 class="tool-h1-normal" @click="changeFate">知命</h1>
    <div class="con" @click="changeFate">
      <el-col>
        <el-card shadow="never">
          {{h.picture}}
          {{h.name}}
          {{h.fortune}}
          {{h.description}}
        </el-card>
      </el-col>
    </div>

  </div>
</template>

<script>
import { res } from './result'
export default {
  name: 'Divination',
  data () {
    return {
      h: res[Math.ceil(Math.random() * 64)]
    }
  },
  methods: {
    changeFate () {
      this.h = res[Math.ceil(Math.random() * 64)]
      console.log('i try')
    }
  }
}
</script>

<style scoped>

</style>

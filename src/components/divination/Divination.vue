<template>
  <div id="divination" class="tool-main-normal">
    <h1 class="tool-h1-normal" @click="changeFate">知命</h1>
    <div class="con" @click="changeFate">
      <el-col>
        <el-card shadow="never">
          <div>
            <el-row>
              <el-col :span="2" :offset="18"><div class="vertical right">{{ h.brief }}</div></el-col>
              <el-col :span="2"><div class="vertical right">{{ h.fortune }}</div></el-col>
              <el-col :span="2"><div class="vertical right">{{ h.tag }}</div></el-col>
            </el-row>
            <el-row>
              <el-col :span="2"> <div class="vertical left">{{ h.picture }} {{ h.name }}</div></el-col>
            </el-row>
          </div>

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
  .vertical {
    width: 0;
  }
  /*.right {*/
  /*  display: block;*/
  /*  float: right;*/
  /*}*/
</style>

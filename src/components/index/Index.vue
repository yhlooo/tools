<template>
  <div id="index">
    <ul>
      <li v-for="tool in tools" :key="tool.name">
        <el-link :title="tool.title" @click="switchToTools(tool.url)">{{ tool.title }}</el-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      tools: [{
        name: 'Base64Codec',
        title: 'Base64 编解码器',
        url: '/base64-codec'
      }, {
        name: 'Fate',
        title: '命运',
        url: '/fate'
      }]
    }
  },
  methods: {
    switchToTools (toolUrl) {
      this.$router.push(toolUrl)
    }
  }
}
</script>

<style scoped>

</style>

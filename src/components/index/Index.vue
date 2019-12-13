<template>
  <div id="index">
    <ul>
      <li><el-link @click="switchToTools('base64-codec')">Base64 在线编解码</el-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Index',
  methods: {
    switchToTools (toolName) {
      console.log(toolName)
      if (['base64-codec'].indexOf(toolName) !== -1) {
        this.$router.push(toolName)
      }
    }
  }
}
</script>

<style scoped>

</style>

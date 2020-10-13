<template>
  <i class="el-icon-back tool-home-btn" @click="goHome"></i>
</template>

<script>
export default {
  name: 'ToolNormalHomeBtn',
  data () {
    return {
    }
  },
  methods: {
    goHome () {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
  .tool-home-btn {
    font-weight: bold;
    margin-right: 5px;
  }
</style>

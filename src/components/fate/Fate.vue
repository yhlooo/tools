<template>
  <div id="fate" class="tool-main-normal">
    <h1 class="tool-h1-normal">
      命运 -
      <el-dropdown class="fate-mode-selector" trigger="click" @command="switchMode">
        <span class="el-dropdown-link fate-mode" :style="`color: ${mode.color}`">
          {{ mode.label }}<i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="option in modeOptions"
            :key="option.url"
            :command="option">
            {{ option.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </h1>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Fate',
  data () {
    return {
      mode: { label: '抛硬币', url: 'flip-a-coin', color: '#29769f' },
      modeOptions: [
        { label: '抛硬币', url: 'flip-a-coin', color: '#29769f' },
        { label: '抽签', url: 'draw', color: '#9f4e2c' }
      ]
    }
  },
  watch: {
    $route (to) {
      this.checkUrl(to.path)
    }
  },
  mounted () {
    this.checkUrl(this.$route.path)
  },
  methods: {
    switchMode (newMode) {
      if (this.mode !== newMode) {
        this.$router.push(`/fate/${newMode.url}`)
      }
    },
    checkUrl (url) {
      let urlMatchGroups = url.match('^/fate/([^/]*?)(/.*?)?$')
      if (urlMatchGroups) {
        for (let i = 0; i < this.modeOptions.length; i++) {
          if (urlMatchGroups[1] === this.modeOptions[i].url) {
            this.mode = this.modeOptions[i]
            break
          }
        }
      }
    }
  }
}
</script>

<style scoped>
  .fate-mode-selector {
    height: 100%;
    font-size: inherit;
    color: inherit;
  }
  .fate-mode:hover {
    text-shadow: 5px 5px 10px #dedede;
    cursor: pointer;
  }
</style>

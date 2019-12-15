<template>
  <div id="flip-a-coin">
    <div
      class="coin-panel-cover"
      @mousedown="coinPressHandler"
      @mouseup="coinReleaseHandler"
      @touchstart="coinPressHandler"
      @touchend="coinReleaseHandler">
    </div>
    <div class="coin-panel">
      <img
        v-if="coinImagesLoadedNum === coinImagesTotalNum" :src="coinImageUrl"
        :style="{'max-width': `${coinSize}%`, 'max-height': `${coinSize}%`}"
        alt title>
      <div v-if="coinImagesLoadedNum < coinImagesTotalNum" class="image-loading-progress">
        <el-progress
          :text-inside="true"
          :stroke-width="20"
          :percentage="coinImagesLoadingProgress"
          style="width: 100%"
        >
        </el-progress>
        <div><b>硬币</b>加载中...</div>
      </div>
    </div>

    <i class="el-icon-s-tools icon-btn" @click="showSettingsPanel = true"></i>
    <i class="el-icon-info icon-btn" @click="showTipsPanel = true"></i>

    <el-drawer
      title="高级设置"
      :visible.sync="showSettingsPanel"
      direction="btt"
      size="40%"
      @opened="settingsPanelOpenedHandler"
      @closed="settingsPanelClosedHandler">
      <span slot="title" role="heading" tabindex="0" title="高级设置" style="outline: none">高级设置</span>
      <div class="settings-panel">
        <span class="label">
          硬币大小
          <el-tooltip effect="dark" content="拖动滑块，调整硬币大小至接近真实大小" placement="right">
            <i class="el-icon-info tips"></i>
          </el-tooltip>
        </span>
        <el-slider class="max-width" v-model="coinSize" :show-tooltip="false"></el-slider>
        <span class="label">
          旋转速度
          <el-tooltip effect="dark" content="拖动滑块，调整硬币旋转速度至满意" placement="right">
            <i class="el-icon-info tips"></i>
          </el-tooltip>
        </span>
        <el-slider class="max-width" v-model="coinRotatingSpeed" :show-tooltip="false"></el-slider>
        <span class="label">
          硬币类型
          <el-tooltip effect="dark" content="选择一枚自己喜欢的硬币" placement="right">
            <i class="el-icon-info tips"></i>
          </el-tooltip>
        </span>
        <el-select v-model="coinType" placeholder="硬币类型">
          <el-option
            v-for="option in coinTypeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value">
          </el-option>
        </el-select>
      </div>
    </el-drawer>

    <el-drawer
      title="使用说明"
      :visible.sync="showTipsPanel"
      direction="btt"
      size="60%">
      <span slot="title" role="heading" tabindex="0" title="使用说明" style="outline: none">使用说明</span>
      <div class="tips-panel">
        <h3>使用方法</h3>
        <p>请参考以下步骤：</p>
        <ol>
          <li>按住硬币，心中默念自己的选择（数字还是菊花）</li>
          <li>松开拇指/鼠标，硬币开始“在空中”旋转，同时抬头看天</li>
          <li>旋转一段时间后，再次按住硬币，硬币落到手中，停止旋转，上面显示着命运的选择</li>
          <li>虔诚地遵从命运的选择</li>
        </ol>
        <p><b>Tips: 旋转时间与结果无关</b></p>
        <h3>高级设置</h3>
        <p>点击页面上的 <i class="el-icon-s-tools icon-btn"></i> 图标，可以打开设置面板</p>
        <p>在设置面板打开状态下，硬币会自动进入旋转状态，以作为设置参考</p>
        <p>调节硬币大小，使页面上显示的硬币大小<b>与真实硬币接近</b>；调节旋转速度至<b>使你感觉舒适、放松</b>的值</p>
        <p>也可以选择自己喜欢的硬币款式</p>
      </div>
    </el-drawer>

  </div>
</template>

<script>
export default {
  name: 'FlipACoin',
  data () {
    return {
      coinSize: 90,
      coinCurrent: -1,
      coinImages: [],
      coinImagesLoadedNum: 0,
      coinImagesTotalNum: 72,
      showSettingsPanel: false,
      showTipsPanel: false,
      coinStatus: 'static', // 'static', 'ready', 'rotating'
      coinRotatingSpeed: 60,
      coinRotatingTimer: null,
      coinTriggerCooling: false,
      coinType: '1-cny',
      coinTypeOptions: [
        { label: '1元人民币', value: '1-cny' },
        { label: '1854版3美元金币', value: '3-us-dollar' }
      ]
    }
  },
  computed: {
    coinImageUrl () {
      return this.coinCurrent >= 0 ? this.coinImages[this.coinCurrent].src : ''
    },
    coinImagesLoadingProgress () {
      return parseInt((this.coinImagesLoadedNum / this.coinImagesTotalNum * 100).toString())
    }
  },
  watch: {
    coinType () {
      this.catchTheCoin()
      this.preloadCoinImages()

      let currentHandler = this.coinImages[0].onload
      this.coinImages[0].onload = () => {
        currentHandler()
        if (this.showSettingsPanel) {
          clearTimeout(this.coinRotatingTimer)
          this.coinRotatingTimer = null
          this.coinStatus = 'rotating'
          this.flipTheCoin()
        }
      }
    }
  },
  mounted () {
    this.preloadCoinImages()
  },
  methods: {
    preloadCoinImages () {
      this.coinImages = []
      this.coinImagesLoadedNum = 0
      this.coinCurrent = -1
      for (let i = 0; i < 360; i += 5) {
        let image = new Image()
        image.src = `/static/images/coin/${this.coinType}/${i}-medium.png`
        image.onload = () => {
          this.coinImagesLoadedNum += 1
          if (this.coinImagesLoadedNum === this.coinImagesTotalNum) {
            this.coinCurrent = 0
          }
        }
        this.coinImages[this.coinImages.length] = image
      }
    },
    settingsPanelOpenedHandler () {
      clearTimeout(this.coinRotatingTimer)
      this.coinRotatingTimer = null
      this.coinStatus = 'rotating'
      this.flipTheCoin()
    },
    settingsPanelClosedHandler () {
      this.coinStatus = 'static'
      this.catchTheCoin()
    },
    coinPressHandler () {
      if (this.coinTriggerCooling) {
        return
      }
      if (this.coinStatus === 'static') {
        this.coinStatus = 'ready'
      } else if (this.coinStatus === 'rotating') {
        this.coinStatus = 'static'
        this.catchTheCoin()
        this.coinTriggerCooling = true
        setTimeout(() => {
          this.coinTriggerCooling = false
        }, 500)
      }
    },
    coinReleaseHandler () {
      if (this.coinTriggerCooling) {
        return
      }
      if (this.coinStatus === 'ready') {
        this.coinStatus = 'rotating'
        this.flipTheCoin()
        this.coinTriggerCooling = true
        setTimeout(() => {
          this.coinTriggerCooling = false
        }, 500)
      }
      return false
    },
    flipTheCoin () {
      if (this.coinStatus !== 'rotating') {
        return
      }
      this.coinCurrent = (this.coinCurrent + parseInt((this.coinRotatingSpeed / 10).toString())) % this.coinImagesTotalNum
      this.coinRotatingTimer = setTimeout(() => { this.flipTheCoin() }, 10)
    },
    catchTheCoin () {
      clearTimeout(this.coinRotatingTimer)
      this.coinRotatingTimer = null
      if (Math.random() > 0.5) {
        this.coinCurrent = 0
      } else {
        this.coinCurrent = parseInt((this.coinImagesTotalNum / 2).toString())
      }
    }
  }
}
</script>

<style scoped>
  .max-width {
    max-width: 400px;
  }
  .coin-panel-cover {
    position: absolute;
    height: 400px;
    max-height: 90vw;
    width: 90%;
    max-width: 1024px;
    z-index: 5;
    background-color: transparent;
    user-select: none;
  }
  .coin-panel {
    display: flex;
    box-sizing: border-box;
    height: 400px;
    max-height: 90vw;
    padding: 30px;
    justify-content: center;
    align-content: center;
    align-items: center;
  }
  .image-loading-progress {
    width: 100%;
    text-align: center;
  }
  .settings-panel {
    height: calc(40vh - 74px);
    padding: 5px 20px;
    outline: none;
    overflow: auto;
  }
  .tips-panel {
    height: calc(60vh - 74px);
    padding: 5px 20px;
    outline: none;
    overflow: auto;
  }
  .tips {
    color: #409eff;
    cursor: pointer;
  }
  .tips:hover {
    color: #3373c7;
  }
</style>

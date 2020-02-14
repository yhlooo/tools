<template>
  <div id="divination" class="tool-main-normal divination-main">
    <h1 class="tool-h1-normal divination-title">知命</h1>
    <div class="main-panel">
      <div class="user-cv-container" v-show="!resultVisible">
        <canvas ref="userCv" class="user-cv">
          不支持canvas的浏览器
        </canvas>
      </div>
      <div class="result-container" v-show="resultVisible & !detailVisible" @click="detailVisible = true">
          <div class="r-content">
            <div class="vertical right">{{ result.brief }}</div>
            <div class="vertical right">{{ result.fortune }}</div>
            <div class="vertical right">{{ result.tag }}</div>
          </div>
          <div class="vertical left">{{ result.picture }} {{ result.name }}</div>
      </div>
      <div class="result-detail-container" v-show="detailVisible" @click="detailVisible = false">
        {{result.description}}
      </div>
    </div>

    <div class="divination-footer btn-group">
      <el-button plain @click="handleClearBtnClick">{{ resultVisible ? '重置' : '清空' }}</el-button>
      <el-button plain @click="divine" v-show="!resultVisible">发书占之</el-button>
      <i class="el-icon-info keybrl-icon-btn lg" @click="tipsPanelVisible = true"></i>
    </div>

    <!-- 帮助信息面板 -->
    <el-drawer
      title="使用说明"
      :visible.sync="tipsPanelVisible"
      direction="btt"
      size="60%">
      <span slot="title" role="heading" tabindex="0" title="使用说明" style="outline: none">使用说明</span>
      <div class="tips-panel">
        <h3>使用方法</h3>
        <p>请参考以下步骤：</p>
        <ol>
          <li>写下或简要画出你的问题</li>
          <li>点击"发书占之"</li>
          <li>如果你不喜欢这个结果可以重新绘图直到出现你想要的结果</li>
          <li>毕竟命运掌握在自己手中</li>
          <li>单击结果卡可以查看此卦详情</li>
          <li>你可以开始了</li>
        </ol>
      </div>
    </el-drawer>

  </div>
</template>

<script>
import { sha256 } from 'js-sha256'
import { results } from './results'

export default {
  name: 'Divination',
  data () {
    return {
      result: {
        name: null,
        brief: null,
        fortune: null,
        description: null,
        picture: null,
        tag: null
      },
      tipsPanelVisible: false,
      resultVisible: false,
      detailVisible: false,

      // 窗口大小改变事件处理器的计时器（用于函数节流）
      windowResizeHandlerTimer: null
    }
  },
  mounted () {
    this.initUserCanvas()
    window.onresize = this.throttledHandleWindowResize
  },
  methods: {

    initUserCanvas () {
      this.setUserCvSize()
      const cv = this.$refs.userCv
      const ctx = cv.getContext('2d')

      ctx.lineWidth = 3

      // 绑定用户鼠标按下事件，使用户能够绘画
      cv.onmousedown = function (ev) {
        console.log('[INFO] 正在用鼠标作画')
        ctx.moveTo(ev.clientX - cv.offsetLeft, ev.clientY - cv.offsetTop)
        document.onmousemove = function (ev) {
          ctx.lineTo(ev.clientX - cv.offsetLeft, ev.clientY - cv.offsetTop)
          ctx.stroke()
        }
        document.onmouseup = function () {
          document.onmousemove = null
          document.onmouseup = null
        }
      }

      // 绑定用户触摸事件，使用户能够使用触摸屏绘画
      cv.ontouchstart = function (ev) {
        console.log('[INFO] 正在用触摸屏作画')
        ctx.moveTo(ev.touches[0].clientX - cv.offsetLeft, ev.touches[0].clientY - cv.offsetTop)
        document.ontouchmove = function (ev) {
          ctx.lineTo(ev.touches[0].clientX - cv.offsetLeft, ev.touches[0].clientY - cv.offsetTop)
          ctx.stroke()
        }
        document.ontouchend = function () {
          document.ontouchmove = null
          document.ontouchend = null
        }
      }

      window.onresize = () => {
        console.log('2')
      }
    },

    /**
     * 设置画布大小
     *
     * 将画布大小设置为其显示大小
     */
    setUserCvSize () {
      const cv = this.$refs.userCv
      cv.width = cv.clientWidth
      cv.height = cv.clientHeight
    },

    /**
     * 占卜
     *
     * 1. 从画布导出 Base64 编码的数据
     * 2. 计算其 SHA256
     * 3. 根据 SHA256 的结果选择一个卦
     * 4. 展示之
     */
    divine () {
      const cvDataBase64 = this.$refs.userCv.toDataURL('image/png')
      const cvDataSha256 = sha256(cvDataBase64)

      let resIndex = 0
      for (let i = 0; i < 6; i++) {
        resIndex *= 2
        resIndex += parseInt(cvDataSha256.substr(i * 10, 10), 16) > 5549755813887.5 ? 1 : 0
      }
      resIndex += parseInt(cvDataSha256.substr(60, 4), 16)

      this.result = results[resIndex % 64]
      this.resultVisible = true

      console.log(`[INFO] 抽取到第 ${resIndex % 64} 个结果`)
    },

    /**
     * 处理清空按钮点击事件
     *
     * 清空画布、结果
     */
    handleClearBtnClick () {
      this.$refs.userCv.height += 0
      this.resultVisible = false
      this.detailVisible = false
    },

    /**
     * （节流地）处理窗口大小改变
     *
     * 同步修改画布大小
     */
    throttledHandleWindowResize () {
      const that = this

      // 清除定时器
      clearTimeout(this.windowResizeHandlerTimer)

      // 设置定时器
      this.windowResizeHandlerTimer = setTimeout(() => {
        that.$message.warning('由于画布大小改变，内容将会清空')
        console.log('[WARNING] 由于画布大小改变，内容将会清空')
        that.setUserCvSize()
      }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
  .divination-main {
    display: flex;
    height: 100vh;
    flex-direction: column;

    .main-panel {
      flex-grow: 1;
      max-height: 650px;
      padding: 10px;
      border-width: 1px;
      border-style: solid;
      border-color: #d3d5db;
      border-radius: 5px;
      overflow: hidden;

      .user-cv-container, .user-cv {
        width: 100%;
        height: 100%;
      }
    }

    .divination-footer {
      margin: 24px 0;
    }
  }

  .r-content {
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-start;
  }
  .right {
    margin: 0 3px 0 2px;
  }
  .left {
    padding-top: 19px;
    align-items: flex-end;
  }
  .vertical {
    /*width: 0;*/
    writing-mode:tb-rl;
    letter-spacing: 4px;
  }
  .main-panel {

  }
</style>

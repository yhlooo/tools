<template>
  <div id="divination" class="tool-main-normal divination-main">

    <!-- 标题 -->
    <h1 class="tool-h1-normal divination-title">知命</h1>

    <!-- 主面板 -->
    <div
      class="main-panel"
      :class="{
        'light-yellow-bg': isDivined && isResultTextVertical,
        'grow': !isDivined || isResultTextVertical
      }"
    >

      <!-- 画布 -->
      <div class="user-cv-container" v-show="!isDivined">
        <canvas ref="userCv" class="user-cv">
          不支持canvas的浏览器
        </canvas>
      </div>

      <!-- 结果 -->
      <div
        class="result-container"
        :class="isResultTextVertical ? 'vertical' : 'horizontal'"
        v-show="isDivined"
        @click="isResultTextVertical = !isResultTextVertical"
      >
        <div v-show="isResultTextVertical">
          {{ result.brief }}<br>
          <span class="red">{{ result.fortune }}</span><br>
          {{ result.tag }}
        </div>
        <div v-show="!isResultTextVertical">
          {{ result.brief }}（{{ result.fortune }}）<br>
          {{ result.tag }}
        </div>
        <div class="result-detail">
          {{ isResultTextVertical ? removePunctuation(result.description) : result.description }}
        </div>
        <div class="result-space"></div>
        <div class="result-end"><span class="red">{{ result.picture }}</span> {{ result.name }}</div>
      </div>

    </div>

    <!-- 底部按钮 -->
    <div class="divination-footer btn-group">
      <el-button plain @click="handleClearBtnClick">{{ isDivined ? '重置' : '清空' }}</el-button>
      <el-button plain @click="divine" v-show="!isDivined">发书占之</el-button>
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
          <li>单击结果可以以不同模式查看此卦</li>
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
      isDivined: false,
      isResultTextVertical: true,

      // 窗口大小改变事件处理器的计时器（用于函数节流）
      windowResizeHandlerTimer: null
    }
  },
  mounted () {
    this.initUserCanvas()
    window.onresize = this.throttledHandleWindowResize
  },
  methods: {

    /**
     * 初始化画布
     */
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
      this.isDivined = true

      console.log(`[INFO] 抽取到第 ${resIndex % 64} 个结果`)
    },

    /**
     * 去掉文本中的标点
     */
    removePunctuation (sourceText) {
      if (sourceText === null) {
        return null
      }

      let resultText = sourceText
      resultText = resultText.replace(/[：、，；。《》（）“”]/g, ' ')
      return resultText
    },

    /**
     * 处理清空按钮点击事件
     *
     * 清空画布、结果
     */
    handleClearBtnClick () {
      this.$refs.userCv.height += 0
      this.isDivined = false
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
        if (!this.isDivined) {
          that.$message.warning('由于画布大小改变，内容将会清空')
        }
        console.log('[WARNING] 由于画布大小改变，内容将会清空')
        that.setUserCvSize()
      }, 500)
    }

  }
}
</script>

<style lang="less" scoped>
  @font-face {
    font-family: '方正楷体';
    src: url("/static/fzktk.ttf");
  }

  .divination-main {
    display: flex;
    height: 100vh;
    flex-direction: column;

    .main-panel {
      max-height: 650px;
      padding: 10px;
      border-width: 1px;
      border-style: solid;
      border-color: #d3d5db;
      border-radius: 5px;
      overflow: hidden;
      transition: background-color 1s;

      .user-cv-container, .result-container, .user-cv {
        width: 100%;
        height: 100%;
      }

      .result-container {
        font-family: '方正楷体', serif;

        /* 竖排的结果 */
        &.vertical {
          display: flex;
          flex-direction: row-reverse;

          div {
            margin: 0 5px;

            /* 竖排文字 */
            writing-mode:tb-rl;
            letter-spacing: 2px;
            line-height: 22px;

            &.result-detail {  /* 卦象描述 */
              padding-bottom: 32px;
            }
            &.result-end {  /* 对齐到底部 */
              align-self: flex-end;
              padding-bottom: 16px;
            }
            &.result-space {  /* 留白 */
              flex-grow: 1;
            }
          }

          .red {
            color: #b12524;
          }
        }

        /* 横排的结果 */
        &.horizontal {
          div {
            margin: 5px 0 12px;
            line-height: 28px;

            &.result-end {
              margin-top: 20px;
              text-align: right;
              font-weight: bolder;
            }
          }
        }
      }

      &.light-yellow-bg {
        background-color: #e5ddc9;
      }
      &.grow {
        flex-grow: 1;
      }
    }

    .divination-footer {
      margin: 24px 0;
    }

    .tips-panel {
      height: calc(60vh - 74px);
      padding: 5px 20px;
      outline: none;
      overflow: auto;
    }
  }

</style>

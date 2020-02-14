<template>
  <div id="divination" class="tool-main-normal">
    <h1 class="tool-h1-normal">知命</h1>
    <div class="main-panel">
      <div class="user-cv-container">
        <canvas v-show="!resultVisible" id="user-cv" class="user-cv">
          不支持canvas的浏览器
        </canvas>
      </div>
      <div v-show="resultVisible & !detailVisible" @click="detailVisible = true">
          <div class="r-content">
            <div class="vertical right">{{ result.brief }}</div>
            <div class="vertical right">{{ result.fortune }}</div>
            <div class="vertical right">{{ result.tag }}</div>
          </div>
          <div class="vertical left">{{ result.picture }} {{ result.name }}</div>
<!--        <el-row>-->
<!--          <el-col :span="2" :offset="18"><div class="vertical right">{{ result.brief }}</div></el-col>-->
<!--          <el-col :span="2"><div class="vertical right">{{ result.fortune }}</div></el-col>-->
<!--          <el-col :span="2"><div class="vertical right">{{ result.tag }}</div></el-col>-->
<!--        </el-row>-->
<!--        <el-row>-->
<!--          <el-col :span="2"> <div class="vertical left">{{ result.picture }} {{ result.name }}</div></el-col>-->
<!--        </el-row>-->
      </div>
      <div v-show="detailVisible" @click="detailVisible = false">
        {{result.description}}
      </div>
    </div>

    <div class="btn-group">
      <el-button plain @click="handleClearBtnClick">{{clearBtnLabel}}</el-button>
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
      clearBtnLabel: '清空'
    }
  },
  mounted () {
    this.initUserCanvas()
  },
  methods: {

    initUserCanvas () {
      this.setUserCvSize()
      const cv = document.getElementById('user-cv')
      const ctx = cv.getContext('2d')

      // 绑定用户鼠标按下事件，使用户能够绘画
      cv.onmousedown = function (ev) {
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
    },

    /**
     * 设置画布大小
     */
    setUserCvSize () {
      let cv = document.getElementById('user-cv')
      cv.width = cv.clientWidth
      cv.height = cv.clientHeight
    },

    divine () {
      const cv = document.getElementById('user-cv')
      const cvDataBase64 = cv.toDataURL('image/png')
      const cvDataSha256 = sha256(cvDataBase64)

      let resIndex = 0
      for (let i = 0; i < 6; i++) {
        resIndex *= 2
        resIndex += parseInt(cvDataSha256.substr(i * 10, 10), 16) > 5549755813887.5 ? 1 : 0
      }
      resIndex += parseInt(cvDataSha256.substr(60, 4), 16)

      this.result = results[resIndex % 64]
      this.clearBtnLabel = '重置'
      this.resultVisible = true

      console.log(`抽取到第 ${resIndex % 64} 个结果`)
    },

    /**
     * 处理清空按钮点击事件
     *
     * 清空画布、结果
     */
    handleClearBtnClick () {
      const cv = document.getElementById('user-cv')
      cv.height += 0
      this.resultVisible = false
      this.detailVisible = false
    }
  }
}
</script>

<style scoped>
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
  .btn-group {
    padding-top: 24px;
  }
  .main-panel {
    padding: 12px;
    border-width: 1px;
    border-style: solid;
    border-color: #f0f2f8;
    border-radius: 5px;
  }
  .user-cv {
    width: 100%;
    height: 168px;
  }
</style>

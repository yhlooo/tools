<template>
  <div id="divination" class="tool-main-normal">
    <h1 class="tool-h1-normal" @click="changeFate">知命</h1>
    <div class="con" @click="changeFate">
      <el-col>
        <el-card shadow="never" >
          <canvas id="cv" height="168px">
            不支持canvas的浏览器
          </canvas>
          <div id="ans">
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
    <div class="but">
      <el-button ref="buttonClear" plain @click="clear" id="clear" :disabled="isDiv">清空</el-button>
      <el-button ref="buttonAns" plain  @click="getBase64" :disabled="isDiv">发书占之</el-button>
      <i class="el-icon-info keybrl-icon-btn lg" @click="showTipsPanel = true"></i>
    </div>
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
          <li>写下或简要画出你的问题</li>
          <li>点击"发书占之"</li>
          <li>如果你不喜欢这个结果可以点击卡片更换直到出现你想要的结果</li>
          <li>毕竟命运掌握在自己手中</li>
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
      h: results[Math.floor(Math.random() * 64)],
      showTipsPanel: false,
      isDiv: false
    }
  },
  mounted () {
    this.initCanvas()
  },
  methods: {
    changeFate () {
      this.h = results[Math.floor(Math.random() * 64)]
      console.log('i try')
    },
    initCanvas () {
      let theCanvas = document.getElementById('cv')
      theCanvas.width = document.body.clientWidth
      let cv = document.getElementById('cv')
      let ctx = cv.getContext('2d')
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
    getBase64 () {
      let canvas = document.getElementById('cv')
      let base64 = canvas.toDataURL('image/png')
      let num = sha256(base64)
      let ans
      for (let i = 0; i < 64; i++) {
        ans = num.charAt(i).charCodeAt()
        if (ans < 64) {
          break
        }
      }
      document.getElementById('cv').style.display = 'none'
      this.h = results[ans % 64]
      document.getElementById('ans').style.display = 'block'
      this.isDiv = true
    },
    clear () {
      let c = document.getElementById('cv')
      c.height = c.height
    }
  }
}
</script>

<style scoped>
  .vertical {
    width: 0;
  }
  #ans {
    display: none;
  }
  .con {
    margin-bottom: 150px;
  }
  .but{
    padding-top: 120px;
  }
  /*.right {*/
  /*  display: block;*/
  /*  float: right;*/
  /*}*/
</style>

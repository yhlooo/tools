<template>
  <div id="web-figlet" class="tool-main-normal">
    <h1 class="tool-h1-normal" v-show="!figletReadied">FIGlet</h1>
    <div v-show="figletReadied"><pre class="figlet-title">
    __________________     __
   / ____/  _/ ____/ /__  / /_
  / /_   / // / __/ / _ \/ __/
 / __/ _/ // /_/ / /  __/ /_
/_/   /___/\____/_/\___/\__/
    </pre></div>

    <!-- 输入框 -->
    <div class="source-text-container">
      <el-input
        v-model="sourceText"
        @input="refreshTargetText">
        <el-select
          slot="prepend"
          v-model="selectedFont"
          @input="refreshTargetText"
          style="width: 130px;">
          <el-option
            v-for="font in figletFonts"
            :key="font"
            :label="font"
            :value="font">
          </el-option>
        </el-select>
      </el-input>
    </div>

    <!-- 字体大小调节 -->
    <div class="target-text-size-slider-container">
      <el-slider
        class="target-text-size-slider"
        v-model="targetTextSize"
        :format-tooltip="targetTextSizeSliderTooltip">
      </el-slider>
    </div>

    <!-- 结果展示框 -->
    <div class="target-text-container">
      <div class="copy-btn-container">
        <i
          title="复制"
          class="el-icon-copy-document copy-btn"
          :data-clipboard-text="targetText"
          @click="alertCopy">
        </i>
      </div>
      <pre class="target-text" :style="{'font-size': (targetTextSize / 100 * 48 + 12) + 'px'}">{{ targetText }}</pre>
    </div>

  </div>
</template>

<script>
import Clipboard from 'clipboard'
import * as figlet from 'figlet'
import banner from 'figlet/importable-fonts/Banner'
import block from 'figlet/importable-fonts/Block'
import digital from 'figlet/importable-fonts/Digital'
import lean from 'figlet/importable-fonts/Lean'
import mnemonic from 'figlet/importable-fonts/Mnemonic'
import shadow from 'figlet/importable-fonts/Shadow'
import small from 'figlet/importable-fonts/Small'
import smshadow from 'figlet/importable-fonts/Small Shadow'
import standard from 'figlet/importable-fonts/Standard'
import big from 'figlet/importable-fonts/Big'
import bubble from 'figlet/importable-fonts/Bubble'
import ivrit from 'figlet/importable-fonts/Ivrit'
import mini from 'figlet/importable-fonts/Mini'
import script from 'figlet/importable-fonts/Script'
import slant from 'figlet/importable-fonts/Slant'
import smscript from 'figlet/importable-fonts/Small Script'
import smslant from 'figlet/importable-fonts/Small Slant'
import term from 'figlet/importable-fonts/Term'

export default {
  name: 'WebFiglet',
  data () {
    return {
      figletReadied: false,
      figletFonts: [],
      sourceText: 'Hello World!',
      selectedFont: 'standard',
      targetText: '',
      targetTextSize: 16,
      clipboard: new Clipboard('.copy-btn')
    }
  },
  mounted () {
    this.parseFigletFont()
    this.figletReadied = true
    this.refreshTargetText()
    console.log(figlet.textSync('FIGlet READY!', 'slant'))
  },
  methods: {
    refreshTargetText () {
      this.targetText = figlet.textSync(this.sourceText, this.selectedFont)
    },
    parseFigletFont () {
      let fonts = {
        banner: banner,
        block: block,
        digital: digital,
        lean: lean,
        mnemonic: mnemonic,
        shadow: shadow,
        small: small,
        smshadow: smshadow,
        standard: standard,
        big: big,
        bubble: bubble,
        ivrit: ivrit,
        mini: mini,
        script: script,
        slant: slant,
        smscript: smscript,
        smslant: smslant,
        term: term
      }

      console.log('parsedFigletFonts:')
      for (let i in fonts) {
        figlet.parseFont(i, fonts[i])
        this.figletFonts.push(i)
        console.log(`  - ${i}`)
      }
    },
    targetTextSizeSliderTooltip (value) {
      return `${(value / 100 * 48 + 12).toFixed(1)}px`
    },
    alertCopy () {
      this.$message({message: '内容已复制。', type: 'success', duration: 1000})
    }
  }
}
</script>

<style scoped>

  .target-text-size-slider-container {
    margin-bottom: 20px;
  }

  .target-text-container {
    width: 100%;
    margin-bottom: 20px;
    border-style: solid;
    border-width: 1px;
    border-color: #dcdfe6;
    border-radius: 4px;

    overflow: auto;
  }
  .target-text-container::-webkit-scrollbar {
    height: 0.4em;
    width: 0.4em;
    background-color: transparent;
  }
  .target-text-container::-webkit-scrollbar-thumb {
    border-radius: 0.4em;
    background-color: #939393;
  }
  .target-text-container::-webkit-scrollbar-corner {
    background-color: transparent;
  }

  .copy-btn-container {
    padding: 5px 5px 0;
    text-align: right;
  }
  .copy-btn {
    cursor: pointer;
  }

  pre {
    margin: 0;
    font-family: monospace;
    color: #000000;
  }
  pre.figlet-title {
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  pre.target-text {
    font-size: 2em;
  }

</style>

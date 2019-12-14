<template>
  <div id="base64-codec" class="tool-main-normal">
    <h1 class="tool-h1-normal">Base64 编解码器</h1>
    <el-form class="base64-codec-form">
      <el-form-item>
        <label class="el-form-item__label">
          原始文本：
          <i title="复制" class="el-icon-copy-document copy-btn" :data-clipboard-text="sourceText"></i>
        </label>
        <el-input
          type="textarea"
          placeholder="Hello World!"
          :autosize="{ minRows: 4 }"
          v-model="sourceText"
          @input="b64Text = base64Codec(sourceText, 'encode') !== null ? base64Codec(sourceText, 'encode') : b64Text">
        </el-input>
      </el-form-item>
      <el-form-item>
        <label class="el-form-item__label">
          Base64 文本：
          <i title="复制" class="el-icon-copy-document copy-btn" :data-clipboard-text="b64Text"></i>
        </label>
        <el-input
          type="textarea"
          placeholder="SGVsbG8gV29ybGQh"
          :autosize="{ minRows: 4 }"
          v-model="b64Text"
          @input="sourceText = base64Codec(b64Text, 'decode') !== null ? base64Codec(b64Text, 'decode') : sourceText">
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'
import Clipboard from 'clipboard'

export default {
  name: 'Base64Codec',
  data () {
    return {
      sourceText: '',
      b64Text: '',
      clipboard: new Clipboard('.copy-btn')
    }
  },
  mounted () {
  },
  methods: {
    base64Codec (value, action) {
      if (action === 'encode') {
        try {
          return Base64.encode(value)
        } catch (e) {
          this.$notify.error({
            title: '错误',
            message: 'Base64 编码失败'
          })
          return null
        }
      } else {
        try {
          return Base64.decode(value)
        } catch (e) {
          this.$notify.error({
            title: '错误',
            message: 'Base64 解码失败'
          })
          return null
        }
      }
    }
  }
}
</script>

<style scoped>

  .base64-codec-form {
    /*max-width: 500px;*/
  }

  .copy-btn:hover {
    font-weight: bolder;
    cursor: pointer;
  }
</style>

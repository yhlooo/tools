<template>
  <div id="base64-codec">
    <h1>Base64 编解码器</h1>
    <el-form class="base64-codec-form">
      <el-form-item label="原始文本：">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="Hello World!"
          v-model="sourceText"
          @input="b64Text = base64Codec(sourceText, 'encode') !== null ? base64Codec(sourceText, 'encode') : b64Text">
        </el-input>
      </el-form-item>
      <el-form-item label="Base64文本：">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="SGVsbG8gV29ybGQh"
          v-model="b64Text"
          @input="sourceText = base64Codec(b64Text, 'decode') !== null ? base64Codec(b64Text, 'decode') : sourceText">
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'

export default {
  name: 'Base64Codec',
  data () {
    return {
      sourceText: '',
      b64Text: ''
    }
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
  #base64-codec {
    padding: 50px 5vw;
  }

  .base64-codec-form {
    max-width: 500px;
  }
</style>

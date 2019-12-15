<template>
  <div id="draw">
    <div class="tags-panel panel">
      <div class="tags-panel-label">
        标签池
        <i
          v-if="tagsPoolEditable"
          class="el-icon-unlock icon-btn inherit-font-size"
          title="锁定标签编辑"
          style="color: #e6a23c"
          @click="tagsPoolEditable = false">
        </i>
        <i
          v-else
          class="el-icon-lock icon-btn inherit-font-size"
          title="解除编辑锁定"
          style="color: #67c23a"
          @click="tagsPoolEditable = true">
        </i>
        <i
          class="el-icon-refresh icon-btn inherit-font-size"
          title="摇晃均匀"
          style="color: #409eff"
          @click="handleRearrangeTagsPool">
        </i>
      </div>
      <div class="tags-panel-pool">
        <el-tag
          v-for="(tag, i) in tagsPool"
          class="tag"
          :key="i"
          :color="tag.color"
          effect="dark"
          @close="handleDeleteTag(i)"
          :closable="tagsPoolEditable">
          {{ tag.label }}
        </el-tag>
      </div>
      <div class="tags-panel-input-panel">
        <el-input
          class="new-tag-input"
          v-if="newTagInputVisible && tagsPoolEditable"
          v-model="newTagInputValue"
          ref="newTagInput"
          size="small"
          maxlength="16"
          @keyup.enter.native="handleAppendTag"
          @blur="handleAppendTag"
          show-word-limit>
        </el-input>
        <el-button v-else-if="tagsPoolEditable" class="new-tag-btn" size="small" @click="showNewOptionInput">
          <i class="el-icon-plus el-icon--left"></i>添加标签
        </el-button>
      </div>
    </div>
    <div class="control-panel panel">
      <el-button type="primary" @click="handleDraw">开始抽取</el-button>
      <i class="el-icon-s-tools icon-btn" @click="settingsPanelVisible = true"></i>
      <span>
        <i class="el-icon-info el-icon--left" style="color: #909399"></i>
        {{ putBack ? '放回' : '不放回' }} {{ drawTimes === 1 ? '单次抽取' : `连抽${drawTimes}次` }}
      </span>
    </div>

    <!-- 结果展示面板 -->
    <div v-show="results.length > 0" class="results-panel panel">
      <div class="results-panel-label">
        抽取结果
        <i class="el-icon-delete-solid icon-btn inherit-font-size" style="color: #f56c6c" @click="results = []"></i>
      </div>
      <el-card
        v-for="(result, i) in results"
        :key="i"
        class="result-panel"
        shadow="never">
        <div slot="header" class="result-panel-header">
          <span v-if="!result.titleEditable">
            {{ result.title }}
            <i
              class="el-icon-edit icon-btn inherit-font-size"
              @click="showResultTitleInput(i, result)">
            </i>
          </span>
          <el-input
            v-else
            class="result-title-input"
            v-model="result.title"
            size="mini"
            maxlength="10"
            :id="`result-title-input-${i}`"
            @keyup.enter.native="result.titleEditable = false"
            @blur="result.titleEditable = false"
            show-word-limit>
          </el-input>
          <div style="float: right; padding: 3px 0">
            <el-dropdown @command="handleResultCommand" trigger="click">
              <span>
                <fa-icon icon="bars" class="icon-btn inherit-font-size"></fa-icon>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="result.canPutBack"
                  :command="['put-back', result]">
                  <fa-icon icon="undo"></fa-icon> 将结果全部放回标签池
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="result.view === 'tags'"
                  :command="['list-view', result]">
                  <fa-icon icon="list"></fa-icon> 更改为列表视图
                </el-dropdown-item>
                <el-dropdown-item
                  v-else
                  :command="['tags-view', result]">
                  <fa-icon icon="tags"></fa-icon> 更改为标签视图
                </el-dropdown-item>
                <el-dropdown-item :command="['delete', i]">
                  <fa-icon icon="trash" style="color: #f56c6c"></fa-icon> 删除该结果
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div>
          <div v-if="result.view === 'tags'">
            <el-tag
              v-for="(tag, i) in result.results"
              class="tag"
              :color="tag.color"
              effect="dark"
              size="small"
              :key="i">
              {{ tag.label }}
            </el-tag>
          </div>
          <div v-else>
            <ol style="margin: 0; padding-left: 30px">
              <li v-for="(tag, i) in result.results" :key="i">{{ tag.label }}</li>
            </ol>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 抽签方式设置菜单 -->
    <el-drawer
      title="高级设置"
      :visible.sync="settingsPanelVisible"
      direction="btt"
      size="90%">
      <span slot="title" role="heading" tabindex="0" title="高级设置" style="outline: none">高级设置</span>
      <div class="settings-panel">
        <div class="label">
          是否放回
          <el-tooltip effect="dark" content="每次抽取，取出的标签是否放回标签池" placement="right">
            <i class="el-icon-info tips"></i>
          </el-tooltip>
        </div>
        <div class="setting-item">
          <el-switch
            v-model="putBack"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
          <span style="display: inline-block; color: #909399; width: 55px; text-align: right">{{ putBack ? '放回' : '不放回' }}</span>
        </div>
        <div class="label">
          连抽次数
          <el-tooltip effect="dark" content="按一次“开始抽取”按钮后连续抽取的次数" placement="right">
            <i class="el-icon-info tips"></i>
          </el-tooltip>
        </div>
        <div class="setting-item">
          <el-input-number v-model="drawTimes" :min="1" :step-strictly="true" size="small" label="连抽次数"></el-input-number>
        </div>
        <div class="label">
          批量导入标签
          <el-tooltip effect="dark" content="一行一个标签" placement="right">
            <i class="el-icon-info tips"></i>
          </el-tooltip>
          <el-button type="success" icon="el-icon-check" size="mini" @click="handleImportTags"></el-button>
        </div>
        <div class="setting-item">
          <el-input
            type="textarea"
            min="4"
            :autosize="{ minRows: 4 }"
            placeholder="一行一个标签"
            v-model="importTags">
          </el-input>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Draw',
  data () {
    return {
      tagsPool: [
        { label: '一个标签', color: this.getARandColor() },
        { label: '就是', color: this.getARandColor() },
        { label: '一个可以抽的“签”', color: this.getARandColor() }
      ],
      results: [],
      newTagInputVisible: false,
      newTagInputValue: '',
      settingsPanelVisible: false,
      tagsPoolEditable: true,

      // 抽取行为
      putBack: true, // 是否放回
      drawTimes: 1, // 连抽次数

      importTags: ''// 批量导入输入框
    }
  },
  methods: {
    showNewOptionInput () {
      this.newTagInputVisible = true
      this.$nextTick(() => {
        this.$refs.newTagInput.$refs.input.focus()
      })
    },
    showResultTitleInput (i, result) {
      result.titleEditable = true
      this.$nextTick(() => {
        document.getElementById(`result-title-input-${i}`).focus()
      })
    },
    handleAppendTag () {
      let newTagLabel = this.newTagInputValue
      if (newTagLabel) {
        this.tagsPool.push({ label: newTagLabel, color: this.getARandColor() })
      }
      this.newTagInputVisible = false
      this.newTagInputValue = ''
    },
    handleDeleteTag (tagIndex) {
      this.tagsPool.splice(tagIndex, 1)
    },
    handleRearrangeTagsPool () {
      let newTagsPool = []
      while (this.tagsPool.length) {
        newTagsPool.push(this.choice(this.tagsPool, false))
      }
      for (let i = 0; i < newTagsPool.length; i++) {
        this.tagsPool.push(newTagsPool[i])
      }
    },
    handleDraw () {
      if (this.tagsPool.length < 1) {
        this.$message.error('没有标签可以抽取，请先添加一些标签')
        return
      }
      if (!this.putBack && this.tagsPool.length < this.drawTimes) {
        this.$message.error('不放回情况下，标签池内标签数量不足以进行此处抽取，请先添加一些标签')
        return
      }

      let results = []
      for (let i = 0; i < this.drawTimes; i++) {
        results.push(this.choice(this.tagsPool, this.putBack))
      }
      this.results.push({
        title: `第${this.results.length + 1}次抽取`,
        results: results,
        canPutBack: !this.putBack,
        view: 'tags',
        titleEditable: false
      })
    },
    handleResultCommand (command) {
      if (command[0] === 'put-back') {
        if (command[1].canPutBack) {
          command[1].canPutBack = false
          for (let i = 0; i < command[1].results.length; i++) {
            this.tagsPool.push(command[1].results[i])
          }
        }
      } else if (command[0] === 'list-view') {
        command[1].view = 'list'
      } else if (command[0] === 'tags-view') {
        command[1].view = 'tags'
      } else if (command[0] === 'delete') {
        this.results.splice(command[1], 1)
      }
    },
    handleImportTags () {
      let tags = this.importTags.split('\n')
      for (let i = 0; i < tags.length; i++) {
        if (tags[i]) {
          this.tagsPool.push({ label: tags[i], color: this.getARandColor() })
        }
      }
      this.importTags = ''
      this.settingsPanelVisible = false
    },
    choice (tagsPool, putBack) {
      if (tagsPool.length < 1) {
        return null
      }

      let i = parseInt((Math.random() * tagsPool.length).toString())

      if (putBack) {
        // 放回
        return tagsPool[i]
      } else {
        // 不放回
        return tagsPool.splice(i, 1)[0]
      }
    },
    getARandColor () {
      return this.choice([
        '#f44336', '#e91e63', '#9c27b0', '#673ab7',
        '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
        '#009688', '#4caf50', '#8bc34a',
        '#ff9800', '#ff5722',
        '#795548', '#9e9e9e', '#607d8b'
      ], true)
    }
  }
}
</script>

<style scoped>
  .inherit-font-size {
    font-size: inherit;
  }

  .panel {
    margin: 10px 0;
  }
  .tags-panel {
    padding: 10px 5px;
    border-top-style: dashed;
    border-right-style: dashed;
    border-bottom-style: dashed;
    border-left-style: dashed;
    border-width: 1px;
    border-color: #3373c7;
    border-radius: 5px;
  }
  .tags-panel-label, .results-panel-label {
    padding: 0 10px 10px;
    font-size: 20px;
  }
  .tags-panel-pool {
    padding-bottom: 12px;
  }
  .tag {
    margin: 5px;
    border-color: transparent;
  }
  .new-tag-btn {
    height: 32px;
    line-height: 30px;
    padding: 0;
    width: 100%;
  }
  .new-tag-input {
    width: 100%;
    vertical-align: bottom;
  }

  .control-panel {
  }
  .control-panel .icon-btn {
    line-height: 40px;
    vertical-align: bottom;
  }
  .settings-panel {
    height: calc(90vh - 74px);
    padding: 5px 20px;
    outline: none;
    overflow: auto;
  }
  .settings-panel .label {
    margin: 0 0 8px;
  }
  .settings-panel .setting-item {
    margin: 0 0 20px;
  }

  .results-panel {
    margin-top: 40px;
    padding: 10px 5px;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
  .result-panel {
    margin: 10px 0;
  }
  .result-panel-header {
    height: 28px;
  }
  .result-title-input {
    width: calc(100% - 70px);
    max-width: 300px;
    vertical-align: bottom;
  }
</style>

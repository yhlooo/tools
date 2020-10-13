<template>
  <div id="index" class="tool-main-normal">

    <!-- 标题 -->
    <h1 class="tool-h1-normal">KeybrL's Tools</h1>

    <!-- 工具卡片列表 -->
    <el-row>
      <el-col
        v-for="tool in tools" :key="tool.name"
        :xs="24" :sm="8"
      >
        <div class="tool-card-container">
          <el-card class="tool-card">
            <div @click="switchToTools(tool.url)">
              <div class="tool-title">{{ tool.title }}</div>
              <div class="tool-description">{{ tool.description }}</div>
              <div class="tool-author">
                <a
                  :href="tool.author.url"
                  target="_blank"
                  @click.stop=""
                >
                  @{{ tool.author.name }}
                </a>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      tools: [{
        name: 'Base64Codec',
        url: '/base64-codec',
        title: 'Base64 编解码器',
        description: '对文本进行 Base64 编解码。',
        author: {
          name: 'KeybrL',
          url: 'https://github.com/keybrl/'
        }
      }, {
        name: 'Fate',
        url: '/fate',
        title: '命运',
        description: '“抛硬币”或者“抽签”，认知自己的命运。',
        author: {
          name: 'KeybrL',
          url: 'https://github.com/keybrl/'
        }
      }, {
        name: 'Divination',
        url: '/divination',
        title: '知命',
        description: '德人无累，知命不忧。',
        author: {
          name: 'Maozu',
          url: 'https://github.com/maozu/'
        }
      }, {
        name: 'WebFiglet',
        url: '/web-figlet',
        title: 'FIGlet',
        description: '基于 FIGlet ，使用普通字符构建大字母。',
        author: {
          name: 'KeybrL',
          url: 'https://github.com/keybrl/'
        }
      }]
    }
  },
  methods: {
    switchToTools (toolUrl) {
      this.$router.push(toolUrl)
    }
  }
}
</script>

<style lang="less" scoped>
.tool-main-normal {
  padding-bottom: 80px;
}
.tool-card-container {
  padding: 10px;

  .tool-card {
    cursor: pointer;

    &:hover {
      box-shadow: 0 2px 15px 0 rgba(0,0,0,.2);
    }

    .tool-title {
      height: 1.2rem;
      margin-bottom: 12px;

      line-height: 1.2rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      color: #303133;
      font-size: 1.1rem;
      font-weight: bolder;
    }
    .tool-description {
      height: 3.6rem;
      margin-bottom: 10px;
      overflow: hidden;
      line-height: 1.2rem;
      color: #606266;
    }
    .tool-author {
      text-align: right;
      font-size: 0.8rem;

      a {
        color: #909399;
        text-decoration: none;

        &:hover {
          color: #409eff;
        }
      }
    }
  }
}
</style>

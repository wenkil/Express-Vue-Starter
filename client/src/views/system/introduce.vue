<template>
  <div class="app-container">
    <el-card style="min-width: 600px">
      <vue-markdown>{{ systemMd }}</vue-markdown>
    </el-card>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import systemMd from './system.md'

export default {
  components: {VueMarkdown},
  data() {
    return {
      systemMd: systemMd
    }
  },

  created() {

  },
  methods: {}
}
</script>

<style lang="scss" scoped>

</style>

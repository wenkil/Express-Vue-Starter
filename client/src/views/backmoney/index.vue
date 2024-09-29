<template>
  <div class="app-container">
    <back-money-head ref="BackMoneyHead" @getList="getList"></back-money-head>
    <back-money-table ref="BackMoneyTable"></back-money-table>
    <back-money-form ref="BackMoneyForm"></back-money-form>
  </div>
</template>

<script>
import { BackMoneyHead, BackMoneyTable, BackMoneyForm } from './module'

export default {
  components: { BackMoneyHead, BackMoneyTable, BackMoneyForm },
  data() {
    return {}
  },
  created() {

  },
  methods: {
    getList(form) {
      this.$nextTick(() => {
        this.$refs.BackMoneyTable.getList(form)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

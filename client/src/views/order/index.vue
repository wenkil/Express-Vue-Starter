<template>
  <div class="app-container">
    <order-list-head ref="OrderListHead" @getList="getList"/>
    <order-list-table ref="OrderListTable"/>

  </div>
</template>

<script>
  import { OrderListForm, OrderListHead, OrderListTable } from './module'

  export default {
    components: { OrderListForm, OrderListHead, OrderListTable },
    data() {
      return {}
    },
    created() {

    },
    methods: {
      getList(query) {
        this.$nextTick(()=>{
          this.$refs.OrderListTable.getList(query)
        })
      }
    }
  }
</script>

<style scoped>

</style>

<template>
  <div class="app-container">

    <goods-list-head @getList="getList"></goods-list-head>

    <goods-list-table style="margin-top: 10px" :dataList="dataList" v-loading="loading"
                      @getTableList="getTableList"></goods-list-table>

    <Pagination
      v-if="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList(listQuery)"
    />
  </div>
</template>

<script>
  import { goodsList } from '@/api/goods'
  import { GoodsListForm, GoodsListHead, GoodsListTable } from './module'
  import { queryParams } from '@/utils'

  export default {
    name: 'index',
    components: { GoodsListForm, GoodsListHead, GoodsListTable },
    data() {
      return {
        total: 0,
        listQuery: {},
        dataList: [],
        loading: false
      }
    },
    created() {

    },
    methods: {

      getTableList() {
        this.getList(this.listQuery)
      },

      getList(query) {
        this.loading = true
        this.listQuery = JSON.parse(JSON.stringify(query))
        this.listQuery.goods_type_id = query.goods_type_id && query.goods_type_id.length > 0 ? query.goods_type_id[0] : ''
        queryParams(this.listQuery)
        goodsList(this.listQuery, 'list').then(res => {
          this.loading = false
          if (res.code == 200) {
            this.dataList = res.data.list
            this.total = res.data.count
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>

<template>
  <div class="app-container">

    <FollowRecordHead @getList="getList"/>

    <FollowRecordTable :dataList="dataList" v-loading="loading"/>

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
  import { getFollowRecordList } from '@/api/crm_user'
  import { FollowRecordHead, FollowRecordTable, FollowRecordForm } from './module'

  export default {
    name: 'index',
    components: { FollowRecordHead, FollowRecordTable, FollowRecordForm },
    data() {
      return {
        loading: false,
        dataList: [],
        total: 0,
        listQuery: {}
      }
    },
    created() {
    },
    methods: {
      getList(query) {
        this.loading = true
        this.listQuery = JSON.parse(JSON.stringify(query))
        //跟进记录记录类型 1只包含自己及下属的 2全部的
        this.listQuery.type = 1
        getFollowRecordList(this.listQuery).then(res => {
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

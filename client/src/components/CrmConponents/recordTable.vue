<template>
  <div>
    <FollowRecordTable :dataList="dataList" v-loading="loading"/>
  </div>
</template>

<script>
  import { FollowRecordTable } from '@/views/customer/follow-up-records/module'
  import { getFollowRecordList } from '@/api/crm_user'

  export default {
    components: { FollowRecordTable },
    data() {
      return {
        dataList: [],
        loading: false

      }
    },

    methods: {
      getList(id) {
        this.loading = true
        getFollowRecordList({
          page: 1,
          limit: 500,
          crm_user_id: id,
          type:2,//记录类型,1只包含自己及下属的 2全部的
        }).then(res => {
          this.loading = false
          if (res.code == 200) {
            this.dataList = res.data.list
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

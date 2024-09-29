<template>
  <div class="app-container">
    <ContactHead @getList="getList"/>
    <ContactTable :dataList="dataList" :total="count" :listQuery="listQuery" v-loading="loading" @getList="getList"/>
  </div>
</template>

<script>
  import { ContactHead, ContactTable } from './module'
  import { contactList } from '@/api/contact'

  export default {
    name: 'index',
    components: { ContactHead, ContactTable },
    data() {
      return {
        dataList: [],
        loading: false,
        listQuery: {},
        count: 0
      }
    },

    methods: {
      getList(query) {
        this.loading = true
        if (query) {
          this.listQuery = JSON.parse(JSON.stringify(query))
        }
        contactList(this.listQuery).then(res => {
          this.loading = false
          if (res.code == 200) {
            this.dataList = res.data.list
            this.count = res.data.count
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

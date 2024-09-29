<template>
  <div>
    <el-form inline>
      <el-form-item label="订单ID">
        <el-input v-model="listQuery.id" clearable></el-input>
      </el-form-item>
      <el-form-item label="客户筛选">
        <el-select v-model="listQuery.crm_user_id" filterable clearable placeholder="请选择客户">
          <el-option
            v-for="item in crmUsers"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="primary" @click="onAdd">新增订单</el-button>
      </el-form-item>
    </el-form>

    <order-list-form ref="OrderListForm" :open-type="1" @getList="search"/>
  </div>
</template>

<script>
  import { crmUserList } from '@/api/crm_user'
  import OrderListForm from './form.vue'

  export default {
    components: { OrderListForm },
    data() {
      return {
        listQuery: {
          page: 1,
          limit: 15,
          crm_user_id: ''
        },
        crmUsers: []
      }
    },
    created() {
      this.search()
      this.getCrmUserList()
    },
    methods: {
      search() {
        this.$emit('getList', this.listQuery)
      },

      async getCrmUserList() {
        await crmUserList({
          page: 1,
          limit: 500,
          crm_list_type: 1
        }).then(res => {
          if (res.code == 200) {
            this.crmUsers = res.data.list.map(item => {
              return {
                id: item.id,
                name: item.crm_user_name
              }
            })
          } else {
            this.$message.error(res.msg)
          }
        })
      },

      onAdd() {
        this.$refs.OrderListForm.openModel()
      }
    }
  }
</script>

<style scoped>

</style>

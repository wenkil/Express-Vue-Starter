<template>
  <div>
    <el-form inline>
      <el-form-item label="回款ID">
        <el-input v-model="listQuery.id" clearable></el-input>
      </el-form-item>
      <el-form-item label="订单ID">
        <el-input v-model="listQuery.order_id" clearable></el-input>
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
      <el-form-item label="回款状态">
        <el-select v-model="listQuery.collect_cycle" clearable placeholder="请选择客户">
          <el-option
            v-for="item in [
              {id:1,name:'未取消'},
              {id:2,name:'已取消'},
            ]"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button type="primary" @click="onAdd">新增回款</el-button>
      </el-form-item>
    </el-form>

    <back-money-form ref="BackMoneyForm" :open-type="1" @getList="onSearch"></back-money-form>
  </div>
</template>

<script>
import BackMoneyForm from './form'
import { crmUserList } from '@/api/crm_user'

export default {
  components: { BackMoneyForm },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 15,
        id: '',
        order_id: '',
        crm_user_id: '',
        collect_cycle: '',
      },
      crmUsers: []
    }
  },
  created() {
    this.onSearch()
    this.getCrmUserList()
  },
  methods: {
    onSearch() {
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
      this.$refs.BackMoneyForm.openModel()
    }

  }
}
</script>

<style scoped>

</style>

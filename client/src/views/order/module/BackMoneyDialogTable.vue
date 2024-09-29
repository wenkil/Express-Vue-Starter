<template>
  <div>
    <el-dialog
      top="5vh"
      title="已回款详情"
      :visible.sync="addModel"
      width="1200px">
      <el-table
        height="600px"
        :data="dataList"
        border
        v-loading="loading"
        highlight-current-row
        style="width: 100%;min-height: 400px"
      >
        <el-table-column prop="id" show-overflow-tooltip label="回款ID" min-width="120" align="center"/>
        <el-table-column prop="order_id" show-overflow-tooltip label="订单ID" min-width="120" align="center"/>
        <el-table-column prop="order_name" label="订单名称" align="center" min-width="150" show-overflow-tooltip/>
        <el-table-column prop="crm_user_name" label="客户名称" align="center" min-width="150" show-overflow-tooltip/>
        <el-table-column prop="approve_status" label="回款审批状态" align="center" min-width="120" show-overflow-tooltip>
          <template slot-scope="{row}">
            <el-tag :type="['','danger','success'][row.approve_status - 1]">
              {{ row.approve_status | orderApproveStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="collect_cycle" label="是否取消" align="center" min-width="120" show-overflow-tooltip>
          <template slot-scope="{row}">
            <el-tag :type="['success','danger'][row.collect_cycle - 1]">
              {{ row.collect_cycle | cycleStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="contract_date" label="回款日期" align="center" min-width="120" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.collect_date | toDate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="actual_amount" label="回款金额" align="center" min-width="120" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.collect_amount | amountFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" min-width="200" show-overflow-tooltip/>
        <el-table-column prop="reject_reason" label="回款驳回原因" align="center" min-width="200" show-overflow-tooltip/>
        <el-table-column prop="admin_name" label="操作人" align="center" min-width="100" show-overflow-tooltip/>
        <el-table-column prop="create_time" label="创建时间" align="center" min-width="160" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.create_time | toTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="update_time" label="更新时间" align="center" min-width="160" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.update_time | toTime }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { backmoneyApi } from '@/api/backmoney'

export default {
  name: 'BackMoneyDialogTable',
  components: {},
  data() {
    return {
      dataList: [],
      loading: false,
      addModel: false
    }
  },
  created() {

  },
  methods: {
    openModel(row) {
      this.addModel = true
      this.dataList = []
      if(row.real_back_cnt == 0) return
      this.loading = true
      backmoneyApi({ order_id: row.id, related: 2, page: 1, limit: 500 }, 'list').then(async res => {
        if (res.code == 200) {
          this.dataList = res.data.list
        } else {
          this.$message.error(res.msg)
        }
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

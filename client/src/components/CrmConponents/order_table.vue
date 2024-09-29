<template>
  <div>
    <el-dialog
      top="5vh"
      title="客户订单记录详情"
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
        <el-table-column prop="id" show-overflow-tooltip label="订单ID" min-width="120" align="center"/>
        <el-table-column prop="order_name" label="订单名称(点击查看详情)" align="center" min-width="180" show-overflow-tooltip>
          <template slot-scope="{row}">
            <a style="color: #1482f0" @click="approveAndLook(row)">{{ row.order_name }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号" align="center" min-width="150" show-overflow-tooltip/>
        <el-table-column prop="orderType" label="订单类型" align="center" min-width="150" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.order_type | orderType }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approve_status" label="订单审批状态" align="center" min-width="120" show-overflow-tooltip>
          <template slot-scope="{row}">
            <el-tag :type="getOrderAppover(row.approve_status)">
              {{ row.approve_status | orderApproveStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="effect_status" label="订单生效状态" align="center" min-width="120" show-overflow-tooltip>
          <template slot-scope="{row}">
            <el-tag :type="row.effect_status == 2 ? '' : 'success'">
              {{ row.effect_status == 1 ? '已生效' : '未生效' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="order_cycle" label="是否取消" align="center" min-width="120" show-overflow-tooltip>
          <template slot-scope="{row}">
            <el-tag :type="['success','danger'][row.order_cycle - 1]">
              {{ row.order_cycle | cycleStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="crm_user_name" label="客户名称" align="center" min-width="150" show-overflow-tooltip/>
        <el-table-column prop="contact_name" label="客户签约人" align="center" min-width="150" show-overflow-tooltip/>
        <el-table-column prop="contract_date" label="签约日期" align="center" min-width="120" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.contract_date | toDate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="goods_name" label="产品名称" align="center" min-width="150" show-overflow-tooltip/>
        <el-table-column prop="goods_cnt" label="产品数量" align="center" min-width="150" show-overflow-tooltip/>
        <el-table-column prop="discount" label="订单折扣" align="center" min-width="100" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ (row.discount / 100).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="actual_amount" label="实际金额" align="center" min-width="120" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.actual_amount | amountFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="real_back_amount" label="已回款总数/金额" align="center" min-width="150" show-overflow-tooltip>
          <template slot-scope="{row}">
            <a style="color: #1482f0" @click="openBackMoneyModel(row)">{{ row.real_back_amount | amountFilter }} /
              {{ row.real_back_cnt }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="real_back_amount" label="未回款金额" align="center" min-width="150" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ (row.actual_amount - row.real_back_amount) | amountFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" min-width="200" show-overflow-tooltip/>
        <el-table-column prop="reject_reason" label="订单驳回原因" align="center" min-width="200" show-overflow-tooltip/>
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
        <!--        <el-table-column label="操作" align="center" min-width="250">-->
        <!--          <template slot-scope="{row}">-->
        <!--            <el-button-->
        <!--              size="mini"-->
        <!--              type="primary"-->
        <!--              @click="approveAndLook(row)">-->
        <!--              查看-->
        <!--            </el-button>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
      </el-table>
    </el-dialog>

    <approve-order-form ref="ApproveOrderForm" :open-type="2"></approve-order-form>
    <back-money-dialog-table ref="BackMoneyDialogTable"></back-money-dialog-table>
  </div>
</template>

<script>
import { ApproveOrderForm, BackMoneyDialogTable } from '@/views/order/module/index'
import { orderApi } from '@/api/order'

export default {
  components: { ApproveOrderForm, BackMoneyDialogTable },
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
      if (row.order_cnt == 0) return
      this.loading = true
      orderApi({ crm_user_id: row.id, related: 0, order_cycle: -1, page: 1, limit: 500 }, 'list').then(async res => {
        if (res.code == 200) {
          this.dataList = res.data.list
        } else {
          this.$message.error(res.msg)
        }
        this.loading = false
      })
    },

    approveAndLook(row) {
      this.$refs.ApproveOrderForm.openModel(row)
    },

    openBackMoneyModel(row) {
      this.$refs.BackMoneyDialogTable.openModel(row)
    },

    getOrderAppover(type) {
      switch (type) {
        case 2:
          return 'warning'
        case 3:
          return 'success'
        case 4:
          return 'danger'
        default:
          return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

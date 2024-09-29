<template>
  <div>

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="全部订单" name="first"></el-tab-pane>
      <el-tab-pane :label=" $store.getters.userInfo.role_id == 1? '所有待审批':'待我审批'" name="second"></el-tab-pane>
      <el-tab-pane label="已驳回" name="third"></el-tab-pane>
      <el-tab-pane label="已通过" name="fourth"></el-tab-pane>
      <el-tab-pane label="已退款" name="five"></el-tab-pane>
      <el-tab-pane label="已取消" name="six"></el-tab-pane>
    </el-tabs>

    <el-table
      height="600px"
      :data="dataList"
      border
      v-loading="loading"
      highlight-current-row
      style="width: 100%;min-height: 400px"
    >
      <el-table-column prop="id" show-overflow-tooltip label="订单ID" min-width="120" align="center"/>
      <el-table-column prop="order_name" label="订单名称" align="center" min-width="150" show-overflow-tooltip/>
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
      <el-table-column prop="real_back_amount" label="已回款金额/总数" align="center" min-width="150" show-overflow-tooltip>
        <template slot-scope="{row}">
          <a style="color: #1482f0" @click="openBackMoneyModel(row)">{{ row.real_back_amount | amountFilter }} / {{ row.real_back_cnt }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="real_back_amount" label="未回款金额" align="center" min-width="150" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ (row.actual_amount - row.real_back_amount) | amountFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center" min-width="200" show-overflow-tooltip/>
      <el-table-column prop="reject_reason" label="订单驳回原因" align="center" min-width="200" show-overflow-tooltip/>
      <el-table-column prop="admin_name" label="操作人" align="center" min-width="120" show-overflow-tooltip/>
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
      <el-table-column fixed="right" label="操作" align="center" min-width="250">
        <template slot-scope="{row}">
          <div v-if="row.order_cycle != 2">
            <el-button
              size="mini"
              v-if="row.approve_status != 2"
              :type="row.isApprove == 2 ? 'primary' : 'warning' "
              @click="approveAndLook(row)">
              {{ row.isApprove == 2 ? '查看' : '审批' }}
            </el-button>
            <el-button type="success" size="mini" v-if="row.approve_status == 2" @click="editOrer(row)">编辑</el-button>
            <el-button type="danger" size="mini"
                       v-if="row.effect_status == 2 && handleType != 1 && row.order_cycle == 1"
                       @click="cancelOrer(row)">取消订单
            </el-button>
          </div>
          <div v-else>
            <el-button
              size="mini"
              type="primary"
              @click="approveAndLook(row)">
              查看
            </el-button>
          </div>

        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-if="total > 0"
      :total="total"
      :page.sync="searchQuery.page"
      :limit.sync="searchQuery.limit"
      @pagination="getList(searchQuery)"
    />

    <order-list-form ref="OrderListForm" :open-type="2" @getList="onEditSuccess"/>
    <approve-order-form ref="ApproveOrderForm" :open-type="approveType" @getList="onEditSuccess"/>
    <back-money-dialog-table ref="BackMoneyDialogTable"></back-money-dialog-table>
  </div>
</template>

<script>
import { orderApi, getCheckApprove, cancelOrder } from '@/api/order'
import { queryParams } from '@/utils'
import OrderListForm from './form.vue'
import ApproveOrderForm from './approve-order.vue'
import BackMoneyDialogTable from './BackMoneyDialogTable'

export default {
  components: { OrderListForm, ApproveOrderForm,BackMoneyDialogTable },
  data() {
    return {
      activeName: 'first',
      searchQuery: {},
      dataList: [],
      loading: false,
      handleNames: ['first', 'second', 'third', 'fourth', 'five', 'six'],
      handleType: 0,
      total: 0,
      approveType: 0//打开审批或查看弹框的类型 1审批 2查看
    }
  },
  created() {

  },
  methods: {

    onEditSuccess() {
      this.getList(this.searchQuery)
    },

    //根据选项卡判断当前状态是否展示按钮
    handleClick(val) {
      this.dataList = []
      this.handleType = this.handleNames.indexOf(val.name)
      this.getList(this.searchQuery)
    },

    getList(query) {
      this.loading = true
      this.searchQuery = JSON.parse(JSON.stringify(query))
      this.searchQuery.related = this.handleType == 1 ? 1 : 2 //related 值为1时查找待我审批的订单,值为2时查找所有我创建的
      this.searchQuery.order_cycle = this.handleType == 5 ? 2 : -1  //订单是否取消,-1是查找全部
      this.searchQuery.approve_status = this.handleType != 0 && this.handleType != 5 ?
        this.handleType : '' //订单审批状态值
      queryParams(this.searchQuery)
      orderApi(this.searchQuery, 'list').then(async res => {
        if (res.code == 200) {
          this.total = res.data.count
          //此处逻辑：isApprove=1有审批权,isApprove=2没有审批权,
          this.dataList = res.data.list
        } else {
          this.$message.error(res.msg)
        }
        this.loading = false
      })
    },

    editOrer(row) {
      this.$refs.OrderListForm.openModel(row)
    },

    cancelOrer(row) {
      this.$showTips({
        title: `确定取消【${row.order_name}】订单?`
      }, () => {
        cancelOrder({ id: row.id }).then(res => {
          if (res.code == 200) {
            this.getList(this.searchQuery)
          } else {
            this.$message.error(res.msg)
          }
        })
      })
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
    },

    //审批或查看 根据列表中的row.isApprove == 1 判断如果有审批权限检验是否轮到当前用户审批
    async approveAndLook(row) {
      this.loading = true
      if (row.order_cycle == 1 && row.isApprove == 1) { //调用检验接口
        await getCheckApprove({ id: row.id }).then(res => {
          if (res.code == 200) {
            this.approveType = res.data.isApprove
            this.$refs.ApproveOrderForm.openModel(row)
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.approveType = 2
        this.$refs.ApproveOrderForm.openModel(row)
      }
      this.loading = false
    },

    openBackMoneyModel(row){
      this.$refs.BackMoneyDialogTable.openModel(row)
    }

  }
}
</script>

<style scoped>

</style>

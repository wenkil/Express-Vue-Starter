<template>
  <div>

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="我创建的" name="first"></el-tab-pane>
      <el-tab-pane :label=" $store.getters.userInfo.role_id == 1? '所有待审批':'待我审批'" name="second"></el-tab-pane>
    </el-tabs>

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
      <el-table-column fixed="right" label="操作" align="center" min-width="250">
        <template slot-scope="{row}">
          <el-button
            size="mini"
            v-if="row.approve_status != 2"
            :type="row.isApprove == 2 ? 'primary' : 'warning' "
            @click="approveAndLook(row)">
            {{ row.isApprove == 2 ? '查看' : '审批' }}
          </el-button>
          <el-button type="success" size="mini" v-if="row.approve_status == 2" @click="editOrer(row)">编辑</el-button>
          <el-button type="danger" size="mini"
                     v-if="row.approve_status  != 3 && row.admin_id == $store.getters.userInfo.admin_id && row.collect_cycle == 1"
                     @click="deleteRow(row)">取消
          </el-button>
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

    <back-money-form :open-type="2" ref="BackMoneyForm" @getList="getList(searchQuery)"></back-money-form>
    <approve-back-money :open-type="approveType" ref="ApproveBackMoney"
                        @getList="getList(searchQuery)"></approve-back-money>
  </div>
</template>

<script>
import { queryParams } from '@/utils'
import { backmoneyApi, getCheckApprove, cancelOrder } from '@/api/backmoney'
import BackMoneyForm from './form'
import ApproveBackMoney from './approve-backmoney'

export default {
  components: { BackMoneyForm, ApproveBackMoney },
  data() {
    return {
      total: 0,
      activeName: 'first',
      loading: false,
      searchQuery: {},
      dataList: [],
      listType: 2,
      approveType: 0
    }
  },
  created() {
  },
  methods: {
    handleClick(val) {
      this.listType = val.name == 'first' ? 2 : 1 //2自己创建的 1需要自己审批的
      this.getList(this.searchQuery)
    },

    getList(query) {
      this.loading = true
      this.searchQuery = JSON.parse(JSON.stringify(query))
      this.searchQuery.related = this.listType
      queryParams(this.searchQuery)
      this.dataList = []
      backmoneyApi(this.searchQuery, 'list').then(async res => {
        if (res.code == 200) {
          this.total = res.data.count
          this.dataList = res.data.list
        } else {
          this.$message.error(res.msg)
        }
        this.loading = false
      })
    },

    //审批或查看 根据列表中的row.isApprove == 1 判断如果有审批权限检验是否轮到当前用户审批
    async approveAndLook(row) {
      this.loading = true
      if (row.isApprove == 1) { //调用检验接口
        await getCheckApprove({ id: row.id }).then(res => {
          if (res.code == 200) {
            this.approveType = res.data.isApprove
            this.$refs.ApproveBackMoney.openModel(row)
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.approveType = 2
        this.$refs.ApproveBackMoney.openModel(row)
      }
      this.loading = false
    },

    editOrer(row) {
      this.$refs.BackMoneyForm.openModel(row)
    },

    //只有自己创建的回款,并且审批尚未通过才可以取消
    deleteRow(row) {
      this.$showTips({ title: '是否确认取消回款？' }, () => {
        cancelOrder({ id: row.id }).then(res => {
          if (res.code == 200) {
            this.getList(this.searchQuery)
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    }

  }
}
</script>

<style scoped>

</style>

<template>
  <div>
    <el-dialog
      top="5vh"
      :title="openType == 1 ? '审批订单' : '查看订单'"
      :visible.sync="addModel"
      width="1200px">
      <el-form
        v-loading="modelLoading"
        :model="orderData"
        label-width="100px">
        <el-row>
          <el-col :span="16">
            <el-row>
              <el-col :span="12">
                <el-form-item label="订单名称">
                  <span>{{ orderData.order_name }}</span>
                </el-form-item>
                <el-form-item label="订单类型">
                  <span>{{ orderData.orderType | orderType }}</span>
                </el-form-item>
                <el-form-item label="客户签约人">
                  <span>{{ orderData.contact_name }}</span>
                </el-form-item>
                <el-form-item label="产品名称">
                  <span>{{ orderData.goods_name }}</span>
                </el-form-item>
                <el-form-item label="订单折扣">
                  <span>{{ orderData.discount }}</span>
                </el-form-item>
                <el-form-item label="创建人">
                  <span>{{ orderData.admin_name }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="订单编号">
                  <span>{{ orderData.order_number }}</span>
                </el-form-item>
                <el-form-item label="客户名称">
                  <span>{{ orderData.crm_user_name }}</span>
                </el-form-item>
                <el-form-item label="签约日期">
                  <span>{{ orderData.contract_date | toDate }}</span>
                </el-form-item>
                <el-form-item label="产品数量">
                  <span>{{ orderData.goods_cnt }}</span>
                </el-form-item>
                <el-form-item label="实际金额">
                  <span>{{ orderData.actual_amount | amountFilter }}</span>
                </el-form-item>
                <el-form-item label="创建时间">
                  <span>{{ orderData.create_time | toTime }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="备注" style="width:90%">
              <span>{{ orderData.remark }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <h3>审批流程</h3>
            <br>
            <el-timeline>
              <el-timeline-item
                v-for="(item, index) in approveList"
                :key="index"
                :timestamp="item.create_time">
                {{ item.user_name }}
              </el-timeline-item>
            </el-timeline>
          </el-col>
        </el-row>
      </el-form>
      <div class="divCenter" v-if="openType == 2 && (orderData.admin_id == $store.getters.userInfo.admin_id || $store.getters.userInfo.role_id == 1)">
        <el-button type="primary" style="margin: 0 80px" @click="openFlowReport">查看订单流程</el-button>
      </div>
      <div class="divCenter" v-if="openType == 1">
        <el-button type="primary" style="margin: 0 80px" @click="orderApprove(1)">驳回</el-button>
        <el-button type="success" style="margin: 0 80px" @click="orderApprove(2)">通过</el-button>
      </div>
    </el-dialog>

    <order-flow-report ref="OrderFlowReport"></order-flow-report>

    <el-dialog
      title="订单驳回"
      :visible.sync="check_order_modal"
      :close-on-click-modal="false"
      width="450px"
    >
      <el-form
        :model="checkFrom"
        ref="checkFrom"
        :rules="checkFormRuler"
        label-width="90px"
      >
        <el-form-item label="驳回原因" label-width="80px" prop="reject_reason">
          <el-input
            style="width: 100%"
            type="textarea"
            show-word-limit
            :rows="4"
            v-model.trim="checkFrom.reject_reason"
            placeholder="请输入驳回原因"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancelCheck">取 消</el-button>
        <el-button type="primary" @click="onSubmitCheck">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getApprovelist, approveOrder } from '@/api/order'
import moment from 'moment'
import { getOrderOperaTyoe } from '@/utils'
import OrderFlowReport from './order_flow_report'

export default {
  name: 'approve-order',
  components: { OrderFlowReport },
  props: {
    openType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      addModel: false,
      check_order_modal: false,
      modelLoading: false,
      orderData: {},
      approveList: [],
      orderFlowList: [],
      checkFrom: {
        reject_reason: ''
      },
      checkFormRuler: {
        reject_reason: [
          { required: true, message: '请输入驳回原因', trigger: 'blur' }
        ]
      }
    }
  },
  created() {

  },
  methods: {

    //orderData 列表数据
    openModel(data) {
      this.addModel = true
      this.modelLoading = true
      this.orderData = JSON.parse(JSON.stringify(data))
      this.getApproveList()
      this.modelLoading = false
    },

    //获取订单审批记录
    async getApproveList() {
      await getApprovelist({ id: this.orderData.id }).then(res => {
        if (res.code == 200) {
          this.approveList = res.data.list.map(v => {
            v.create_time = v.create_time
              ?
              moment(v.create_time).format('YYYY-MM-DD HH:mm:ss')
              :
              '暂未审批'
            return v
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    //审批订单 1驳回 2通过
    orderApprove(type) {
      if (type == 1) {
        this.check_order_modal = true
        this.checkFrom.reject_reason = ''
      } else {
        this.$showTips({
          title: '是否确认通过审批?'
        }, () => {
          approveOrder({
            id: this.orderData.id,
            type
          }).then(res => {
            if (res.code == 200) {
              this.$message.success('审批通过操作完成')
              this.$emit('getList')
              this.addModel = false
            } else {
              this.$message.error(res.msg)
            }
          })
        })
      }
    },

    // 确认驳回
    onSubmitCheck() {
      this.$refs.checkFrom.validate(valid => {
          if (valid) {
            approveOrder({
              id: this.orderData.id,
              type: 1,
              reject_reason: this.checkFrom.reject_reason
            }).then(res => {
              if (res.code == 200) {
                this.$message.success('审批驳回操作完成')
                this.$emit('getList')
                this.check_order_modal = false
                this.addModel = false
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            this.$message.error('请输入必填字段')
            return false
          }
        }
      )
    },

    onCancelCheck() {
      this.$refs.checkFrom.resetFields()
      this.check_order_modal = false
    },

    openFlowReport() {
      this.$refs.OrderFlowReport.openModel(this.orderData.id)
    }

  }
}
</script>

<style lang="scss" scoped>
.divCenter {
  display: flex;
  justify-content: center;
  //position: absolute;
  //left: 32%;
  //bottom: 8%;
}

.el-timeline-item {
  padding-bottom: 80px;
}

.div__style_flex {
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;

  span {
    font-size: 16px;
    font-weight: 700;
    line-height: 40px;
  }

  .jiantou_style {
    font-size: 20px;
    color: #1482f0;
    margin: 0 15px;
  }
}
</style>

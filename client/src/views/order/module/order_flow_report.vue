<template>
  <div>
    <el-dialog
      top="5vh"
      title="查看订单流程记录"
      :visible.sync="addModel"
      width="700px"
      v-loading="stepsLoading"
    >
      <div style="max-height: 700px;overflow-y: auto">
        <el-steps space="100px" direction="vertical" :active="orderFlowList.length" align-center>
          <el-step v-for="(item,index) in orderFlowList" :key="index" :title="getTitle(item)"
                   :description="getOperaTime(item.create_time)"></el-step>
        </el-steps>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderFlowRecordList } from '@/api/order'
import { getOrderOperaTyoe } from '@/utils'
import moment from 'moment'

export default {
  components: {},
  data() {
    return {
      addModel: false,
      stepsLoading: false,
      orderFlowList: []
    }
  },
  created() {

  },
  methods: {

    openModel(id) {
      this.addModel = true
      this.stepsLoading = true
      this.getList(id)
    },

    //获取订单周期流程记录
    async getList(id) {
      await getOrderFlowRecordList({ id }).then(res => {
        this.stepsLoading = false
        if (res.code == 200) {
          this.orderFlowList = res.data.list
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    getTitle(item) {
      return item.approve_user_name + '【' + getOrderOperaTyoe(item) + '】'
    },

    getOperaTime(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div>
    <el-table
      height="600px"
      :data="dataList"
      border
      highlight-current-row
      v-loading="loading"
      style="width: 100%;min-height: 400px"
    >
      <el-table-column prop="crm_user_name" show-overflow-tooltip label="客户名称" min-width="120" align="center"/>
      <el-table-column
        prop="source_id"
        label="客户来源"
        align="center"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <span>{{ getSourceById(row.source_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="crm_user_phone"
        label="手机号"
        align="center"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="crm_user_mail"
        label="邮箱"
        align="center"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="crm_user_address"
        label="联系地址"
        align="center"
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="crm_user_trade"
        label="客户行业"
        align="center"
        min-width="140"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <span>{{ row.crm_user_trade | crm_tradeType }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="crm_user_level"
        label="客户等级"
        align="center"
        min-width="140"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <span>{{ row.crm_user_level | crm_levelType }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="contact_cnt"
        label="联系人"
        align="center"
        min-width="100"
      >
        <template slot-scope="{row}">
          <a style="color: #1482f0" @click="onClickContact(row)">{{ row.contact_cnt }}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="record_cnt"
        label="跟进记录"
        align="center"
        min-width="100"
      >
        <template slot-scope="{row}">
          <a style="color: #1482f0" @click="onClickRecord(row)">{{ row.record_cnt }}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="order_cnt"
        label="客户订单"
        align="center"
        min-width="100"
      >
        <template slot-scope="{row}">
          <a style="color: #1482f0" @click="onClickOrder(row)">{{ row.order_cnt }}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="charge_user_id"
        label="负责人"
        align="center"
        min-width="140"
      >
        <template slot-scope="{row}">
          <a style="color: #20a0ff"
             size="mini" type="primary"
             @click="openSelectUser(row)">{{ row.charge_user_id ? row.charge_user_name : '点击分配责任人' }}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        align="center"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="creat_time"
        label="创建时间"
        align="center"
        min-width="160"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <span>{{ row.creat_time | toTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="update_time"
        label="更新时间"
        align="center"
        min-width="160"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <span>{{ row.update_time | toTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="creat_admin_name"
        label="创建人"
        align="center"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="admin_name"
        label="最后操作人"
        align="center"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        label="操作"
        align="center"
        min-width="150"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="edit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-if="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="pageFun(listQuery.page)"
    />

    <CrmUserForm ref="CrmUserForm" :openType="2" :submit="submit"/>
    <SelectUser ref="SelectUser" :modelTitle="modelTitle" :openType="2" :infoId="infoId" @getList="pageFun"/>

    <el-dialog
      top="2vh"
      destroy-on-close
      title="查看联系人"
      :visible.sync="contactModel"
      width="1500px"
    >
      <el-button type="primary" @click="onOpenContact">新建联系人</el-button>
      <div style="margin-top: 20px">
        <ContactTable ref="ContactTable"/>
      </div>
    </el-dialog>

    <el-dialog
      top="2vh"
      destroy-on-close
      title="查看跟进记录"
      :visible.sync="recordModel"
      width="1500px"
    >
      <el-button type="primary" @click="onOpenAddRecord">新建跟进记录</el-button>
      <div style="margin-top: 20px">
        <RecordTable ref="RecordTable"/>
      </div>
    </el-dialog>

    <FollowRecordForm ref="FollowRecordForm" :crm_user_id="crm_user_id" @getList="getRecordList(2)"></FollowRecordForm>

    <ContactForm :open-type="3" ref="ContactForm" @getList="getContactList(2)"/>

    <order-table ref="OrderTable"></order-table>
  </div>
</template>

<script>
import { clueSourceList } from '@/api/clue'
import { updateCrmUser } from '@/api/crm_user'
import CrmUserForm from './crm_userForm.vue'
import SelectUser from '@/components/SelectUser'
import { ContactTable, RecordTable, OrderTable } from '@/components/CrmConponents'
import { FollowRecordForm } from '../../follow-up-records/module'
import { ContactForm } from '../../contact-list/module'

export default {
  name: 'CrmUserTable',
  components: {
    CrmUserForm,
    SelectUser,
    ContactTable,
    RecordTable,
    FollowRecordForm,
    ContactForm,
    OrderTable
  },
  props: {
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    },
    listQuery: {
      type: Object,
      default: {}
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      clue_source_list: [],
      loading: false,
      contactModel: false,
      recordModel: false,
      infoId: -1,
      modelTitle: '',
      editData: {},
      curData: {},
      crm_user_id: 0
    }
  },

  created() {
    this.getSourceList()
  },

  methods: {
    pageFun() {
      this.$emit('getList', this.listQuery)
    },

    getSourceList() {
      this.loading = true
      this.clue_source_list = []
      clueSourceList({ page: 1, limit: 500 }).then(res => {
        this.loading = false
        if (res.code == 200) {
          this.clue_source_list = res.data.list.map(item => {
            return {
              value: item.source_name,
              id: item.id
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    getSourceById(id) {
      let value = ''
      let arr = this.clue_source_list.filter(item => {
        return item.id == id
      })
      return arr.length > 0 ? arr[0].value : ''
    },

    edit(row) {
      this.editData = JSON.parse(JSON.stringify(row))
      this.$refs.CrmUserForm.openModel(row)
    },

    submit(form) {
      form.id = this.editData.id
      updateCrmUser(form).then(res => {
        if (res.code == 200) {
          this.$message.success('编辑客户操作成功')
          this.$refs.CrmUserForm.closeModel()
          this.$emit('getList', this.listQuery)
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    openSelectUser(row) {
      this.modelTitle = row.charge_user_id ? '修改负责人' : '添加负责人'
      this.infoId = row.id
      this.$refs.SelectUser.openModel()
    },

    //点击联系人数量
    onClickContact(row) {
      if (!row.charge_user_id) {
        this.$message.error('请先分配责任人')
        return
      }
      this.contactModel = true
      if (!row.contact_cnt || Number(row.contact_cnt) === 0) return
      this.curData = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.getContactList(1)
      })
    },

    //打开新增联系人弹框
    onOpenContact() {
      let form = {
        contact_name: '',//名称
        crm_user_id: this.curData.id,//客户id
        contact_gender: '',//性别
        contact_phone: '',//手机号
        contact_mail: '',//邮箱
        decision_type: '',//是否决策人
        contact_address: '',//地址
        remark: ''
      }
      this.$refs.ContactForm.openModel(form)
    },

    //1不刷新客户列表 2刷新客户列表
    getContactList(type) {
      this.$refs.ContactTable.getList(this.curData.id)
      if (type == 2) { //如果新增了跟进记录也要同时刷新下客户列表的最新数据
        this.$emit('getList', this.listQuery)
      }
    },

    //点击跟进记录数量
    onClickRecord(row) {
      if (!row.charge_user_id) {
        this.$message.error('请先分配责任人')
        return
      }
      this.recordModel = true
      if (!row.record_cnt || Number(row.record_cnt) === 0) return
      this.curData = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.getRecordList(1)
      })
    },

    //打开订单列表弹框
    onClickOrder(row) {
      this.$refs.OrderTable.openModel(row)
    },

    //打开新增跟进记录弹框
    onOpenAddRecord() {
      this.crm_user_id = this.curData.id
      this.$refs.FollowRecordForm.openModel()
    },

    //1不刷新客户列表 2刷新客户列表
    getRecordList(type) {
      this.$refs.RecordTable.getList(this.curData.id)
      if (type == 2) { //如果新增了跟进记录也要同时刷新下客户列表的最新数据
        this.$emit('getList', this.listQuery)
      }
    }
  }
}
</script>

<style scoped>

</style>

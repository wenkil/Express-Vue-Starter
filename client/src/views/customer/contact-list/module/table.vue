<template>
  <div>
    <el-table
      height="600px"
      :data="dataList"
      border
      highlight-current-row
      style="width: 100%;min-height: 400px;"
    >
      <!--      <el-table-column prop="crm_user_id" label="客户ID" min-width="80" align="center"/>-->
      <!--      <el-table-column prop="contact_id"  label="联系人ID" min-width="80" align="center"/>-->
      <el-table-column prop="crm_user_name" show-overflow-tooltip label="客户名称" min-width="150" align="center"/>
      <el-table-column prop="contact_name" show-overflow-tooltip label="联系人名称" min-width="150" align="center"/>
      <el-table-column
        prop="contact_gender"
        label="性别"
        align="center"
        min-width="80"
      >
        <template slot-scope="{row}">
          <span>{{row.contact_gender == 1 ? '男' : '女'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="contact_phone"
        label="手机"
        align="center"
        min-width="130"
        show-overflow-tooltip
      />
      <el-table-column
        prop="contact_mail"
        label="邮箱"
        align="center"
        min-width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="contact_address"
        label="联系地址"
        align="center"
        min-width="250"
        show-overflow-tooltip
      />
      <el-table-column
        prop="decision_type"
        label="是否决策人"
        align="center"
        min-width="120"
      >
        <template slot-scope="{row}">
          <span>{{row.decision_type == 1 ? '是' : '否'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="charge_user_name"
        label="客户负责人"
        align="center"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="next_contact_time"
        label="下次联系时间"
        align="center"
        min-width="180"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <span :class="[row.next_contact_time < time ? 'overdue-class' : '']">{{row.next_contact_time | toTime}}</span>
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
          <span>{{row.creat_time | toTime}}</span>
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
          <span>{{row.update_time | toTime}}</span>
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
        min-width="100"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="edit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-if="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="pageFun"
    />

    <ContactForm :open-type="2" ref="ContactForm" @getList="pageFun"/>
  </div>
</template>

<script>
  import ContactForm from './ContactForm'
  import moment from 'moment'

  export default {
    components: { ContactForm },
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
    watch:{
      dataList(){
        this.time = moment().format('x')
      }
    },
    data() {
      return {
        loading: false,
        time:0
      }
    },
    methods: {
      pageFun() {
        this.$emit('getList', this.listQuery)
      },

      edit(row) {
        this.$refs.ContactForm.openModel(row)
      },
    }
  }
</script>

<style scoped>
.overdue-class{
  color: red;
}
</style>

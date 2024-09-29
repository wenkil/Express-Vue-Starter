<template>
  <div>
    <el-table
      height="500px"
      v-loading="loading"
      :data="dataList"
      border
      highlight-current-row
      style="width: 100%;min-height: 400px;"
    >
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
        min-width="100"
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
        prop="next_contact_time"
        label="下次联系时间"
        align="center"
        min-width="180"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <span>{{row.next_contact_time | toTime}}</span>
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
        prop="admin_name"
        label="最后操作人"
        align="center"
        min-width="150"
        show-overflow-tooltip
      />
    </el-table>
  </div>
</template>

<script>
  import { contactList } from '@/api/contact'

  export default {
    name: 'contact_table',
    data() {
      return {
        dataList: [],
        loading: false
      }
    },
    created() {
    },
    methods: {
      getList(id) {
        this.loading = true
        this.dataList = []
        contactList({
          crm_user_id: id,
          page: 1,
          limit: 100
        }).then(res => {
          this.loading = false
          if (res.code == 200) {
            this.dataList = res.data.list
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>

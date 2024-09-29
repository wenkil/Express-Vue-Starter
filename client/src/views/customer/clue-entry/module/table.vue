<template>
  <div>

    <el-table
      height="600px"
      :data="dataList"
      v-loading="loading"
      border
      highlight-current-row
      style="width: 100%;min-height: 400px;"
    >
      <el-table-column prop="clue_id" show-overflow-tooltip label="线索id" min-width="100" align="center"/>
      <el-table-column prop="clue_name" show-overflow-tooltip label="线索名称" min-width="100" align="center"/>
      <el-table-column
        prop="source_id"
        label="线索来源"
        align="center"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <span>{{getSourceById(row.source_id)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="clue_phone"
        label="手机号"
        align="center"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="clue_mail"
        label="邮箱"
        align="center"
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="clue_address"
        label="联系地址"
        align="center"
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="cus_trade"
        label="客户行业"
        align="center"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <span>{{row.cus_trade | crm_tradeType}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cus_level"
        label="客户等级"
        align="center"
        min-width="120"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <span>{{row.cus_level | crm_levelType}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="charge_user_id"
        label="负责人"
        align="center"
        min-width="120"
      >
        <template slot-scope="{row}">
          <a style="color: #20a0ff"
             size="mini" type="primary"
             @click="openSelectUser(row)">{{row.charge_user_id ? row.charge_user_name : '点击分配责任人'}}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="next_contact_time"
        label="下次联系时间"
        align="center"
        min-width="160"
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

    <ClueForm ref="ClueForm" :openType="2" :submit="submit"/>
    <SelectUser ref="SelectUser" :modelTitle="modelTitle" :openType="1" :infoId="infoId" @getList="pageFun"/>
  </div>
</template>

<script>
  import { clueSourceList, updateClue } from '@/api/clue'
  import ClueForm from './clueform.vue'
  import SelectUser from '@/components/SelectUser'

  export default {
    name: 'ClueTable',
    components: { ClueForm, SelectUser },
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
        infoId:-1,
        modelTitle:''
      }
    },
    created() {
      this.getSourceList()
    },
    methods: {

      pageFun() {
        this.$emit('getList', this.listQuery)
      },

      getList() {
        this.listQuery.page = 1
        this.listQuery.limit = 15
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
        this.$refs.ClueForm.openModel(row)
      },

      submit(form) {
        // console.log('编辑表单', form)
        form.id = this.editData.clue_id
        updateClue(form).then(res => {
          if (res.code == 200) {
            this.$message.success('编辑线索操作成功')
            this.$refs.ClueForm.closeModel()
            this.$emit('getList', this.listQuery)
          } else {
            this.$message.error(res.msg)
          }
        })
      },

      openSelectUser(row){
        this.modelTitle = row.charge_user_id ? '修改负责人' : '添加负责人'
        this.infoId = row.clue_id
        this.$refs.SelectUser.openModel()
      }

    }
  }
</script>

<style scoped>

</style>

<template>
  <div>
    <el-form inline>
      <el-form-item label="客户名称">
        <el-select
          style="width: 220px"
          clearable
          @change="onSearch"
          v-model="listQuery.crm_user_id">
          <el-option
            v-for="item in crm_user_list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下次联系时间">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          clearable
          @change="timeChange"
          placeholder="请选择下次联系时间"
          value-format="timestamp"
          :default-time="['00:00:00','23:59:59']"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button type="primary" @click="onAdd">新增跟进记录</el-button>
      </el-form-item>
    </el-form>

    <FollowRecordForm ref="FollowRecordForm" @getList="onSearch"></FollowRecordForm>
  </div>
</template>

<script>
  import { crmUserList } from '@/api/crm_user'
  import FollowRecordForm from './form'

  export default {
    components: { FollowRecordForm },
    data() {
      return {
        listQuery: {
          page: 1,
          limit: 15,
          crm_user_id: ''
        },
        crm_user_list: [],
        time: []
      }
    },
    created() {
      this.getCrmUserList()
      this.onSearch()
    },
    methods: {

      getCrmUserList() {
        this.crm_user_list = []
        return new Promise((resolve, reject) => {
          crmUserList({ crm_list_type: 2, page: 1, limit: 500 }).then(res => {
            if (res.code == 200) {
              this.crm_user_list = res.data.list.map(item => {
                return {
                  id: item.id,
                  name: item.crm_user_name
                }
              })
              resolve()
            } else {
              this.$message.error(res.msg)
              reject(res.msg)
            }
          })
        })
      },

      onSearch() {
        this.$emit('getList', this.listQuery)
      },

      onAdd() {
        this.$refs.FollowRecordForm.openModel()
      },

      timeChange(val) {
        if (!val || val.length == 0) {
          this.time = []
          this.listQuery.next_contact_time_start = ''
          this.listQuery.next_contact_time_end = ''
        } else {
          this.listQuery.next_contact_time_start = val[0]
          this.listQuery.next_contact_time_end = val[1]
        }
        this.onSearch()
      }
    }
  }
</script>

<style scoped>

</style>

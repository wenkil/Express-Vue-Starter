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
      <el-form-item label="联系人名称">
        <el-input
          style="width: 240px"
          v-model.trim="listQuery.contact_name"
          clearable
          @clear="onSearch"
          @keydown.enter.native="onSearch"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input
          style="width: 240px"
          v-model.trim="listQuery.contact_phone"
          clearable
          onKeyUp="value=value.replace(/[\W]/g,'')"
          @clear="onSearch"
          @keydown.enter.native="onSearch"
        ></el-input>
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
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="openContactModel">新建联系人</el-button>
      </el-form-item>
    </el-form>


    <ContactForm ref="ContactForm" :open-type="1" @getList="onSearch"/>
  </div>
</template>

<script>
  import ContactForm from './ContactForm'
  import { crmUserList } from '@/api/crm_user'

  export default {
    components: { ContactForm },
    data() {
      return {
        listQuery: {
          crm_user_id: '',
          contact_name: '',
          contact_phone: '',
          next_contact_time_start: '',
          next_contact_time_end: '',
          page: 1,
          limit: 15
        },
        time: [],
        crm_user_list: []
      }
    },

    created() {
      this.getCrmUserList()
      this.onSearch()
    },

    methods: {
      onSearch() {
        this.$emit('getList', this.listQuery)
      },

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
      },

      openContactModel() {
        this.$refs.ContactForm.openModel()
      }
    }

  }
</script>

<style scoped>

</style>

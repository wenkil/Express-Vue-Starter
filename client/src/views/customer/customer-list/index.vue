<template>
  <div class="app-container">
    <CrmUserhead @getList="getList"/>
    <div>
      <el-form inline>
        <el-form-item>
          <el-button type="primary" @click="onAdd">新增客户</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="exportCrmUser">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <CrmUserTable :dataList="dataList" :total="count" :listQuery="listQuery" v-loading="loading" @getList="getList"/>
    <CrmUserForm ref="CrmUserForm" :openType="1" :submit="submit"/>
  </div>
</template>

<script>
import { addCrmUser, crmUserList } from '@/api/crm_user'
import { CrmUserhead, CrmUserTable, CrmUserForm } from './module'
import { export_api } from '@/api/export'
import moment from 'moment'
import { downLoadFun } from '@/utils'

export default {
  name: 'index',
  components: { CrmUserhead, CrmUserTable, CrmUserForm },
  data() {
    return {
      loading: false,
      dataList: [],
      count: 0,
      listQuery: {}
    }
  },

  created() {
  },

  methods: {
    getList(query) {
      this.loading = true
      this.listQuery = JSON.parse(JSON.stringify(query))
      this.listQuery.crm_list_type = 2
      crmUserList(this.listQuery).then(res => {
        this.loading = false
        if (res.code == 200) {
          this.dataList = res.data.list
          this.count = res.data.count
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    onAdd() {
      this.$refs.CrmUserForm.openModel({})
    },
    submit(form) {
      // console.log('新增客户', form)
      addCrmUser(form).then(res => {
        if (res.code == 200) {
          this.$message.success('新增客户操作成功')
          this.$refs.CrmUserForm.closeModel()
          this.listQuery.page = 1
          this.getList(this.listQuery)
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    /**
     // 以下为官方的 FileReader.readAsText()的解释：
     // readAsText 方法可以将 Blob 或者 File 对象转根据特殊的编码格式转化为内容(字符串形式)
     // 这个方法是异步的，也就是说，只有当执行完成后才能够查看到结果，如果直接查看是无结果的，并返回undefined
     // 也就是说必须要挂载 实例下的 onload 或 onloadend 的方法处理转化后的结果
     // 当转化完成后， readyState 这个参数就会转换 为 done 即完成态， event("loadend") 挂载的事件会被触发，并可以通过事件返回的形参得到中的 FileReader.result 属性得到转化后的结果
     */
    exportCrmUser() {
      export_api(this.listQuery).then(res => {
        const reader = new FileReader()
        let result = null
        reader.readAsText(res)
        //FileReader 对象执行readAsText后需要监听loadend事件，才可以获取到readAsText执行的结果,根据解析blob后的字符串判断接口返回了json还是blob
        reader.addEventListener('loadend', () => {
          if (typeof reader.result === 'string') {
            try {
              result = JSON.parse(reader['result'])
            } catch (e) {
              result = undefined
            }
          }
          if (result && result.code) {
            this.$message.error(result.msg)
            return
          }
          this.$message.info('正在导出中')
          downLoadFun(res)
        })
      })
    }

  }
}
</script>

<style scoped>

</style>

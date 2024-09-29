<template>
  <div class="app-container">
    <staff-head @getList="getList"></staff-head>

    <el-row :gutter="12">
      <el-col :span="6">
        <el-card shadow="hover">
          <el-tag style="font-size: 20px">总数: {{onJobCnt + dismissionCnt}}</el-tag>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-tag type="success" style="font-size: 20px">在职: {{onJobCnt}}</el-tag>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-tag type="danger" style="font-size: 20px">离职: {{dismissionCnt}}</el-tag>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-tag type="info" style="font-size: 20px">试用期: {{probationCnt}}</el-tag>
        </el-card>
      </el-col>
    </el-row>

    <staff-table style="margin-top: 10px" :dataList="dataList" v-loading="loading"
                 @getTableList="getTableList"></staff-table>

    <Pagination
      v-if="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList(listQuery)"
    />
  </div>
</template>

<script>
  import { staffList } from '@/api/department'
  import { StaffForm, StaffHead, StaffTable } from './module'

  export default {
    name: 'index',
    components: { StaffForm, StaffHead, StaffTable },
    data() {
      return {
        loading: false,
        dataList: [],
        total: 0,
        onJobCnt: 0,
        dismissionCnt: 0,
        probationCnt: 0,
        listQuery: {}
      }
    },

    created() {

    },

    methods: {

      getTableList() {
        this.getList(this.listQuery)
      },

      getList(query) {
        this.loading = true
        this.listQuery = JSON.parse(JSON.stringify(query))
        staffList(this.listQuery).then(res => {
          this.loading = false
          if (res.code == 200) {
            this.dataList = res.data.list
            this.total = res.data.count
            this.onJobCnt = res.data.onJobCnt
            this.dismissionCnt = res.data.dismissionCnt
            this.probationCnt = res.data.probationCnt
          } else {
            this.$message.error(res.msg)
          }
        })
      }

    }
  }
</script>

<style scoped>
  /deep/ .el-card__body {
    text-align: center;
  }
</style>

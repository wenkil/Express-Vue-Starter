<template>
  <div class="app-container">
    <el-form inline>
      <el-form-item label="操作类型">
        <el-select
          style="width: 200px"
          clearable
          v-model="listQuery.type">
          <el-option
            v-for="item in operateTypes"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作时间">
        <el-date-picker
          v-model="search_date"
          type="datetimerange"
          @change="changeDate"
          :default-time="['00:00:00','23:59:59']"
          value-format="timestamp"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList(1)">搜索</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-top: 20px">
      <el-table
        height="600px"
        :data="dataList"
        border
        highlight-current-row
        style="width: 100%"
        v-loading="listLoading"
      >
        <el-table-column
          prop="id"
          label="日志ID"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="operat_type"
          label="操作类型"
          align="center"
          min-width="100"
        >
          <template slot-scope="{row}">
            <span> {{row.operat_type | operateType}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="content"
          label="操作内容"
          min-width="150"
          align="center"
        ></el-table-column>
        <el-table-column label="操作人信息" align="center">
          <el-table-column
            prop="name"
            label="操作人"
            min-width="150"
            align="center"
          />
          <el-table-column
            prop="ip"
            label="操作人所在IP"
            min-width="130"
            align="center"
          />
          <el-table-column
            prop="browser"
            label="浏览器信息"
            min-width="130"
            align="center"
          />
          <el-table-column
            prop="os"
            label="系统信息"
            min-width="130"
            align="center"
          />
          <el-table-column
            prop="device"
            label="设备信息"
            min-width="130"
            align="center"
          />
        </el-table-column>
        <el-table-column
          prop="creat_time"
          label="操作时间"
          align="center"
          min-width="170"
        >
          <template slot-scope="{row}">
            <span> {{row.creat_time | toTime}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-if="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList(listQuery.page)"
    />
  </div>
</template>

<script>
  import moment from 'moment'
  import { getOperateLogList } from '@/api/log'
  import { queryParams } from '@/utils'

  export default {
    components: {  },
    name: 'operate-log',
    data() {
      return {
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 15,
          type: '',
          start_time: '',
          end_time: ''
        },
        dataList: [],
        operateTypes: [
          { id: 1, value: '新增' },
          { id: 2, value: '更新' },
          { id: 3, value: '查询' },
          { id: 4, value: '删除' },
          { id: 5, value: '登录' },
          { id: 6, value: '修改密码'}
        ],
        search_date: []
      }
    },
    created() {
      this.getList(1)
    },
    methods: {
      getList(page) {
        if (page && page > 0) {
          this.listQuery.page = page
        }
        this.listLoading = true
        getOperateLogList(this.listQuery).then(res => {
          this.listLoading = false
          if (res.code == 200) {
            this.total = res.data.count
            this.dataList = res.data.list
          } else {
            this.$message.error(res.msg)
          }
        })
      },

      changeDate(val) {
        this.listQuery.start_time = val ? val[0] : ''
        this.listQuery.end_time = val ? val[1] : ''
      }

    }
  }
</script>

<style scoped>

</style>

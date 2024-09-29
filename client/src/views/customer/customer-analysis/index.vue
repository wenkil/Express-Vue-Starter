<template>
  <div class="app-container">
    <div style="display: flex;justify-content: center;">
      <el-form inline>
        <el-form-item label="时间筛选">
          <el-date-picker
            v-model="dateValue"
            :clearable="false"
            type="monthrange"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            value-format="yyyy-MM"
            @change="dateChange"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>

    </div>
    <div style="margin-top: 50px">
      <el-row>
        <el-col :span="11">
          <el-card class="box-card">
            <CrmSourceChart ref="CrmSourceChart"/>
          </el-card>
        </el-col>
        <el-col :span="11" style="margin-left: 5%">
          <el-card class="box-card">
            <CrmLevelChart ref="CrmLevelChart"/>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div style="margin-top: 50px">
      <el-card class="box-card">
        <CrmTradeChart ref="CrmTradeChart"/>
      </el-card>
    </div>
  </div>
</template>

<script>

  import { CrmSourceChart, CrmLevelChart, CrmTradeChart } from './mohule'
  import moment from 'moment'

  export default {
    name: 'index',
    components: { CrmSourceChart, CrmLevelChart, CrmTradeChart },
    data() {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        dateValue: []
      }
    },

    created() {
      let monthStart = moment().startOf('month').format('YYYY-MM')
      let monthEnd = moment().endOf('month').format('YYYY-MM')
      this.dateValue = [monthStart, monthEnd]

    },
    mounted() {
      this.dateChange(this.dateValue)
    },

    methods: {
      dateChange(val){
        this.$refs.CrmSourceChart.getSourceData(this.dateValue)
        this.$refs.CrmLevelChart.getLevelData(this.dateValue)
        this.$refs.CrmTradeChart.getTradeData(this.dateValue)
      }
    }
  }
</script>

<style scoped>

</style>

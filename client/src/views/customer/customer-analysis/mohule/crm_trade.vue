<template>
  <div style="width: 100%;height: 500px;margin-top: 20px" id="crm_trade"></div>
</template>

<script>
  import * as echarts from 'echarts'
  import moment from 'moment'
  import { getCrmTradeAnalyse } from '@/api/analyse'
  import config from '@/config'

  export default {
    data() {
      return {
        crm_trade_Echarts: {},
        dataList: []
      }
    },

    mounted() {
      this.crm_trade_Echarts = echarts.init(document.getElementById('crm_trade'))
      this.resizefun = ()=>{
        this.crm_trade_Echarts.resize()
      }
      window.addEventListener('resize',this.resizefun)
    },
    //移除事件监听，避免内存泄漏
    beforeDestroy() {
      window.removeEventListener('resize', this.resizefun)
      this.resizefun = null
    },
    methods: {

      //根据选择月份获取第一天和最后一天
      getTradeData(dateValue) {
        let start = dateValue[0] + '-01 00:00:00'
        let dayCnt = moment(dateValue[1]).daysInMonth()//获取当月天数1-31
        let end = dateValue[1] + `-${dayCnt} 23:59:59`

        let query = {
          start_time: moment(start).valueOf(),
          end_time: moment(end).valueOf()
        }
        return new Promise((resolve, reject) => {
          getCrmTradeAnalyse(query).then(res => {
            if (res.code == 200) {
              let temp = res.data.list
              this.dataList = config.cus_trade.map(item => {
                let tradeData = temp.filter(t => t.id == item.id)
                return tradeData.length ? tradeData[0].count : 0
              })
              this.initChart()
              resolve()
            } else {
              this.$message.error(res.msg)
              reject(res.msg)
            }
          })
        })
      },

      initChart() {
        let option = {
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {
                title:'下载'
              }
            }
          },
          title: {
            text: '行业分析',
            subtext: '',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'  // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: config.cus_trade.map(item => item.name),
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              minInterval: 1
            }
          ],
          series: [
            {
              name: '客户数量',
              type: 'bar',
              barWidth: '40%',
              data: this.dataList
            }
          ]
        }
        this.crm_trade_Echarts.setOption(option)
      }

    }
  }
</script>

<style scoped>

</style>

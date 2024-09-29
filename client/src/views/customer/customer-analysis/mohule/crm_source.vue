<template>
  <div style="width: 100%;height: 350px;margin-top: 20px" id="crm_source"></div>
</template>

<script>
  import * as echarts from 'echarts'
  import moment from 'moment'
  import { getCrmSourceAnalyse } from '@/api/analyse'

  export default {
    data() {
      return {
        crm_source_Echarts: {},
        dataList: []
      }
    },
    created() {

    },
    mounted() {
      this.crm_source_Echarts = echarts.init(document.getElementById('crm_source'))
      this.resizefun = ()=>{
        this.crm_source_Echarts.resize()
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
      getSourceData(dateValue) {
        let start = dateValue[0] + '-01 00:00:00'
        let dayCnt = moment(dateValue[1]).daysInMonth()//获取当月天数1-31
        let end = dateValue[1] + `-${dayCnt} 23:59:59`

        let query = {
          start_time: moment(start).valueOf(),
          end_time: moment(end).valueOf()
        }
        return new Promise((resolve, reject) => {
          getCrmSourceAnalyse(query).then(res => {
            if (res.code == 200) {
              this.dataList = res.data.list.map(item => {
                return {
                  name: item.source_name + '  ' + item.user_cnt,
                  value: item.user_cnt
                }
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
        this.crm_source_Echarts.setOption({
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {
                title: '下载'
              }
            }
          },
          title: {
            text: '来源分析',
            subtext: '',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              type: 'pie',
              radius: '50%',
              data: this.dataList,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
      }

    }
  }
</script>

<style scoped>

</style>

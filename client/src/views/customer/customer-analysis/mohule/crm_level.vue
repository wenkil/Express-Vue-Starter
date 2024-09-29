<template>
  <div style="width: 100%;height: 350px;margin-top: 20px" id="crm_level"></div>
</template>

<script>
  import * as echarts from 'echarts'
  import moment from 'moment'
  import { getCrmLevelAnalyse } from '@/api/analyse'
  import config from '@/config'

  export default {
    data() {
      return {
        crm_level_Echarts: {},
        dataList: []
      }
    },

    mounted() {
      this.crm_level_Echarts = echarts.init(document.getElementById('crm_level'))
      this.resizefun = ()=>{
        this.crm_level_Echarts.resize()
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
      getLevelData(dateValue) {
        let start = dateValue[0] + '-01 00:00:00'
        let dayCnt = moment(dateValue[1]).daysInMonth()//获取当月天数1-31
        let end = dateValue[1] + `-${dayCnt} 23:59:59`

        let query = {
          start_time: moment(start).valueOf(),
          end_time: moment(end).valueOf()
        }
        return new Promise((resolve, reject) => {
          getCrmLevelAnalyse(query).then(res => {
            if (res.code == 200) {
              if (res.data.list.length > 0) {
                this.dataList = res.data.list.map(item => {
                  let value = config.cus_level.filter(val => val.id == item.id)
                  return {
                    name: value[0].name + '  ' + item.count,
                    value: item.count
                  }
                })
              } else {
                this.dataList = config.cus_level.map(item => {
                  return {
                    name: item.name + '  0',
                    value: 0
                  }
                })
              }
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
        this.crm_level_Echarts.setOption({
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {
                title: '下载'
              }
            }
          },
          title: {
            text: '等级分析',
            subtext: '',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '5%',
            left: 'center'
          },
          series: [
            {
              type: 'pie',
              radius: ['30%', '50%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                // label: {
                //   show: true,
                //   fontSize: '20',
                //   fontWeight: 'bold'
                // }
              },
              labelLine: {
                show: false
              },
              data: this.dataList
            }
          ]
        })
      }

    }
  }
</script>

<style scoped>

</style>


<template>
  <div>
    <el-button @click="addClueSource" type="primary"> 新增线索来源</el-button>
    <el-table
      height="400px"
      :data="dataList"
      border
      highlight-current-row
      v-loading="loading"
      @cell-click="cellClick"
      style="width: 100%;max-height: 400px;margin-top: 20px"
    >
      <el-table-column prop="source_name" show-overflow-tooltip label="线索来源名称: （点击线索名称进行编辑）" align="center">
        <template slot-scope="scope">
          <el-input :ref="'elInput' + '-' +  + scope.row.id" v-model.trim="scope.row.source_name" v-if="scope.row.seen"
                    @blur="blurFun(scope.$index, scope.row)"></el-input>
          <span style="margin-left: 10px" v-else>{{ scope.row.source_name }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {
    addClueSource,
    clueSourceList,
    updateClueSource
  } from '@/api/clue'

  export default {
    name: 'clueSource-table',
    data() {
      return {
        dataList: [],
        copyList: [],
        loading: false,
        isclose: false
      }
    },
    created() {

    },
    methods: {
      initTable(){
        this.dataList = this.copyList
        this.$forceUpdate()
        this.isclose = true

      },
      getList() {
        this.loading = true
        clueSourceList({ page: 1, limit: 1000 }).then(res => {
          this.loading = false
          if (res.code == 200) {
            this.dataList = res.data.list.map(item => {
              item.seen = false
              return item
            })
            this.copyList = JSON.parse(JSON.stringify(this.dataList))
          } else {
            this.$message.error(res.msg)
          }
        })
      },

      addClueSource() {
        if (this.dataList.length == this.copyList.length) {
          let maxNum = Math.max.apply(Math, this.copyList.map(item => {
            return item.id
          }))
          // console.log('id最大数', maxNum)
          //设置最大id为id,为了设置不同ref
          this.dataList.push({
            id: maxNum + 1,
            source_name: '',
            seen: true
          })
          this.$forceUpdate()
          this.$nextTick(function() {
            if (this.$refs['elInput' + '-' + (maxNum + 1)]) {
              this.$refs['elInput' + '-' + (maxNum + 1)].focus()
            }
          })
        } else {
          this.$message.error('请先操作当前新增项')
        }
      },

      blurFun(index, row) {
        if(this.isclose) {
          return
        }
        else{
          let arr = this.copyList.filter(item => {
            return item.id == row.id
          })
          if (arr.length > 0) { //编辑
            if (arr[0].source_name != row.source_name) {
              if(row.source_name == ''){
                this.$message.error('请输入线索来源名称')
                row.seen = true
                this.$refs['elInput' + '-' + row.id].focus()
              }
              else{
                updateClueSource({ id: row.id, source_name: row.source_name }).then(res => {
                  if (res.code == 200) {
                    row.seen = false
                    this.$message.success('编辑成功')
                    this.getList()
                  } else {
                    this.$message.error(res.msg)
                    row.seen = true
                  }
                })
              }
            } else {
              this.getList()
            }
          }
          else { //新增
            if (row.source_name == '') {
              row.seen = true
              this.$refs['elInput' + '-' + row.id].focus()
              return
            } else {
              addClueSource({source_name:row.source_name}).then(res=>{
                if (res.code == 200) {
                  row.seen = false
                  this.$message.success('新增成功')
                  this.getList()
                } else {
                  this.$message.error(res.msg)
                  row.seen = true
                }
              })
            }
          }
        }
      },
      cellClick(row, column, cell, event) {
        if(this.isclose) {
          return
        }
        else{
          this.$nextTick(function() {
            if (this.$refs['elInput' + '-' + row.id]) {
              this.$refs['elInput' + '-' + row.id].focus()
            }
          })
          row.seen = true
        }
      }
    }
  }
</script>

<style scoped>

</style>

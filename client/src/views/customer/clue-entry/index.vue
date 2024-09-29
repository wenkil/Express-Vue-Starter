<template>
  <div class="app-container">
    <Cluehead ref="clueHead" @getList="getList"/>
    <el-form>
      <el-form-item>
        <el-button type="primary" @click="addFun">新增线索</el-button>
        <el-button type="primary" @click="sourceDeployFun">线索来源配置</el-button>
        <el-button
          style="background-color: #939fff;color: #ffffff"
          icon="el-icon-s-check"
          @click="openBatchModel"
        >批量分配线索
        </el-button>
        <el-button
          style="background-color: rgb(66,216,212);color: #ffffff"
          icon="el-icon-s-check"
          @click="openDivertModel"
        >批量转客户
        </el-button>
      </el-form-item>
    </el-form>

    <ClueForm ref="ClueForm" :openType="1" :submit="submit"/>
    <ClueTable :dataList="dataList" :total="count" :listQuery="listQuery" v-loading="loading" @getList="getList"/>

    <el-dialog
      title="线索来源配置"
      :visible.sync="sourceModel"
      destroy-on-close
      width="800px"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <ClueSourceTable ref="ClueSourceTable"/>
    </el-dialog>

    <BatchProcessClue ref="BatchProcessClue" @getList="getList"/>
    <DivertCustomByClue ref="DivertCustomByClue" @getList="getList"/>
  </div>
</template>

<script>
  import {
    addClue,
    clueList,
    addClueSource,
    updateClueSource
  } from '@/api/clue'
  import { Cluehead, ClueTable, ClueForm, ClueSourceTable, BatchProcessClue, DivertCustomByClue } from './module'

  export default {
    name: 'index',
    components: { Cluehead, ClueTable, ClueForm, ClueSourceTable, BatchProcessClue, DivertCustomByClue },
    data() {
      return {
        dataList: [],
        loading: false,
        listQuery: {},
        count: 0,
        sourceModel: false
      }
    },

    created() {

    },

    methods: {

      /**
       * 页面组件调用逻辑： head组件的搜索条件传给index,index保存搜索项调用列表接口
       * 并传给table组件head传来的搜索项和total，total组件修改页面后再次通知index调用getlist
       * @param query
       */
      getList(query) {
        this.loading = true
        if(query){
          this.listQuery = JSON.parse(JSON.stringify(query))
        }
        clueList(this.listQuery).then(res => {
          this.loading = false
          if (res.code == 200) {
            this.dataList = res.data.list
            this.count = res.data.count
          } else {
            this.$message.error(res.msg)
          }
        })
      },

      addFun() {
        this.$refs.ClueForm.openModel({})
      },

      submit(form) {
        // console.log('新增表单', form)
        addClue(form).then(res => {
          if (res.code == 200) {
            this.$message.success('新增线索操作成功')
            this.$refs.ClueForm.closeModel()
            this.listQuery.page = 1
            this.getList(this.listQuery)
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      sourceDeployFun() {
        this.sourceModel = true
        this.$nextTick(function() {
          this.$refs.ClueSourceTable.getList()
        })
      },

      handleClose(done) {
        this.$refs.ClueSourceTable.initTable()
        done()
      },

      openBatchModel() {
        this.$refs.BatchProcessClue.openModel()
      },

      openDivertModel() {
        this.$refs.DivertCustomByClue.openModel()
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>

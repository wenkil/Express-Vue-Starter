<template>
  <div class="app-container">
    <div>
      <el-button type="primary" size="mini" @click="refresh" icon="el-icon-refresh">刷新</el-button>
      <el-button v-if="showFirst" type="primary" size="mini" @click="onAddNode(1)">新增一级部门</el-button>
      <el-button v-if="onClickNode && canAdd" type="primary" size="mini" @click="onAddNode(2)">新增子级</el-button>
      <el-button v-if="onClickNode" type="primary" size="mini" @click="onAddNode(3)">编辑名称</el-button>
      <el-button v-if="canDelete" type="primary" size="mini" @click="onDelDep">删除部门</el-button>
    </div>
    <div class="dep-info">
      <span>部门名称：{{curData.name}}</span>
<!--      <span>部门人数：<a style="color: #20a0ff" @click="openStaffPage">{{20}}</a></span>-->
      <span>创建时间：{{curData.creat_time | toTime}}</span>
    </div>
    <div class="tree-component">
      <VueOkrTree
        ref="VueOkrTree"
        :data="data"
        node-key="id"
        direction="horizontal"
        @node-click="handleNodeClick"
        current-lable-class-name="render-current-class"
        label-class-name='label-class-blue'
      />
    </div>

    <el-dialog
      :close-on-click-modal="false"
      :title="operateType === 3 ? '编辑部门' : '新增部门'"
      :visible.sync="dep_Model"
      width="500px"
    >
      <el-form :model="form" ref="form" v-loading="formLoading">
        <el-form-item
          label="部门名称"
          label-width="100px"
          prop="name"
          :rules="[{ required: true, trigger: 'blur',validator:nameValidate }]"
        >
          <el-input v-model.trim="form.name" placeholder="请输入部门名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelModel">取消</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { VueOkrTree } from 'vue-okr-tree'
  import 'vue-okr-tree/dist/vue-okr-tree.css'
  import { depList, addDep, updateDep, deleteDep } from '@/api/department'

  export default {
    name: 'index',
    components: { VueOkrTree },
    data() {
      return {
        data: [],
        showFirst: false,
        onClickNode: false,
        dep_Model: false,
        canDelete: false,
        canAdd: false,
        formLoading: false,
        operateType: 1,
        form: {},
        curData: {}
      }
    },
    created() {
      this.getList()
    },
    methods: {

      openStaffPage() {
        this.$message('跳转到员工列表功能开发中')
      },

      nameValidate(rule, value, callback) {
        if (value === '') {
          callback(new Error('请输入部门名称'))
        } else if (value) {
          if (value.length > 20) {
            callback(new Error('名称长度不得超过20个字'))
          } else {
            callback()
          }
        }
      },
      refresh() {
        this.onClickNode = false
        this.canDelete = false
        this.curData = {}
        this.getList()
      },
      getList() {
        depList({}).then(res => {
          // console.log('res', res)
          this.loading = false
          if (res.code == 200) {
            this.data = res.data.list
            this.showFirst = res.data.list.length > 0 ? false : true
          } else {
            this.$message.error(res.msg)
          }
        })
      },

      handleNodeClick(data, node) {
        this.curData = Object.assign({}, data)
        this.canDelete = data.level != 1 ? true : false //第一级不可删除
        this.canAdd = data.level != 4 ? true : false   //第四级不可再新增子级
        this.onClickNode = true
      },

      //打开部门编辑弹框
      async onAddNode(type) {
        if (type == 2 && this.curData.level == 4) {
          this.$message.error('部门层级最大可设置四级')
          return
        }
        this.operateType = type
        this.dep_Model = true
        if (type == 1 || type == 2) {
          this.initForm()
        } else {
          this.form = Object.assign({}, this.curData)
        }
      },

      initForm() {
        this.form = { name: '' }
      },

      cancelModel() {
        this.$refs.form.resetFields()
        this.dep_Model = false
      },

      onSubmit() {
        this.$refs.form.validate(validate => {
          if (validate) {
            if (this.operateType == 1 || this.operateType == 2) {
              let data = {
                type: this.operateType,
                name: this.form.name
              }
              if (this.operateType == 2) data.pid = this.curData.id
              addDep(data).then(res => {
                if (res.code == 200) {
                  this.cancelModel()
                  this.refresh()
                } else {
                  this.$message.error(res.msg)
                }
              })
            } else {
              updateDep({ id: this.curData.id, name: this.form.name }).then(res => {
                if (res.code == 200) {
                  this.cancelModel()
                  this.refresh()
                } else {
                  this.$message.error(res.msg)
                }
              })
            }
          } else {
            this.$message.error('请填入必填项')
            return
          }
        })
      },

      onDelDep() {
        this.$showTips({
          title: '是否确认删除此部门? (请先确认该部门下没有关联员工)'
        }, () => {
          deleteDep({ id: this.curData.id }).then(res => {
            if (res.code == 200) {
              this.canDelete = false
              this.refresh()
            } else {
              this.$message.error(res.msg)
            }
          })
        })
      }

    }
  }
</script>

<style>
  .horizontal .org-chart-node:not(.is-left-child-node):after, .horizontal .org-chart-node:not(.is-left-child-node):before {
    height: 51% !important;
  }

  .label-class-blue {
    background-color: #e4e4e4;
  }

  .render-current-class {
    color: #20a0ff;
  }
</style>
<style scoped lang="scss">
  .dep-info {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    font-size: 18px;
    line-height: initial;
  }

  .tree-component {
    margin-top: 30px;
  }
</style>

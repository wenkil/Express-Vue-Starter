<template>
  <div class="app-container">
    <el-form inline v-if="role_id == 1">
      <el-form-item>
        <el-button type="primary" @click="openModel(1)">新增</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="getList(listQuery.page)">刷新</el-button>
      </el-form-item>
    </el-form>
    <div>
      Tips:非管理员角色不可【新增和修改】权限组
    </div>
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
          prop="role_name"
          label="权限组名称"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="creat_time"
          label="创建时间"
          align="center"
          min-width="120"
        >
          <template slot-scope="{row}">
            <span> {{row.creat_time | toTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="update_time"
          label="更新时间"
          align="center"
          min-width="120"
        >
          <template slot-scope="{row}">
            <span> {{row.update_time | toTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="role_id == 1"
          label="操作"
          align="center"
          min-width="120">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="openModel(2,row)">编辑</el-button>
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

    <el-dialog
      :close-on-click-modal="false"
      :title="curType == 1 ? '新增权限组':'编辑权限组'"
      :visible.sync="roleModel"
      width="600px"
      destroy-on-close
    >
      <el-form label-width="100px" v-loading="modelLoading">
        <el-form-item label="权限组名称:" :rules="[{ required: true }]">
          <el-input v-model.trim="role_name" ></el-input>
        </el-form-item>
        <el-form-item label="选择权限:" :rules="[{ required: true }]">
          <el-tree
            style="margin-top: 10px;"
            :data="roleList"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            check-on-click-node
            :expand-on-click-node="false"
            :props="defaultProps"
          >
          </el-tree>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onTeacherSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import moment from 'moment'
  import { getRoleList,addRole,updateRole } from '@/api/user'
  import { queryParams } from '@/utils'
  import { asyncRoutes } from '@/config'

  export default {
    components: {  },
    name: 'role-list',
    data() {
      return {
        total: 0,
        listLoading: false,
        modelLoading:false,
        listQuery: {
          page: 1,
          limit: 15,
          id: ''
        },
        dataList: [],
        roleModel: false,
        roleList: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        role_name: '',
        curType:1,
        curData:1,
        role_id:-1
      }
    },

    created() {
      // console.log('this.$store.userInfo',this.$store.getters.userInfo)
      this.role_id = this.$store.getters.userInfo.role_id
      this.getList(1)
    },

    methods: {
      getList(page) {
        if (page && page > 0) {
          this.listQuery.page = page
        }
        this.listLoading = true
        getRoleList(this.listQuery).then(res => {
          this.listLoading = false
          if (res.code == 200) {
            this.total = res.data.count
            this.dataList = res.data.list
          } else {
            this.$message.error(res.msg)
          }
        })
      },

      openModel(type, data) {
        // console.log('asyncRoutes', asyncRoutes)
        this.role_name = ''
        this.roleModel = true
        this.modelLoading = true
        this.roleList = asyncRoutes
        this.curType = type
        this.curData = data
        if (type == 1) {
          this.$nextTick(function() {
            this.$refs.tree.setCheckedKeys([])
          })
        } else if (type == 2) {
          this.role_name = data.role_name
          // console.log('当前角色权限', data.menulist.split(',').map(Number))
          this.$nextTick(function() {
            this.$refs.tree.setCheckedKeys(data.menulist.split(',').map(Number))
          })
        }
        this.modelLoading = false
      },


      onCancel() {
        this.roleModel = false
      },

      onTeacherSubmit() {
        if(this.role_name == ''){
          this.$message.error('请输入权限组名称')
          return
        }
        let nodes = this.$refs.tree.getCheckedNodes()
        if(nodes.length == 0) {
          this.$message.error('权限不得为空,请至少选择一个页面')
          return
        }
        let checkNodes = nodes.filter(item => {
          return !item.children
        }).map(v => v.id)
        // console.log('提交的节点', checkNodes.join(','))
        if(this.curType == 1){
          addRole({
            name:this.role_name,
            menulist:checkNodes.join(',')
          }).then(res=>{
            if (res.code == 200) {
              this.$message.success('新增权限操作成功')
              this.roleModel = false
              this.getList(this.listQuery.page)
            } else {
              this.$message.error(res.msg)
            }
          })
        }
        else{
          updateRole({
            role_id:this.curData.role_id,
            name:this.role_name,
            menulist:checkNodes.join(',')
          }).then(res=>{
            if (res.code == 200) {
              this.$message.success('编辑权限操作成功')
              this.roleModel = false
              this.getList(this.listQuery.page)
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>

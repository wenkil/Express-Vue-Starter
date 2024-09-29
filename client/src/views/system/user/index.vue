<template>
  <div class="app-container">
    <div>
      <el-form inline>
        <el-form-item label="用户名">
          <el-input
            v-model.trim="listQuery.name"
            clearable
            @clear="getList(1)"
            @keydown.enter.native="getList(1)"
            placeholder="请输入关键字模糊搜索"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select style="width: 200px" clearable v-model="listQuery.type" @change="getList(1)">
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList(1)">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="openAddModel(1,{})">新增用户</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      Tips:非管理员角色不可【修改和禁用】用户
    </div>
    <div style="margin-top: 20px">
      <el-table
        height="600px"
        :data="dataList"
        border
        highlight-current-row
        style="width: 100%;min-height: 400px"
        v-loading="listLoading"
      >
        <el-table-column prop="user_id" label="用户ID" min-width="100" align="center"/>
        <el-table-column
          prop="name"
          label="用户名"
          align="center"
          min-width="140"
        />
        <el-table-column
          prop="user_status"
          label="用户状态"
          align="center"
          min-width="100"
        >
          <template slot-scope="{row}">
            <el-tag :type="row.user_status == 1 ? 'success': 'danger'">
              {{row.user_status == 1 ? '正常':'禁用'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="用户角色"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="superior_name"
          label="直属上级"
          align="center"
          min-width="120"
        />
        <el-table-column
          prop="creat_time"
          label="创建时间"
          align="center"
          min-width="160"
        >
          <template slot-scope="{row}">
            <span> {{row.creat_time | toTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="update_time"
          label="更新时间"
          align="center"
          min-width="160"
        >
          <template slot-scope="{row}">
            <span> {{row.update_time | toTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="role_id == 1"
          label="操作"
          align="center"
          min-width="160"
        >
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="openAddModel(2,row)">编辑</el-button>
            <el-button v-if="row.role_id != 1 && row.user_status == 1" type="danger" size="mini"
                       @click="deleteUser(row)">禁用
            </el-button>
            <el-button v-if="row.role_id != 1 && row.user_status == 2" type="success" size="mini"
                       @click="deleteUser(row)">启用
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList(listQuery.page)"
      />
    </div>

    <el-dialog
      :title="openType == 1 ? '新增用户' : '编辑用户'"
      :visible.sync="addModel"
      width="500px"
      :close-on-click-modal="false"
      :before-close="beforeClose"
    >
      <el-form :model="userForm" label-width="80px" :rules="rules" ref="userForm" v-loading="formLoading">
        <el-form-item label="用户名" prop="name">
          <el-input v-model.trim="userForm.name" maxlength="20" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="openType == 1">
          <el-input :type="showNewPassword ? 'text' : 'password'" v-model.trim="userForm.password"
                    placeholder="请输入新密码：6~12位,英文字母+数字" maxlength="12">
            <template slot="append">
              <a slot="suffix" class="el-icon-view" @click="showNewPassword = !showNewPassword"></a>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="权限组" prop="role">
          <el-select
            style="width: 100%"
            clearable
            v-model="userForm.role">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="直属上级" prop="superior">
          <el-select
            filterable
            style="width: 100%"
            clearable
            v-model="userForm.superior">
            <el-option
              v-for="item in superiorList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div>
          <el-button @click="closeModel">取 消</el-button>
          <el-button type="primary" @click="modelSubmit">提 交</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import moment from 'moment'
  import { addUser, getUserList, deleteUser, getRoleList, updateUsre } from '@/api/user'

  export default {
    components: {  },
    name: 'backend-user',
    data() {
      return {
        total: 0,
        listLoading: false,
        formLoading: false,
        listQuery: {
          page: 1,
          limit: 15,
          name: '',
          type: ''
        },
        dataList: [],
        addModel: false,
        showNewPassword: false,
        userForm: {},
        rules: {
          name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          password: [
            { required: true, validator: this.validatePass, trigger: 'blur' }
          ],
          role: [
            { required: true, message: '请选择权限组', trigger: 'change' }
          ],
          // superior: [
          //   { required: true, message: '请选择直属上级', trigger: 'change' }
          // ]
        },
        roleList: [],
        superiorList: [],
        role_id: -1,
        openType: 0,
        statusList: [
          { id: 1, value: '启用' },
          { id: 2, value: '禁用' }
        ]
      }
    },

    created() {
      // console.log('this.$store.userInfo',this.$store.getters.userInfo)
      this.role_id = this.$store.getters.userInfo.role_id
      this.getList(1)
      this.initForm()
    },

    methods: {
      validatePass(rule, value, callback) {
        if (value === '') {
          callback(new Error('请输入登录密码'))
        } else if (value) {
          let pwdRegex = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/)
          if (!pwdRegex.test(value)) {
            callback(new Error('密码不符合规范：长度：6~12位,复杂度：英文字母+数字,请重新输入'))
            return
          } else {
            callback()
          }
        }
      },

      getList(page) {
        if (page && page > 0) {
          this.listQuery.page = page
        }
        this.listLoading = true
        let query = JSON.parse(JSON.stringify(this.listQuery))
        this.getUserList(query, (res) => {
          this.total = res.data.count
          if (res.data.list.length == 0 && this.total != 0) {
            this.getList(page - 1)
          } else {
            this.dataList = res.data.list
          }
        })
      },

      getUserList(query, callback) {
        getUserList(query).then(res => {
          this.listLoading = false
          if (res.code == 200) {
            callback(res)
          } else {
            this.$message.error(res.msg)
          }
        })
      },

      getUserByStatus() {
        let query = {
          page: 1,
          limit: 500,
          type: 1,
          listType:1
        }
        this.getUserList(query, (res) => {
          this.superiorList = res.data.list.map(item => {
            return {
              id: item.user_id,
              name: item.name
            }
          })
        })
      },

      getRoleList() {
        this.roleList = []
        this.formLoading = true
        return new Promise((resolve, reject) => {
          getRoleList({ page: 1, limit: 200 }).then(res => {
            this.formLoading = false
            if (res.code == 200) {
              this.roleList = res.data.list.map(item => {
                return {
                  id: item.role_id,
                  name: item.role_name
                }
              })
              resolve()
            } else {
              this.$message.error(res.msg)
              resolve()
            }
          })
        })
      },

      initForm() {
        this.userForm = {
          name: '',
          password: '',
          role: '',
          superior: ''
        }
      },

      //新增用户：1新增 2编辑
      async openAddModel(type, data) {
        this.addModel = true
        this.openType = type
        await this.getUserByStatus()
        await this.getRoleList()
        if (type == 1) {
          this.$nextTick(function() {
            this.initForm()
          })
        } else {
          this.curData = JSON.parse(JSON.stringify(data))
          this.userForm.name = this.curData.name
          this.userForm.role = this.curData.role_id
          this.userForm.superior = this.curData.superior_id ? this.curData.superior_id : ''
        }
      },

      closeModel() {
        this.$refs.userForm.resetFields()
        this.addModel = false
      },

      beforeClose(done) {
        this.$refs.userForm.resetFields()
        done()
      },

      modelSubmit() {
        if (this.userForm.name.length > 12) {
          this.$message.error('名字长度不可大于12位,请重新输入')
          return
        }
        this.$refs.userForm.validate((valid) => {
          if (valid) {
            if (this.openType == 1) {
              let data = JSON.parse(JSON.stringify(this.userForm))
              addUser(data).then(res => {
                if (res.code == 200) {
                  this.$message.success('新增用户操作成功')
                  this.closeModel()
                  this.getList(this.listQuery.page)
                } else {
                  this.$message.error(res.msg)
                }
              })
            } else {
              if (this.curData.user_id == this.userForm.superior) {
                this.$message.error('直属上级不可为用户本人')
                return
              }
              updateUsre({
                user_id: this.curData.user_id,
                name: this.userForm.name,
                role_id: this.userForm.role,
                superior: this.userForm.superior
              }).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑用户操作成功')
                  this.closeModel()
                  this.getList(this.listQuery.page)
                } else {
                  this.$message.error(res.msg)
                }
              })
            }
          } else {
            this.$message.error('请填写必填项')
          }
        })
      },

      deleteUser(row) {
        this.$confirm(`确定${row.user_status == 1 ? '禁用' : '启用'}该后台用户?`, '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
            deleteUser({ user_id: row.user_id, type: row.user_status == 1 ? 2 : 1 }).then(res => {
              if (res.code == 200) {
                this.$message.success(`${row.user_status == 1 ? '禁用' : '启用'}用户操作成功`)
                this.getList(this.listQuery.page)
              } else {
                this.$message.error(res.msg)
              }
            })
          })
          .catch((action) => {
          })
      }

    }
  }
</script>

<style scoped>

</style>

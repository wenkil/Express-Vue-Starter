<template>
  <div>
    <el-dialog
      top="5vh"
      :close-on-click-modal="false"
      :show-close="false"
      :title="openType == 1 ? '新增回款' : '编辑回款'"
      :visible.sync="addModel"
      width="1000px"
    >
      <el-form
        v-loading="modelLoading"
        :model="form"
        :rules="rulers"
        ref="form"
        label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户" prop="crm_user_id">
              <el-select
                :disabled="openType == 2"
                style="width: 370px"
                filterable
                v-model="form.crm_user_id"
                @change="crmUserChange"
              >
                <el-option
                  v-for="item in crmUserList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="回款方式" prop="collect_type">
              <el-select
                style="width: 370px"
                filterable
                v-model="form.collect_type"
              >
                <el-option
                  v-for="item in collectTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户订单" prop="order_id">
              <el-select
                :disabled="openType == 2"
                style="width: 370px"
                filterable
                v-model="form.order_id"
              >
                <el-option
                  v-for="item in crmOrderList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="实际金额" prop="collect_amount">
              <el-input style="width: 370px" v-model.trim="form.collect_amount"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="回款日期" prop="collect_date">
          <el-date-picker
            style="width: 100%"
            v-model="form.collect_date"
            :clearable="false"
            type="date"
            placeholder="请选择签约日期"
            value-format="timestamp"
          >
          </el-date-picker>
        </el-form-item>
        <div class="tagTitle">
          <span>回款审批人</span>
          <i
            class="el-icon-circle-plus-outline"
            style="margin-left: 10px; cursor: pointer"
            @click="onAdd"
          ></i>
        </div>
        <br/>
        <div class="approve_div">
          <div v-for="(item, index) in form.approve_user"
               :key="index">
            <span style="font-size: 16px">{{ index + 1 + '级审批人' }}</span>
            <el-select
              style="width: 80%"
              multiple
              :multiple-limit="1"
              filterable
              v-model="item.id">
              <el-option
                v-for="item in approveUserList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <i
              v-show="!(form.approve_user.length > index + 1)"
              style="font-size: 18px; margin-left: 10px; cursor: pointer"
              class="el-icon-remove-outline"
              @click="onDel(item, index)"
            ></i>
          </div>
        </div>
        <br>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            placeholder="请输入备注内容"
            type="textarea"
            autosize
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="closeModel">取消</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { contactList } from '@/api/contact'
import { crmUserList } from '@/api/crm_user'
import { getUserList } from '@/api/user'
import { collectTypes } from '@/config/index'
import { orderApi } from '@/api/order'
import { backmoneyApi } from '@/api/backmoney'

export default {
  components: {},
  props: {
    openType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      addModel: false,
      modelLoading: false,
      form: {},
      curData: {},
      crmUserList: [],//客户列表
      approveUserList: [],//审批人列表
      crmOrderList: [],//客户订单列表
      collectTypes: collectTypes,
      rulers: {
        collect_type: [
          { required: true, message: '请选择回款方式', trigger: 'blur' }
        ],
        crm_user_id: [
          { required: true, message: '请选择客户', trigger: 'change' }
        ],
        collect_date: [
          { required: true, message: '请选择回款日期', trigger: 'change,blur' }
        ],
        order_id: [
          { required: true, message: '请选择客户订单', trigger: 'change' }
        ],
        collect_amount: [
          { required: true, message: '请输入回款金额', trigger: 'blur' }
        ],
        approve_user: [
          { required: true, message: '请选择审批人', trigger: 'change' }
        ]
      }
    }
  },
  created() {

  },
  methods: {
    onAdd() {
      if (this.form.approve_user.length == 3) {
        this.$message.error('审批人最多只能选择三级')
        return
      }
      let form = {
        id: ''
      }
      this.form.approve_user.push(form)
    },
    onDel(item, index) {
      if (this.form.approve_user.length == 1) {
        this.$message.error('请至少选择一位审批人')
        return
      }
      this.form.approve_user.splice(index, 1)
    },

    openModel(row) {
      this.addModel = true
      this.modelLoading = true
      this.initForm()
      this.getCrmUserList()
      this.getUserList()
      if (this.openType == 1) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
          this.$refs.form.clearValidate()
        })
      } else {
        this.curData = JSON.parse(JSON.stringify(row))
        this.form = {
          order_id: this.curData.order_id,
          crm_user_id: this.curData.crm_user_id,
          collect_date: this.curData.collect_date,
          collect_type: this.curData.collect_type,
          collect_amount: this.curData.collect_amount / 100,
          approve_user: this.curData.approve_user.split(',').map(v => {
            return {
              id: [Number(v)]
            }
          }),
          remark: this.curData.remark ? this.curData.remark : ''
        }
        this.getCrmUserOrderList(this.curData.crm_user_id)
      }
      console.log('this.form', this.form)
      this.modelLoading = false
    },

    initForm() {
      this.form = {
        crm_user_id: '',
        order_id: '',
        collect_date: '',
        collect_amount: '',
        collect_type: '',
        approve_user: [],
        remark: ''
      }
    },

    onSubmit() {
      if (!this.checkApproveUser()) return

      this.$refs.form.validate(valid => {
        if (valid) {
          this.$showTips({ title: '是否确认提交回款数据?' }, () => {
            let data = { ...this.form }
            data.approve_user = this.form.approve_user.map(item => item.id[0]).join(',')
            data.collect_amount = this.form.collect_amount * 100
            let apiType = 'add'
            if (this.openType == 2) {
              apiType = 'edit'
              data.id = this.curData.id
              delete data.crm_user_id
              delete data.order_id
            }

            backmoneyApi(data, apiType).then(res => {
              if (res.code == 200) {
                this.$message.success(`${this.openType == 1 ? '新增' : '编辑'}回款操作完成`)
                this.$emit('getList')
                this.closeModel()
              } else {
                this.$message.error(res.msg)
              }
            })
          })
        } else {
          this.$message.error('请填写必填项')
        }
      })
    },
    closeModel() {
      this.addModel = false
    },
    checkApproveUser() {
      if (this.form.approve_user.length == 0) {
        this.$message.error('请至少选择一位审批人')
        return false
      }
      for (let key of this.form.approve_user) {
        if (!key.id[0]) {
          this.$message.error('审批人不得为空')
          return false
        }
      }
      let tempSet = new Set()
      let array = this.form.approve_user.map(v => {
        tempSet.add(v.id[0])
        return v.id[0]
      })
      if (array.length != tempSet.size) {
        this.$message.error('审批人不得重复,请重新选择')
        return false
      }
      return true
    },
    //根据客户id获取该用户下未取消且未生效的订单
    async getCrmUserOrderList(id) {
      let data = {
        page: 1,
        limit: 100,
        crm_user_id: id,
        related: 2,
        order_cycle: 1, //1未取消 2已生效
        effect_status: 2 //1已生效 2未生效
      }
      orderApi(data, 'list').then(res => {
        if (res.code == 200) {
          this.crmOrderList = res.data.list.map(item => {
            return {
              id: item.id,
              name: item.order_name
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    async crmUserChange(val) {
      this.form.order_id = '' //清空订单id
      this.crmOrderList = []
      if (val) {
        this.getCrmUserOrderList(val)
      }
    },
    async getCrmUserList() {
      await crmUserList({
        page: 1,
        limit: 500,
        crm_list_type: 1
      }).then(res => {
        if (res.code == 200) {
          this.crmUserList = res.data.list.map(item => {
            return {
              id: item.id,
              name: item.crm_user_name
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    //获取审批人列表: 自己不可成为自己创建的订单的审批人
    async getUserList() {
      let admin_id = this.$store.getters.userInfo.admin_id
      this.approveUserList = []
      await getUserList({
        page: 1,
        limit: 500,
        type: 1
      }).then(res => {
        if (res.code == 200) {
          for (let i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i].user_id != admin_id) {
              this.approveUserList.push({
                id: res.data.list[i].user_id,
                name: res.data.list[i].name
              })
            }
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    }

  }
}
</script>

<style scoped>
.tagTitle {
  margin-left: 20px;
  font-weight: 600;
  font-size: 18px;
}

.approve_div {
  margin-left: 110px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>

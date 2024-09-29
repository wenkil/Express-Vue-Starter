<template>
  <div>
    <el-dialog
      top="5vh"
      :close-on-click-modal="false"
      :show-close="false"
      :title="openType == 1 ? '新增订单' : '编辑订单'"
      :visible.sync="addModel"
      width="1000px">
      <el-form
        v-loading="modelLoading"
        :model="form"
        :rules="rulers"
        ref="form"
        label-width="110px">
        <el-row>
          <el-form-item label="订单名称" prop="order_name">
            <el-input v-model.trim="form.order_name" maxlength="30"></el-input>
          </el-form-item>
          <el-col :span="12">
            <el-form-item label="订单类型" prop="order_type">
              <el-select
                style="width: 335px"
                filterable
                v-model="form.order_type"
              >
                <el-option
                  v-for="item in orderTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户" prop="crm_user_id">
              <el-select
                style="width: 335px"
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

            <el-form-item label="选择产品" prop="goods_id">
              <el-select
                style="width: 335px"
                v-model="form.goods_id"
                filterable
                @change="goodsChange"
              >
                <el-option
                  v-for="item in goodsList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单折扣系数" prop="discount">
              <el-input-number
                style="width: 310px"
                @change="discountChange"
                v-model="form.discount"
                :precision="2"
                :step="0.1"
                :max="1"
                :min="0.1">
              </el-input-number>
              <el-tooltip class="item" effect="dark" content="折扣系数1为不打折,0.9打九折,依此类推" placement="top">
                <i class="el-icon-question" style="font-size:20px"></i>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单编号">
              <el-input v-model.trim="form.order_number" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="客户签约人" prop="crm_contact_id">
              <el-select
                style="width: 370px"
                v-model="form.crm_contact_id">
                <el-option
                  v-for="item in crmContactList"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品数量" prop="goods_cnt">
              <el-input-number
                @change="discountChange"
                style="width: 370px"
                v-model="form.goods_cnt"
                :step="1"
                :min="1">
              </el-input-number>
            </el-form-item>
            <el-form-item label="实际金额" prop="actual_amount">
              <el-input readonly v-model.trim="form.actual_amount"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="签约日期" prop="contract_date">
          <el-date-picker
            style="width: 100%"
            v-model="form.contract_date"
            :clearable="false"
            type="date"
            placeholder="请选择签约日期"
            value-format="timestamp"
          >
          </el-date-picker>
        </el-form-item>
        <div class="tagTitle">
          <span>订单审批人</span>
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
import { getUserList } from '@/api/user'
import { crmUserList } from '@/api/crm_user'
import { contactList } from '@/api/contact'
import { goodsList } from '@/api/goods'
import { orderApi } from '@/api/order'
import moment from 'moment'

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
      crmContactList: [],//联系人列表
      approveUserList: [],//审批人列表
      goodsList: [],//产品列表
      orderTypes: [
        { id: 1, name: '体验产品订单' },
        { id: 2, name: '新签订单' },
        { id: 3, name: '复购订单' }
      ],
      rulers: {
        order_name: [
          { required: true, message: '请输入订单名称', trigger: 'blur' }
        ],
        order_number: [
          { required: true, message: '请输入订单编号', trigger: 'blur' }
        ],
        order_type: [
          { required: true, message: '请选择订单类型', trigger: 'blur' }
        ],
        crm_user_id: [
          { required: true, message: '请选择客户', trigger: 'change' }
        ],
        contract_date: [
          { required: true, message: '请选择签约日期', trigger: 'change,blur' }
        ],
        crm_contact_id: [
          { required: true, message: '请选择客户签约人', trigger: 'change' }
        ],
        goods_id: [
          { required: true, message: '请选择产品', trigger: 'change' }
        ],
        discount: [
          { required: true, message: '请输入订单折扣', trigger: 'change' }
        ],
        goods_cnt: [
          { required: true, message: '请输入产品数量', trigger: 'change' }
        ],
        actual_amount: [
          { required: true, message: '请输入实际金额', trigger: 'change' }
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
      this.getGoodsList()
      this.getUserList()
      if (this.openType == 1) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
          this.$refs.form.clearValidate()
        })
      } else {
        this.curData = JSON.parse(JSON.stringify(row))
        this.form = {
          order_name: this.curData.order_name,
          order_type: this.curData.order_type,
          order_number: this.curData.order_number,
          crm_user_id: this.curData.crm_user_id,
          crm_contact_id: this.curData.crm_contact_id,
          contract_date: this.curData.contract_date,
          goods_id: this.curData.goods_id,
          goods_cnt: this.curData.goods_cnt,
          discount: this.curData.discount / 100,
          actual_amount: this.curData.actual_amount / 100,
          approve_user: this.curData.approve_user.split(',').map(v => {
            return {
              id: [Number(v)]
            }
          }),
          remark: this.curData.remark ? this.curData.remark : '',
          reject_reason: this.curData.reject_reason ? this.curData.reject_reason : ''
        }
        this.getContactUserList(this.curData.crm_user_id)
      }
      console.log('this.form', this.form)
      this.modelLoading = false
    },

    initForm() {
      this.form = {
        order_name: '',
        order_type: '',
        order_number: '',
        crm_user_id: '',
        crm_contact_id: '',
        contract_date: '',
        goods_id: '',
        goods_cnt: 1,
        discount: 1,
        actual_amount: '',
        approve_user: [],
        remark: '',
        reject_reason: ''
      }
    },

    async crmUserChange(val) {
      this.form.crm_contact_id = '' //清空联系人id
      this.crmContactList = []
      if (val) {
        this.getContactUserList(val)
      }
    },

    async getContactUserList(id) {
      await contactList({
        crm_user_id: id,
        page: 1,
        limit: 500
      }).then(res => {
        this.loading = false
        if (res.code == 200) {
          this.crmContactList = res.data.list.map(item => {
            return {
              id: item.contact_id,
              value: item.contact_name
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    async getGoodsList() {
      await goodsList({
        page: 1,
        limit: 500,
        goods_status: 1
      }, 'list').then(res => {
        this.loading = false
        if (res.code == 200) {
          this.goodsList = res.data.list.map(item => {
            return {
              id: item.goods_id,
              name: item.goods_name,
              price: item.goods_price
            }
          })
          if (this.openType == 2) { //已禁用的产品加进数组进行回显
            if (!this.goodsList.some(v => v.id == this.curData.goods_id)) {
              this.goodsList.unshift({
                id: this.curData.goods_id,
                name: this.curData.goods_name,
                price: this.curData.goods_price
              })
            }
          }
        } else {
          this.$message.error(res.msg)
        }
      })
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
    },

    goodsChange(id) {
      let temp = this.goodsList.filter(v => v.id == id)
      if (temp.length && this.form.discount && this.form.goods_cnt) {
        this.form.actual_amount = (temp[0].price / 100) * Number(this.form.discount) * this.form.goods_cnt
      } else {
        this.$message.info('请先选择产品')
        this.form.actual_amount = ''
      }
    },

    discountChange() {
      this.goodsChange(this.form.goods_id)
    },

    onSubmit() {
      console.log('this.form', this.form)
      if (!this.form.discount) {
        this.$message.error('订单折扣不得为空')
        return
      }
      if (!this.form.goods_cnt) {
        this.$message.error('产品数量不得为空')
        return
      }
      if (!this.checkApproveUser()) return
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$showTips({ title: '是否确认提交此订单数据?' }, () => {
            let data = { ...this.form }
            if (!this.form.order_number) {
              data.order_number = moment().format('YYYYMMDDHHmmss')
            }
            data.approve_user = this.form.approve_user.map(item => item.id[0]).join(',')
            data.actual_amount = this.form.actual_amount * 100
            data.discount = this.form.discount * 100
            let apiType = 'add'
            if (this.openType == 2) {
              apiType = 'edit'
              data.id = this.curData.id
            }

            orderApi(data, apiType).then(res => {
              if (res.code == 200) {
                this.$message.success(`${this.openType == 1 ? '新增' : '编辑'}订单操作完成`)
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

    closeModel() {
      this.addModel = false
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

<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      :title="(openType == 1 || openType == 3) ? '新建联系人' : '编辑联系人'"
      :visible.sync="addModel"
      width="1100px"
    >
      <el-form label-width="120px" v-loading="modelLoading" :model="form" :rules="rulers" ref="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="选择客户" prop="crm_user_id">
              <el-select
                :disabled="openType == 2 || openType == 3"
                style="width: 360px"
                v-model="form.crm_user_id">
                <el-option
                  v-for="item in crm_user_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="性别" prop="contact_gender">
              <el-select
                style="width: 360px"
                v-model="form.contact_gender">
                <el-option
                  v-for="item in genderList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="手机号" prop="contact_phone">
              <el-input style="width: 360px" v-model.trim="form.contact_phone" maxlength="11"></el-input>
            </el-form-item>

            <el-form-item label="地址" prop="contact_address">
              <el-input style="width: 360px" v-model.trim="form.contact_address" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人名称" prop="contact_name">
              <el-input style="width: 360px" v-model.trim="form.contact_name" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="是否决策人" prop="decision_type">
              <el-select
                style="width: 360px"
                v-model="form.decision_type">
                <el-option
                  v-for="item in decision_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="邮箱" prop="contact_mail">
              <el-input style="width: 360px" v-model.trim="form.contact_mail"></el-input>
            </el-form-item>

            <el-form-item label="下次联系时间" prop="next_contact_time">
              <el-date-picker
                style="width: 360px"
                v-model="form.next_contact_time"
                type="datetime"
                placeholder="请选择下次联系时间"
                :picker-options="pickerOptions"
                value-format="timestamp"
                :popper-class="'currentDatePickerClass'"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input
            style="width: 890px"
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
  import { addContact, updateContact } from '@/api/contact'
  import { crmUserList } from '@/api/crm_user'

  export default {
    props: {
      openType: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 12 * 60 * 60 * 1000
          }
        },
        modelLoading: false,
        addModel: false,
        form: {},
        rulers: {
          crm_user_id: [
            { required: true, message: '请选择客户', trigger: 'change' }
          ],
          contact_name: [
            { required: true, message: '请输入联系人名称', trigger: 'blur' }
          ],
          contact_gender: [
            { required: true, message: '请选择性别', trigger: 'change' }
          ],
          contact_phone: [
            { required: true, validator: this.phoneRule, trigger: 'blur' }
          ],
          contact_address: [
            { required: true, message: '请输入联系人地址', trigger: 'blur' }
          ],
          decision_type: [
            { required: true, message: '请选择是否决策人', trigger: 'change' }
          ],
          next_contact_time: [
            { required: true, message: '请选择下次联系时间', trigger: 'change' }
          ]
        },
        crm_user_list: [],//客户列表
        genderList: [
          { id: 1, name: '男' },
          { id: 2, name: '女' }
        ],
        decision_list: [
          { id: 1, name: '是' },
          { id: 2, name: '否' }
        ]
      }
    },
    created() {

    },
    methods: {
      phoneRule(rule, val, callback) {
        if (val) {
          if (Number(val)) {
            if (val.length != 11) {
              callback(new Error('手机号长度限制11位'))
            } else {
              var reg = /^1[3-9]\d{9}$/
              if (!reg.test(val)) {
                callback(new Error('手机号验证失败'))
              } else {
                callback()
              }
            }
          } else {
            callback(new Error('手机号格式不正确'))
          }
        } else {
          callback(new Error('请输入手机号'))
        }
      },

      initForm() {
        this.form = {
          contact_name: '',//名称
          crm_user_id: '',//客户id
          contact_gender: '',//性别
          contact_phone: '',//手机号
          contact_mail: '',//邮箱
          decision_type: '',//是否决策人
          contact_address: '',//地址
          next_contact_time: '',//下次联系时间
          remark: ''
        }
      },

      async openModel(data) {
        this.initForm()
        this.addModel = true
        this.modelLoading = true
        await this.getCrmUserList()
        if (this.openType == 1) {
          this.curData = {}
        } else {
          // console.log('编辑联系人', data)
          this.curData = JSON.parse(JSON.stringify(data))
          Object.keys(this.curData).forEach(item => {
            if (this.form.hasOwnProperty(item)) {
              this.form[item] = this.curData[item]
            }
          })
        }
        this.modelLoading = false
      },

      getCrmUserList() {
        this.crm_user_list = []
        return new Promise((resolve, reject) => {
          crmUserList({ crm_list_type: 2, page: 1, limit: 500 }).then(res => {
            if (res.code == 200) {
              this.crm_user_list = res.data.list.map(item => {
                return {
                  id: item.id,
                  name: item.crm_user_name
                }
              })
              resolve()
            } else {
              this.$message.error(res.msg)
              reject(res.msg)
            }
          })
        })
      },

      onSubmit() {
        this.$refs.form.validate(valid => {
          if (this.form.crm_user_mail) {
            var reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
            if (!reg.test(this.form.crm_user_mail)) {
              this.$message.error('邮箱格式不正确')
              return
            }
          }

          if (valid) {
            this.$confirm('是否确定提交以上数据？', '确认信息', {
              distinguishCancelAndClose: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            })
              .then(() => {
                if (this.openType == 1 || this.openType == 3) {
                  let data = JSON.parse(JSON.stringify(this.form))
                  addContact(data).then(res => {
                    if (res.code == 200) {
                      this.$message.success('新增联系人操作成功')
                      this.$emit('getList')
                      this.closeModel()
                    } else {
                      this.$message.error(res.msg)
                    }
                  })
                } else {
                  let data = JSON.parse(JSON.stringify(this.form))
                  data.contact_id = this.curData.contact_id
                  updateContact(data).then(res => {
                    if (res.code == 200) {
                      this.$message.success('编辑联系人操作成功')
                      this.$emit('getList')
                      this.closeModel()
                    } else {
                      this.$message.error(res.msg)
                    }
                  })
                }
              })
              .catch(action => {
              })
          } else {
            this.$message.error('请填写必填项')
            return
          }
        })
      },

      closeModel() {
        this.$refs.form.resetFields()
        this.addModel = false
      }
    }
  }
</script>

<style>
  .currentDatePickerClass > .el-picker-panel__footer > .el-button--text:first-child {
    display: none;
  }
</style>

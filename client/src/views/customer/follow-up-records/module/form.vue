<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      title="新增跟进记录"
      :visible.sync="addModel"
      width="1100px"
    >
      <el-form label-width="120px" v-loading="modelLoading" :model="form" :rules="rulers" ref="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="crm_user_id">
              <el-select
                :disabled="disabledSelectCrmUser"
                style="width: 360px"
                v-model="form.crm_user_id"
                :clearable="false"
                @change="crmUserChange"
              >
                <el-option
                  v-for="item in crm_user_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="跟进时间" prop="follow_time">
              <el-date-picker
                style="width: 360px"
                v-model="form.follow_time"
                type="datetime"
                :clearable="false"
                placeholder="请选择跟进时间"
                value-format="timestamp"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="跟进方式" prop="follow_type">
              <el-select
                style="width: 360px"
                v-model="form.follow_type"
                :clearable="false">
                <el-option
                  v-for="item in follow_type_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="crm_contact_id">
              <el-select
                style="width: 360px"
                v-model="form.crm_contact_id"
                :clearable="false"
              >
                <el-option
                  v-for="item in contact_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <!--            <el-form-item label="跟进人" prop="follow_user_id">-->
            <!--              <el-select-->
            <!--                style="width: 360px"-->
            <!--                v-model="form.follow_user_id"-->
            <!--                :clearable="false"-->
            <!--              >-->
            <!--                <el-option-->
            <!--                  v-for="item in follow_user_list"-->
            <!--                  :key="item.id"-->
            <!--                  :label="item.name"-->
            <!--                  :value="item.id"-->
            <!--                >-->
            <!--                </el-option>-->
            <!--              </el-select>-->
            <!--            </el-form-item>-->
            <el-form-item label="下次联系时间" prop="next_contact_time">
              <el-date-picker
                style="width: 360px"
                :clearable="false"
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
        <el-form-item label="跟进内容" prop="follow_record">
          <el-input
            style="width: 890px"
            v-model="form.follow_record"
            placeholder="请输入跟进内容"
            type="textarea"
            autosize
          ></el-input>
        </el-form-item>
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
  import { contactList } from '@/api/contact'
  import { crmUserList, addFollowRecord } from '@/api/crm_user'
  import { getUserList } from '@/api/user'
  import config from '@/config'

  export default {
    name: 'FollowRecordForm',
    props: {
      crm_user_id: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        addModel: false,
        form: {},
        rulers: {
          follow_time: [
            { required: true, message: '请选择跟进时间', trigger: 'change' }
          ],
          follow_type: [
            { required: true, message: '请选择跟进方式', trigger: 'change' }
          ],
          // follow_user_id: [
          //   { required: true, message: '请选择跟进人', trigger: 'change' }
          // ],
          crm_user_id: [
            { required: true, message: '请选择客户', trigger: 'change' }
          ],
          crm_contact_id: [
            { required: true, message: '请输入联系人', trigger: 'change' }
          ],
          next_contact_time: [
            { required: true, message: '请选择下次联系时间', trigger: 'change' }
          ],
          follow_record: [
            { required: true, message: '请填写跟进内容', trigger: 'change' }
          ]
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 12 * 60 * 60 * 1000
          }
        },
        crm_user_list: [],//客户列表
        contact_list: [],//联系人列表
        follow_user_list: [],//跟进人列表
        follow_type_list: config.follow_types,
        modelLoading: false,
        disabledSelectCrmUser: false
      }
    },
    created() {

    },
    methods: {

      initForm() {
        this.form = {
          follow_time: '',
          follow_type: '',
          // follow_user_id: '',
          crm_user_id: '',
          crm_contact_id: '',
          follow_record: '',
          next_contact_time: '',
          remark: ''
        }
      },

      async openModel() {
        this.initForm()
        this.addModel = true
        this.modelLoading = true
        this.disabledSelectCrmUser = false
        await this.getCrmUserList()
        await this.getUserList()
        if (this.crm_user_id && this.crm_user_id > 0) { //如果id不为空，说明是在客户弹框里新增跟进,直接选好客户和获取该客户下的联系人
          this.form.crm_user_id = this.crm_user_id
          await this.getContactList(this.crm_user_id)
          this.disabledSelectCrmUser = true
        }
        this.modelLoading = false
      },

      getCrmUserList() {
        this.crm_user_list = []
        return new Promise((resolve, reject) => {
          crmUserList({ page: 1, limit: 500, crm_list_type: 2 }).then(res => {
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

      //选择客户时置空联系人筛选并重新获取联系人
      crmUserChange(val) {
        this.form.crm_contact_id = ''
        this.getContactList(val)
      },

      getContactList(id) {
        this.contact_list = []
        return new Promise((resolve, reject) => {
          contactList({ page: 1, limit: 500, crm_user_id: id }).then(res => {
            if (res.code == 200) {
              this.contact_list = res.data.list.map(item => {
                return {
                  id: item.contact_id,
                  name: item.contact_name
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

      getUserList() {
        this.follow_user_list = []
        return new Promise((resolve, reject) => {
          getUserList({ page: 1, limit: 500, type: 1 }).then(res => {
            if (res.code == 200) {
              this.follow_user_list = res.data.list.map(item => {
                return {
                  id: item.user_id,
                  name: item.name
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
          if (valid) {
            this.$confirm('是否确定提交以上数据？', '确认信息', {
              distinguishCancelAndClose: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            })
              .then(() => {
                let data = JSON.parse(JSON.stringify(this.form))
                addFollowRecord(data).then(res => {
                  if (res.code == 200) {
                    this.$message.success('新增跟进记录操作成功')
                    this.$emit('getList')
                    this.closeModel()
                  } else {
                    this.$message.error(res.msg)
                  }
                })
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

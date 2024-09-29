<template>
  <div>
    <el-dialog
      top="2vh"
      :close-on-click-modal="false"
      :show-close="false"
      :title="openType == 1 ? '新增员工':'编辑员工'"
      :visible.sync="addModel"
      width="850px"
    >
      <el-form label-width="120px" ref="form" v-loading="modelLoading" :model="form" :rules="rulers">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="name" label="姓名">
              <el-input v-model.trim="form.name" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="生日" prop="birthday">
              <el-date-picker
                v-model.trim="form.birthday"
                style="width: 285px"
                type="date"
                :clearable="false"
                value-format="timestamp"
                placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="mail" label="邮箱">
              <el-input v-model.trim="form.mail" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="证件类型" prop="paper_type">
              <el-select
                v-model="form.paper_type"
                placeholder="请选择"
                style="width: 100%">
                <el-option
                  v-for="item in paper_typeList"
                  :value="item.id"
                  :key="item.id"
                  :label="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item prop="is_married" label="是否已婚">
              <el-radio v-model="form.is_married" :label="1">是</el-radio>
              <el-radio v-model="form.is_married" :label="2">否</el-radio>
            </el-form-item>
            <el-form-item prop="education" label="最高学历">
              <el-input v-model="form.education" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item prop="native_place" label="籍贯">
              <el-cascader
                style="width: 285px"
                v-model="form.native_place"
                :options="arerOptions"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="gender" label="性别">
              <el-radio v-model="form.gender" :label="1">男</el-radio>
              <el-radio v-model="form.gender" :label="2">女</el-radio>
            </el-form-item>
            <el-form-item prop="phone" label="手机号">
              <el-input v-model.trim="form.phone" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item prop="contact_way" label="其他联系方式">
              <el-input v-model.trim="form.contact_way" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item prop="paper_data" label="证件号">
              <el-input v-model.trim="form.paper_data" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item prop="is_birth" label="是否已育">
              <el-radio v-model="form.is_birth" :label="1">是</el-radio>
              <el-radio v-model="form.is_birth" :label="2">否</el-radio>
            </el-form-item>
            <el-form-item prop="politics_status" label="政治面貌">
              <el-input v-model.trim="form.politics_status" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item prop="native_location" label="详细地址">
              <el-input v-model.trim="form.native_location" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="current_address" label="现居住地址">
          <el-input v-model="form.current_address"  maxlength="50"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="emergency_contact" label="紧急联系人">
              <el-input v-model.trim="form.emergency_contact" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="部门选择" prop="depart_id">
              <el-cascader
                :key="cascaderKey"
                style="width: 285px"
                @change="depChange"
                :props="{value:'id'}"
                v-model="form.depart_id"
                :options="departMentList"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="emergency_contact_phone" label="紧急联系方式">
              <el-input v-model.trim="form.emergency_contact_phone" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="入职日期" prop="entry_date">
              <el-date-picker
                v-model="form.entry_date"
                style="width: 285px"
                type="date"
                value-format="timestamp"
                :clearable="false"
                placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="probation_start_date" label="试用期">
          <el-date-picker
            style="width: 100%"
            v-model="probation_date"
            type="daterange"
            range-separator="至"
            value-format="timestamp"
            :clearable="false"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" autosize v-model="form.remark"></el-input>
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
  import { regionData } from 'element-china-area-data'
  import { depList, addStaff } from '@/api/department'

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
        arerOptions: regionData,
        rulers: {
          name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
          depart_id: [{ required: true, message: '请选择部门', trigger: 'change' }],
          phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
          paper_type: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
          paper_data: [{ required: true, message: '请输入证件号', trigger: 'blur' }],
          gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
          birthday: [{ required: true, message: '请选择生日日期', trigger: 'change,blur' }],
          native_place: [{ required: true, message: '请选择籍贯', trigger: 'change' }],
          native_location: [{ required: true, message: '请输入籍贯地址', trigger: 'blur' }],
          emergency_contact: [{ required: true, message: '请输入紧急联系人姓名', trigger: 'blur' }],
          emergency_contact_phone: [{ required: true, message: '请输入紧急联系方式', trigger: 'blur' }],
          probation_start_date: [{ required: true, message: '请选择试用期', trigger: 'change,blur' }],
          entry_date: [{ required: true, message: '请选择入职日期', trigger: 'change,blur' }]
        },
        departMentList: [],
        paper_typeList: [
          { id: 1, value: '身份证' },
          { id: 2, value: '护照' },
          { id: 3, value: '其他' }
        ],
        probation_date: [],
        curData: null,
        cascaderKey: 1
      }
    },
    created() {

    },
    methods: {

      depChange(val) {
        // console.log('选择部门', val)
      },

      getDepList() {
        this.departMentList = []
        return new Promise((resolve, reject) => {
          depList({}).then(res => {
            if (res.code == 200) {
              this.departMentList = res.data.list.length ? res.data.list[0].children : []
              resolve()
            } else {
              this.$message.error(res.msg)
              resolve()
            }
          })
        })
      },

      initForm() {
        this.form = {
          name: '',//姓名,必填
          gender: 1,//性别，必填
          birthday: '',//生日，必填
          phone: '',//手机号必填
          mail: '',//邮箱，非必填
          contact_way: '',//其他联系方式,选填
          paper_type: 1,//证件类型，必填
          paper_data: '',//证件号,必填
          is_married: '',//已婚，非必填
          is_birth: '',//已育，非必填
          education: '',//最高学历，非必填
          politics_status: '',//政治面貌，非必填
          native_place: [],//籍贯，必填
          native_location: '',//籍贯详细地址，必填
          current_address: '',//现住地址，非必填
          emergency_contact: '',//紧急联系人，必填
          emergency_contact_phone: '',//紧急联系人电话，必填
          probation_start_date: '',//试用期开始日期，必填
          probation_end_date: '',//试用期结束日期，必填
          depart_id: [],//部门必填
          entry_date: '',//入职日期，必填
          remark: ''//备注，非必填
        }
      },
      async openModel(data) {
        this.cascaderKey += 1
        this.addModel = true
        this.modelLoading = true
        this.probation_date = []
        await this.getDepList()
        if (this.openType == 1) {
          this.initForm()
        } else {
          this.curData = JSON.parse(JSON.stringify(data))
          this.form = { ...data }
          this.probation_date = [data.probation_start_date, data.probation_end_date]
          this.form.depart_id = data.depart_id != '' ? data.depart_id.split(',').map(v => parseInt(v)) : []
          this.form.native_place = data.native_place != '' ? data.native_place.split(',') : []
        }
        // console.log('this.form', this.form)

        // this.$nextTick(() => {
        //   // this.$refs.form.resetFields()
        // })

        this.modelLoading = false
      },
      onSubmit() {
        // console.log('this.form', this.form)
        if (this.probation_date.length) {
          this.form.probation_start_date = this.probation_date[0]
          this.form.probation_end_date = this.probation_date[1]
        }
        if (!this.form.is_married) {
          delete this.form.is_married
        }
        if (!this.form.is_birth) {
          delete this.form.is_birth
        }
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$confirm('是否确定提交以上数据？', '确认信息', {
              distinguishCancelAndClose: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            })
              .then(() => {
                let data = JSON.parse(JSON.stringify(this.form))
                data.depart_id = this.form.depart_id.join(',')
                data.native_place = this.form.native_place.join(',')
                if (this.openType == 2) {
                  data.id = this.curData.id
                  delete data.admin_id
                  delete data.admin_name
                  delete data.status
                  delete data.update_time
                  delete data.dimission_cause
                  delete data.dimission_date
                  delete data.create_time
                }
                addStaff(data, this.openType == 1 ? 'add' : 'edit').then(res => {
                  if (res.code == 200) {
                    this.closeModel()
                    this.$emit('getList')
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

<style scoped>

</style>

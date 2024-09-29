<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      title="员工离职"
      :visible.sync="addModel"
      width="550px"
    >
      <el-form label-width="100px" ref="form" :model="form" :rules="rulers">
        <el-form-item label="入职日期" prop="dimiss_date">
          <el-date-picker
            style="width: 410px"
            v-model="form.dimiss_date"
            type="date"
            value-format="timestamp"
            :clearable="false"
            placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="离职原因" prop="reason">
          <el-input type="textarea" autosize v-model="form.reason"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addModel = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { addStaff } from '@/api/department'

  export default {
    name: 'DimissionForm',
    components: {},
    data() {
      return {
        addModel: false,
        rulers: {
          dimiss_date: [{ required: true, message: '请选择入职日期', trigger: 'change,blur' }],
          reason: [{ required: true, message: '请输入离职原因', trigger: 'blur' }]
        },
        form: {
          dimiss_date: '',
          reason: ''
        },
        curData: {}
      }
    },
    created() {

    },
    methods: {

      openModel(data) {
        this.curData = JSON.parse(JSON.stringify(data))
        this.addModel = true
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      },
      onSubmit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            addStaff({
              id: this.curData.id,
              ...this.form
            }, 'dismiss').then(res => {
              if (res.code == 200) {
                this.addModel = false
                this.$emit('getList')
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            this.$message.error('请填写必填项')
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>

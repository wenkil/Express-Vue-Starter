<template>
  <el-dialog
    :close-on-click-modal="false"
    :show-close="false"
    :title="modelTitle"
    :visible.sync="addModel"
    width="500px"
  >
    <el-form label-width="100px" v-loading="modelLoading" :model="form" ref="form" :rules="rulers">
      <el-form-item label="请选择用户" prop="user_id">
        <el-select
          v-model="form.user_id"
          style="width: 100%"
        >
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="closeModel">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getUserList } from '@/api/user'
  import { allotCrmUser } from '@/api/crm_user'
  import { allotClueSingle } from '@/api/clue'

  export default {
    name: 'SelectUser',
    props: {
      infoId:{
        type:Number,
        default:-1
      },
      openType: {
        type: Number,
        default: 0
      },
      modelTitle: {
        type: String,
        default: '选择用户'
      }
    },
    data() {
      return {
        modelLoading: false,
        addModel: false,
        rulers: {
          user_id: [
            { required: true, message: '请选择后再次提交', trigger: 'change' }
          ]
        },
        form: {
          user_id:''
        },
        userList: []

      }
    },
    methods: {

      //1线索 2客户
      submit() {
        this.$refs.form.validate(valid => {
          if(valid){
            if(this.infoId == -1){
              this.$message.error('提交数据id错误')
              return
            }
            if (this.openType == 1) {
              let data = {...this.form}
              data.id = this.infoId
              allotClueSingle(data).then(res=>{
                if (res.code == 200) {
                  this.$emit('getList')
                  this.closeModel()
                } else {
                  this.$message.error(res.msg)
                }
              })
            } else if (this.openType == 2) {
              let data = {...this.form}
              data.id = this.infoId
              allotCrmUser(data).then(res=>{
                if (res.code == 200) {
                  this.$emit('getList')
                  this.closeModel()
                } else {
                  this.$message.error(res.msg)
                }
              })
            }
          }
          else{
            this.$message.error('请选择必填项')
          }
        })
      },

      async openModel() {
        this.form.user_id = ''
        this.addModel = true
        this.$nextTick(() => {
          this.$refs.form.resetFields()
          this.$refs.form.clearValidate()
        })
        await this.getUserList()
      },

      //只选择没有被禁用的后台用户
      getUserList() {
        let data = {
          type: 1,//1启用 2禁用
          page: 1,
          limit: 500
        }
        this.modelLoading = true
        return new Promise((resolve, reject) => {
          getUserList(data).then(res => {
            this.modelLoading = false
            if (res.code == 200) {
              this.userList = res.data.list.map(item => {
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

      closeModel() {
        this.$refs.form.resetFields()
        this.addModel = false
      }
    }
  }
</script>

<style scoped>

</style>

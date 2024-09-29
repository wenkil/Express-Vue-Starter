<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      title="批量分配"
      :visible.sync="addModel"
      width="1000px"
    >
      <div style="margin-bottom: 20px;margin-left: 10px">
        <span>(提示：批量分配功能只能操作未分配的线索,已分配线索如需修改责任人,请在操作栏修改)</span>
      </div>
      <el-form label-width="100px" v-loading="modelLoading" :model="form" ref="form" :rules="rulers">
        <el-form-item label="选择负责人" prop="user_id">
          <el-select
            v-model="form.user_id"
            style="width: 200px"
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
        <el-form-item label="线索分配" prop="clue_list">
          <el-transfer
            v-model="form.clue_list"
            :data="customList"
            :titles="['未分配的线索', '待提交数据']"
            :button-texts="['移回列表', '分配给责任人']"
            @change="transFormChange"
          ></el-transfer>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="closeModel">取消</el-button>
        <el-button @click="submitModel">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { clueList, allotClue } from '@/api/clue'
  import { getUserList } from '@/api/user'

  export default {
    name: 'BatchProcessClue',
    data() {
      return {
        modelLoading: false,
        addModel: false,
        userList: [],//选择的后台用户
        form: {},
        rulers: {
          user_id: [
            { required: true, message: '请选择责任人', trigger: 'change' }
          ],
          clue_list: [
            { required: true, message: '请选择要分配的线索', trigger: 'blur,change' }
          ]
        },
        select_list: [],//已选择的线索列表
        customList: []//待分配的线索列表
      }
    },

    created() {
    },

    methods: {

      async openModel() {
        this.addModel = true
        this.initData()
        this.$nextTick(() => {
          this.$refs.form.resetFields()
          this.$refs.form.clearValidate()
        })

        this.modelLoading = true
        await this.getUserList()
        await this.getCustomList()
        this.modelLoading = false
      },
      closeModel() {
        this.$refs.form.resetFields()
        this.$refs.form.clearValidate()

        this.addModel = false
      },

      initData() {
        this.form = {
          user_id: '',
          clue_list: []
        }
        this.userList = []
        this.select_list = []
        this.customList = []
      },

      //只选择没有被禁用的后台用户
      getUserList() {
        let data = {
          type: 1,//1启用 2禁用
          page: 1,
          limit: 500
        }
        return new Promise((resolve, reject) => {
          getUserList(data).then(res => {
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

      //只选择没有分配的线索(负责人为空的)
      getCustomList() {
        let data = {
          isCharge: 1,//1未分配  2已分配
          page: 1,
          limit: 500
        }
        return new Promise((resolve, reject) => {
          clueList(data).then(res => {
            if (res.code == 200) {
              this.customList = res.data.list.map(item => {
                return {
                  key: item.clue_id,
                  label: item.clue_name
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

      transFormChange(val) {
        for(let key of val){
          if(!key){
            this.$message.error('线索数据错误,请联系管理员')
            return
          }
        }
      },

      submitModel() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$showTips({
              title: '是否确认提交分配数据?'
            }, () => {
              this.modelLoading = true
              let data = JSON.parse(JSON.stringify(this.form))
              data.clue_list = this.form.clue_list.toString()
              // console.log('提交数据',this.form)
              allotClue(data).then(res => {
                this.modelLoading = false
                if (res.code == 200) {
                  this.$emit('getList')
                  this.closeModel()
                } else {
                  this.$message.error(res.msg)
                }
              })
            })
          } else {
            this.$message.error('请选择必填项')
          }
        })
      }

    }
  }
</script>

<style scoped>

</style>

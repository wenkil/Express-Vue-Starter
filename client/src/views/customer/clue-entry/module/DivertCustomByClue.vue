<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      title="批量转客户"
      :visible.sync="addModel"
      width="1000px"
    >
      <div style="margin-bottom: 20px;margin-left: 10px">
        <span>(提示：批量转客户功能只能操作已分配责任人的线索,未分配责任人的线索不可直接转为客户)</span>
      </div>
      <el-form label-width="100px" v-loading="modelLoading" :model="form" ref="form" :rules="rulers">
        <el-form-item label="线索转客户" prop="clue_list">
          <el-transfer
            v-model="form.clue_list"
            :data="customList"
            :titles="['未转线索', '待提交数据']"
            :button-texts="['移回列表', '转为客户']"
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
  import { clueList, divertClue } from '@/api/clue'

  export default {
    name: 'DivertCustomByClue',
    data() {
      return {
        modelLoading: false,
        addModel: false,
        form: {},
        rulers: {
          clue_list: [
            { required: true, message: '请选择要转为客户的线索', trigger: 'blur,change' }
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
          clue_list: []
        }
        this.select_list = []
        this.customList = []
      },

      //只选择已分配的线索
      getCustomList() {
        let data = {
          isCharge: 2,//1未分配  2已分配
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
        for (let key of val) {
          if (!key) {
            this.$message.error('线索数据错误,请联系管理员')
            return
          }
        }
      },

      submitModel() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$showTips({
              title: '是否确认提交转入数据?'
            }, () => {
              // this.modelLoading = true
              let data = JSON.parse(JSON.stringify(this.form))
              data.clue_list = this.form.clue_list.toString()
              // console.log('提交数据', this.form)
              divertClue(data).then(res => {
                this.modelLoading = false
                // console.log('接口返回',res)
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

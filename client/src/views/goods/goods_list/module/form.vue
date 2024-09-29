<template>
  <div>
    <el-dialog
      top="2vh"
      :close-on-click-modal="false"
      :show-close="false"
      :title="openType == 1 ? '新增产品':'编辑产品'"
      :visible.sync="addModel"
      width="500px"
    >
      <el-form label-width="80px" ref="form" v-loading="modelLoading" :model="form" :rules="rulers">
        <el-form-item prop="goods_name" label="产品名称">
          <el-input :disabled="openType == 2" v-model.trim="form.goods_name" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="产品类型" prop="goods_type_id">
          <el-select
            :disabled="openType == 2"
            v-model="form.goods_type_id"
            placeholder="请选择"
            style="width: 100%"
            filterable
          >
            <el-option
              v-for="item in goods_list"
              :value="item.id"
              :key="item.id"
              :label="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="产品价格" prop="goods_price">
          <el-input-number :disabled="openType == 2" v-model="form.goods_price" :min="0" :step="100" :precision="2"
                           label="请输入产品价格"></el-input-number>
        </el-form-item>
        <el-form-item label="产品简介">
          <el-input type="textarea" autosize v-model="form.goods_intro"></el-input>
        </el-form-item>
        <el-form-item label="备注">
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
  import { getGoodsAllLevelList, goodsList } from '@/api/goods'

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
        form: {
          goods_name: '',
          goods_type_id: '',
          goods_price: '',
          goods_intro: '',
          remark: ''
        },
        rulers: {
          goods_name: [
            { required: true, message: '请输入产品名称', trigger: 'blur' }
          ],
          goods_type_id: [
            { required: true, message: '请选择产品类型', trigger: 'change' }
          ],
          goods_price: [
            { required: true, message: '请输入产品价格', trigger: 'blur,change' }
          ]

        },
        goods_list: [],
        curData: {}

      }
    },
    created() {

    },
    methods: {
      async openModel(data) {
        this.curData = this.openType == 1 ? {} : JSON.parse(JSON.stringify(data))
        this.addModel = true
        this.modelLoading = true
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
        if (this.openType == 2) {
          this.form = {
            goods_name: this.curData.goods_name,
            goods_type_id: this.curData.goods_type_id,
            goods_price: this.curData.goods_price / 100,
            goods_intro: this.curData.goods_intro,
            remark: this.curData.remark
          }
        }
        await this.getAllGoodsList()
        this.modelLoading = false
      },

      getAllGoodsList() {
        this.goods_list = []
        return new Promise((resolve, reject) => {
          getGoodsAllLevelList({}).then(res => {
            if (res.code == 200) {
              this.goods_list = res.data.list.map(v => {
                return {
                  id: v.type_name_id,
                  value: v.class_name + '-' + v.branch_name + '-' + v.type_name + '-' + v.type_name_name
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

      onSubmit() {
        if (!this.form.goods_price) {
          this.$message.error('产品价格不得为0或为空')
          return
        }
        this.$refs.form.validate(valid => {
          if (valid) {
            let data
            if (this.openType == 1) {
              data = { ...this.form }
              data.goods_price = this.form.goods_price * 100
            } else {
              data = {
                type: 1,//1编辑2修改状态
                goods_intro: this.form.goods_intro,
                remark: this.form.remark,
                goods_id: this.curData.goods_id
              }
            }

            goodsList(data, this.openType == 1 ? 'add' : 'edit').then(res => {
              if (res.code == 200) {
                this.closeModel()
                this.$emit('refresh')
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            this.$message.error('请填写必填项')
          }
        })
      },

      closeModel() {
        this.$refs.form.clearValidate()
        this.addModel = false
      }

    }
  }
</script>

<style scoped>

</style>

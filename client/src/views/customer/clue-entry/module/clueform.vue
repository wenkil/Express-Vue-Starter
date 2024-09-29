<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      :title="openType == 1 ? '新增线索' : '编辑线索'"
      :visible.sync="addModel"
      width="1000px">
        <el-form v-loading="modelLoading" :model="form" :rules="rulers" ref="form" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="线索名称" prop="clue_name">
                <el-input v-model.trim="form.clue_name" maxlength="30"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="clue_phone">
                <el-input v-model.trim="form.clue_phone" maxlength="11"></el-input>
              </el-form-item>
              <el-form-item label="客户行业" prop="cus_trade">
                <el-select
                  style="width: 360px"
                  v-model="form.cus_trade">
                  <el-option
                    v-for="item in clue_trade_list"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="地址" prop="clue_address">
                <el-input v-model.trim="form.clue_address" maxlength="30"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="线索来源" prop="source_id">
                <el-select
                  style="width: 360px"
                  v-model="form.source_id">
                  <el-option
                    v-for="item in clue_source_list"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="邮箱" prop="clue_mail">
                <el-input v-model.trim="form.clue_mail"></el-input>
              </el-form-item>
              <el-form-item label="客户等级" prop="cus_level">
                <el-select
                  style="width: 360px"
                  v-model="form.cus_level">
                  <el-option
                    v-for="item in clue_level_list"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
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
  import {
    clueSourceList
  } from '@/api/clue'
  import {cus_level,cus_trade} from '@/config'
  export default {
    name: 'ClueForm',
    props:{
      openType:{ //1新增 2编辑
        type:Number,
        default:1
      },
      submit:Function,

    },
    data(){
      return {
        addModel:false,
        modelLoading:false,
        form:{},
        curData:{},
        rulers:{
          clue_name: [
            { required: true, message: "请输入线索名称", trigger: "blur" }
          ],
          clue_phone: [
            { required: true, validator: this.phoneRule, trigger: "blur" }
          ],
          clue_address: [
            { required: true, message: "请输入地址", trigger: "blur" }
          ],
          cus_trade: [
            { required: true, message: "请选择客户行业", trigger: "change" }
          ],
          source_id: [
            { required: true, message: "请选择线索来源", trigger: "change" }
          ],
          cus_level: [
            { required: true, message: "请选择客户等级", trigger: "change" }
          ],
          next_contact_time:[
            { required: true, message: "请选择下次联系时间", trigger: "change" }
          ]
        },
        clue_source_list:[],//线索来源
        clue_level_list:cus_level,
        clue_trade_list:cus_trade,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 12 * 60 * 60 * 1000
          }
        },
      }
    },
    created() {
      this.initForm()
    },
    methods:{

      phoneRule(rule, val, callback){
        if(val){
          if(Number(val)){
            if(val.length != 11){
              callback(new Error('手机号长度限制11位'))
            }
            else{
              var reg=/^1[3-9]\d{9}$/;
              if (!reg.test(val)) {
                callback(new Error('手机号验证失败'))
              } else {
                callback()
              }
            }
          }
          else{
            callback(new Error('手机号格式不正确'))
          }
        }
        else{
          callback(new Error('请输入手机号'))
        }
      },

      initForm(){
        this.form = {
          clue_name:'',//名称
          source_id:'',//来源id
          clue_phone:'',//手机号
          cus_trade:'',//行业
          cus_level:'',//等级
          next_contact_time:'',//下次联系时间
          clue_address:'',//地址
          clue_mail:'',//邮箱
          remark:''
        }
      },
      async openModel(data){
        this.initForm()
        this.addModel = true
        this.modelLoading = true
        await this.getSourceList()
        if(this.openType == 1){
          this.curData = {}
        }
        else{
          // console.log('编辑数据',data)
          this.curData = JSON.parse(JSON.stringify(data))
          Object.keys(this.curData).forEach(item => {
            if (this.form.hasOwnProperty(item)) {
              this.form[item] = this.curData[item];
            }
          });
        }
        this.modelLoading = false
      },

      getSourceList(){
        this.clue_source_list = []
        return new Promise((resolve, reject) => {
          clueSourceList({page:1,limit:500}).then(res=>{
            if(res.code == 200){
              this.clue_source_list = res.data.list.map(item=>{
                return{
                  value:item.source_name,
                  id:item.id
                }
              })
              resolve()
            }
            else{
              this.$message.error(res.msg)
              reject(res.msg)
            }
          })
        })
      },



      onSubmit(){
        this.$refs.form.validate(valid => {
          if(this.form.clue_mail){
            var reg=/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
            if (!reg.test(this.form.clue_mail)) {
              this.$message.error('邮箱格式不正确')
              return
            }
          }

          if (valid) {
            this.$confirm('是否确定提交以上数据？', "确认信息", {
              distinguishCancelAndClose: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            })
              .then(() => {
                this.submit(this.form)
              })
              .catch(action => {
              });
          }
          else{
            this.$message.error('请填写必填项')
            return
          }
        })
      },

      closeModel(){
        this.$refs.form.resetFields()
        this.addModel = false;
      }
    }
  }
</script>
<style>
  .currentDatePickerClass > .el-picker-panel__footer > .el-button--text:first-child{
    display: none;
  }
</style>
<style scoped>

</style>

<template>
  <el-form ref="form" :model="form" :rules="formRules" label-width="90px" style="margin-top: 30px">
    <el-form-item label="旧密码" prop="old_password">
      <el-input :type="showOldPassword ? 'text' : 'password'" placeholder="请输入旧密码" v-model.trim="form.old_password" style="width: 500px">
        <template slot="append">
          <a slot="suffix" class="el-icon-view" @click="showOldPassword = !showOldPassword"></a>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="new_password">
      <el-input :type="showNewPassword ? 'text' : 'password'" placeholder="请输入新密码：6~12位，数字+字母" v-model.trim="form.new_password"  style="width: 500px" maxlength="12">
        <template slot="append">
          <a slot="suffix" class="el-icon-view" @click="showNewPassword = !showNewPassword"></a>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submit">修改密码</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {changePawssword} from '@/api/user'

  export default {

  data(){

    return{
      form:{
        old_password:'',
        new_password:''
      },
      formRules:{
        old_password:[{required: true, message: "请输入旧密码", trigger: "blur"}],
        new_password:[{required: true, validator:this.validatePass, trigger: "blur"}] //,validator: this.validatePass
      },
      showOldPassword:false,
      showNewPassword:false

    }
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          changePawssword({
            old_password:this.form.old_password,
            new_password:this.form.new_password
          }).then(res=>{
            // console.log('修改密码的返回',res)
            if(res.code == 200){
              this.$refs.form.resetFields()
              this.$message.success('修改密码操作成功,请重新登录')
              localStorage.clear()
              sessionStorage.clear()
              this.$store.dispatch('tagsView/delAllViews') //关闭所有标签
              this.$store.dispatch('user/logout') //清空用户信息
              this.$router.push(`/login`)
            }
            else{
              this.$message.error(res.msg)
            }
          })
        } else {
          this.$message.error("请输入必填字段");
          return false;
        }
      })
    },

    validatePass (rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else if (value) {
        let pwdRegex = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
        if (!pwdRegex.test(value)) {
          callback(new Error('密码不符合规范：长度：6~12位,复杂度：数字+字母,请重新输入'));
          return
        }
        else{
          callback()
        }
      }
    }
  }
}
</script>

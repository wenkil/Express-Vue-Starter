<template>
  <div class="login-container">
    <div class="screen_css_phone">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
               label-position="left">
        <div class="title-container">
          <h3 class="title">后台管理系统</h3>
        </div>

        <el-form-item prop="username">
          <el-input placeholder="请输入内容" tabindex="1" v-model.trim="loginForm.username">
            <template slot="prepend">
           <span>
<!--             <svg-icon icon-class="user"/>-->
             用户名
           </span>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            :key="passwordType"
            ref="password"
            v-model.trim="loginForm.password"
            :type="passwordType"
            placeholder="请输入登录密码"
            name="password"
            tabindex="2"
            @keyup.enter.native="handleLogin"
          >
            <template slot="prepend">
              <span v-html="'密&nbsp;&nbsp;&nbsp;码'"></span>
            </template>
            <el-button slot="append" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
            </el-button>
          </el-input>
        </el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                   @click.native.prevent="handleLogin">Login
        </el-button>
      </el-form>
    </div>
    <div class="screen_css_pc">
      <div class="pnone__body">
        <svg-icon class="pnone__img" icon-class="no_screen"></svg-icon>
        <span class="phone__text">请使用电脑端打开本页面</span>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { login } from '@/api/user'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入登录用户名' }],
        password: [{ required: true, trigger: 'blur', message: '请输入登录密码' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          login({ name: this.loginForm.username, password: this.loginForm.password }).then(res => {
            // console.log('res',res)
            if (res.code == 200) {
              this.$store.dispatch('user/getInfo')
              // localStorage.token = res.data.token
              sessionStorage.setItem('token', res.data.token)
              this.$router.push('/')
            } else {
              this.$message.error(res.msg)
            }
          })
          this.loading = false
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/*手机屏幕*/
@media (max-width: 1024px) {
  .screen_css_phone {
    display: none;
  }
}

/*pc屏幕*/
@media (min-width: 1024px) {
  .screen_css_pc {
    min-height: 100%;
    width: 100%;
    background: linear-gradient(
        -20deg, #2b5876 0%, #4e4376 100%);
    background-repeat: no-repeat;
    background-size: 100% 100%;

   .pnone__body, span {
      display: none;
    }
  }
}

.pnone__body{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .pnone__img{
    height: 300px;
    width: 300px;
  }
  .phone__text {
    font-size: 22px;
    text-align: center;
  }
}

</style>
<style lang="scss" scoped>
$bg: linear-gradient(-20deg, #2b5876 0%, #4e4376 100%);
$dark_gray: #889aa4;
$light_gray: #eee;
//$bgImg : url("../../../static/img/ep_naturalblack.png");

@media (min-width: 1024px) {
  .login-container {
    min-height: 100%;
    width: 100%;
    background: $bg;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    /*overflow: hidden;*/

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

  }
}

</style>

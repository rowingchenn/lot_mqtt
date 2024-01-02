<template>
  <div class="fullscreen-background">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <h3 class="title">欢迎登录xx天气预测平台</h3>
      <el-form-item prop="option">
        <el-select v-model="loginForm.option" placeholder="请选择你希望的功能">
          <el-option label="demo" value="home" />
          <el-option label="数据发布" value="publish" />
          <el-option label="数据处理" value="process" />
          <el-option label="数据订阅" value="subscribe" />
        </el-select>
      </el-form-item>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="账号"
        >
          <svg-icon
            slot="prefix"
            icon-class="user"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon
            slot="prefix"
            icon-class="password"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
  
<script>
  export default {
    name: 'YourComponent',
    data() {
      return {
        codeUrl: "",
        loginForm: {
          option:"",//用于控制跳转的选项
          username: "",
          password: "",
          rememberMe: false,
          code: "",
          uuid: "",
        },
        loginRules: {
          username: [
            { required: true, trigger: "blur", message: "请输入您的账号" },
          ],
          password: [
            { required: true, trigger: "blur", message: "请输入您的密码" },
          ],
          code: [{ required: true, trigger: "change", message: "请输入验证码" }],
        },
        loading: false,
        // 验证码开关
        captchaOnOff: true,
        // 注册开关
        register: false,
        redirect: undefined,
      };
    },
    methods: { 
      handleLogin(){
      // 模拟登录逻辑，可以使用假数据或者硬编码
      console.log('我在写伪登录...');
      const fakeLoginData = {
        username: 'exampleUser',
        token: 'exampleToken',
      };

      // 假设登录成功后，将用户信息保存到本地存储或 Vuex 状态管理中
      localStorage.setItem('user', JSON.stringify(fakeLoginData));

      // 使用 $router 对象进行编程式导航到主页面
      this.$router.push('/'+this.loginForm.option);
      },
  },
  };
</script>
  
<style scoped>.fullscreen-background {
  background-image: url('../../public/images/login_background.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative; /* Added relative positioning */
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
</style>
  
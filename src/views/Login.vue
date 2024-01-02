<template>
  <div class="fullscreen-background">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <h3 class="title">欢迎登录xx天气预测平台</h3>
      <!--
      <el-form-item prop="option">
        <el-select v-model="loginForm.option" placeholder="请选择你希望的功能">
          <el-option label="demo" value="home" />
          <el-option label="数据发布" value="publish" />
          <el-option label="数据处理" value="process" />
          <el-option label="数据订阅" value="subscribe" />
        </el-select>
      </el-form-item>
      -->
      <el-form-item prop="username">
        <el-input
          v-model="connection.username"
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
          v-model="connection.password"
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
  import mqtt from 'mqtt'
  import { Notification } from 'element-ui';
  export default {
    name: 'YourComponent',
    data() {
      return {
        connection: {
          protocol: 'ws',
          host:'118.25.137.127',
          port: 8083,
          cleanSession: true,
          keepAlive: 60, // 默认keep alive值
          clientId:
            'emqx_vue_' +
            Math.random()
              .toString(16)
              .substring(2, 8),
          // auth
          username: 'admin',
          password: '127339',
          connectTimeout: 300 * 1000, // ms
          reconnectPeriod: 4000, // ms
        },
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

      let Direction;
      switch(this.connection.username){
        case 'admin':
          Direction='home';
          break;
        case 'processing':
          Direction='processing';
          break;
        case 'visualization':
          Direction='visualization';
          break;
        case 'source':
          Direction='source';
          break;
      }
      // 使用 $router 对象进行编程式导航到主页面
      //this.$router.push('/'+this.loginForm.option);

      //在这里连接MQTT
      this.createConnection();
      //连接上了之后跳转对应的界面

      this.$router.push('/'+ Direction);
      },
      
      createConnection() {
        // 构建连接URL
        const url = `${this.connection.protocol}://${this.connection.host}:${this.connection.port}`;

        // 构建连接选项
        const options = {
          clientId: this.connection.clientId,
          keepalive: this.connection.keepAlive,
          clean: this.connection.cleanSession,
          reconnectPeriod: this.connection.reconnectPeriod, // 重连周期设置为1秒
          connectTimeout: this.connection.connectTimeout, // 连接超时时间设置为30秒
          username: this.connection.username,
          password: this.connection.password,
          path: '/mqtt'
          // 如果使用TLS/SSL，可能需要额外的配置选项
        };

        // 使用MQTT.js的connect方法创建MQTT客户端实例
        this.client = mqtt.connect(url, options);

        // 监听连接事件
        this.client.on('connect', () => {
          console.log('Connected successfully!')
          Notification({
            title: 'Success',
            message: 'Connected to MQTT Broker!',
            type: 'success',
            duration: 5000 // 显示时长(毫秒)
          });
          this.connecting = false;
          // 连接成功后的其他操作...
          this.setupMessageListener(); // 设置消息监听器
        });

        /*
        // 监听连接错误事件
        this.client.on('error', (error) => {
          Notification({
            title: 'Error',
            message: `Connection error: ${error.message}`,
            type: 'error',
            duration: 5000 // 显示时长(毫秒)
          });
          this.connecting = false; // 更新连接状态
          // 连接失败的其他操作...
        });*/

        // 监听连接结束事件
        this.client.on('close', () => {
          if (this.client && !this.client.connected) {
            Notification.error({
              title: 'Connection Closed',
              message: 'MQTT connection was closed.',
              duration: 5000
            });
          }
          this.connecting = false; // 更新连接状态
        });
      },

    },
  };
</script>
  
<style scoped>
.fullscreen-background {
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
  
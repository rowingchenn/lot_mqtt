<template>
  <div class="background">
<!-- 标题栏 -->
<div style="background-color: pink; text-align: center; padding: 10px 0;border-radius: 15px;">
      <h1>Data Processing Centre</h1>
    </div>
    <router-link to="/">返回登录页面</router-link>

<!-- 连接broker的卡片 -->
<el-card shadow="always" style="margin-top:40px;margin-left: 150px;width: 1350px;border-radius: 15px;">
      <div class="emq-title">
        Configuration
      </div>
      <el-form ref="configForm" hide-required-asterisk size="small" label-position="top" :model="connection">
        <el-row :gutter="20">

          <el-col :span="8">
            <el-form-item prop="host" label="Host">
              <el-input v-model="connection.host" placeholder="100.81.86.127"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item prop="port" label="Port">
              <el-input v-model.number="connection.port" type="number" placeholder="8083/8084"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item prop="clientId" label="Client ID">
              <el-input v-model="connection.clientId"> </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item prop="username" label="Username">
              <el-input v-model="connection.username"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item prop="password" label="Password">
              <el-input v-model="connection.password"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item prop="keepAlive" label="Keep Alive">
              <el-input v-model.number="connection.keepAlive" type="number" placeholder="Keep Alive interval"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item prop="cleanSession" label="Clean Session">
              <el-switch v-model="connection.cleanSession"></el-switch>
            </el-form-item>
          </el-col>


          <el-col :span="24">
            <el-button
              type="success"
              size="small"
              class="conn-btn"
              style="margin-right: 20px;"
              :disabled="client.connected"
              @click="createConnection"
              :loading="connecting"
            >
              {{ client.connected ? 'Connected' : 'Connect' }}
            </el-button>

            <el-button v-if="client.connected" type="danger" size="small" class="conn-btn" @click="destroyConnection">
              Disconnect
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 订阅topic的卡片 -->
    <el-card shadow="always" style="margin-top:50px;margin-left: 150px;width: 1350px;border-radius: 15px;">
      <div class="emq-title">
        Subscribe
      </div>
      <el-form ref="subscription" hide-required-asterisk size="small" label-position="top" :model="subscription">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="custom-select-wrapper">
              <el-form-item prop="topic" label="Topic">
                <el-select v-model="subscription.topic" placeholder="请选择">
                  <el-option
                    v-for="item in topicOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="qos" label="QoS">
              <el-select v-model="subscription.qos">
                <el-option v-for="qos in qosList" :key="qos" :label="qos" :value="qos"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button
              :disabled="!client.connected"
              type="success"
              size="small"
              class="subscribe-btn"
              @click="doSubscribe"
            >
              {{ subscribeSuccess ? 'Subscribed' : 'Subscribe' }}
            </el-button>
            <el-button
              :disabled="!client.connected"
              type="success"
              size="small"
              class="subscribe-btn"
              style="margin-left:20px"
              @click="doUnSubscribe"
              v-if="subscribeSuccess"
            >
              Unsubscribe
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 接收消息的卡片 -->
    <!-- <el-card class="message-card" style="margin-bottom:30px;">
      <div class="emq-title">
        <span>Received Messages</span>
      </div>
      <div style="max-height: 400px; overflow-y: scroll;">
        <el-timeline>
          <el-timeline-item
              v-for="(msg, index) in receivedMessages"
              :key="index"
              :timestamp="msg.timestamp"
              placement="top">
            <el-card style="margin-bottom: 20px;">
              <div class="text-item">
                <div><strong>Topic:</strong> {{ msg.topic }}</div>
                <div><strong>QoS:</strong> {{ msg.qos }}</div>
                <div><strong>Message:</strong> {{ msg.payload }}</div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card> -->

    <!-- 文件上传 -->
  <!-- <input type="file" @change="handleFileUpload"> -->
  <el-row>
    <el-col :span="20" :offset="2">
      <!-- 卡片样式更新：增加圆角和阴影 -->
      <el-card title="Received Data" style="margin-top: 50px; height: 450px; border-radius: 15px; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);">
        <h2>Received Data</h2>

        <div style="max-height: 400px; overflow-y: scroll;">
        <el-timeline>
          <el-timeline-item
              v-for="(msg, index) in receivedMessages"
              :key="index"
              :timestamp="msg.timestamp"
              placement="top">
            <el-card style="margin-bottom: 20px;">
              <div class="text-item">
                <div><strong>Topic:</strong> {{ msg.topic }}</div>
                <div><strong>QoS:</strong> {{ msg.qos }}</div>
                <div><strong>Message:</strong> {{ msg.payload }}</div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
        <!-- 按钮样式更新：更加优雅的布局 -->
        <div style="text-align: right; margin-top: 10px;">
          <el-button style="border-radius: 10px; background-color: green; color: white;" type="primary">Receive</el-button>
          <el-button style="border-radius: 10px; background-color: green; color: white; margin-left: 30px;" type="primary">Refresh</el-button>
        </div>
      </el-card>
    </el-col>
  </el-row>


<el-row style="margin-top: 50px;">
  <!-- 处理后的数据 -->
  <el-col :span="5" :offset="2">
    <el-card title="Processed Data" style="height: 600px; border-radius: 15px; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);">
      <h3>Processed Original Data</h3>
      <div style="width: 100%; overflow-y:auto;height: 450px; border-radius: 10px;">
        <el-table :data="processedData" style="width: 100%; border-radius: 10px;">
          <el-table-column prop="date" label="日期"></el-table-column>
          <el-table-column prop="time" label="时间"></el-table-column>
          <el-table-column prop="value" label="数值"></el-table-column>
        </el-table>
      </div>
      <div style="text-align: right; margin-top: 10px;">
          <el-button style="border-radius: 10px; background-color: green; color: white; margin-left: 30px;" type="primary">Refresh</el-button>
        </div>
    </el-card>
  </el-col>

  <!-- 每日数据汇总 -->
  <el-col :span="7" :offset="1">
    <el-card title="每日数据汇总" style="height: 600px; border-radius: 15px; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);">
      <h3>Calculated Data</h3>
      <div style="width: 100%; height: 450px;overflow-y: auto; border-radius: 10px;">
        <el-table :data="summaryData" style="width: 100%; border-radius: 10px;">
          <el-table-column prop="date" label="日期"></el-table-column>
          <el-table-column prop="max" label="最大值"></el-table-column>
          <el-table-column prop="min" label="最小值"></el-table-column>
          <el-table-column prop="avg" label="平均值"></el-table-column>
        </el-table>
      </div>
      <div style="text-align: right; margin-top: 10px;">
        <el-button style="border-radius: 10px; background-color: green; color: white; margin-left: 30px;" type="primary" @click="onCalculateClick()">Calculate</el-button>
        </div>
    </el-card>
  </el-col>

  <!-- 预测的数据 -->
  <el-col :span="6" :offset="1">
    <el-card title="Predicted Data" style="height: 600px; border-radius: 15px; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);">
      <h3>Predicted Data</h3>

      <div style="width: 100%; height: 450px;overflow-y: auto; border-radius: 10px;">
        <el-table :data="formattedPredictedData" style="width: 100%; border-radius: 10px;">
          <el-table-column prop="date" label="日期"></el-table-column>
          <el-table-column prop="time" label="时间"></el-table-column>
          <el-table-column prop="value" label="预测值"></el-table-column>
        </el-table>
      </div>
      <div style="text-align: right; margin-top: 10px;">
          <el-button style="border-radius: 10px; background-color: green; color: white; margin-left: 30px;" type="primary">Predict</el-button>
        </div>
    </el-card>
  </el-col>
</el-row>

  <el-row style="margin-top: 50px;">
        <!-- 数据折线图 -->
        <el-col :span="20" :offset="2">
      <el-card title="Predicted Data Line Chart" style="height: 500px;border-radius: 15px; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);">
        <h3>Predicted Data Line Chart</h3>

        <div ref="lineChart" style="width: 100%; height: 350px; border-radius: 10px; box-shadow: 0 2px 4px 0 rgba(0,0,0,0.1);"></div>
        <div style="text-align: right; margin-top: 10px;">
          <el-button style="border-radius: 10px; background-color: green; color: white; margin-left: 30px;" type="primary">Refresh</el-button>
        </div>
      </el-card>
    </el-col>
  </el-row>
<!-- 发布消息的卡片 -->
<el-card class="box-card" style="margin-top:50px;margin-left: 150px;width: 1350px;border-radius: 15px;">
      <div class="emq-title">
        <span>Publish Processed Data</span>
      </div>
      <el-form ref="publish" hide-required-asterisk size="small" label-position="top" :model="publishData">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="custom-select-wrapper">
              <el-form-item prop="topic" label="Topic">
                <el-select v-model="publishData.publishTopic" placeholder="请选择">
                  <el-option
                      v-for="item in topicOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="qos" label="QoS">
              <el-select v-model="publishData.qos">
                <el-option v-for="qos in qosList" :key="qos" :label="qos" :value="qos"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Message">
          <!-- <el-input
              type="textarea"
              v-model="publishData.publishMessage"
              placeholder="Enter message to publish">
          </el-input> -->
          <el-input
            type="text"
            v-model="publishData.publishMessage"
            placeholder="Processed and predicted data to publish">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="button" @click="doPublish">Publish</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    </div>
  </template>

<script>
import * as echarts from 'echarts';
import mqtt from 'mqtt'
import { Notification } from 'element-ui';

  export default {
    name: 'DataProcessing',
    // 你可以在这里添加方法和数据来处理和展示数据
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
      subscription: {
        topic: '',
        qos: 0,
      },
      publishData: {
        publishTopic: '',
        publishMessage: '',
        qos: 0
      },
      qosList: [0, 1, 2],
      topicOptions: [
        { value: 'humidity', label: 'humidity' },
        { value: 'pressure', label: 'pressure' },
        { value: 'temperature', label: 'temperature' },
        { value: 'processed_data', label: 'processed_data' },
      ],
      client: {
        connected: false,
      },
      isUploading: false,
      subscribeSuccess: false,
      connecting: false,
      retryTimes: 0,
      fileContent: null,
      tableData:null,
      multipleSelection:null,
      chart: null,
      sum_pro_Data:'',
      receivedMessages: [],

        receivedData: [],
        processedData: [], // 处理后的数据数组
    summaryData: [],
        predictedData: [{"2014-02-14T04:50:00": "1.0", "2014-02-14T09:50:00": "4.0", "2014-02-14T12:20:00": "6.0", "2014-02-14T09:00:00": "3", "2014-02-14T16:20:00": "6.0", "2014-02-14T09:20:00": "3.0", "2014-02-14T19:00:00": "4", "2014-02-14T07:20:00": "2.0", "2014-02-14T06:50:00": "2.0", "2014-02-14T13:20:00": "5.0", "2014-02-14T10:00:00": "4", "2014-02-14T21:50:00": "4.0", "2014-02-14T07:50:00": "2.0", "2014-02-14T19:20:00": "3.0", "2014-02-14T14:50:00": "6.0", "2014-02-14T14:20:00": "6.0", "2014-02-14T04:00:00": "1", "2014-02-14T14:00:00": "6", "2014-02-14T23:00:00": "3", "2014-02-14T22:20:00": "4.0", "2014-02-14T13:00:00": "6", "2014-02-14T06:00:00": "2", "2014-02-14T19:50:00": "4.0", "2014-02-14T08:00:00": "2", "2014-02-14T08:20:00": "2.0", "2014-02-14T08:50:00": "3.0", "2014-02-14T11:20:00": "5.0", "2014-02-14T20:50:00": "3.0", "2014-02-14T05:00:00": "1", "2014-02-14T15:20:00": "6.0", "2014-02-14T05:20:00": "1.0", "2014-02-14T15:00:00": "6", "2014-02-14T07:00:00": "2", "2014-02-14T15:50:00": "6.0", "2014-02-14T21:20:00": "3.0", "2014-02-14T17:00:00": "5", "2014-02-14T22:50:00": "3.0", "2014-02-14T17:20:00": "5.0", "2014-02-14T17:50:00": "5.0", "2014-02-14T04:20:00": "1.0", "2014-02-14T01:50:00": "1.0", "2014-02-14T22:00:00": "4", "2014-02-14T01:00:00": "2", "2014-02-14T06:20:00": "2.0", "2014-02-14T01:20:00": "1.0", "2014-02-14T20:20:00": "4.0", "2014-02-14T02:20:00": "1.0", "2014-02-14T02:00:00": "1", "2014-02-14T16:00:00": "6", "2014-02-14T02:50:00": "1.0", "2014-02-14T10:50:00": "5.0", "2014-02-14T18:20:00": "4.0", "2014-02-14T18:00:00": "4", "2014-02-14T03:50:00": "1.0", "2014-02-14T03:20:00": "1.0", "2014-02-14T23:20:00": "3.0", "2014-02-14T03:00:00": "1", "2014-02-14T12:50:00": "6.0", "2014-02-14T16:50:00": "5.0", "2014-02-14T13:50:00": "6.0", "2014-02-14T11:50:00": "5.0", "2014-02-14T23:50:00": "3.0", "2014-02-14T12:00:00": "6", "2014-02-14T20:00:00": "4", "2014-02-14T00:00:00": "2", "2014-02-14T00:20:00": "2.0", "2014-02-14T00:50:00": "1.0", "2014-02-14T05:50:00": "2.0", "2014-02-14T18:50:00": "4.0"}
],  // 预测的数据数组
formattedPredictedData: [],
chartInstance: null,
      };
    },
    mounted() {
    this.formatPredictedData();
    this.initChart();
    this.updateChartData();
  },
  methods: {
    formatPredictedData() {
      this.formattedPredictedData = this.predictedData.flatMap(data => 
        Object.entries(data).map(([datetime, value]) => {
          const [date, time] = datetime.split('T');
          return {
            date: date,
            time: time.substring(0, 5),
            value: value
          };
        })
      );
  },
  initChart() {
      this.chartInstance = echarts.init(this.$refs.lineChart);
    },
    updateChartData() {
  // 整理并处理数据
  const sortedData = [].concat.apply([], this.predictedData.map(item => Object.entries(item)))
                        .sort((a, b) => new Date(a[0]) - new Date(b[0]));

  // 格式化日期为月-日-时间
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // 获取月份并补零
    const day = ('0' + date.getDate()).slice(-2);          // 获取日期并补零
    const time = dateStr.split('T')[1];                    // 获取时间
    return `${month}-${day} ${time}`;
  };

  const dates = sortedData.map(item => formatDate(item[0]));
  const values = sortedData.map(item => item[1]);

  // 配置图表数据
  const option = {
    xAxis: {
      type: 'category',
      data: dates
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: values,
      type: 'line'
    }]
  };

  // 设置图表选项
  this.chartInstance.setOption(option);
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

    doSubscribe() {
      const { topic, qos } = this.subscription;

      // Ensure that topic is not empty or whitespace
      if (!topic.trim()) {
        Notification.error({
          title: 'Subscription Error',
          message: 'Topic cannot be empty.',
          duration: 5000
        });
        return;
      }

      this.client.subscribe(topic, { qos }, (error, res) => {
        if (error) {
          Notification.error({
            title: 'Subscription Failure',
            message: `MQTT subscription failed: ${error.message}`,
            duration: 5000
          });
        } else {
          // res is an array of granted subscriptions, which can be useful for debugging
          console.log('Subscription granted:', res);
          this.subscribeSuccess = true;
          Notification.success({
            title: 'Subscription Success',
            message: `Subscribed to "${topic}" with QoS ${qos}.`,
            duration: 5000
          });
        }
      });
    },
    // 调用这个方法来设置消息监听器
    setupMessageListener() {
      this.client.on('message', (topic, message) => {
        // 将接收到的消息转换为字符串
        const payload = message.toString();
        console.log('收到'+message.toString());
        // 将新消息添加到已接收消息的数组中
        this.receivedMessages.push({ topic, payload });
        const newProcessedData = this.processPayload(payload);
      this.processedData = newProcessedData;
        // 可以在这里进行进一步处理，例如更新UI、触发状态变更等
      });
    },
    processPayload(payload) {
  const processedData = [];
  const dataObj = JSON.parse(payload);

  // 解析并添加数据到数组
  Object.keys(dataObj).forEach(dateTime => {
    const [date, time] = dateTime.split('T');
    const value = dataObj[dateTime];
    processedData.push({ dateTime: new Date(dateTime), date, time, value });
  });

  // 按日期和时间排序
  processedData.sort((a, b) => a.dateTime - b.dateTime);
  // 移除 dateTime 属性，返回排序后的结果
  this.summaryData = this.summaryData.concat(this.calculateDailyStats(processedData));
  this.sum_pro_Data = this.convertSummaryDataToString(this.summaryData);
  this.publishData.publishMessage=this.sum_pro_Data;
  return processedData.map(({ date, time, value }) => ({ date, time, value }));
},
calculateDailyStats(processedData) {
  const dailyData = {};

  // 分组每天的数据，并转换值为数字或 null
  processedData.forEach(({ date, value }) => {
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(value !== "" ? parseInt(value, 10) : null);
  });

  // 处理每天的数据，用前后值的平均数填充空值
  for (const date in dailyData) {
    const dayData = dailyData[date];
    for (let i = 0; i < dayData.length; i++) {
      if (dayData[i] === null) {
        const prevValue = dayData.slice(0, i).reverse().find(v => v !== null);
        const nextValue = dayData.slice(i + 1).find(v => v !== null);

        dayData[i] = prevValue !== undefined && nextValue !== undefined
          ? Math.round((prevValue + nextValue) / 2)
          : (prevValue !== undefined ? prevValue : nextValue);
      }
    }
  }

  // 计算每天的最大值、最小值和平均值
  const summary = Object.keys(dailyData).map(date => {
    const values = dailyData[date].filter(v => v !== null);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const avgVal = values.reduce((a, b) => a + b, 0) / values.length;

    return {
      date,
      max: maxVal,
      min: minVal,
      avg: Number(avgVal.toFixed(2))
    };
  });

  return summary;
},
convertSummaryDataToString(summaryData) {
  let sum_pro_Data = summaryData.map(item => {
    return `Date: ${item.date}, Max: ${item.max}, Min: ${item.min}, Avg: ${item.avg}`;
  }).join('\n');

  return sum_pro_Data;
},
    doUnSubscribe() {
      const topic = this.subscription.topic; // 确保你有一个变量来存储当前订阅的主题

      // 确保主题不是空字符串
      if (!topic.trim()) {
        Notification.error({
          title: 'Unsubscribe Error',
          message: 'Topic cannot be empty.',
          duration: 5000
        });
        return;
      }

      this.client.unsubscribe(topic, (error) => {
        if (error) {
          // 如果取消订阅失败，显示错误通知
          Notification.error({
            title: 'Unsubscribe Error',
            message: `Failed to unsubscribe from topic: ${error.message}`,
            duration: 5000
          });
        } else {
          // 如果取消订阅成功，显示成功通知
          Notification.success({
            title: 'Unsubscribe Success',
            message: `Unsubscribed from "${topic}" successfully.`,
            duration: 5000
          });
          this.subscription.topic = ''; // 清空订阅主题
          this.subscription.qos = 0; // 重置QoS
          this.subscribeSuccess = false; // 更新订阅状态
        }
      });
    },
    doPublish() {
      const { publishTopic, publishMessage, qos } = this.publishData;

      // 确保发布主题和消息不为空
      if (!publishTopic.trim()) {
        Notification.error({
          title: 'Publish Error',
          message: 'Topic must be provided.',
          duration: 5000
        });
        return;
      }

      if (!publishMessage.trim()) {
        Notification.error({
          title: 'Publish Error',
          message: 'Message must be provided.',
          duration: 5000
        });
        return;
      }

      this.client.publish(publishTopic, publishMessage, { qos }, (error) => {
        if (error) {
          Notification.error({
            title: 'Publish Failure',
            message: `Failed to publish message: ${error.message}`,
            duration: 5000
          });
        } else {
          Notification.success({
            title: 'Publish Success',
            message: `Message published to "${publishTopic}" successfully.`,
            duration: 5000
          });
          // Optionally clear the message input after successful publish

        }
      });
    },
    destroyConnection() {
      if (this.client.connected) {
        try {
          this.client.end(false, () => {
            this.initData()
            console.log('Successfully disconnected!')
          })
        } catch (error) {
          console.log('Disconnect failed', error.toString())
        }
      }
    },
    parseJsonData(jsonData) {
      const dateMap = {};
      console.log('我在parseJsonData');

      // 将数据按日期分组
      Object.entries(jsonData).forEach(([timestamp, value]) => {
        const date = timestamp.split("T")[0];
        if (!dateMap[date]) {
          dateMap[date] = [];
        }
        dateMap[date].push(Number(value));
      });
  }
}
}
</script>

<style>
.background {
  background-image: url('../../public/images/1.jpg'); /* 替换为您的图片路径 */
  background-size: cover;
  border-radius: 15px;
}
.el-table .el-table__body tr:nth-child(odd) {
  background-color: white; /* 奇数行的颜色 */
}

.el-table .el-table__body tr:nth-child(even) {
  background-color: #f9f9f9; /* 偶数行的颜色，这里使用了浅灰色 */
}
</style>

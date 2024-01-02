<template>
  <div class="home-container">
    <router-link to="/">返回登录页面</router-link>
    <!-- 连接broker的卡片 -->
    <el-card shadow="always" style="margin-bottom:30px;">
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
    <el-card shadow="always" style="margin-bottom:30px;">
      <div class="emq-title">
        Subscribe
      </div>
      <el-form ref="subscription" hide-required-asterisk size="small" label-position="top" :model="subscription">
        <el-row :gutter="20">
          <el-col :span="8">
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
          <el-col :span="8">
            <el-form-item prop="qos" label="QoS">
              <el-select v-model="subscription.qos">
                <el-option v-for="qos in qosList" :key="qos" :label="qos" :value="qos"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
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

    <!-- 发布消息的卡片 -->
    <el-card class="box-card" style="margin-bottom:30px;">
      <div class="emq-title">
        <span>Publish Message</span>
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
          <el-input
              type="textarea"
              v-model="publishData.publishMessage"
              placeholder="Enter message to publish">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="button" @click="doPublish">Publish</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 接收消息的卡片 -->
    <el-card class="message-card" style="margin-bottom:30px;">
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
    </el-card>

<!--    <el-card shadow="always" style="margin-bottom:30px;">-->
<!--      <div class="emq-title">-->
<!--        Publish-->
<!--      </div>-->
<!--      <el-form ref="publish" hide-required-asterisk size="small" label-position="top" :model="publish">-->
<!--        <el-row :gutter="20">-->
<!--          <el-col :span="8">-->
<!--            <div class="custom-select-wrapper">-->
<!--              <el-form-item prop="topic" label="Topic">-->
<!--                <el-select v-model="publish.topic" placeholder="请选择">-->
<!--                  <el-option-->
<!--                    v-for="item in topicOptions"-->
<!--                    :key="item.value"-->
<!--                    :label="item.label"-->
<!--                    :value="item.value">-->
<!--                  </el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--            </div>-->
<!--          </el-col>-->
<!--          <el-col :span="8">-->
<!--            <el-form-item prop="qos" label="QoS">-->
<!--              <el-select v-model="publish.qos">-->
<!--                <el-option v-for="qos in qosList" :key="qos" :label="qos" :value="qos"></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          -->
<!--          <el-col :span="24">-->
<!--            <el-form-item prop="file">-->
<!--              <el-upload-->
<!--                class="upload-demo"-->
<!--                :show-file-list="false"-->
<!--                :on-change="uploadFile"-->
<!--              >-->
<!--                <el-button-->
<!--                  size="small"-->
<!--                  type="primary"-->
<!--                  class="conn-btn"-->
<!--                  :style="{ borderColor: '#409EFF', backgroundColor: '#409EFF', fontSize: '14px' }"-->
<!--                >-->
<!--                  Upload-->
<!--                </el-button>-->
<!--              </el-upload>-->
<!--            </el-form-item>-->
<!--          </el-col>-->

<!--        </el-row>-->
<!--        &lt;!&ndash;-->
<!--        <el-col :span="8">-->
<!--          <el-form-item prop="payload" label="Payload">-->
<!--            <el-input v-model="publish.payload"></el-input>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        &ndash;&gt;-->
<!--      </el-form>-->
<!--      <div>-->
<!--        <el-table-->
<!--          ref="multipleTable"-->
<!--          :data="tableData"-->
<!--          tooltip-effect="dark"-->
<!--          style="width: 100%"-->
<!--          max-height="250"-->
<!--          @selection-change="handleSelectionChange"-->
<!--        >-->
<!--           &lt;!&ndash; 勾选列配置 &ndash;&gt;-->
<!--          <el-table-column type="selection" width="55"></el-table-column>-->

<!--          &lt;!&ndash; 表格列配置 &ndash;&gt;-->
<!--          <el-table-column label="Date" width="180">-->
<!--            <template slot-scope="scope">{{ scope.row.date }}</template>-->
<!--          </el-table-column>-->

<!--          <el-table-column label="Average" width="180">-->
<!--            <template slot-scope="scope">{{ scope.row.avg }}</template>-->
<!--          </el-table-column>-->

<!--          <el-table-column label="Maximum" width="180">-->
<!--            <template slot-scope="scope">{{ scope.row.max }}</template>-->
<!--          </el-table-column>-->

<!--          <el-table-column label="Minimum" width="180">-->
<!--            <template slot-scope="scope">{{ scope.row.min }}</template>-->
<!--          </el-table-column>-->
<!--        </el-table>-->

<!--        <div style="margin-top: 20px">-->
<!--          <el-button @click="toggleSelection()">Cancel</el-button>-->
<!--        </div>-->
<!--      </div>-->

<!--      <el-col :span="24">-->
<!--        <el-button :disabled="!client.connected" type="success" size="small" class="publish-btn" @click="doPublish">-->
<!--          Publish-->
<!--        </el-button>-->
<!--      </el-col>-->
<!--    </el-card>-->
  </div>
</template>

<script>
/* eslint-disable */
import mqtt from 'mqtt'
import * as echarts from 'echarts';
import { Notification } from 'element-ui';

export default {
  name: 'Home',

  data() {
    return {
      connection: {
        protocol: 'ws',
        host:'100.81.86.127',
        port: 9001,
        cleanSession: true,
        keepAlive: 60, // 默认keep alive值
        clientId:
          'emqx_vue_' +
          Math.random()
            .toString(16)
            .substring(2, 8),
        // auth
        username: 'zwc',
        password: '2151414',
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
      receivedMessages: [],
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart);
  },
  methods: {
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
      });

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

        // 可以在这里进行进一步处理，例如更新UI、触发状态变更等
      });
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



    uploadFile(file) {
      if (this.isUploading) {
        // 如果正在上传，避免重复处理
        return;
      }

      if (file && file.raw) {
        this.isUploading = true; // 设置上传状态为 true

        const reader = new FileReader();

        reader.onload = () => {
          this.fileContent = reader.result;

          // 根据文件内容动态检测数据类型
          const dataType = this.detectDataType(file);
          if (dataType === 'unknown') {
            alert("你好，文件不符合要求！请检查之后重新上传！");
          } 
          else {
            console.log("我准备使用 parseJsonData 方法生成表格数据");
            //console.log(this.fileContent)
            // 使用 parseJsonData 方法生成表格数据
            //this.tableData = this.parseJsonData(JSON.parse(this.fileContent));
            this.tableData = this.processMultipleDaysData(this.fileContent);

            // 设置 publish 对象的 payload 属性
            //this.$set(this.publish, 'payload', this.fileContent);
          }

          this.isUploading = false; // 上传完成后设置上传状态为 false
        }; 

        reader.readAsText(file.raw);
      }
    },
    detectDataType(file) {
      // 判断文件内容是否包含关键字来确定数据类型
      if (file.name.includes('temperature')&&this.publish.topic.includes('temperature')) {
        console.log("temperature成功");
        return 'temperature';
      } else if (file.name.includes('humidity')&&this.publish.topic.includes('humidity')) {
        console.log("humidity成功");
        return 'humidity';
      } else if (file.name.includes('pressure')&&this.publish.topic.includes('pressure')) {
        console.log("pressure成功");
        return 'pressure';
      }
      // 默认数据类型，可以根据需要修改
      console.log("信息不匹配");
      return 'unknown';
    },
    //经过这个函数的处理，然后就把数据放到了表格之中
    processMultipleDaysData(datasets) {
      const result = [];
      
      // 分割每个数据集（每天的数据）
      const jsonDataArray = datasets.split('\n');

      // 遍历每个数据集
      jsonDataArray.forEach((jsonData, index) => {
        console.log('Looping...');
        console.log(`Processing day ${index + 1}`);
        
        // 调用处理单个数据集的函数
        const processedData = this.parseJsonData(JSON.parse(jsonData));

        // 将处理后的数据添加到结果数组
        result.push(...processedData);
      });

      return result;
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

      // 计算每个日期的最大值、最小值和平均值
      const result = Object.entries(dateMap).map(([date, values], index, array) => {
        // Replace empty or zero values with the average of neighboring values
        for (let i = 0; i < values.length; i++) {
          if (values[i] === null || values[i] === undefined || values[i] === 0) {
            values[i] = this.calculateAverageNeighboringValues(values, i);
          }
        }

        // Calculate max, min, and avg
        const max = Math.max(...values);
        const min = Math.min(...values);
        const avg = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);

        return {
          date,
          max,
          min,
          avg,
          rawData: jsonData, // 存储原始 JSON 数据
        };
      });

      return result;
    },

    calculateAverageNeighboringValues(values, index) {
      const prevValue = index > 0 ? values[index - 1] : 0;
      const nextValue = index < values.length - 1 ? values[index + 1] : 0;
      return Math.round((prevValue + nextValue) / 2);
    },

    toggleSelection() {
      // After toggling selection, update the payload
      console.log(this.multipleSelection);
      console.log(this.publish.payload);
      this.$refs.multipleTable.clearSelection();
      this.updatePayload();
      console.log(this.multipleSelection);
      console.log(this.publish.payload);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // Update the payload whenever selection changes
      this.updatePayload();
    },
    updatePayload() {
      // Get the original JSON data from the selected rows
      const selectedRowsData = this.multipleSelection.map(selectedRow => {
        if (typeof selectedRow.rawData === 'object') {
          return JSON.stringify(selectedRow.rawData);
        } else {
          return selectedRow.rawData;
        }
      });

      // Convert the original JSON data to a string and set it as payload
      const selectedRawDataString = selectedRowsData.join('\n');//n个数据有n-1个换行符号
      this.$set(this.publish, 'payload', selectedRawDataString);
      //console.log("我在updatePayload", selectedRawDataString);
    },
    generateLineChart() {
      if (this.chart) {
        // Dispose the current chart instance to clear all settings and data
        this.chart.dispose();
        console.log(this.chart);
        // Create a new chart instance
        //this.chart = echarts.init(this.$refs.chart);
        this.chart = echarts.init(this.$refs.chart);
        console.log(this.chart);
      }

      console.log("Generating Line Chart");
      const seriesData = this.processReceiveNews();
      console.log("Extract data for ECharts from recieveNews", seriesData);

      const sortedSeriesData = seriesData.map(data => {
        // Sort data by time
        data.data.sort((a, b) => new Date(`1970-01-01T${a.time}`) - new Date(`1970-01-01T${b.time}`));
        return data;
      });

      // Ensure that the x-axis (time) is evenly spaced
      const interpolatedSeriesData = this.interpolateTimeValues(sortedSeriesData);

      const colors = this.generateRandomColors(interpolatedSeriesData.length);
      console.log("Colors:", colors);

      const series = interpolatedSeriesData.map(data => ({
        name: data.name,
        type: 'line',
        smooth: true,
        data: data.data.map(entry => entry.value),
        lineStyle: {
          color: colors[Math.floor(Math.random() * colors.length)],
        },
      }));

      const options = {
        title: {
          text: 'Line Chart',
        },
        xAxis: {
          type: 'category',
          data: interpolatedSeriesData.length > 0 ? interpolatedSeriesData[0].data.map(entry => entry.time) : [],
        },
        yAxis: {
          type: 'value',
        },
        series,
      };

      console.log("Setting options and rendering the chart");
      console.log("Options:", options);

      this.chart.setOption(options);
    },

    interpolateTimeValues(seriesData) {
      const interpolatedSeriesData = [];
      const timeSet = new Set();

      // Collect all unique time values
      seriesData.forEach(data => {
        data.data.forEach(entry => {
          timeSet.add(entry.time);
        });
      });

      // Create a sorted array of unique time values
      const sortedTimes = Array.from(timeSet).sort();

      // Interpolate values for each series
      seriesData.forEach(data => {
        const interpolatedData = sortedTimes.map(time => {
          const existingEntry = data.data.find(entry => entry.time === time);
          return existingEntry ? existingEntry : { time, value: null }; // Use null for missing values
        });

        interpolatedSeriesData.push({ ...data, data: interpolatedData });
      });

      return interpolatedSeriesData;
    },
    processReceiveNews() {
      const dateMap = {};

      // Split the receiveNews string by newline character
      const jsonDataArray = this.receiveNews.split('\n');

      jsonDataArray.forEach(jsonString => {
        try {
          // Parse the JSON string
          const jsonData = JSON.parse(jsonString);

          Object.entries(jsonData).forEach(([timestamp, value]) => {
            const date = timestamp.split("T")[0];
            
            if (!dateMap[date]) {
              dateMap[date] = {
                name: date,
                type: 'line',
                smooth: true,
                data: [],
              };
            }

            const time = new Date(timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            dateMap[date].data.push({ time, value: Number(value) });
          });
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      });

      // Convert dateMap object to an array
      const seriesData = Object.values(dateMap);

      // Sort the data array within each series by time
      seriesData.forEach(series => {
        series.data.sort((a, b) => {
          return new Date(`1970-01-01T${a.time}`) - new Date(`1970-01-01T${b.time}`);
        });
      });

      return seriesData;
    },

    generateRandomColors(count) {
      // Generate an array of random colors
      const colors = [];
      for (let i = 0; i < count; i++) {
        const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)})`;
        colors.push(color);
      }
      return colors;
    },


    initData() {
      this.client = {
        connected: false,
      }
      this.retryTimes = 0
      this.connecting = false
      this.subscribeSuccess = false
    },
  },
}
</script>

<style lang="scss">
@import url('../assets/style/home.scss');

.home-container {
  max-width: 1100px;
  margin: 0 auto;

  .conn-btn {
    color: #fff;
    background-color: #409EFF;
    font-size: 14px;
  }

  .publish-btn {
    margin-bottom: 20px;
    float: right;
  }

  .el-button--success {
    background-color: #409EFF !important;
    border-color: #409EFF !important;
    font-size: 14px !important;
  }

  .el-button--danger {
    background-color: #f5222d !important;
    border-color: #f5222d !important;
  }

  .el-form-item {
    &.is-error {
      .el-input__inner,
      .el-textarea__inner {
        box-shadow: 0 0 0 2px #f5222d;
      }
    }
    &.is-success {
      .el-input__inner,
      .el-textarea__inner {
        border-color: #409EFF !important;
      }
    }
  }
}
</style>

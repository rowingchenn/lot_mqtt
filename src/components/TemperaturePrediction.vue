<template>
  <div>
    <button @click="calculateAndPredict">Predict</button>

    <div v-if="dailyAverages.length">
      <h2>提取的日期和平均温度</h2>
      <ul>
        <li v-for="data in dailyAverages" :key="data.date">
          日期: {{ data.date }}, 平均温度: {{ data.averageTemperature }}
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    summaryDataProp: Array,
    childUpdatePredictedData:Function
  },
  data() {
    return {
      dailyAverages: [],
      predictedTemperature: [],
      predictedData: [], // 新增这行
    };
  },
  mounted () {
   this.$emit('childUpdatePredictedData',[123123,123123])
  },
  methods: {
    calculateAndPredict() {
      console.log('this.summaryDataProp:', this.summaryDataProp);
      if (!Array.isArray(this.summaryDataProp) || this.summaryDataProp.length === 0) {
        console.error('Invalid or empty summaryDataProp.');
        return;
      }

      // 在这里使用 this.summaryDataProp 进行最小二乘法拟合
      this.performLeastSquaresFit(this.summaryDataProp);
    },
    performLeastSquaresFit(summaryData) {
      if (!Array.isArray(summaryData)) {
        console.error('Invalid summaryData. Expected an array.');
        return;
      }

      const dates = summaryData.map((data) => new Date(data.date).getTime());
      const temperatures = summaryData.map((data) => data.avg);

      // 执行最小二乘法拟合
      const result = this.leastSquaresFit(dates, temperatures);
      console.log('Update Predicted Data Method Called');
      // 预测后面七天的平均温度数据
      this.predictTemperature(result, dates[dates.length - 1]);
       // 确保在执行完后调用 updatePredictedData
     this.updatePredictedData();
    },

    predictTemperature(result, lastDate) {
      // 获取最后一个日期，并在其基础上预测后面七天的日期和温度
      const startDate = new Date(lastDate);
      startDate.setDate(startDate.getDate() + 1); // 增加一天作为起始日期

      const predictedDates = [];
      const predictedTemperatures = [];

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        predictedDates.push(currentDate.toISOString().split('T')[0]);
        predictedTemperatures.push(result.slope * currentDate.getTime() + result.intercept);
      }

      // 将预测结果保存到 predictedTemperature 数组中
      this.predictedTemperature = predictedDates.map((date, index) => ({
        date,
        predictedTemperature: predictedTemperatures[index],
      }));
      
    },
    updatePredictedData() {
    console.log('Predicted Temperature:', this.predictedTemperature);
  this.$emit('childUpdatePredictedData', this.predictedTemperature);
},
    leastSquaresFit(x, y) {
      const n = x.length;
      let sumX = 0;
      let sumY = 0;
      let sumXY = 0;
      let sumXX = 0;

      for (let i = 0; i < n; i++) {
        sumX += x[i];
        sumY += y[i];
        sumXY += x[i] * y[i];
        sumXX += x[i] * x[i];
      }

      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      return { slope, intercept };
    },
  },
};
</script>

<style scoped>
/* 在这里添加样式 */
</style>

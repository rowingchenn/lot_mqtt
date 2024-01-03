<template>
  <div>
    <button @click="calculateAndPredict">计算并预测湿度</button>

    <div v-if="dailyAverages.length">
      <h2>提取的日期和平均湿度</h2>
      <ul>
        <li v-for="data in dailyAverages" :key="data.date">
          日期: {{ data.date }}, 平均湿度: {{ data.averageHumidity }}
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    summaryDataProp: Array,
    childUpdatePredictedData: Function,
  },
  data() {
    return {
      dailyAverages: [],
      predictedHumidity: [],
    };
  },
  mounted() {
    // Emitting initial data to the parent component
    this.$emit('childUpdatePredictedData', [123123, 123123]);
  },
  methods: {
    calculateAndPredict() {
      console.log('this.summaryDataProp:', this.summaryDataProp);
      if (!Array.isArray(this.summaryDataProp) || this.summaryDataProp.length === 0) {
        console.error('Invalid or empty summaryDataProp.');
        return;
      }

      // Use this.summaryDataProp for the least squares fit
      this.performLeastSquaresFit(this.summaryDataProp);
    },
    performLeastSquaresFit(summaryData) {
      if (!Array.isArray(summaryData)) {
        console.error('Invalid summaryData. Expected an array.');
        return;
      }

      const dates = summaryData.map((data) => new Date(data.date).getTime());
      const humidities = summaryData.map((data) => data.avgHumidity);

      // Perform least squares fit
      const result = this.leastSquaresFit(dates, humidities);

      // Predict the next seven days' humidity data
      this.predictHumidity(result, dates[dates.length - 1]);

      // Ensure to call updatePredictedData after the prediction
      this.updatePredictedData();
    },

    predictHumidity(result, lastDate) {
      // Predict humidity for the next seven days based on the last date
      const startDate = new Date(lastDate);
      startDate.setDate(startDate.getDate() + 1);

      const predictedDates = [];
      const predictedHumidities = [];

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        predictedDates.push(currentDate.toISOString().split('T')[0]);
        predictedHumidities.push(result.slope * currentDate.getTime() + result.intercept);
      }

      // Save the predicted results to the predictedHumidity array
      this.predictedHumidity = predictedDates.map((date, index) => ({
        date,
        predictedHumidity: predictedHumidities[index],
      }));
    },

    updatePredictedData() {
      console.log('Predicted Humidity:', this.predictedHumidity);
      this.$emit('childUpdatePredictedData', this.predictedHumidity);
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
/* Add your styles here */
</style>

<template>
  <div>
    <button @click="calculateAndPredict">计算并预测压力</button>

    <div v-if="dailyAverages.length">
      <h2>提取的日期和平均压力</h2>
      <ul>
        <li v-for="data in dailyAverages" :key="data.date">
          日期: {{ data.date }}, 平均压力: {{ data.averagePressure }}
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
      predictedPressure: [],
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
      const pressures = summaryData.map((data) => data.avgPressure);

      // Perform least squares fit
      const result = this.leastSquaresFit(dates, pressures);

      // Predict the next seven days' pressure data
      this.predictPressure(result, dates[dates.length - 1]);

      // Ensure to call updatePredictedData after the prediction
      this.updatePredictedData();
    },

    predictPressure(result, lastDate) {
      // Predict pressure for the next seven days based on the last date
      const startDate = new Date(lastDate);
      startDate.setDate(startDate.getDate() + 1);

      const predictedDates = [];
      const predictedPressures = [];

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        predictedDates.push(currentDate.toISOString().split('T')[0]);
        predictedPressures.push(result.slope * currentDate.getTime() + result.intercept);
      }

      // Save the predicted results to the predictedPressure array
      this.predictedPressure = predictedDates.map((date, index) => ({
        date,
        predictedPressure: predictedPressures[index],
      }));
    },

    updatePredictedData() {
      console.log('Predicted Pressure:', this.predictedPressure);
      this.$emit('childUpdatePredictedData', this.predictedPressure);
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

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface WaterLineChartProps {
  data: Array<{
    date: string;
    percentage: number;
  }>;
}

const WaterLineChart: React.FC<WaterLineChartProps> = ({ data }) => {
  const screenWidth = Dimensions.get('window').width;

  const labels = data.map(d => {
    const date = new Date(d.date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  const percentages = data.map(d => d.percentage);

  const chartData = {
    labels,
    datasets: [
      {
        data: percentages,
        color: (opacity = 1) => `rgba(0, 188, 212, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Goal Achievement Trend</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        yAxisLabel=""
        yAxisSuffix="%"
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 188, 212, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#00BCD4',
          },
        }}
        style={styles.chart}
        bezier
        fromZero
        segments={5}
        withDots={true}
        withShadow={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
      />
      <View style={styles.goalLineContainer}>
        <View style={styles.goalLine} />
        <Text style={styles.goalLineText}>100% Goal</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  goalLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  goalLine: {
    width: 40,
    height: 2,
    backgroundColor: '#00BCD4',
    marginRight: 8,
  },
  goalLineText: {
    fontSize: 12,
    color: '#666',
  },
});

export default WaterLineChart;

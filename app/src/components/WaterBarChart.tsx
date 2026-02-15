import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

interface WaterBarChartProps {
  data: Array<{
    date: string;
    amount: number;
    goal: number;
  }>;
  goal: number;
}

const WaterBarChart: React.FC<WaterBarChartProps> = ({ data, goal }) => {
  const screenWidth = Dimensions.get('window').width;

  const labels = data.map(d => {
    const date = new Date(d.date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  const amounts = data.map(d => d.amount);

  const chartData = {
    labels,
    datasets: [
      {
        data: amounts,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Water Intake</Text>
      <BarChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        yAxisLabel=""
        yAxisSuffix="ml"
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#2196F3',
          },
        }}
        style={styles.chart}
        showValuesOnTopOfBars
        fromZero
        segments={5}
      />
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.legendColorBlue]} />
          <Text style={styles.legendText}>Water Intake</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.legendColorCyan]} />
          <Text style={styles.legendText}>Daily Goal: {goal}ml</Text>
        </View>
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
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendColorBlue: {
    backgroundColor: '#2196F3',
  },
  legendColorCyan: {
    backgroundColor: '#00BCD4',
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});

export default WaterBarChart;

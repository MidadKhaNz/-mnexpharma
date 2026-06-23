<template>
  <div class="relative h-72">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend
} from 'chart.js'
import { salesByCategoryData } from '@/data/mockData.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const COLORS = [
  '#0F766E','#14B8A6','#3B82F6','#F59E0B','#EF4444',
  '#8B5CF6','#10B981','#F97316','#EC4899','#06B6D4',
  '#84CC16','#A78BFA'
]

const chartData = computed(() => ({
  labels: salesByCategoryData.labels,
  datasets: [{
    data: salesByCategoryData.data,
    backgroundColor: COLORS.slice(0, salesByCategoryData.labels.length),
    borderColor: '#fff',
    borderWidth: 3,
    hoverBorderColor: '#fff',
    hoverBorderWidth: 3,
    hoverOffset: 8
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: {
      position: 'right',
      labels: {
        boxWidth: 10,
        boxHeight: 10,
        borderRadius: 3,
        useBorderRadius: true,
        font: { size: 11, family: 'Inter' },
        color: '#6B7280',
        padding: 12
      }
    },
    tooltip: {
      backgroundColor: '#fff',
      titleColor: '#111827',
      bodyColor: '#6B7280',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      cornerRadius: 10,
      padding: 12,
      callbacks: {
        label: ctx => `  ${ctx.label}: ${ctx.parsed} sales`
      }
    }
  }
}
</script>

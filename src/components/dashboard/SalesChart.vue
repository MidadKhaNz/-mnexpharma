<template>
  <div class="relative h-72">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js'
import { monthlySalesData } from '@/data/mockData.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const chartData = computed(() => ({
  labels: monthlySalesData.labels,
  datasets: [
    {
      label: 'Sales Count',
      data: monthlySalesData.sales,
      borderColor: '#0F766E',
      backgroundColor: 'rgba(15, 118, 110, 0.08)',
      borderWidth: 2.5,
      pointBackgroundColor: '#0F766E',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
      tension: 0.4,
      fill: true,
      yAxisID: 'y'
    },
    {
      label: 'Revenue (৳)',
      data: monthlySalesData.revenue,
      borderColor: '#14B8A6',
      backgroundColor: 'rgba(20, 184, 166, 0.06)',
      borderWidth: 2,
      pointBackgroundColor: '#14B8A6',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.4,
      fill: true,
      yAxisID: 'y1'
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        boxWidth: 12,
        boxHeight: 12,
        borderRadius: 3,
        useBorderRadius: true,
        font: { size: 12, family: 'Inter' },
        color: '#6B7280',
        padding: 20
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
      boxPadding: 4,
      callbacks: {
        label(ctx) {
          return ctx.datasetIndex === 1
            ? ` Revenue: ৳${ctx.parsed.y.toLocaleString()}`
            : ` Sales: ${ctx.parsed.y}`
        }
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { font: { size: 12, family: 'Inter' }, color: '#9CA3AF' }
    },
    y: {
      position: 'left',
      grid: { color: '#F3F4F6', drawBorder: false },
      border: { display: false, dash: [4, 4] },
      ticks: { font: { size: 12, family: 'Inter' }, color: '#9CA3AF', stepSize: 5 }
    },
    y1: {
      position: 'right',
      grid: { display: false },
      border: { display: false },
      ticks: {
        font: { size: 12, family: 'Inter' },
        color: '#9CA3AF',
        callback: v => `৳${(v / 1000).toFixed(0)}k`
      }
    }
  }
}
</script>

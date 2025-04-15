<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-900">仪表盘</h1>
    
    <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <!-- 卡片：当前酿造 -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-brew-amber rounded-md p-3">
              <BeakerIcon class="h-6 w-6 text-white" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  当前酿造中
                </dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ activeBatches }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <router-link to="/brewing" class="font-medium text-brew-amber hover:text-amber-500">
              查看全部
            </router-link>
          </div>
        </div>
      </div>

      <!-- 卡片：库存低的物品 -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-red-600 rounded-md p-3">
              <ExclamationTriangleIcon class="h-6 w-6 text-white" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  库存低的物品
                </dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ lowStockItems }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <router-link to="/inventory" class="font-medium text-brew-amber hover:text-amber-500">
              查看库存
            </router-link>
          </div>
        </div>
      </div>

      <!-- 卡片：完成的批次 -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
              <CheckCircleIcon class="h-6 w-6 text-white" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  完成的批次
                </dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ completedBatches }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <router-link to="/brewing" class="font-medium text-brew-amber hover:text-amber-500">
              查看历史
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 酿造进度表 -->
    <div class="mt-8">
      <h2 class="text-lg font-medium text-gray-900">当前酿造进度</h2>
      <div class="mt-4 bg-white shadow overflow-hidden rounded-md">
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="batch in recentBatches" :key="batch.id" class="p-4 hover:bg-gray-50">
            <div class="flex items-center space-x-4">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ batch.name }}</p>
                <p class="text-sm text-gray-500 truncate">{{ batch.style }}</p>
              </div>
              <div class="flex-shrink-0">
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    class="bg-brew-amber h-2.5 rounded-full" 
                    :style="{ width: `${batch.progress}%` }"
                  ></div>
                </div>
                <p class="text-xs text-gray-500 text-right mt-1">{{ batch.progress }}%</p>
              </div>
              <div>
                <router-link 
                  :to="`/brewing/${batch.id}`" 
                  class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-brew-amber hover:bg-brew-cream focus:outline-none"
                >
                  详情
                </router-link>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- 生产图表 -->
    <div class="mt-8">
      <h2 class="text-lg font-medium text-gray-900">月度生产</h2>
      <div class="mt-4 bg-white p-6 shadow rounded-lg">
        <BarChart :chart-data="productionChartData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { BeakerIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import { Bar as BarChart } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// 这些数据将来自API
const activeBatches = ref(3)
const lowStockItems = ref(5)
const completedBatches = ref(28)

const recentBatches = reactive([
  { id: 1, name: 'Hoppy IPA', style: 'IPA', progress: 75 },
  { id: 2, name: '比利时小麦啤酒', style: '小麦啤酒', progress: 45 },
  { id: 3, name: '德式皮尔森', style: '皮尔森', progress: 20 },
])

const productionChartData = computed(() => ({
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  datasets: [
    {
      label: '批次数量',
      backgroundColor: '#F59E0B',
      data: [4, 3, 6, 5, 8, 4]
    }
  ]
}))
</script> 
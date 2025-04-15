<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">酿造管理</h1>
        <p class="mt-2 text-sm text-gray-700">管理您的所有酿造批次，包括当前的和已完成的。</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          type="button"
          @click="openNewBatchModal"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-brew-amber px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:w-auto"
        >
          新增批次
        </button>
      </div>
    </div>

    <!-- 过滤和搜索栏 -->
    <div class="mt-6 flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
      <div class="flex flex-1 max-w-md">
        <div class="relative flex-grow focus-within:z-10">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            v-model="searchQuery"
            class="block w-full rounded-md border-gray-300 pl-10 focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            placeholder="搜索批次..."
          />
        </div>
      </div>
      <div class="flex space-x-2">
        <select
          v-model="statusFilter"
          class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
        >
          <option value="all">所有状态</option>
          <option value="active">酿造中</option>
          <option value="fermenting">发酵中</option>
          <option value="completed">已完成</option>
        </select>
        <select
          v-model="sortBy"
          class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
        >
          <option value="date">创建日期</option>
          <option value="name">名称</option>
          <option value="style">风格</option>
        </select>
      </div>
    </div>
    
    <!-- 批次列表 -->
    <div class="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">名称</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">风格</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">开始日期</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">状态</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">进度</th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">操作</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="batch in filteredBatches" :key="batch.id" class="hover:bg-gray-50">
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ batch.name }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ batch.style }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ formatDate(batch.startDate) }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm">
              <span :class="[
                'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                statusClasses[batch.status]
              ]">
                {{ statusLabels[batch.status] }}
              </span>
            </td>
            <td class="px-3 py-4 text-sm text-gray-500">
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  class="bg-brew-amber h-2.5 rounded-full" 
                  :style="{ width: `${batch.progress}%` }"
                ></div>
              </div>
              <span class="text-xs">{{ batch.progress }}%</span>
            </td>
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <router-link 
                :to="`/brewing/${batch.id}`" 
                class="text-brew-amber hover:text-amber-900 mr-4"
              >
                详情
              </router-link>
              <button 
                @click="editBatch(batch)" 
                class="text-brew-amber hover:text-amber-900"
              >
                编辑
              </button>
            </td>
          </tr>
          <tr v-if="filteredBatches.length === 0">
            <td colspan="6" class="px-3 py-4 text-sm text-gray-500 text-center">
              没有找到符合条件的批次
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新批次模态框（实际实现时可能需要单独的组件） -->
    <div v-if="showNewBatchModal" class="fixed inset-0 overflow-y-auto z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showNewBatchModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              新增酿造批次
            </h3>
            <div class="mt-4">
              <form @submit.prevent="createNewBatch">
                <div class="space-y-4">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">名称</label>
                    <input type="text" id="name" v-model="newBatch.name" class="mt-1 block w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 sm:text-sm" />
                  </div>
                  <div>
                    <label for="style" class="block text-sm font-medium text-gray-700">风格</label>
                    <select id="style" v-model="newBatch.style" class="mt-1 block w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 sm:text-sm">
                      <option value="IPA">IPA</option>
                      <option value="Stout">司陶特</option>
                      <option value="Wheat">小麦啤酒</option>
                      <option value="Pilsner">皮尔森</option>
                      <option value="Lager">拉格</option>
                      <option value="Porter">波特</option>
                    </select>
                  </div>
                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">描述</label>
                    <textarea id="description" v-model="newBatch.description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 sm:text-sm"></textarea>
                  </div>
                  <div class="flex justify-between space-x-3">
                    <div class="w-1/2">
                      <label for="quantity" class="block text-sm font-medium text-gray-700">数量 (L)</label>
                      <input type="number" id="quantity" v-model="newBatch.quantity" min="1" class="mt-1 block w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 sm:text-sm" />
                    </div>
                    <div class="w-1/2">
                      <label for="startDate" class="block text-sm font-medium text-gray-700">开始日期</label>
                      <input type="date" id="startDate" v-model="newBatch.startDate" class="mt-1 block w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 sm:text-sm" />
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brew-amber text-base font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:col-start-2 sm:text-sm">
                    创建
                  </button>
                  <button type="button" @click="showNewBatchModal = false" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'

// 示例数据 - 实际应用中会从API获取
const batches = ref([
  {
    id: 1,
    name: 'Hoppy IPA',
    style: 'IPA',
    startDate: '2023-10-01',
    status: 'active',
    progress: 75,
    description: '使用Citra和Mosaic啤酒花酿造的IPA'
  },
  {
    id: 2,
    name: '比利时小麦啤酒',
    style: 'Wheat',
    startDate: '2023-09-15',
    status: 'fermenting',
    progress: 45,
    description: '传统比利时风格小麦啤酒'
  },
  {
    id: 3,
    name: '德式皮尔森',
    style: 'Pilsner',
    startDate: '2023-08-20',
    status: 'completed',
    progress: 100,
    description: '清爽的德国风格啤酒'
  },
  {
    id: 4,
    name: '牛奶司陶特',
    style: 'Stout',
    startDate: '2023-09-01',
    status: 'completed',
    progress: 100,
    description: '添加了乳糖的醇厚黑啤'
  }
])

// 过滤和搜索状态
const searchQuery = ref('')
const statusFilter = ref('all')
const sortBy = ref('date')

// 模态框状态
const showNewBatchModal = ref(false)
const newBatch = ref({
  name: '',
  style: 'IPA',
  description: '',
  quantity: 20,
  startDate: new Date().toISOString().split('T')[0],
})

// 状态样式和标签
const statusClasses = {
  active: 'bg-blue-100 text-blue-800',
  fermenting: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800'
}

const statusLabels = {
  active: '酿造中',
  fermenting: '发酵中',
  completed: '已完成'
}

// 过滤批次
const filteredBatches = computed(() => {
  let result = batches.value

  // 按状态过滤
  if (statusFilter.value !== 'all') {
    result = result.filter(batch => batch.status === statusFilter.value)
  }

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(batch => 
      batch.name.toLowerCase().includes(query) ||
      batch.style.toLowerCase().includes(query) ||
      batch.description.toLowerCase().includes(query)
    )
  }

  // 排序
  result = [...result].sort((a, b) => {
    if (sortBy.value === 'date') {
      return new Date(b.startDate) - new Date(a.startDate)
    } else if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name)
    } else if (sortBy.value === 'style') {
      return a.style.localeCompare(b.style)
    }
    return 0
  })

  return result
})

// 方法
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('zh-CN', options)
}

function openNewBatchModal() {
  showNewBatchModal.value = true
}

function createNewBatch() {
  // 创建新批次的逻辑 - 实际应用中会提交到API
  const newId = Math.max(...batches.value.map(b => b.id)) + 1
  batches.value.push({
    id: newId,
    name: newBatch.value.name,
    style: newBatch.value.style,
    startDate: newBatch.value.startDate,
    status: 'active',
    progress: 0,
    description: newBatch.value.description
  })
  
  // 重置表单和关闭模态框
  newBatch.value = {
    name: '',
    style: 'IPA',
    description: '',
    quantity: 20,
    startDate: new Date().toISOString().split('T')[0],
  }
  showNewBatchModal.value = false
}

function editBatch(batch) {
  // 编辑批次的逻辑 - 实际应用中可能会打开一个编辑模态框
  console.log('编辑批次:', batch)
  // 此处可以实现编辑功能
}
</script> 
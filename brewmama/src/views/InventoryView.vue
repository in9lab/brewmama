<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">库存管理</h1>
        <p class="mt-2 text-sm text-gray-700">管理您的所有原料、设备和消耗品库存。</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          type="button"
          @click="openNewItemModal"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-brew-amber px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:w-auto"
        >
          添加物品
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
            placeholder="搜索物品..."
          />
        </div>
      </div>
      <div class="flex space-x-2">
        <select
          v-model="categoryFilter"
          class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
        >
          <option value="all">所有类别</option>
          <option value="grain">谷物</option>
          <option value="hops">啤酒花</option>
          <option value="yeast">酵母</option>
          <option value="equipment">设备</option>
          <option value="packaging">包装</option>
          <option value="other">其他</option>
        </select>
        <select
          v-model="stockFilter"
          class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
        >
          <option value="all">所有库存</option>
          <option value="low">库存不足</option>
          <option value="out">无库存</option>
        </select>
      </div>
    </div>
    
    <!-- 库存列表 -->
    <div class="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">名称</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">类别</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">当前库存</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">单位</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">库存状态</th>
            <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">上次更新</th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">操作</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="item in filteredItems" :key="item.id" class="hover:bg-gray-50">
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ item.name }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ categoryLabels[item.category] }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ item.quantity }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ item.unit }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm">
              <span :class="[
                'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                stockStatusClasses[getStockStatus(item)]
              ]">
                {{ stockStatusLabels[getStockStatus(item)] }}
              </span>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">{{ formatDate(item.lastUpdated) }}</td>
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <button 
                @click="updateStock(item)" 
                class="text-brew-amber hover:text-amber-900 mr-3"
              >
                调整
              </button>
              <button 
                @click="editItem(item)" 
                class="text-brew-amber hover:text-amber-900"
              >
                编辑
              </button>
            </td>
          </tr>
          <tr v-if="filteredItems.length === 0">
            <td colspan="7" class="px-3 py-4 text-sm text-gray-500 text-center">
              没有找到符合条件的物品
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新物品模态框 -->
    <div v-if="showItemModal" class="fixed inset-0 overflow-y-auto z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showItemModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              {{ editingExistingItem ? '编辑物品' : '添加物品' }}
            </h3>
            <div class="mt-4">
              <form @submit.prevent="saveItem">
                <div class="space-y-4">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">名称</label>
                    <input type="text" id="name" v-model="currentItem.name" class="mt-1 block w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 sm:text-sm" />
                  </div>
                  <div>
                    <label for="category" class="block text-sm font-medium text-gray-700">类别</label>
                    <select id="category" v-model="currentItem.category" class="mt-1 block w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 sm:text-sm">
                      <option value="grain">谷物</option>
                      <option value="hops">啤酒花</option>
                      <option value="yeast">酵母</option>
                      <option value="equipment">设备</option>
                      <option value="packaging">包装</option>
                      <option value="other">其他</option>
                    </select>
                  </div>
                  <div class="flex justify-between space-x-3">
                    <div class="w-1/2">
                      <label for="quantity" class="block text-sm font-medium text-gray-700">库存数量</label>
                      <input type="number" id="quantity" v-model="currentItem.quantity" min="0" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 sm:text-sm" />
                    </div>
                    <div class="w-1/2">
                      <label for="unit" class="block text-sm font-medium text-gray-700">单位</label>
                      <input type="text" id="unit" v-model="currentItem.unit" class="mt-1 block w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 sm:text-sm" />
                    </div>
                  </div>
                  <div class="flex justify-between space-x-3">
                    <div class="w-1/2">
                      <label for="minStockLevel" class="block text-sm font-medium text-gray-700">最低库存量</label>
                      <input type="number" id="minStockLevel" v-model="currentItem.minStockLevel" min="0" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 sm:text-sm" />
                    </div>
                    <div class="w-1/2">
                      <label for="supplier" class="block text-sm font-medium text-gray-700">供应商</label>
                      <input type="text" id="supplier" v-model="currentItem.supplier" class="mt-1 block w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 sm:text-sm" />
                    </div>
                  </div>
                  <div>
                    <label for="notes" class="block text-sm font-medium text-gray-700">备注</label>
                    <textarea id="notes" v-model="currentItem.notes" rows="2" class="mt-1 block w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 sm:text-sm"></textarea>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brew-amber text-base font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:col-start-2 sm:text-sm">
                    {{ editingExistingItem ? '保存' : '添加' }}
                  </button>
                  <button type="button" @click="showItemModal = false" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 库存调整模态框 -->
    <div v-if="showStockUpdateModal" class="fixed inset-0 overflow-y-auto z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showStockUpdateModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              库存调整 - {{ currentItem.name }}
            </h3>
            <div class="mt-4">
              <div class="bg-gray-50 p-4 rounded-md mb-4">
                <p class="text-sm text-gray-600">当前库存: <span class="font-semibold">{{ currentItem.quantity }} {{ currentItem.unit }}</span></p>
              </div>
              <form @submit.prevent="saveStockUpdate">
                <div class="space-y-4">
                  <div>
                    <label for="updateType" class="block text-sm font-medium text-gray-700">调整类型</label>
                    <select id="updateType" v-model="stockUpdate.type" class="mt-1 block w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 sm:text-sm">
                      <option value="add">入库</option>
                      <option value="remove">出库</option>
                      <option value="setExact">设置确切值</option>
                    </select>
                  </div>
                  <div>
                    <label for="updateAmount" class="block text-sm font-medium text-gray-700">数量</label>
                    <input type="number" id="updateAmount" v-model="stockUpdate.amount" min="0" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 sm:text-sm" />
                  </div>
                  <div>
                    <label for="updateNotes" class="block text-sm font-medium text-gray-700">备注</label>
                    <textarea id="updateNotes" v-model="stockUpdate.notes" rows="2" class="mt-1 block w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 sm:text-sm" placeholder="例如: 接收新货物, 用于批次 #123"></textarea>
                  </div>
                </div>
                <div class="mt-4 bg-gray-50 p-4 rounded-md">
                  <p class="text-sm text-gray-600">调整后库存: <span class="font-semibold">{{ calculateNewStock() }} {{ currentItem.unit }}</span></p>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brew-amber text-base font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:col-start-2 sm:text-sm">
                    确认调整
                  </button>
                  <button type="button" @click="showStockUpdateModal = false" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:mt-0 sm:col-start-1 sm:text-sm">
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
const inventoryItems = ref([
  {
    id: 1,
    name: '皮尔森麦芽',
    category: 'grain',
    quantity: 50,
    unit: 'kg',
    minStockLevel: 10,
    supplier: '啤创麦芽公司',
    notes: '德国进口',
    lastUpdated: '2023-09-25'
  },
  {
    id: 2,
    name: 'Citra啤酒花',
    category: 'hops',
    quantity: 2.5,
    unit: 'kg',
    minStockLevel: 1,
    supplier: '美国啤酒花供应商',
    notes: '柑橘风味',
    lastUpdated: '2023-10-02'
  },
  {
    id: 3,
    name: '美国艾尔酵母',
    category: 'yeast',
    quantity: 5,
    unit: '包',
    minStockLevel: 3,
    supplier: '发酵科技公司',
    notes: '适合IPA',
    lastUpdated: '2023-09-30'
  },
  {
    id: 4,
    name: '500ml棕色瓶',
    category: 'packaging',
    quantity: 1200,
    unit: '个',
    minStockLevel: 200,
    supplier: '玻璃制品厂',
    notes: '标准瓶盖尺寸',
    lastUpdated: '2023-08-15'
  },
  {
    id: 5,
    name: '杀菌剂',
    category: 'other',
    quantity: 3,
    unit: 'L',
    minStockLevel: 2,
    supplier: '酿酒设备供应商',
    notes: '用于设备消毒',
    lastUpdated: '2023-10-01'
  },
  {
    id: 6,
    name: '温度计',
    category: 'equipment',
    quantity: 0,
    unit: '个',
    minStockLevel: 1,
    supplier: '酿酒设备供应商',
    notes: '高精度数字温度计',
    lastUpdated: '2023-09-15'
  }
])

// 过滤和搜索状态
const searchQuery = ref('')
const categoryFilter = ref('all')
const stockFilter = ref('all')

// 模态框状态
const showItemModal = ref(false)
const showStockUpdateModal = ref(false)
const editingExistingItem = ref(false)
const currentItem = ref({
  name: '',
  category: 'grain',
  quantity: 0,
  unit: '',
  minStockLevel: 0,
  supplier: '',
  notes: '',
})
const stockUpdate = ref({
  type: 'add',
  amount: 0,
  notes: ''
})

// 类别标签
const categoryLabels = {
  grain: '谷物',
  hops: '啤酒花',
  yeast: '酵母',
  equipment: '设备',
  packaging: '包装',
  other: '其他'
}

// 库存状态样式和标签
const stockStatusClasses = {
  ok: 'bg-green-100 text-green-800',
  low: 'bg-yellow-100 text-yellow-800',
  out: 'bg-red-100 text-red-800'
}

const stockStatusLabels = {
  ok: '库存充足',
  low: '库存不足',
  out: '无库存'
}

// 获取库存状态
function getStockStatus(item) {
  if (item.quantity <= 0) return 'out'
  if (item.quantity < item.minStockLevel) return 'low'
  return 'ok'
}

// 过滤物品
const filteredItems = computed(() => {
  let result = inventoryItems.value

  // 按类别过滤
  if (categoryFilter.value !== 'all') {
    result = result.filter(item => item.category === categoryFilter.value)
  }

  // 按库存状态过滤
  if (stockFilter.value !== 'all') {
    if (stockFilter.value === 'low') {
      result = result.filter(item => getStockStatus(item) === 'low')
    } else if (stockFilter.value === 'out') {
      result = result.filter(item => getStockStatus(item) === 'out')
    }
  }

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.supplier.toLowerCase().includes(query) ||
      item.notes.toLowerCase().includes(query)
    )
  }

  return result
})

// 方法
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('zh-CN', options)
}

function openNewItemModal() {
  editingExistingItem.value = false
  currentItem.value = {
    name: '',
    category: 'grain',
    quantity: 0,
    unit: '',
    minStockLevel: 0,
    supplier: '',
    notes: '',
  }
  showItemModal.value = true
}

function editItem(item) {
  editingExistingItem.value = true
  currentItem.value = { ...item }
  showItemModal.value = true
}

function saveItem() {
  if (editingExistingItem.value) {
    // 更新现有物品
    const index = inventoryItems.value.findIndex(item => item.id === currentItem.value.id)
    if (index !== -1) {
      currentItem.value.lastUpdated = new Date().toISOString().split('T')[0]
      inventoryItems.value[index] = { ...currentItem.value }
    }
  } else {
    // 创建新物品
    const newId = Math.max(...inventoryItems.value.map(i => i.id)) + 1
    inventoryItems.value.push({
      id: newId,
      ...currentItem.value,
      lastUpdated: new Date().toISOString().split('T')[0]
    })
  }
  
  showItemModal.value = false
}

function updateStock(item) {
  currentItem.value = { ...item }
  stockUpdate.value = {
    type: 'add',
    amount: 0,
    notes: ''
  }
  showStockUpdateModal.value = true
}

function calculateNewStock() {
  let newStock = parseFloat(currentItem.value.quantity)
  const amount = parseFloat(stockUpdate.value.amount)
  
  if (stockUpdate.value.type === 'add') {
    newStock += amount
  } else if (stockUpdate.value.type === 'remove') {
    newStock = Math.max(0, newStock - amount)
  } else if (stockUpdate.value.type === 'setExact') {
    newStock = amount
  }
  
  return newStock
}

function saveStockUpdate() {
  const index = inventoryItems.value.findIndex(item => item.id === currentItem.value.id)
  if (index !== -1) {
    inventoryItems.value[index].quantity = calculateNewStock()
    inventoryItems.value[index].lastUpdated = new Date().toISOString().split('T')[0]
    
    // 在实际应用中，这里还应该记录库存变动历史
  }
  
  showStockUpdateModal.value = false
}
</script> 
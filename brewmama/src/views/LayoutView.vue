<template>
  <div class="flex h-screen bg-gray-100">
    <!-- 移动端侧边栏 -->
    <div 
      class="fixed inset-0 z-40 flex md:hidden transform"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      style="transition-property: transform; transition-duration: 300ms; transition-timing-function: ease-in-out;"
    >
      <div class="relative flex-1 flex flex-col max-w-xs w-full bg-brew-dark">
        <div class="absolute top-0 right-0 -mr-12 pt-2">
          <button
            type="button"
            class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            @click="sidebarOpen = false"
          >
            <span class="sr-only">关闭菜单</span>
            <XMarkIcon class="h-6 w-6 text-white" />
          </button>
        </div>
        
        <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <div class="flex-shrink-0 flex items-center px-4">
            <span class="text-2xl font-bold text-brew-amber">BrewMama</span>
          </div>
          <nav class="mt-5 px-2 space-y-1">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
              :class="[$route.path.startsWith(item.href) 
                ? 'bg-brew-amber text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white']"
            >
              <component 
                :is="item.icon" 
                class="mr-4 flex-shrink-0 h-6 w-6" 
                aria-hidden="true" 
              />
              {{ item.name }}
            </router-link>
          </nav>
        </div>
      </div>
      
      <div class="flex-shrink-0 w-14">
        <!-- 强制侧边栏有固定宽度 -->
      </div>
    </div>

    <!-- 桌面端侧边栏 -->
    <div class="hidden md:flex md:flex-shrink-0">
      <div class="flex flex-col w-64">
        <div class="flex-1 flex flex-col min-h-0 bg-brew-dark">
          <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div class="flex items-center flex-shrink-0 px-4">
              <span class="text-2xl font-bold text-brew-amber">BrewMama</span>
            </div>
            <nav class="mt-5 flex-1 px-2 space-y-1">
              <router-link
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                :class="[$route.path.startsWith(item.href) 
                  ? 'bg-brew-amber text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white']"
              >
                <component 
                  :is="item.icon" 
                  class="mr-3 flex-shrink-0 h-6 w-6" 
                  aria-hidden="true" 
                />
                {{ item.name }}
              </router-link>
            </nav>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 主内容区 -->
    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <div class="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
        <button
          type="button"
          class="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          @click="sidebarOpen = true"
        >
          <span class="sr-only">打开菜单</span>
          <Bars3Icon class="h-6 w-6" />
        </button>
      </div>
      
      <main class="flex-1 relative z-0 overflow-y-auto focus:outline-none">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <router-view />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  HomeIcon, 
  BeakerIcon, 
  ClipboardDocumentListIcon, 
  ArchiveBoxIcon, 
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon 
} from '@heroicons/vue/24/outline'

const sidebarOpen = ref(false)

const navigation = [
  { name: '仪表盘', href: '/dashboard', icon: HomeIcon },
  { name: '配方', href: '/recipes', icon: ClipboardDocumentListIcon },
  { name: '酿造', href: '/brewing', icon: BeakerIcon },
  { name: '库存', href: '/inventory', icon: ArchiveBoxIcon },
  { name: '设置', href: '/settings', icon: Cog6ToothIcon },
]
</script> 
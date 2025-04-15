<template>
  <div class="p-4 md:p-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold">Recipes</h1>
        <p class="text-slate-500">Manage your beer recipes</p>
      </div>
      <button 
        class="mt-4 md:mt-0 px-4 py-2 bg-brew-amber text-white rounded-md hover:bg-amber-600 transition flex items-center"
        @click="showNewRecipeModal = true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        New Recipe
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          <input 
            type="text" 
            class="pl-10 p-2 w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brew-amber focus:border-transparent"
            placeholder="Search recipes..."
            v-model="searchQuery"
          />
        </div>
        <div class="md:w-48">
          <select 
            class="p-2 w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brew-amber focus:border-transparent"
            v-model="styleFilter"
          >
            <option value="">All Styles</option>
            <option v-for="style in beerStyles" :key="style" :value="style">{{ style }}</option>
          </select>
        </div>
        <div class="md:w-48">
          <select 
            class="p-2 w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brew-amber focus:border-transparent"
            v-model="sortBy"
          >
            <option value="name">Sort by Name</option>
            <option value="style">Sort by Style</option>
            <option value="recent">Sort by Recent</option>
            <option value="abv">Sort by ABV</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Recipe Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="recipe in filteredRecipes" 
        :key="recipe.id" 
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
      >
        <div class="h-3" :class="styleColorMap[recipe.style] || 'bg-brew-amber'"></div>
        <div class="p-5">
          <div class="flex justify-between">
            <h3 class="text-lg font-semibold">{{ recipe.name }}</h3>
            <div class="flex space-x-2">
              <button class="text-slate-400 hover:text-brew-amber" @click="editRecipe(recipe.id)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button class="text-slate-400 hover:text-red-500" @click="confirmDeleteRecipe(recipe.id)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div class="text-sm text-slate-500 mt-1">{{ recipe.style }}</div>
          
          <div class="mt-4 grid grid-cols-3 gap-2 text-sm">
            <div>
              <div class="text-slate-500">ABV</div>
              <div class="font-medium">{{ recipe.abv }}%</div>
            </div>
            <div>
              <div class="text-slate-500">IBU</div>
              <div class="font-medium">{{ recipe.ibu }}</div>
            </div>
            <div>
              <div class="text-slate-500">SRM</div>
              <div class="font-medium">{{ recipe.srm }}</div>
            </div>
          </div>
          
          <p class="mt-4 text-sm text-slate-600 line-clamp-2">{{ recipe.description }}</p>
          
          <div class="mt-4 flex justify-between items-center">
            <button 
              class="text-brew-amber hover:text-amber-700"
              @click="viewRecipeDetails(recipe.id)"
            >
              View details
            </button>
            <button 
              class="px-4 py-1.5 bg-brew-amber text-white rounded-md hover:bg-amber-600 transition text-sm"
              @click="brewThisRecipe(recipe.id)"
            >
              Brew
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredRecipes.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center mt-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-slate-900">No recipes found</h3>
      <p class="mt-1 text-slate-500">
        {{ recipes.length === 0 ? "You haven't created any recipes yet." : "No recipes match your search criteria." }}
      </p>
      <button
        v-if="recipes.length === 0"
        class="mt-4 px-4 py-2 bg-brew-amber text-white rounded-md hover:bg-amber-600 transition"
        @click="showNewRecipeModal = true"
      >
        Create Your First Recipe
      </button>
    </div>

    <!-- New/Edit Recipe Modal -->
    <div v-if="showNewRecipeModal || showEditRecipeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b">
          <h2 class="text-xl font-semibold">{{ showEditRecipeModal ? 'Edit Recipe' : 'New Recipe' }}</h2>
        </div>
        
        <div class="p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Recipe Name</label>
              <input 
                type="text" 
                v-model="editingRecipe.name"
                class="p-2 w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brew-amber focus:border-transparent"
                placeholder="Enter recipe name"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Style</label>
              <select 
                v-model="editingRecipe.style"
                class="p-2 w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brew-amber focus:border-transparent"
              >
                <option v-for="style in beerStyles" :key="style" :value="style">{{ style }}</option>
              </select>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">ABV (%)</label>
                <input 
                  type="number" 
                  v-model="editingRecipe.abv"
                  step="0.1"
                  min="0"
                  class="p-2 w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brew-amber focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">IBU</label>
                <input 
                  type="number" 
                  v-model="editingRecipe.ibu"
                  step="1"
                  min="0"
                  class="p-2 w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brew-amber focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">SRM</label>
                <input 
                  type="number" 
                  v-model="editingRecipe.srm"
                  step="1"
                  min="0"
                  class="p-2 w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brew-amber focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea 
                v-model="editingRecipe.description"
                class="p-2 w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brew-amber focus:border-transparent"
                rows="3"
                placeholder="Brief description of your recipe"
              ></textarea>
            </div>
            
            <!-- More fields would go here for a real recipe builder -->
          </div>
        </div>
        
        <div class="p-6 border-t bg-slate-50 flex justify-end space-x-3">
          <button 
            class="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-100 transition"
            @click="closeRecipeModal"
          >
            Cancel
          </button>
          <button 
            class="px-4 py-2 bg-brew-amber text-white rounded-md hover:bg-amber-600 transition disabled:opacity-50"
            :disabled="!editingRecipe.name || !editingRecipe.style"
            @click="saveRecipe"
          >
            {{ showEditRecipeModal ? 'Update' : 'Create' }} Recipe
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h3 class="text-lg font-medium text-slate-900">Confirm Delete</h3>
          <p class="mt-2 text-slate-500">
            Are you sure you want to delete this recipe? This action cannot be undone.
          </p>
        </div>
        <div class="bg-slate-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button 
            class="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-100 transition"
            @click="showDeleteModal = false"
          >
            Cancel
          </button>
          <button 
            class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            @click="deleteRecipe"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Mock data - replace with actual API call
const recipes = ref([
  {
    id: '1',
    name: 'Classic American Pale Ale',
    style: 'American Pale Ale',
    abv: 5.5,
    ibu: 40,
    srm: 8,
    description: 'A clean, refreshing pale ale with a nice balance of malt and hops. Cascade hops provide a signature citrus and floral aroma.',
    createdAt: '2023-04-15'
  },
  {
    id: '2',
    name: 'Belgian Witbier',
    style: 'Witbier',
    abv: 4.8,
    ibu: 15,
    srm: 3,
    description: 'A refreshing, elegant, tasty, moderate-strength wheat-based ale with a complex blend of spices.',
    createdAt: '2023-05-10'
  },
  {
    id: '3',
    name: 'Irish Red Ale',
    style: 'Irish Red Ale',
    abv: 5.0,
    ibu: 25,
    srm: 14,
    description: 'An easy-drinking pint with a moderate caramel malt character and just enough hop bitterness to support it.',
    createdAt: '2023-03-22'
  },
  {
    id: '4',
    name: 'Hoppy IPA',
    style: 'American IPA',
    abv: 6.5,
    ibu: 65,
    srm: 7,
    description: 'A decidedly hoppy and bitter, moderately strong American pale ale with a clean fermentation profile and dry finish.',
    createdAt: '2023-06-01'
  },
  {
    id: '5',
    name: 'Robust Porter',
    style: 'Porter',
    abv: 5.8,
    ibu: 32,
    srm: 30,
    description: 'A substantial, malty dark beer with a complex and flavorful dark malt character.',
    createdAt: '2023-01-15'
  },
]);

const beerStyles = [
  'American Pale Ale',
  'American IPA',
  'New England IPA',
  'Stout',
  'Porter',
  'Witbier',
  'Hefeweizen',
  'Pilsner',
  'Lager',
  'Saison',
  'Belgian Tripel',
  'Irish Red Ale',
  'Scottish Ale',
  'Brown Ale',
  'Barleywine',
];

const searchQuery = ref('');
const styleFilter = ref('');
const sortBy = ref('name');
const showNewRecipeModal = ref(false);
const showEditRecipeModal = ref(false);
const showDeleteModal = ref(false);
const recipeToDeleteId = ref(null);

const editingRecipe = ref({
  id: null,
  name: '',
  style: 'American Pale Ale',
  abv: 5.0,
  ibu: 20,
  srm: 5,
  description: '',
});

const styleColorMap = {
  'American Pale Ale': 'bg-amber-500',
  'American IPA': 'bg-amber-600',
  'New England IPA': 'bg-yellow-300',
  'Stout': 'bg-slate-900',
  'Porter': 'bg-slate-800',
  'Witbier': 'bg-yellow-100',
  'Hefeweizen': 'bg-yellow-200',
  'Pilsner': 'bg-yellow-400',
  'Lager': 'bg-yellow-500',
  'Saison': 'bg-orange-300',
  'Belgian Tripel': 'bg-amber-300',
  'Irish Red Ale': 'bg-red-600',
  'Scottish Ale': 'bg-red-800',
  'Brown Ale': 'bg-amber-800',
  'Barleywine': 'bg-amber-900',
};

const filteredRecipes = computed(() => {
  let result = [...recipes.value];
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(recipe => 
      recipe.name.toLowerCase().includes(query) || 
      recipe.description.toLowerCase().includes(query)
    );
  }
  
  // Apply style filter
  if (styleFilter.value) {
    result = result.filter(recipe => recipe.style === styleFilter.value);
  }
  
  // Apply sorting
  switch (sortBy.value) {
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'style':
      result.sort((a, b) => a.style.localeCompare(b.style));
      break;
    case 'recent':
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'abv':
      result.sort((a, b) => b.abv - a.abv);
      break;
  }
  
  return result;
});

const viewRecipeDetails = (id) => {
  router.push(`/recipes/${id}`);
};

const brewThisRecipe = (id) => {
  // Navigate to create batch page with recipe pre-selected
  router.push(`/brewing/new?recipe=${id}`);
};

const editRecipe = (id) => {
  const recipe = recipes.value.find(r => r.id === id);
  if (recipe) {
    editingRecipe.value = { ...recipe };
    showEditRecipeModal.value = true;
  }
};

const confirmDeleteRecipe = (id) => {
  recipeToDeleteId.value = id;
  showDeleteModal.value = true;
};

const deleteRecipe = () => {
  if (recipeToDeleteId.value) {
    recipes.value = recipes.value.filter(r => r.id !== recipeToDeleteId.value);
    showDeleteModal.value = false;
    recipeToDeleteId.value = null;
  }
};

const saveRecipe = () => {
  if (showEditRecipeModal.value) {
    // Update existing recipe
    const index = recipes.value.findIndex(r => r.id === editingRecipe.value.id);
    if (index !== -1) {
      recipes.value[index] = { ...editingRecipe.value };
    }
  } else {
    // Create new recipe
    const newId = Math.max(...recipes.value.map(r => parseInt(r.id)), 0) + 1;
    recipes.value.push({
      ...editingRecipe.value,
      id: newId.toString(),
      createdAt: new Date().toISOString().split('T')[0]
    });
  }
  
  closeRecipeModal();
};

const closeRecipeModal = () => {
  showNewRecipeModal.value = false;
  showEditRecipeModal.value = false;
  editingRecipe.value = {
    id: null,
    name: '',
    style: 'American Pale Ale',
    abv: 5.0,
    ibu: 20,
    srm: 5,
    description: '',
  };
};
</script> 
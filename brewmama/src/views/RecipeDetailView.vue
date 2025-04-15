<template>
  <div class="p-4 md:p-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold">{{ recipe.name }}</h1>
        <p class="text-slate-500">{{ recipe.style }} | Created {{ formatDate(recipe.createdAt) }}</p>
      </div>
      <div class="mt-4 md:mt-0 flex space-x-3">
        <button 
          class="px-4 py-2 bg-brew-amber text-white rounded-md hover:bg-amber-600 transition"
          @click="brewRecipe"
        >
          Brew This Recipe
        </button>
        <button 
          class="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-100 transition"
          @click="editRecipe"
        >
          Edit Recipe
        </button>
        <button 
          class="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-100 transition"
          @click="goBack"
        >
          Back
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recipe Overview -->
      <div class="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
        <h2 class="text-xl font-semibold mb-4">Recipe Overview</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-slate-50 p-4 rounded-md">
            <p class="text-slate-500 text-sm">ABV (Alcohol)</p>
            <p class="text-2xl font-bold">{{ recipe.abv }}%</p>
          </div>
          <div class="bg-slate-50 p-4 rounded-md">
            <p class="text-slate-500 text-sm">IBU (Bitterness)</p>
            <p class="text-2xl font-bold">{{ recipe.ibu }}</p>
          </div>
          <div class="bg-slate-50 p-4 rounded-md">
            <p class="text-slate-500 text-sm">SRM (Color)</p>
            <div class="flex items-center mt-1">
              <div 
                class="w-8 h-8 rounded-full mr-2" 
                :class="styleColorMap[recipe.style] || 'bg-brew-amber'"
              ></div>
              <p class="text-2xl font-bold">{{ recipe.srm }}</p>
            </div>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="font-medium text-lg mb-2">Description</h3>
          <p class="text-slate-700">{{ recipe.description }}</p>
        </div>
        
        <div class="mb-6" v-if="recipe.notes">
          <h3 class="font-medium text-lg mb-2">Brewer's Notes</h3>
          <p class="text-slate-700">{{ recipe.notes }}</p>
        </div>
      </div>
      
      <!-- Recipe Specs -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Recipe Specifications</h2>
        
        <div class="space-y-4">
          <div>
            <h3 class="font-medium mb-2">Batch Size</h3>
            <p class="text-slate-700">{{ recipe.batchSize || 5 }} gallons</p>
          </div>
          
          <div>
            <h3 class="font-medium mb-2">Expected OG</h3>
            <p class="text-slate-700">{{ recipe.expectedOG || '1.048 - 1.052' }}</p>
          </div>
          
          <div>
            <h3 class="font-medium mb-2">Expected FG</h3>
            <p class="text-slate-700">{{ recipe.expectedFG || '1.010 - 1.014' }}</p>
          </div>
          
          <div>
            <h3 class="font-medium mb-2">Boil Time</h3>
            <p class="text-slate-700">{{ recipe.boilTime || 60 }} minutes</p>
          </div>
        </div>
      </div>
      
      <!-- Ingredients Section -->
      <div class="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
        <h2 class="text-xl font-semibold mb-4">Ingredients</h2>
        
        <!-- Grains/Fermentables -->
        <div class="mb-6">
          <h3 class="font-medium text-lg mb-2">Grains & Fermentables</h3>
          <div class="bg-slate-50 p-4 rounded-md">
            <div v-if="recipe.grains && recipe.grains.length" class="space-y-2">
              <div v-for="(grain, index) in recipe.grains" :key="index" class="flex justify-between">
                <span>{{ grain.amount }} {{ grain.unit }} {{ grain.name }}</span>
                <span class="text-slate-500">{{ grain.type }}</span>
              </div>
            </div>
            <div v-else class="text-slate-500 italic">No grains specified</div>
          </div>
        </div>
        
        <!-- Hops -->
        <div class="mb-6">
          <h3 class="font-medium text-lg mb-2">Hops</h3>
          <div class="bg-slate-50 p-4 rounded-md">
            <div v-if="recipe.hops && recipe.hops.length" class="space-y-2">
              <div v-for="(hop, index) in recipe.hops" :key="index" class="flex justify-between">
                <span>{{ hop.amount }} {{ hop.unit }} {{ hop.name }}</span>
                <span class="text-slate-500">{{ hop.timing }} min ({{ hop.purpose }})</span>
              </div>
            </div>
            <div v-else class="text-slate-500 italic">No hops specified</div>
          </div>
        </div>
        
        <!-- Yeast -->
        <div class="mb-6">
          <h3 class="font-medium text-lg mb-2">Yeast</h3>
          <div class="bg-slate-50 p-4 rounded-md">
            <div v-if="recipe.yeast" class="flex justify-between">
              <span>{{ recipe.yeast.name }}</span>
              <span class="text-slate-500">{{ recipe.yeast.type }}</span>
            </div>
            <div v-else class="text-slate-500 italic">No yeast specified</div>
          </div>
        </div>
        
        <!-- Other Ingredients -->
        <div v-if="recipe.others && recipe.others.length">
          <h3 class="font-medium text-lg mb-2">Other Ingredients</h3>
          <div class="bg-slate-50 p-4 rounded-md">
            <div class="space-y-2">
              <div v-for="(other, index) in recipe.others" :key="index" class="flex justify-between">
                <span>{{ other.amount }} {{ other.unit }} {{ other.name }}</span>
                <span class="text-slate-500">{{ other.timing }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Brewing Process -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Brewing Process</h2>
        
        <div class="space-y-6">
          <div>
            <h3 class="font-medium mb-2">Mash Guidelines</h3>
            <div v-if="recipe.mashSteps && recipe.mashSteps.length" class="space-y-3">
              <div v-for="(step, index) in recipe.mashSteps" :key="index" class="bg-slate-50 p-3 rounded-md">
                <p class="font-medium">{{ step.name }}</p>
                <p class="text-sm text-slate-700">{{ step.temperature }}°F for {{ step.time }} minutes</p>
              </div>
            </div>
            <div v-else class="text-slate-500 italic">No mash steps specified</div>
          </div>
          
          <div>
            <h3 class="font-medium mb-2">Fermentation</h3>
            <div class="bg-slate-50 p-3 rounded-md">
              <p class="text-slate-700">{{ recipe.fermentation || 'Primary: 14 days at 68°F' }}</p>
            </div>
          </div>
          
          <div v-if="recipe.carbonation">
            <h3 class="font-medium mb-2">Carbonation</h3>
            <div class="bg-slate-50 p-3 rounded-md">
              <p class="text-slate-700">{{ recipe.carbonation }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit Recipe Modal -->
  <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b">
        <h2 class="text-xl font-semibold">Edit Recipe</h2>
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
          
          <!-- More complex editing fields would go here in a real app -->
        </div>
      </div>
      
      <div class="p-6 border-t bg-slate-50 flex justify-end space-x-3">
        <button 
          class="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-100 transition"
          @click="showEditModal = false"
        >
          Cancel
        </button>
        <button 
          class="px-4 py-2 bg-brew-amber text-white rounded-md hover:bg-amber-600 transition disabled:opacity-50"
          :disabled="!editingRecipe.name || !editingRecipe.style"
          @click="updateRecipe"
        >
          Update Recipe
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const recipeId = route.params.id;

// Style color mapping from RecipesView
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

// State
const recipe = ref({
  id: recipeId,
  name: 'Classic American Pale Ale',
  style: 'American Pale Ale',
  abv: 5.5,
  ibu: 40,
  srm: 8,
  description: 'A clean, refreshing pale ale with a nice balance of malt and hops. Cascade hops provide a signature citrus and floral aroma.',
  createdAt: '2023-04-15',
  batchSize: 5,
  expectedOG: '1.052',
  expectedFG: '1.012',
  boilTime: 60,
  fermentation: 'Primary: 14 days at 68°F',
  carbonation: 'Force carbonate to 2.4 volumes of CO2',
  notes: 'This recipe works best with water adjusted to enhance hop character. Consider adding gypsum to increase sulfate levels.',
  grains: [
    { amount: 9, unit: 'lbs', name: 'American 2-row Pale Malt', type: 'Base Grain' },
    { amount: 1, unit: 'lb', name: 'Crystal 40L', type: 'Specialty Grain' },
    { amount: 0.5, unit: 'lb', name: 'Carapils', type: 'Specialty Grain' },
  ],
  hops: [
    { amount: 1, unit: 'oz', name: 'Cascade', timing: '60', purpose: 'Bittering' },
    { amount: 1, unit: 'oz', name: 'Cascade', timing: '15', purpose: 'Flavor' },
    { amount: 1, unit: 'oz', name: 'Cascade', timing: '0', purpose: 'Aroma' },
    { amount: 1, unit: 'oz', name: 'Cascade', timing: 'Dry Hop', purpose: 'Aroma' },
  ],
  yeast: {
    name: 'Safale US-05 American Ale',
    type: 'Dry Ale Yeast'
  },
  others: [
    { amount: 1, unit: 'tablet', name: 'Whirlfloc', timing: '15 min' },
    { amount: 1, unit: 'tsp', name: 'Yeast Nutrient', timing: '10 min' },
  ],
  mashSteps: [
    { name: 'Mash In', temperature: 152, time: 60 },
    { name: 'Mash Out', temperature: 168, time: 10 },
  ],
});

const showEditModal = ref(false);
const editingRecipe = ref({});

onMounted(() => {
  // In a real app, you would fetch the recipe data from your API
  // fetchRecipeDetails(recipeId);
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).format(date);
};

const goBack = () => {
  router.back();
};

const editRecipe = () => {
  editingRecipe.value = { ...recipe.value };
  showEditModal.value = true;
};

const updateRecipe = () => {
  // In a real app, you would send an API request to update the recipe
  recipe.value = { ...editingRecipe.value };
  showEditModal.value = false;
};

const brewRecipe = () => {
  // Navigate to create batch page with recipe pre-selected
  router.push(`/brewing/new?recipe=${recipeId}`);
};
</script> 
<template>
  <div class="p-4 md:p-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold">{{ batch.name }}</h1>
        <p class="text-slate-500">{{ batch.style }} | Started {{ formatDate(batch.startDate) }}</p>
      </div>
      <div class="mt-4 md:mt-0 flex space-x-3">
        <button 
          class="px-4 py-2 bg-brew-amber text-white rounded-md hover:bg-amber-600 transition"
          @click="editBatch"
        >
          Edit Batch
        </button>
        <button 
          class="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-100 transition"
          @click="goBack"
        >
          Back
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex flex-col md:flex-row md:space-x-8">
        <div class="md:w-2/3">
          <div class="mb-6">
            <h2 class="text-xl font-semibold mb-2">Batch Details</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-slate-500">Status</p>
                <p class="font-medium">{{ batch.status }}</p>
              </div>
              <div>
                <p class="text-slate-500">Progress</p>
                <div class="w-full bg-slate-200 rounded-full h-2.5 mt-2">
                  <div 
                    class="bg-brew-amber h-2.5 rounded-full" 
                    :style="{ width: `${batch.progress}%` }"
                  ></div>
                </div>
              </div>
              <div>
                <p class="text-slate-500">Recipe</p>
                <p class="font-medium">{{ batch.recipe || 'Custom' }}</p>
              </div>
              <div>
                <p class="text-slate-500">Batch Size</p>
                <p class="font-medium">{{ batch.batchSize }} gallons</p>
              </div>
              <div>
                <p class="text-slate-500">Target OG</p>
                <p class="font-medium">{{ batch.targetOG || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-slate-500">Target FG</p>
                <p class="font-medium">{{ batch.targetFG || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-slate-500">ABV</p>
                <p class="font-medium">{{ batch.abv || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-slate-500">IBU</p>
                <p class="font-medium">{{ batch.ibu || 'N/A' }}</p>
              </div>
            </div>
          </div>
          
          <div class="mb-6">
            <h2 class="text-xl font-semibold mb-2">Description</h2>
            <p class="text-slate-700">{{ batch.description || 'No description provided.' }}</p>
          </div>
        </div>

        <div class="md:w-1/3 mt-6 md:mt-0">
          <h2 class="text-xl font-semibold mb-2">Batch Timeline</h2>
          <div class="border-l-2 border-slate-200 pl-4 space-y-4">
            <div v-for="(event, index) in batchEvents" :key="index" class="relative">
              <div class="absolute -left-6 mt-1 w-4 h-4 rounded-full" :class="event.completed ? 'bg-brew-amber' : 'bg-slate-200'"></div>
              <div class="mb-1">
                <span class="font-medium">{{ event.name }}</span>
                <span v-if="event.date" class="text-sm text-slate-500 ml-2">{{ formatDate(event.date) }}</span>
              </div>
              <p class="text-sm text-slate-600">{{ event.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Brewing Notes</h2>
      <div v-if="brewingNotes.length" class="space-y-4">
        <div v-for="(note, index) in brewingNotes" :key="index" class="p-4 bg-slate-50 rounded-md">
          <div class="flex justify-between items-start">
            <div>
              <p class="font-medium">{{ formatDate(note.date) }}</p>
              <p class="text-slate-700 mt-1">{{ note.content }}</p>
            </div>
            <button class="text-slate-400 hover:text-slate-600" @click="deleteNote(index)">
              <span class="sr-only">Delete note</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-slate-500 italic">No brewing notes added yet.</div>
      
      <div class="mt-4">
        <textarea 
          v-model="newNote" 
          class="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brew-amber focus:border-transparent"
          placeholder="Add a brewing note..."
          rows="3"
        ></textarea>
        <div class="mt-2 flex justify-end">
          <button 
            class="px-4 py-2 bg-brew-amber text-white rounded-md hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!newNote.trim()"
            @click="addNote"
          >
            Add Note
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const batchId = route.params.id;

// Mock data - replace with actual API call
const batch = ref({
  id: batchId,
  name: 'Hoppy Amber Ale',
  style: 'American Amber Ale',
  startDate: '2023-05-15',
  status: 'Fermenting',
  progress: 65,
  description: 'A well-balanced amber ale with a nice hop aroma and caramel malt backbone.',
  recipe: 'Amber Ale Base',
  batchSize: 5,
  targetOG: 1.055,
  targetFG: 1.012,
  abv: '5.6%',
  ibu: 35
});

const batchEvents = ref([
  { 
    name: 'Brewing Day',
    date: '2023-05-15',
    description: 'Brew day completed successfully with target OG achieved.',
    completed: true
  },
  { 
    name: 'Primary Fermentation', 
    date: '2023-05-16',
    description: 'Transferred to fermenter, active fermentation observed after 12 hours.',
    completed: true
  },
  { 
    name: 'Secondary Fermentation',
    date: '2023-05-30',
    description: 'Transferred to secondary fermenter for clearing.',
    completed: true
  },
  { 
    name: 'Dry Hopping', 
    date: '2023-06-02',
    description: 'Added 2oz Cascade hops for aroma.',
    completed: true
  },
  { 
    name: 'Bottling/Kegging', 
    date: null,
    description: 'Not completed yet.',
    completed: false
  },
  { 
    name: 'Conditioning', 
    date: null,
    description: 'Not completed yet.',
    completed: false
  }
]);

const brewingNotes = ref([
  {
    date: '2023-05-15',
    content: 'Mash temperature was stable at 152°F. Collected 6.5 gallons of wort pre-boil.'
  },
  {
    date: '2023-05-16',
    content: 'Fermentation started vigorously, had to use a blow-off tube instead of an airlock.'
  },
  {
    date: '2023-05-22',
    content: 'Fermentation activity has slowed. Gravity reading: 1.025.'
  }
]);

const newNote = ref('');

onMounted(() => {
  // Here you would fetch the batch data from your API
  // fetchBatchData(batchId);
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

const editBatch = () => {
  // Navigate to edit page or open edit modal
  console.log('Edit batch:', batchId);
};

const goBack = () => {
  router.back();
};

const addNote = () => {
  if (newNote.value.trim()) {
    brewingNotes.value.unshift({
      date: new Date().toISOString().split('T')[0],
      content: newNote.value.trim()
    });
    newNote.value = '';
  }
};

const deleteNote = (index) => {
  brewingNotes.value.splice(index, 1);
};
</script> 
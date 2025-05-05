<template>
  <div class="flex h-screen">
    <!-- Panneau gauche -->
    <div class="w-1/4 bg-gray-100 border-r p-4 overflow-y-auto rounded ">
      <h2 class="text-xl font-bold mb-4">🗂️ Mes To-Do</h2>
      <ul>
        <li
          v-for="(todo, index) in todos"
          :key="index"
          class="group flex justify-between items-center px-3 py-2 rounded mb-2 cursor-pointer"
          :class="selectedIndex === index ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'"
        >
          <div @click="selectTodo(index)" class="flex-1">
            {{ todo.title }}
          </div>
          <button
            @click.stop="deleteTodo(index)"
            class="text-red-500 hover:text-red-700 invisible group-hover:visible ml-2"
            title="Supprimer la liste"
          >
            ✖
          </button>
        </li>
      </ul>
      <!-- Ajout d'une nouvelle To-Do -->
      <div class="mt-4">
        <input
          v-model="newTodoTitle"
          @keyup.enter="addTodo"
          placeholder="Nouvelle liste..."
          class="w-full p-2 border rounded"
        />
      </div>
    </div>

    <!-- Panneau droit -->
    <div class="flex-1 p-6 overflow-y-auto">
      <template v-if="selectedTodo">
        <h2 class="text-2xl font-bold mb-4">{{ selectedTodo.title }}</h2>

        <ul>
          <li
            v-for="(task, i) in selectedTodo.tasks"
            :key="i"
            class="flex justify-between items-center bg-white shadow p-2 rounded mb-2"
          >
            <div
              @click="toggleDone(i)"
              :class="task.done ? 'line-through text-gray-400' : 'cursor-pointer'"
            >
              {{ task.text }}
            </div>
            <button @click="deleteTask(i)" class="text-red-500 hover:text-red-700">🗑</button>
          </li>
        </ul>

        <div class="flex mb-4">
          <input
            v-model="newTask"
            @keyup.enter="addTask"
            placeholder="Ajouter une tâche..."
            class="flex-1 p-2 border rounded"
          />
          <button @click="addTask" class="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
            Ajouter
          </button>
        </div>
      </template>

      <template v-else>
        <p class="text-gray-400">Sélectionne une liste à gauche pour voir les détails.</p>
      </template>
    </div>
  </div>
</template>

<script setup>

import { ref, computed, watch, onMounted } from 'vue'

const STORAGE_KEY = 'my-todos'

const todos = ref([])
const selectedIndex = ref(null)
const newTodoTitle = ref('')
const newTask = ref('')

// ➕ Charger les données au démarrage
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    todos.value = JSON.parse(saved)
  }
})

// 💾 Sauvegarder à chaque modification
watch(todos, () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
}, { deep: true })

const selectedTodo = computed(() => {
  if (selectedIndex.value !== null) return todos.value[selectedIndex.value]
  return null
})

function selectTodo(index) {
  selectedIndex.value = index
}

function addTodo() {
  if (newTodoTitle.value.trim()) {
    todos.value.push({ title: newTodoTitle.value.trim(), tasks: [] })
    newTodoTitle.value = ''
  }
}

function addTask() {
  if (newTask.value.trim() && selectedTodo.value) {
    selectedTodo.value.tasks.push({ text: newTask.value.trim(), done: false })
    newTask.value = ''
  }
}

function toggleDone(taskIndex) {
  const task = selectedTodo.value.tasks[taskIndex]
  task.done = !task.done
}

function deleteTask(taskIndex) {
  selectedTodo.value.tasks.splice(taskIndex, 1)
}

function deleteTodo(index) {
  todos.value.splice(index, 1)
  if (selectedIndex.value === index) {
    selectedIndex.value = null
  } else if (selectedIndex.value > index) {
    selectedIndex.value-- // décale le pointeur si besoin
  }
}
</script>
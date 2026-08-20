<template>
  <div class="container mt-4">
    <!-- Кнопка установки PWA -->
    <div v-if="installPrompt && !isStandalone" class="mb-4 text-center">
      <button class="btn btn-primary" @click="installApp">
        💾 Установить приложение
      </button>
    </div>

    <div class="card mb-4">
      <div class="card-header">Добавить мальчика</div>
      <div class="card-body">
        <form @submit.prevent="quickAddMan" class="mb-3">
          <p class="add-man-intro mb-2">
            Если он воображаемый или ещё не знает, что он твой - это не проблема
          </p>
          <input
              v-model="newManName"
              type="text"
              class="form-control mb-2"
              placeholder="Просто друг Вася"
              required
          />
          <div class="text-center">
            <button type="submit" class="btn btn-primary">Добавить</button>
          </div>
        </form>
        <router-link to="/men" class="btn btn-link">Список запасных вариантов</router-link>
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">Кто нас обидел?</label>
      <select v-model="selectedManId" class="form-select" @change="changeMan" required>
        <option value="" disabled>Выберите</option>
        <option v-for="man in menStore.men" :key="man.id" :value="man.id">
          {{ man.name }}
        </option>
      </select>
      <div v-if="menStore.men.length === 0" class="alert alert-warning mt-2">
        Сначала добавьте кого-то
      </div>
    </div>

    <ul class="nav nav-tabs">
      <li class="nav-item" v-for="(category, index) in offenseReasons.categories" :key="category.id">
        <button
            class="nav-link"
            :class="{ active: activeCategory === category.id }"
            @click="activeCategory = category.id"
        >
          {{ category.name }}
        </button>
      </li>
    </ul>

    <div class="mt-3">
      <div v-for="reason in activeCategoryReasons" :key="reason.id" class="card mb-2"
           :class="{ 'flash-highlight': flashReasonId === reason.id }">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <div class="fw-bold">{{ reason.text }}</div>
            <div class="text-muted small">{{ reason.description }}</div>
          </div>
          <button
              v-if="selectedManId"
              class="btn btn-danger btn-sm ms-3"
              @click="addOffense(reason.id)"
          >
            Обидеться
          </button>
        </div>
      </div>
      <div v-if="activeCategoryReasons.length === 0" class="text-muted">
        В этой категории пока нет причин.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useMenStore } from '../stores/men';
import { useOffensesStore } from '../stores/offenses';
import offenseReasons from '../data/offenseReasons.json';
import { useCurrentManStore } from '../stores/currentMan';

const menStore = useMenStore();
const offensesStore = useOffensesStore();
const currentManStore = useCurrentManStore();

const newManName = ref('');
const selectedManId = ref('');
const activeCategory = ref(offenseReasons.categories[0]?.id || '');
const flashReasonId = ref(null);

const installPrompt = ref(null);
const isStandalone = ref(false);
let flashTimer = null; // для хранения setTimeout

function checkStandalone() {
  isStandalone.value =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
}

function onBeforeInstallPrompt(e) {
  e.preventDefault();
  installPrompt.value = e;
}

function onAppInstalled() {
  installPrompt.value = null;
  checkStandalone();
}

async function installApp() {
  if (!installPrompt.value) return;
  installPrompt.value.prompt();
  const { outcome } = await installPrompt.value.userChoice;
  if (outcome === 'accepted') {
    installPrompt.value = null;
  }
}

onMounted(() => {
  menStore.loadMen();
  offensesStore.loadOffenses();

  checkStandalone();
  window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  window.addEventListener('appinstalled', onAppInstalled);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  window.removeEventListener('appinstalled', onAppInstalled);

  if (flashTimer) clearTimeout(flashTimer);
});

const activeCategoryReasons = computed(() => {
  const category = offenseReasons.categories.find(c => c.id === activeCategory.value);
  return category ? category.reasons : [];
});

async function quickAddMan() {
  if (!newManName.value.trim()) return;
  const newId = await menStore.addMan(newManName.value);
  newManName.value = '';
  if (newId) {
    selectedManId.value = newId;
    currentManStore.setCurrentMan(newId);
  }
}

function changeMan() {
  if (selectedManId.value) {
    currentManStore.setCurrentMan(selectedManId.value);
  }
}

async function addOffense(reasonId) {
  if (!selectedManId.value) {
    alert('Выберите мужчину');
    return;
  }

  triggerFlash(reasonId);

  await offensesStore.addOffense({
    manId: selectedManId.value,
    reasonId: reasonId,
    customReason: null
  });
}

function triggerFlash(reasonId) {
  if (flashTimer) {
    clearTimeout(flashTimer);
  }

  flashReasonId.value = reasonId;

  flashTimer = setTimeout(() => {
    if (flashReasonId.value === reasonId) {
      flashReasonId.value = null;
    }
    flashTimer = null;
  }, 600);
}
</script>
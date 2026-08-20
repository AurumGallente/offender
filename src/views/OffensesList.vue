<template>
  <div class="container mt-4">
    <h1>История обид</h1>
    <router-link to="/" class="btn btn-outline-secondary mb-3">Назад</router-link>

    <div class="mb-3">
      <button
          class="btn btn-outline-danger"
          :disabled="selectedIds.length === 0"
          @click="forgiveSelected"
      >
        Простить выбранное ({{ selectedIds.length }})
      </button>
    </div>

    <div v-if="offensesStore.loading" class="text-muted">Загрузка...</div>
    <div v-else-if="offensesStore.offenses.length === 0" class="alert alert-info">
      Пока нет записей обид.
    </div>
    <table v-else class="table table-striped">
      <thead>
      <tr>
        <th scope="col" style="width: 40px;">
          <input
              type="checkbox"
              class="form-check-input"
              :checked="allSelected"
              @change="toggleSelectAll"
          />
        </th>
        <th scope="col">Мужчина</th>
        <th scope="col">Причина</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="offense in offensesStore.offenses" :key="offense.id">
        <td>
          <input
              type="checkbox"
              class="form-check-input"
              :checked="selectedIds.includes(offense.id)"
              @change="toggleSelect(offense.id)"
          />
        </td>
        <td>
          <p>{{ getManName(offense.manId) }}</p>
          <p>{{ formatTimestamp(offense.timestamp) }}</p>
        </td>
        <td>
          {{ formatReason(offense) }}
          <button
              class="btn btn-sm btn-outline-danger"
              @click="forgiveOne(offense.id)"
          >
            Простить
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMenStore } from '../stores/men';
import { useOffensesStore } from '../stores/offenses';
import offenseReasons from '../data/offenseReasons.json';

const menStore = useMenStore();
const offensesStore = useOffensesStore();

const selectedIds = ref([]);

onMounted(() => {
  menStore.loadMen();
  offensesStore.loadOffenses();
});

const allSelected = computed(() => {
  return offensesStore.offenses.length > 0 &&
      offensesStore.offenses.every(o => selectedIds.value.includes(o.id));
});

function toggleSelect(id) {
  const index = selectedIds.value.indexOf(id);
  if (index === -1) {
    selectedIds.value.push(id);
  } else {
    selectedIds.value.splice(index, 1);
  }
}

function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function toggleSelectAll() {
  if (allSelected.value) {
    selectedIds.value = [];
  } else {
    selectedIds.value = offensesStore.offenses.map(o => o.id);
  }
}

async function forgiveOne(id) {
  await offensesStore.deleteOffense(id);
  selectedIds.value = selectedIds.value.filter(selId => selId !== id);
}

async function forgiveSelected() {
  if (selectedIds.value.length === 0) return;
  await offensesStore.deleteOffenses(selectedIds.value);
  selectedIds.value = [];
}

function getManName(manId) {
  const man = menStore.men.find(m => m.id === manId);
  return man ? man.name : 'Удалён';
}

function formatReason(offense) {
  if (offense.customReason) return offense.customReason;
  if (offense.reasonId) {
    for (const category of offenseReasons.categories) {
      const reason = category.reasons.find(r => r.id === offense.reasonId);
      if (reason) return reason.text;
    }
  }
  return 'Неизвестная причина';
}
</script>
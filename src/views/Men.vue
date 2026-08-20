<template>
  <div class="container mt-4">
    <h1>Мальчики</h1>

    <form @submit.prevent="addMan" class="row g-3 mb-4">
      <div class="col-xs-12">
        <input
            v-model="newManName"
            type="text"
            class="form-control"
            placeholder="Андрюша, просто знакомый"
            required
        />
      </div>
      <div class="col-auto">
        <button type="submit" class="btn btn-primary">Добавить</button>
      </div>
    </form>

    <div v-if="menStore.loading" class="text-muted">Загрузка...</div>
    <ul v-else class="list-group">
      <li
          v-for="man in menStore.sortedMen"
          :key="man.id"
          class="list-group-item"
      >
        <div v-if="editingId !== man.id" class="d-flex justify-content-between align-items-center">
          <span>{{ man.name }}</span>
          <div class="d-flex gap-1">
            <button class="btn btn-sm btn-outline-secondary" @click="startEdit(man)">
              Изменить
            </button>
            <button class="btn btn-sm btn-outline-danger" @click="deleteMan(man.id)">
              Удалить
            </button>
          </div>
        </div>

        <div v-else>
          <p>Может, и правда ему изменить?</p>
          <input
              v-model="editingName"
              type="text"
              class="form-control mb-2"
              @keyup.enter="saveEdit(man.id)"
          />
          <div class="d-flex gap-1">
            <button class="btn btn-sm btn-success" @click="saveEdit(man.id)">
              Я подумаю
            </button>
            <button class="btn btn-sm btn-outline-danger" @click="deleteMan(man.id)">
              Всё нормально!
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMenStore } from '../stores/men';

const menStore = useMenStore();

const newManName = ref('');
const editingId = ref(null);
const editingName = ref('');

onMounted(() => {
  menStore.loadMen();
});

async function addMan() {
  if (!newManName.value.trim()) return;
  await menStore.addMan(newManName.value);
  newManName.value = '';
}

function startEdit(man) {
  editingId.value = man.id;
  editingName.value = man.name;
}

async function saveEdit(id) {
  if (!editingName.value.trim()) return;
  await menStore.updateMan(id, editingName.value);
  editingId.value = null;
  editingName.value = '';
}

async function deleteMan(id) {
  if (confirm('Удалить мужчину и все его обиды?')) {
    await menStore.deleteMan(id);
  }
}
</script>
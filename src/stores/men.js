import { defineStore } from 'pinia';
import { db } from '../db';

export const useMenStore = defineStore('men', {
    state: () => ({
        men: [],
        loading: false,
        error: null
    }),
    getters: {
        getManById: (state) => (id) => state.men.find(man => man.id === id),
        sortedMen: (state) => [...state.men].sort((a, b) => a.name.localeCompare(b.name))
    },
    actions: {
        async loadMen() {
            this.loading = true;
            this.error = null;
            try {
                this.men = await db.men.toArray();
            } catch (e) {
                this.error = e.message;
                console.error('Ошибка загрузки мужчин:', e);
            } finally {
                this.loading = false;
            }
        },
        async addMan(name) {
            const trimmed = name.trim();
            if (!trimmed) return;
            try {
                const id = await db.men.add({ name: trimmed, createdAt: new Date() });
                await this.loadMen();
                return id;
            } catch (e) {
                this.error = e.message;
                console.error('Ошибка добавления мужчины:', e);
            }
        },
        async updateMan(id, newName) {
            const trimmed = newName.trim();
            if (!trimmed) return;
            try {
                await db.men.update(id, { name: trimmed });
                await this.loadMen();
            } catch (e) {
                this.error = e.message;
            }
        },
        async deleteMan(id) {
            try {
                await db.men.delete(id);
                await db.offenses.where('manId').equals(id).delete();
                await this.loadMen();
            } catch (e) {
                this.error = e.message;
            }
        }
    }
});
import { defineStore } from 'pinia';
import { db } from '../db';

export const useOffensesStore = defineStore('offenses', {
    state: () => ({
        offenses: [],
        loading: false,
        error: null
    }),
    getters: {
        offensesByMan: (state) => (manId) => state.offenses.filter(o => o.manId === manId),
        totalOffenses: (state) => state.offenses.length,
    },
    actions: {
        async loadOffenses() {
            this.loading = true;
            this.error = null;
            try {
                this.offenses = await db.offenses.toArray();
                // Сортируем по убыванию timestamp (свежие сверху)
                this.offenses.sort((a, b) => b.timestamp - a.timestamp);
            } catch (e) {
                this.error = e.message;
            } finally {
                this.loading = false;
            }
        },
        async addOffense({ manId, reasonId, customReason }) {
            try {
                const timestamp = new Date();
                await db.offenses.add({
                    manId,
                    reasonId: reasonId || null,
                    customReason: customReason || null,
                    timestamp
                });
                await this.loadOffenses();
                return timestamp;
            } catch (e) {
                this.error = e.message;
            }
        },
        async deleteOffense(id) {
            try {
                await db.offenses.delete(id);
                await this.loadOffenses();
            } catch (e) {
                this.error = e.message;
            }
        }
    }
});
import { defineStore } from 'pinia';
import { useMenStore } from './men';

export const useCurrentManStore = defineStore('currentMan', {
    state: () => ({
        currentManId: null,
    }),
    getters: {
        currentMan: (state) => {
            const menStore = useMenStore();
            return menStore.getManById(state.currentManId) || null;
        },
        currentManName: (state) => {
            const man = useCurrentManStore().currentMan;
            return man ? man.name : '';
        }
    },
    actions: {
        setCurrentMan(id) {
            this.currentManId = id;
        },
        clearCurrentMan() {
            this.currentManId = null;
        }
    }
});
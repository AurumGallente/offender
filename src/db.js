import Dexie from 'dexie';

export const db = new Dexie('OffenderDatabase');

db.version(1).stores({
    men: '++id, name, createdAt',
    offenses: '++id, manId, reasonId, customReason, timestamp'
});
import { openDB } from 'idb';

const DB_NAME = 'StoryAppDB';
const DB_VERSION = 1;
const STORE_NAME = 'stories';

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export async function saveStory(story) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.store.put(story);
  await tx.done;
}

export async function saveStories(stories = []) {
  if (!Array.isArray(stories)) return;
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  stories.forEach((story) => tx.store.put(story));
  await tx.done;
}

export async function getAllStories() {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
}

export async function deleteStory(id) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.store.delete(id);
  await tx.done;
}

export async function deleteAllStories() {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.clear();
  await tx.done;
}

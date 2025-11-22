// This is a placeholder file. In a real-world scenario, you would use a library like `idb` for a more robust implementation.
const DB_NAME = 'BhashaMitraDB';
const STORE_NAME = 'dictionary';
const DB_VERSION = 1;

let db: IDBDatabase;

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Database error:', request.error);
      reject('Error opening database');
    };

    request.onsuccess = (event) => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'word' });
      }
    };
  });
}

export async function addWord(word: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add({ word });

    request.onsuccess = () => resolve();
    request.onerror = () => {
      // Ignore "ConstraintError" which happens if the word already exists.
      if (request.error?.name === 'ConstraintError') {
        resolve();
      } else {
        console.error('Error adding word:', request.error);
        reject(request.error);
      }
    };
  });
}

export async function addWords(words: string[]): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        let completed = 0;
        const total = words.length;

        if (total === 0) {
            resolve();
            return;
        }

        words.forEach(word => {
            const request = store.add({ word });
            request.onsuccess = () => {
                completed++;
                if (completed === total) {
                    resolve();
                }
            };
            request.onerror = () => {
                // Ignore "ConstraintError" for duplicates
                if (request.error?.name === 'ConstraintError') {
                    completed++;
                    if (completed === total) {
                        resolve();
                    }
                } else {
                    console.error(`Error adding word: ${word}`, request.error);
                    // Don't reject the whole batch for one error, just log it
                    completed++;
                    if (completed === total) {
                        resolve();
                    }
                }
            };
        });

        transaction.oncomplete = () => {
             // This might be redundant, but ensures resolution
            if (completed === total) {
                resolve();
            }
        };

        transaction.onerror = () => {
            reject(transaction.error);
        };
    });
}


export async function removeWord(word: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(word);

    request.onsuccess = () => resolve();
    request.onerror = () => {
      console.error('Error removing word:', request.error);
      reject(request.error);
    };
  });
}

export async function getDictionary(): Promise<string[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result.map(item => item.word));
    };
    request.onerror = () => {
      console.error('Error getting dictionary:', request.error);
      reject(request.error);
    };
  });
}

export async function isWordInDictionary(word: string): Promise<boolean> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(word);

        request.onsuccess = () => {
            resolve(!!request.result);
        };
        request.onerror = () => {
            console.error('Error checking word:', request.error);
            reject(request.error);
        };
    });
}

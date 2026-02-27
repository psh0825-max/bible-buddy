const DB_NAME = 'bible-buddy'
const DB_VERSION = 1

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains('profile')) db.createObjectStore('profile', { keyPath: 'id' })
      if (!db.objectStoreNames.contains('stories')) db.createObjectStore('stories', { keyPath: 'storyId' })
      if (!db.objectStoreNames.contains('quizScores')) db.createObjectStore('quizScores', { keyPath: 'storyId' })
      if (!db.objectStoreNames.contains('verses')) db.createObjectStore('verses', { keyPath: 'verseId' })
      if (!db.objectStoreNames.contains('attendance')) db.createObjectStore('attendance', { keyPath: 'date' })
      if (!db.objectStoreNames.contains('badges')) db.createObjectStore('badges', { keyPath: 'badgeId' })
      if (!db.objectStoreNames.contains('coloring')) db.createObjectStore('coloring', { keyPath: 'id', autoIncrement: true })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function dbGet<T>(store: string, key: string): Promise<T | undefined> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly')
    const req = tx.objectStore(store).get(key)
    req.onsuccess = () => resolve(req.result as T)
    req.onerror = () => reject(req.error)
  })
}

export async function dbPut(store: string, value: unknown): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite')
    tx.objectStore(store).put(value)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function dbGetAll<T>(store: string): Promise<T[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly')
    const req = tx.objectStore(store).getAll()
    req.onsuccess = () => resolve(req.result as T[])
    req.onerror = () => reject(req.error)
  })
}

export async function dbDelete(store: string, key: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite')
    tx.objectStore(store).delete(key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// Helper: record today's attendance
export async function recordAttendance() {
  const today = new Date().toISOString().split('T')[0]
  await dbPut('attendance', { date: today, visited: true })
}

// Helper: get streak
export async function getStreak(): Promise<number> {
  const records = await dbGetAll<{ date: string }>('attendance')
  const dates = records.map(r => r.date).sort().reverse()
  if (dates.length === 0) return 0
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const ds = d.toISOString().split('T')[0]
    if (dates.includes(ds)) streak++
    else if (i > 0) break
  }
  return streak
}

// Helper: check & award badge
export async function awardBadge(badgeId: string) {
  const existing = await dbGet('badges', badgeId)
  if (!existing) {
    await dbPut('badges', { badgeId, earnedAt: new Date().toISOString() })
    return true // newly awarded
  }
  return false
}

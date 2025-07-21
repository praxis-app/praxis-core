export const indexedDBWorkerFactory = (options?: WorkerOptions | undefined) => {
  return new Worker(
    new URL('./indexed-db.worker.ts', import.meta.url),
    /* @vite-ignore */
    { type: 'module', ...options },
  );
};

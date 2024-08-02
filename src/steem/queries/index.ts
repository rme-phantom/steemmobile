import {QueryClient} from '@tanstack/react-query';
import {PersistQueryClientProviderProps} from '@tanstack/react-query-persist-client';
import {MMKV} from 'react-native-mmkv';
import {createSyncStoragePersister} from '@tanstack/query-sync-storage-persister';

export const initQueryClient = () => {
  // const asyncStoragePersister = createAsyncStoragePersister({
  //   storage: AsyncStorage,
  // });

  const storage = new MMKV();

  const clientStorage = {
    setItem: (key, value) => {
      storage.set(key, value);
    },
    getItem: key => {
      const value = storage.getString(key);
      return value === undefined ? null : value;
    },
    removeItem: key => {
      storage.delete(key);
    },
  };

  const clientPersister = createSyncStoragePersister({storage: clientStorage});

  const client = new QueryClient({
    //Query client configurations go here...
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 60 * 24 * 6, // 7 days cache timer
        retry: 3,
      },
    },
  });

  return {
    client,
    persistOptions: {persister: clientPersister},
  } as PersistQueryClientProviderProps;
};

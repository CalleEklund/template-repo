import { useContext } from 'react';
import { ApiClientContext } from '../providers/ApiClientProvider';

export const useApiClient = () => useContext(ApiClientContext);

import { handleError } from '@/utils/handle-error.util';
import type { HTTP_RESPONSE } from '@/types';

export const handleAsync = async <T, P = unknown>(fn: () => Promise<T>) => {
    try {
        const data = (await fn()) as HTTP_RESPONSE<T> & P;
        return { data, error: null };
    } catch (error) {
        return { error: handleError(error), data: null };
    }
};

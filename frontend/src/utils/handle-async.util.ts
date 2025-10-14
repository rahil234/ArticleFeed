import { handleError } from '@/utils/handle-error.util';
import type { HTTP_RESPONSE } from '@/types';

type Success<T> = { data: HTTP_RESPONSE<T>; error: null };
type Failure = { data: null; error: ReturnType<typeof handleError> };

export const handleAsync = async <T>(
    fn: () => Promise<HTTP_RESPONSE<T>>,
): Promise<Success<T> | Failure> => {
    try {
        const data = await fn();
        return { data, error: null };
    } catch (err) {
        return { data: null, error: handleError(err) };
    }
};

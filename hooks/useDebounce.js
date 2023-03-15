import { useEffect } from 'react';
import useTimeoutFn from './useTimeoutFn';

export default function useDebounce(fn, ms, deps) {
    const [run, clear] = useTimeoutFn(fn, ms);

    useEffect(run, deps);

    return clear;
}
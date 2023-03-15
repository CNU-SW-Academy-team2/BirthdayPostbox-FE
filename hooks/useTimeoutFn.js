import { useCallback, useEffect, useRef } from "react";

// 함수 호출 방식
export default function useTimeoutFn(
    fn,
    ms
) {
    const timeoutId = useRef();
    const callback = useRef(fn);

    useEffect(() => {
        callback.current = fn;
    }, [fn]);

    const run = useCallback(() => {
        timeoutId.current && clearTimeout(timeoutId.current);

        timeoutId.current = setTimeout(() => {
            callback.current();
        }, ms);
    }, [ms]);

    const clear = useCallback(() => {
        timeoutId.current && clearTimeout(timeoutId.current);
    }, []);

    useEffect(() => clear, [clear]);

    return [run, clear];
}
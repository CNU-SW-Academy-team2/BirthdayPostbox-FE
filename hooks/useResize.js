import { useEffect, useRef } from "react";

export default function useResize(handler) {
    const savedHandler = useRef(handler);
    const ref = useRef(null);

    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new ResizeObserver((entries) => {
            savedHandler.current(entries[0].contentRect);
        });

        observer.observe(element);

        return () => {
            observer.disconnect();
        }
    }, [ref])

    return ref;
}
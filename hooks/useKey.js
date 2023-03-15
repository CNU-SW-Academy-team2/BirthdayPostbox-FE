import { useCallback, useEffect } from "react";

export default function useKey (event = 'keydown', targetKey, handler)  {
    const handleKey = useCallback(({ key }) => {
        if (key === targetKey) {
            handler();
        }
    }, [targetKey, handler]);

    useEffect(() => {
        window.addEventListener(event, handleKey);

        return () => {
            window.removeEventListener(event, handleKey);
        }
    }, [event, targetKey, handleKey])
}
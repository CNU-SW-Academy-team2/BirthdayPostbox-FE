import { useCallback, useRef, useState } from "react";

export default function useRafState (initialState) {
    const frame = useRef(0);
    const [state, setState] = useState(initialState);

    const setRafState = useCallback((value) => {
        cancelAnimationFrame(frame.current);

        frame.current = requestAnimationFrame(() => {
            setState(value);
        })
    }, []);

    return [state, setRafState]
};
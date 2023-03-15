import { useEffect } from "react";
import useIntervalFn from "./useIntervalFn";

export default function useInterval(fn, ms) {
    const [run, clear] = useIntervalFn(fn, ms);

    useEffect(() => {
        run();
        return clear;
    }, [run, clear]);

    return clear;
}
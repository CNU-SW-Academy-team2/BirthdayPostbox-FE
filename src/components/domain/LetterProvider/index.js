import { createContext } from "react";

const LetterContext = createContext();

export default function LetterProvider({ children }) {
    return (
        <LetterContext>{children}</LetterContext>
    );
}
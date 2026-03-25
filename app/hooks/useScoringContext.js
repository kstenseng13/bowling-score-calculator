import { useContext } from "react";
import { ScoringContext } from "../context/ScoringContext";

export const useScoringContext = () => {
    const context = useContext(ScoringContext);
    
    if (!context) {
        throw new Error(
            "useScoringContext must be used within a component wrapped by ScoringContext.Provider"
        );
    }
    
    return context;
};
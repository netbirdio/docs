import {createContext, useContext, useEffect, useState} from "react";

const NavigationStateContext = createContext([]);

export function NavigationStateProvider({ children }) {
    const [state, setState] = useState(0);
    const update =() =>setState((prev)=>prev+1)
    useEffect(() => setState(0), []);
    return (
        <NavigationStateContext.Provider value={[state, update]}>
            {children}
        </NavigationStateContext.Provider>
    );
}

export function useNavigationState() {
    const context = useContext(NavigationStateContext);
    if (context === undefined) {
        throw new Error(
            'useNavigationState must be used within a NavigationStateProvider'
        );
    }
    return context;
}
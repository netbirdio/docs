import {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";

const NavigationStateContext = createContext([]);

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function NavigationStateProvider({ children,index }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();

    const setActiveHighlight = async (groupTitle = undefined) => {
        await timeout(250);

        const links = [];
        document.querySelectorAll(`.outer-wrapper-${index} [data-nb-link]`).forEach((link) => {
            links.push(link.getAttribute('data-nb-link'));
        });
        links.shift();

        const activeGroupTitle = groupTitle ? groupTitle : document.querySelector(`.outer-wrapper-${index} [data-nb-active="1"]`)?.getAttribute('data-nb-link');
        const activeIndex = links.findIndex((link) => link === "1");
        const activeGroupIndex = links.findIndex((link) => link === activeGroupTitle);

        if(activeGroupIndex !== -1 && activeIndex === -1){
            setActiveIndex(activeGroupIndex);
        }else if(activeIndex !== -1){
            setActiveIndex(activeIndex);
        }
        return Promise.resolve();
    }

    useEffect(() => {
        setActiveHighlight().then();
    }, [router.pathname]);

    return (
        <NavigationStateContext.Provider value={[activeIndex, setActiveHighlight]}>
            <div className={`outer-wrapper-${index}`}>
                {children}
            </div>
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
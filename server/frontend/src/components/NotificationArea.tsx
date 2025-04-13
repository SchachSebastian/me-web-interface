import React from "react";
import ReactDOM from "react-dom";
import { useCraftingResponses } from '../requests/useMeItems';
export const NotificationArea = () => {
    const [craftingResponses, setCraftingResponses] = useCraftingResponses();

    const firstResponse = craftingResponses[craftingResponses.length - 1];
    if (!firstResponse) return <></>;

    const isSuccess = firstResponse.success;

    return ReactDOM.createPortal(
        <div className="absolute bottom-5 right-5 z-[999] pointer-events-none max-w-[min(400px,calc(100%-2.5rem))] max-h-screen overflow-hidden">
            <div
                className={`
                    px-4 py-3 rounded-lg shadow-lg transition-opacity
                    ${isSuccess ? "border-green-500" : "border-red-500"}
                    border-2 bg-black/90 text-white animate-achievement
                    font-mono
                `}
                onAnimationEnd={() =>
                    setCraftingResponses([])
                }
            >
                <div className="font-bold text-lg">
                    Successfully started crafting {firstResponse.fingerprint}
                </div>
                <div className="text-sm opacity-80">
                    Crafting {firstResponse.count}
                </div>
            </div>

            <style>
                {`
                    @keyframes fadeInOut {  
                        0% { opacity: 0; transform: translateY(10px); }
                        10% { opacity: 1; transform: translateY(0); }
                        90% { opacity: 1; transform: translateY(0); }
                        100% { opacity: 0; transform: translateY(-10px); }
                    }

                    .animate-achievement {
                        animation: fadeInOut 3s ease-in-out forwards;
                    }
                `}
            </style>
        </div>,
        document.body
    );
};

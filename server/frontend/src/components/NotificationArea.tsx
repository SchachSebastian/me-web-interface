import { useStore } from "@nanostores/react";
import { $items } from "diff-store";
import ReactDOM from "react-dom";
import { useCraftingResponses } from "../requests/useCraftingResponses";
export const NotificationArea = () => {
    const [craftingResponses, setCraftingResponses] = useCraftingResponses();
    const items = useStore($items);

    const firstResponse = craftingResponses[craftingResponses.length - 1];
    if (!firstResponse) return <></>;

    const item = items.find((item) => item.id === firstResponse.id);
    const name = item?.displayName ?? (firstResponse.id as string);

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
                onAnimationEnd={() => setCraftingResponses([])}
            >
                <div className="font-bold text-lg">
                    {firstResponse.success
                        ? "Successfully started crafting"
                        : "Failed to craft"}{" "}
                    {name}
                </div>
                <div className="text-sm opacity-80">
                    Count: {firstResponse.count}
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

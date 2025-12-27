import {
    createContext,
    useCallback,
    useContext,
    useState,
    ReactNode,
} from "react";
import ReactDOM from "react-dom";

type Notification = {
    id: number;
    header: string;
    message?: string;
    success?: boolean;
};

type NotificationContextType = {
    addNotification: (notification: Omit<Notification, "id">) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error(
            "useNotifications must be used inside NotificationProvider"
        );
    }
    return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback(
        (notification: Omit<Notification, "id">) => {
            setNotifications((prev) => [
                ...prev,
                { ...notification, id: Date.now() },
            ]);
        },
        []
    );

    const removeNotification = (id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}

            {ReactDOM.createPortal(
                <div className="absolute bottom-5 right-5 z-[999] pointer-events-none max-w-[min(400px,calc(100%-2.5rem))] space-y-2">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`
                                px-4 py-3 rounded-lg shadow-lg transition-opacity
                                ${
                                    notification.success
                                        ? "border-green-500"
                                        : "border-red-500"
                                }
                                border-2 bg-black/90 text-white animate-achievement
                                font-mono
                            `}
                            onAnimationEnd={() =>
                                removeNotification(notification.id)
                            }
                        >
                            <div className="font-bold text-lg">{notification.header}</div>
                            {notification.message && (
                                <div className="text-sm opacity-80">
                                    {notification.message}
                                </div>
                            )}
                        </div>
                    ))}

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
            )}
        </NotificationContext.Provider>
    );
};

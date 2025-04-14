import React, { ReactNode } from "react";
import ReactDOM from "react-dom";

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children?: ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return ReactDOM.createPortal(
        <div onClick={handleBackdropClick} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[#c6c6c6] border-white border-8 rounded p-5 flex flex-col max-w-[85%] max-h-[50%] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center sticky top-0 bg-[#c6c6c6] pb-5">
                    <h2 className="text-black text-lg font-bold">{title || "Dialog"}</h2>
                </div>
                {/* Content */}
                <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
        </div>,
        document.body
    );
};

export default Dialog;

import React, { useState } from 'react';

type NumberInputProps = {
    onValueSubmit: (value: number) => void;
};
const buttonStyle = `py-2 bg-purple-800 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2`;

const NumberInput: React.FC<NumberInputProps> = ({ onValueSubmit }) => {
    const [value, setValue] = useState(0);

    const handleIncrement = (amount: number) => {
        setValue((prev) => prev + amount);
    };

    const handleDecrement = (amount: number) => {
        setValue((prev) => {
            if (prev < amount) return 0;
            return prev - amount;
        });
    };

    const handleSubmit = () => {
        onValueSubmit(value);
    };

    return (
        <div className="w-full grid grid-cols-4 gap-2 bg-gray-200 p-4 rounded">
            <button className={"btn"+buttonStyle} onClick={() => handleIncrement(1)}>
                +1
            </button>
            <button className={"btn"+buttonStyle} onClick={() => handleIncrement(10)}>
                +10
            </button>
            <button className={"btn"+buttonStyle} onClick={() => handleIncrement(100)}>
                +100
            </button>
            <button className={"btn"+buttonStyle} onClick={() => handleIncrement(1000)}>
                +1000
            </button>
            <div className="col-span-3 flex items-center justify-center">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(parseInt(e.target.value) || 0)}
                    className="w-4/5 text-center text-lg border border-gray-300 rounded"
                />
            </div>
            <button
                className={"btn col-span-1"+buttonStyle}
                onClick={handleSubmit}
            >
                Next
            </button>
            <button className={"btn"+buttonStyle} onClick={() => handleDecrement(1)}>
                -1
            </button>
            <button className={"btn"+buttonStyle} onClick={() => handleDecrement(10)}>
                -10
            </button>
            <button className={"btn"+buttonStyle} onClick={() => handleDecrement(100)}>
                -100
            </button>
            <button className={"btn"+buttonStyle} onClick={() => handleDecrement(1000)}>
                -1000
            </button>
        </div>
    );
};

export default NumberInput;

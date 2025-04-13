import React, { useState } from 'react';

type NumberInputProps = {
    onValueSubmit: (value: number) => void;
};
const buttonStyle = `bg-[#8b8b8b] text-white rounded hover:bg-[#545353] focus:outline-none focus:ring-2 focus:ring-[#545353] focus:ring-offset-2`;

const NumberInput: React.FC<NumberInputProps> = ({ onValueSubmit }) => {
    const [value, setValue] = useState(1);

    const handleIncrement = (amount: number) => {
        setValue((prev) => prev + amount);
    };

    const handleDecrement = (amount: number) => {
        setValue((prev) => {
            if (prev < amount) return 1;
            return prev - amount;
        });
    };

    const handleSubmit = () => {
        onValueSubmit(value);
    };

    return (
        <div className="w-full grid grid-cols-4 gap-2 bg-gray-200 p-4 rounded">
            <button className={buttonStyle} onClick={() => handleIncrement(1)}>
                +1
            </button>
            <button className={buttonStyle} onClick={() => handleIncrement(10)}>
                +10
            </button>
            <button
                className={buttonStyle}
                onClick={() => handleIncrement(100)}
            >
                +100
            </button>
            <button
                className={buttonStyle}
                onClick={() => handleIncrement(1000)}
            >
                +1000
            </button>
            <div className="col-span-3 flex justify-center">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(parseInt(e.target.value) ?? 1)}
                    className="flex-grow text-center text-lg border border-gray-300 rounded"
                />
            </div>
            <button
                className={buttonStyle}
                onClick={handleSubmit}
            >
                Next
            </button>
            <button className={buttonStyle} onClick={() => handleDecrement(1)}>
                -1
            </button>
            <button className={buttonStyle} onClick={() => handleDecrement(10)}>
                -10
            </button>
            <button
                className={buttonStyle}
                onClick={() => handleDecrement(100)}
            >
                -100
            </button>
            <button
                className={buttonStyle}
                onClick={() => handleDecrement(1000)}
            >
                -1000
            </button>
        </div>
    );
};

export default NumberInput;

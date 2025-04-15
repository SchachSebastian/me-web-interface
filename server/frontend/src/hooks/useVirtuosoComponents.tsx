import { ForwardedRef, forwardRef, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { GridItemProps, GridListProps } from "react-virtuoso";

const calculateColumns = () => {
    const screenWidth = window.innerWidth;
     const minItemWidth = 120;
     const calculatedColumns = Math.max(
         1,
         Math.floor(screenWidth / minItemWidth)
    );
    return calculatedColumns;
}
const useVirtuosoComponents = () => {
    const [columns, setColumns] = useState(calculateColumns());

    useEffect(() => {
        const updateColumns = () => {
            setColumns(calculateColumns());
        };
        updateColumns();
        window.addEventListener("resize", updateColumns);
        return () => window.removeEventListener("resize", updateColumns);
    }, []);
    
    return useMemo(
        () => ({
            List: forwardRef(
                (
                    { children, ...props }: GridListProps,
                    ref: ForwardedRef<HTMLDivElement>
                ) => (
                    <div ref={ref} {...props} className="flex flex-wrap gap-2">
                        {children}
                    </div>
                )
            ),
            Item: ({ children, style, ...props }: GridItemProps) => (
                <div
                    {...props}
                    style={{
                        ...style,
                        width: `calc(${100.0 / columns}% - 0.5rem)`,
                    }}
                    className="flex aspect-square"
                >
                    {children}
                </div>
            ),
        }),
        [columns]
    );
};

export default useVirtuosoComponents;

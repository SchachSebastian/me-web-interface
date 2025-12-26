import Dialog from "./Dialog";

interface Props {
    openHelp: boolean;
    setOpenHelp: (open: boolean) => void;
}

const HelpDialog = (props: Props) => {
    return (
        <Dialog
                isOpen={props.openHelp}
                title={"🔍 How Filtering Works"}
                onClose={() => {
                    props.setOpenHelp(false);
                }}
            >
                <div className="text-black text-base space-y-4">
                    <p>
                        You can filter items by typing search terms into the
                        input field. Filters are{" "}
                        <strong>case-insensitive</strong> and can be combined by
                        separating them with spaces.
                    </p>

                    <div>
                        <h3 className="font-semibold">🧠 Basic Filtering</h3>
                        <p>
                            <strong>Text only</strong> → Matches against the
                            item's <code>displayName</code>.<br />
                            <em>Example:</em> <code>iron</code> finds items like{" "}
                            Iron Ingot, Iron Ore, etc.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">#️⃣ NBT Filtering</h3>
                        <p>
                            <strong>
                                <code>#</code> prefix
                            </strong>{" "}
                            → Searches inside the item's nbt data.
                            <br />
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">🧩 Mod Filtering</h3>
                        <p>
                            <strong>
                                <code>@</code> prefix
                            </strong>{" "}
                            → Filters by the mod name.
                            <br />
                            <em>Example:</em> <code>@mekanism</code> shows items
                            from the Mekanism mod.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">🏷️ Type Filtering</h3>
                        <p>
                            <strong>
                                <code>$</code> prefix
                            </strong>{" "}
                            → Filters by type:
                        </p>
                        <ul className="list-disc list-inside ml-4">
                            <li>
                                <code>$item</code> – only shows items
                            </li>
                            <li>
                                <code>$fluid</code> – only fluids
                            </li>
                            <li>
                                <code>$chemical</code> – only chemicals
                            </li>
                            <li>
                                <code>$craftable</code> – only craftable items
                            </li>
                            <li>
                                <code>$enchanted</code> – only enchanted items
                            </li>
                        </ul>
                        <p>
                            <em>Example:</em> <code>$craftable</code> shows all
                            items that can be crafted.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">🔢 Count Comparison</h3>
                        <p>
                            You can filter based on the{" "}
                            <strong>item count</strong>:
                        </p>
                        <ul className="list-disc list-inside ml-4">
                            <li>
                                <code>&gt;10</code> → Count greater than 10
                            </li>
                            <li>
                                <code>&lt;5</code> → Count less than 5
                            </li>
                            <li>
                                <code>=64</code> → Count exactly 64
                            </li>
                        </ul>
                    </div>
                </div>
        </Dialog>
    );
};
export default HelpDialog;
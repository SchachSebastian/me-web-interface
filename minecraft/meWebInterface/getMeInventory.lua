local ae2 = peripheral.find("meBridge")
local util = require("util")
local getDiff = util.getDiff

local storage = {}

local function cleanDisplayName(displayName)
    displayName = displayName:match("^%s*(.-)%s*$")

    if displayName:sub(1, 1) == "[" then
        displayName = displayName:sub(2)
    end

    if displayName:sub(-1) == "]" then
        displayName = displayName:sub(1, -2)
    end

    return displayName
end

local function getNewInventory()
    local inventory = {}

    local items = ae2.listItems()
    local craftableItems = ae2.listCraftableItems()
    for _, craftableItem in ipairs(craftableItems) do
        if craftableItem.count == 0 then
            table.insert(items, craftableItem)
        end
    end

    for _, item in ipairs(items) do
        local components = nil
        if (next(item.components)) then
            components = item.components
        end

        local new_item = {
            id = item.fingerprint,
            name = item.name,
            fingerprint = item.fingerprint,
            count = item.count,
            displayName = cleanDisplayName(item.displayName),
            components = components,
            isCraftable = item.isCraftable
        }
        table.insert(inventory, new_item)
    end

    local fluids = ae2.listFluids()
    local craftableFluids = ae2.listCraftableFluids()
    for _, craftableFluid in ipairs(craftableFluids) do
        if craftableFluid.count == 0 then
            table.insert(fluids, craftableFluid)
        end
    end
    for _, fluid in ipairs(fluids) do
        local components = nil
        if (next(fluid.components)) then
            components = fluid.components
        end

        local new_fluid = {
            id = fluid.fingerprint .. "#fluid",
            name = fluid.name,
            fingerprint = fluid.fingerprint,
            count = fluid.count/1000,
            displayName = cleanDisplayName(fluid.displayName),
            components = components,
            isCraftable = fluid.isCraftable,
            isFluid = true
        }
        table.insert(inventory, new_fluid)
    end

    local gases = ae2.listGases()
    for _, gas in ipairs(gases) do
        local new_gas = {
            id = gas.name .. "#gas",
            name = gas.name,
            count = gas.count/1000,
            displayName = cleanDisplayName(gas.displayName),
            isCraftable = false,
            isGas = true
        }
        table.insert(inventory, new_gas)
    end

    return inventory
end

local function getMeInventoryDiff()
    local items = getNewInventory()
    local list = {}
    local seenItems = {}

    for _, item in ipairs(items) do
        local item_key = item.id
        local saved_item = storage[item_key] or {}

        local diff = getDiff(saved_item, item)
        if next(diff) then
            diff.id = item.id
            table.insert(list, diff)
        end
        storage[item_key] = item
        seenItems[item_key] = true
    end

    for _, item in pairs(storage) do
        if not seenItems[item.id] then

            table.insert(list, {
                id = item.id,
                count = -1
            })
            storage[item.id] = nil
        end
    end

    print("Sending", #list, "items")

    return list
end

local function resetStorage()
    storage = {}
end

return {
    getMeInventoryDiff = getMeInventoryDiff,
    resetStorage = resetStorage,
};

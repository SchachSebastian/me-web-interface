local bridge = require("bridge")
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

    local items = bridge.getItems()
    local craftableItems = bridge.getCraftableItems()
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
            count = item.count,
            displayName = cleanDisplayName(item.displayName),
            components = components,
            isCraftable = item.isCraftable
        }
        table.insert(inventory, new_item)
    end

    local fluids = bridge.getFluids()
    local craftableFluids = bridge.getCraftableFluids()
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
            id = fluid.fingerprint,
            name = fluid.name,
            count = fluid.count/1000,
            displayName = cleanDisplayName(fluid.displayName),
            components = components,
            isCraftable = fluid.isCraftable,
            isFluid = true
        }
        table.insert(inventory, new_fluid)
    end

    local chemicals = bridge.getChemicals()
    local craftableChemicals = bridge.getCraftableChemicals()
    for _, craftableChemical in ipairs(craftableChemicals) do
        if craftableChemical.count == 0 then
            table.insert(chemicals, craftableChemical)
        end
    end

    for _, chemical in ipairs(chemicals) do
        local new_gas = {
            id = chemical.fingerprint,
            name = chemical.name,
            count = chemical.count/1000,
            displayName = cleanDisplayName(chemical.displayName),
            isCraftable = false,
            isChemical = true
        }
        table.insert(inventory, new_gas)
    end

    return inventory
end

local function getInventoryDiff()
    if (bridge == nil or not bridge.isConnected() or not bridge.isOnline()) then
        return {}
    end
    
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
    return list
end

local function resetStorage()
    storage = {}
end

return {
    getInventoryDiff = getInventoryDiff,
    resetStorage = resetStorage,
};

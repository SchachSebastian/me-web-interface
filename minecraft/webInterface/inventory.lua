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

local function parseItem(item)
    local components = nil
    if (next(item.components)) then
        components = item.components
    end

    local new_item = {
        id = item.fingerprint .. 'i',
        name = item.name,
        count = item.count,
        displayName = cleanDisplayName(item.displayName),
        components = components,
        isCraftable = item.isCraftable
    }
    return new_item
end

local function parseFluid(fluid)
    local components = nil
    if (next(fluid.components)) then
        components = fluid.components
    end

    local new_fluid = {
        id = fluid.fingerprint .. 'f',
        name = fluid.name,
        count = fluid.count / 1000,
        displayName = cleanDisplayName(fluid.displayName),
        components = components,
        isCraftable = fluid.isCraftable,
        isFluid = true
    }
    return new_fluid
end

local function parseChemical(chemical)
    local new_chemical = {
        id = chemical.fingerprint .. 'c',
        name = chemical.name,
        count = chemical.count / 1000,
        displayName = cleanDisplayName(chemical.displayName),
        isCraftable = false,
        isChemical = true
    }

    return new_chemical
end

local function getNewInventory()
    local inventory = {}

    local items = bridge.getItems()
    local craftableItems = bridge.getCraftableItems()
    for _, craftableItem in ipairs(craftableItems) do
        if craftableItem.count == 0 then
            table.insert(items, parseItem(craftableItem))
        end
    end

    for _, item in ipairs(items) do
        table.insert(inventory, parseItem(item))
    end

    local fluids = bridge.getFluids()
    local craftableFluids = bridge.getCraftableFluids()
    for _, craftableFluid in ipairs(craftableFluids) do
        if craftableFluid.count == 0 then
            table.insert(fluids, parseFluid(craftableFluid))
        end
    end
    for _, fluid in ipairs(fluids) do
        table.insert(inventory, parseFluid(fluid))
    end

    local chemicals = bridge.getChemicals()
    local craftableChemicals = bridge.getCraftableChemicals()
    for _, craftableChemical in ipairs(craftableChemicals) do
        if craftableChemical.count == 0 then
            table.insert(chemicals, parseChemical(craftableChemical))
        end
    end

    for _, chemical in ipairs(chemicals) do
        table.insert(inventory, parseChemical(chemical))
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
        local saved_item = storage[item.id] or {}

        local diff = getDiff(saved_item, item)
        if next(diff) then
            diff.id = item.id
            table.insert(list, diff)
        end
        storage[item.id] = item
        seenItems[item.id] = true
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
    resetStorage = resetStorage
};

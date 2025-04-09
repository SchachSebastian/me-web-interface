local ae2 = peripheral.wrap("bottom")

local storage = {}

local function deepEqual(a, b)
    if type(a) ~= type(b) then
        return false
    end

    if type(a) == "table" then
        for key, value in pairs(a) do
            if not deepEqual(value, b[key]) then
                return false
            end
        end

        for key, value in pairs(b) do
            if not deepEqual(value, a[key]) then
                return false
            end
        end

        return true
    else
        return a == b
    end
end

local function getItemDiff(old, new)
    local diff = {}

    for key, value in pairs(new) do
        if not deepEqual(value, old[key]) then
            diff[key] = new[key]
        end
    end

    return diff
end

local function getNewInventory()
    local inventory = {}

    local items = ae2.listItems()
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
            displayName = item.displayName,
            components = components,
            isCraftable = item.isCraftable
        }
        table.insert(inventory, new_item)
    end

    local fluids = ae2.listFluids()
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
            displayName = fluid.displayName,
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
            displayName = gas.displayName,
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

        local diff = getItemDiff(saved_item, item)
        if next(diff) then
            diff.id = item.id
            table.insert(list, diff)
        end
        storage[item_key] = item
        seenItems[item_key] = true
    end

    for key, item in ipairs(storage) do
        if not seenItems[key] then

            table.insert(list, {
                id = item.id,
                amount = 0
            })
            storage[key] = nil
        end
    end

    print("Sending", #list, "items")

    return list
end

return getMeInventoryDiff;

local ae2 = peripheral.wrap("bottom")

local storage = {}

local function getItemKey(item)
    return item.name .. "|" .. textutils.serialiseJSON(item.components, {
        allow_repetitions = true
    })
end

local function getItemDiff(old, new)
    local diff = {}

    for key, value in pairs(new) do
        if key ~= "components" and value ~= old[key] then
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
            name = fluid.name,
            fingerprint = fluid.fingerprint,
            count = fluid.count,
            displayName = fluid.displayName,
            components = components,
            isCraftable = fluid.isCraftable,
            isFluid = true
        }
        table.insert(inventory, new_fluid)
    end

    local gases = ae2.listGases()
    for _, gas in ipairs(gases) do
        local components = nil
        if (next(gas.components)) then
            components = gas.components
        end

        local new_fluid = {
            name = gas.name,
            fingerprint = gas.fingerprint,
            count = gas.count,
            displayName = gas.displayName,
            components = components,
            isCraftable = gas.isCraftable,
            isGas = true
        }
        table.insert(inventory, new_fluid)
    end

    return inventory
end

local function getMeInventory()
    local items = getNewInventory()
    local list = {}
    local seenItems = {}

    for _, item in ipairs(items) do
        local item_key = getItemKey(item)
        local saved_item = storage[item_key] or {}

        local diff = getItemDiff(saved_item, item)
        if next(diff) then
            diff.name = item.name
            diff.components = item.components
            table.insert(list, diff)
        end
        storage[item_key] = item
        seenItems[item_key] = true
    end

    for key, item in ipairs(storage) do
        if not seenItems[key] then

            table.insert(list, {
                components = item.components,
                name = item.name,
                amount = 0
            })
            storage[key] = nil
        end
    end

    print("Sending", #list, "items")

    return list
end

return getMeInventory;

local ae2 = peripheral.wrap("bottom")
local storage = {}

local function getItemKey(item)
    return item.name .. "|" .. textutils.serialiseJSON(item.components, {
        allow_repetitions = true,
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

local function tableLength(T)
    local count = 0
    for _ in pairs(T) do
        count = count + 1
    end
    return count
end

local function getMeItems()
    local items = ae2.listItems()
    local list = {}
    local seenItems = {}

    for _, item in ipairs(items) do
        local item_key = getItemKey(item)
        local saved_item = storage[item_key] or {}

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

        local diff = getItemDiff(saved_item, new_item)
        if next(diff) then
            diff.name = new_item.name
            diff.components = new_item.components
            table.insert(list, diff)
        end
        storage[item_key] = new_item
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

    print(tableLength(storage), "in storage")
    print("Sending", #list, "items")

    return list
end

return getMeItems;

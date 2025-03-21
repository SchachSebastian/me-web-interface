ae2 = peripheral.wrap("bottom")

local storage = {}

local function getStoredItemIndex(item)
    for index, stored in ipairs(storage) do
        if stored.nbt == item.nbt then
            return index
        end
    end

    return nil
end

local function getItemDiff(old, new)
    local diff = {}

    for key, value in pairs(old) do
        if value ~= new[key] then
            diff[key] = new[key]
        end
    end

    return diff
end

local function getMeItems()
    local items = ae2.listItems()

    local list = {}

    for _, item in ipairs(items) do
        local saved_item_index = getStoredItemIndex(item)
        local saved_item

        if saved_item_index == nil then
            saved_item = {}
        else
            saved_item = storage[saved_item_index]
        end

        local new_item = {
            name = item.name,
            fingerprint = item.fingerprint,
            amount = item.count,
            displayName = item.displayName,
            nbt = item.nbt,
            isCraftable = item.isCraftable
        }

        local diff = getItemDiff(saved_item, new_item)
        if #diff ~= 0 then
            diff.nbt = new_item.nbt
            table.insert(list, item)
        end
        if saved_item_index ~= nil then
            table.remove(storage, saved_item_index)
        end
    end

    for _, item in ipairs(storage) do
        local exists = false
        for index, new in ipairs(items) do
            if new.nbt == item.nbt then
                exists = true
            end
        end
        if not exists then
            local not_existing_item = {
                nbt = item.nbt,
                amount = 0
            }
            table.insert(list, not_existing_item)
            table.remove(storage, getStoredItemIndex(not_existing_item))
        end
    end

    print(textutils.parseJSON(list))

    return list
end

return getMeItems;

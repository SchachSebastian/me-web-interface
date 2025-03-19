ae2 = peripheral.wrap("bottom")

function getMeItems()
    local items = ae2.listItems()
    
    local combinedList = {}
    local idMap = {}
    
    for _, obj in ipairs(items) do
        local amount = obj.amount
        if obj.type == "fluid" then
            amount = amount/1000.0
        end
        local newObj = {
            name = obj.name,
            fingerprint = obj.fingerprint,
            amount = amount,
            displayName = obj.displayName,
            nbt = obj.nbt,
            tags = obj.tags,
            isCraftable = obj.isCraftable,
        }
        table.insert(combinedList, newObj)
        idMap[obj.id] = newObj
    end
    
    return combinedList
end

return getMeItems;
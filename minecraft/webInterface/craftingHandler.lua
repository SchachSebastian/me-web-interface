local bridge = require("bridge")

local function handleCraftingRequest(id, count)
    local type = id:sub(-1)
    local fingerprint = id:sub(1, -2)
    local filter = {
        fingerprint = fingerprint,
        count = count
    }
    local result = nil
    local error = nil
    if type == 'i' then
        result, error = bridge.craftItem(filter)
    elseif type == 'f' then
        result, error = bridge.craftFluid(filter)
    elseif type == 'c' then
        result, error = bridge.craftChemical(filter)
    end

    local success = result ~= nil
    if not success then
        print("Crafting error:", error)
    else
        print("Crafting success:", id, count)
    end

    return success
end

return {
    handleCraftingRequest = handleCraftingRequest
}

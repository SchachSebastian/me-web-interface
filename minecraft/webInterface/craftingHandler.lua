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

    local status = nil
    local debugMessage = nil

    while status == nil do
        sleep(0.1)
        if result == nil then
            status = "failed"
            print("Crafting failed with unknown error")
        elseif result.isCalculationNotSuccessful() then
            print("Crafting calculation not successful")
            status = "calculation_failed"
            debugMessage = result.getDebugMessage()
        elseif result.hasErrorOccurred() then
            print("Crafting failed with error:", result.getDebugMessage())
            status = "failed"
            debugMessage = result.getDebugMessage()
        elseif result.isCraftingStarted() or result.isDone() then
            status = "success"
            print("Crafting success:", id, count)
        end
    end

    local data = {
        status = status,
        id = id,
        count = count,
        debugMessage = debugMessage
    }

    return data
end

return {
    handleCraftingRequest = handleCraftingRequest
}

local bridge = require("bridge")

local function handleCraftingRequest(id, count)
    local last = id:sub(-1)
    local fingerprint = id:sub(1, -2)
    local success, err = bridge.craftItem({
        fingerprint = fingerprint,
        count = count
    })
    return success, err
end

return {
    handleCraftingRequest = handleCraftingRequest
}
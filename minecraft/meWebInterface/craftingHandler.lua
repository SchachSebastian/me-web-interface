local bridge = require("bridge")

local function handleCraftingRequest(fingerprint, count)
    local success, err = bridge.craftItem({
        fingerprint = fingerprint,
        count = count
    })
    return success, err
end

return {
    handleCraftingRequest = handleCraftingRequest
}
local ae2 = peripheral.find("meBridge")

local function handleCraftingRequest(fingerprint, count)
    local success, err = ae2.craftItem({
        fingerprint = fingerprint,
        count = count
    })
    return success, err
end

return {
    handleCraftingRequest = handleCraftingRequest
}
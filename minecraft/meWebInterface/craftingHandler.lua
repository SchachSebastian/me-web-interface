local ae2 = peripheral.find("meBridge")

local function handleCraftingRequest(fingerprint, count)
    ae2.craftItem({
        fingerprint = fingerprint,
        count = count
    })
end

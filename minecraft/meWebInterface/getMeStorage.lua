local ae2 = peripheral.find("meBridge")

local function getMeStorage()
    return {
        item = {
            total = ae2.getTotalItemStorage(),
            used = ae2.getUsedItemStorage()
        },
        fluid = {
            total = ae2.getTotalFluidStorage(),
            used = ae2.getUsedFluidStorage()
        }
    }
end

return getMeStorage

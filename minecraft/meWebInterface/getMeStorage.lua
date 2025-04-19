local ae2 = peripheral.find("meBridge")
local util = require("util")
local deepEqual = util.deepEqual

local storage = {}
local function getMeStorage()
    local new = {
        item = {
            total = ae2.getTotalItemStorage(),
            used = ae2.getUsedItemStorage()
        },
        fluid = {
            total = ae2.getTotalFluidStorage(),
            used = ae2.getUsedFluidStorage()
        }
    }
    if deepEqual(storage, new) then
        return nil
    end
    return new
end

return getMeStorage

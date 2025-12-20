local bridge = require("bridge")
local util = require("util")
local deepEqual = util.deepEqual

local storage = {}
local function getStorage()
    local new = {
        item = {
            total = bridge.getTotalItemStorage(),
            used = bridge.getUsedItemStorage()
        },
        fluid = {
            total = bridge.getTotalFluidStorage(),
            used = bridge.getUsedFluidStorage()
        }
    }
    if deepEqual(storage, new) then
        return nil
    end
    return new
end

return getStorage

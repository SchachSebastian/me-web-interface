local bridge = require("bridge")

local storage = {}

local function getStatus()
    if bridge == nil then
        return "bridge_missing"
    elseif not bridge.isConnected() then
        return "network_disconnected"
    elseif bridge.isOnline() then
        return "network_connected"
    else
        return "network_offline"
    end
end


local function getState()
    local state = {}

    local status = getStatus()
    if storage.status ~= status then
        state.status = status
        storage.status = status
    end

    if(status == "network_connected") then
        local totalItemStorage = bridge.getTotalItemStorage()
        local itemStorage = bridge.getUsedItemStorage() / totalItemStorage
        if storage.itemStorage ~= itemStorage and totalItemStorage > 0 then
            state.itemStorage = itemStorage
            storage.itemStorage = itemStorage
        end

        local totalFluidStorage = bridge.getTotalFluidStorage()
        local fluidStorage = bridge.getUsedFluidStorage() / totalFluidStorage
        if storage.fluidStorage ~= fluidStorage and totalFluidStorage > 0 then
            state.fluidStorage = fluidStorage
            storage.fluidStorage = fluidStorage
        end

        local totalChemicalStorage = bridge.getTotalChemicalStorage()
        local chemicalStorage = bridge.getUsedChemicalStorage() / totalChemicalStorage
        if storage.chemicalStorage ~= chemicalStorage and totalChemicalStorage > 0 then
            state.chemicalStorage = chemicalStorage
            storage.chemicalStorage = chemicalStorage
        end

        local totalEnergyStorage = bridge.getEnergyCapacity()
        local energyStorage = bridge.getStoredEnergy() / totalEnergyStorage
        if storage.energyStorage ~= energyStorage and totalEnergyStorage > 0 then
            state.energyStorage = energyStorage
            storage.energyStorage = energyStorage
        end
    end

    return state
end

local function resetStorage()
    storage = {}
end

return {
    getState = getState,
    resetStorage = resetStorage
};

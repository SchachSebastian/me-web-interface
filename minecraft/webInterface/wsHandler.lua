local inventory = require("inventory")
local getInventoryDiff = inventory.getInventoryDiff
local resetStorage = inventory.resetStorage

local craftingHandler = require("craftingHandler")
local handleCraftingRequest = craftingHandler.handleCraftingRequest

local state = require("state")
local getState = state.getState
local resetStateStorage = state.resetStorage

local config = require("config")
local url = config.url .. "/mc"
local maxItemsPerMessage = config.maxItemsPerMessage
local headers = {}
headers["Secret"] = config.secret

local ws

local function sendList(list, type)
    print("Sending " .. type .. " message with " .. #list .. " items")
    for i = 1, #list, maxItemsPerMessage do
        local chunk = {}
        for j = i, math.min(i + maxItemsPerMessage - 1, #list) do
            table.insert(chunk, list[j])
        end
        local message = {
            type = type,
            data = chunk
        }
        local serialisedMessage = textutils.serialiseJSON(message, {
            allow_repetitions = true
        })
        ws.send(serialisedMessage)
    end
end

local function handleMessages()
    while true do
        local message = ws.receive()
        if message then
            local decodedMessage = textutils.unserialiseJSON(message)
            local type = decodedMessage.type
            local data = decodedMessage.data
            if type == "crafting-request" then
                local id = data.id
                local count = data.count or 1
                local success = handleCraftingRequest(id, count)
                ws.send(textutils.serialiseJSON({
                    type = "crafting-response",
                    data = {
                        success = success,
                        id = id,
                        count = count
                    }
                }))
            end
        end
    end
end

local function sendInventory()
    while true do
        sleep(0.1)
        local inventory = getInventoryDiff()
        sendList(inventory, "inventory-update")
    end
end

local function sendState()
    while true do
        sleep(1)
        local data = getState()
        if data then
            ws.send(textutils.serialiseJSON({
                type = "state-update",
                data = data
            }))

        end
    end
end

local function ping()
    while true do
        sleep(5)
        if ws then
            ws.send(textutils.serialiseJSON({
                type = "ping"
            }))
        end
    end
end

local initMessage = textutils.serialiseJSON({
    type = "init"
})

local function wsHandler()
    if ws then
        ws.close()
    end
    ws = http.websocket(url, headers)
    if (not ws) then
        error("Failed to connect to WebSocket at " .. url)
    end
    ws.send(initMessage)
    resetStorage()
    resetStateStorage()
    parallel.waitForAll(sendState, sendInventory, handleMessages, ping)
end

return wsHandler

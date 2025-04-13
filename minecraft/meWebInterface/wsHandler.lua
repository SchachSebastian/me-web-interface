local getMeInventory = require("getMeInventory")
local getMeInventoryDiff = getMeInventory.getMeInventoryDiff
local resetStorage = getMeInventory.resetStorage

local craftingHandler = require("craftingHandler")
local handleCraftingRequest = craftingHandler.handleCraftingRequest

print("Started")

local config = require("config")
local url = config.url
local maxItemsPerMessage = config.maxItemsPerMessage
local headers = {}
headers["Secret"] = config.secret

local ws

local function sendList(list, type)
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
    local message = ws.receive(0.1)
    if message then
        local decodedMessage = textutils.unserialiseJSON(message)
        local type = decodedMessage.type
        local data = decodedMessage.data
        if type == "crafting-request" then
            local fingerprint = data.fingerprint
            local count = data.count or 1
            local success, err = handleCraftingRequest(fingerprint, count)
            ws.send(textutils.serialiseJSON({
                type = "crafting-response",
                data = {
                    success = success,
                    fingerprint = fingerprint,
                    count = count
                }
            }))
        end
    end

end

local function wsHandler()
    while true do
        sendList(getMeInventoryDiff(), "inventory-update")
        handleMessages()
    end
end

-- Startup delay
sleep(5)

local initMessage = textutils.serialiseJSON({
    type = "init"
})

while true do
    ws = http.websocket(url, headers)
    ws.send(initMessage)
    resetStorage()
    pcall(wsHandler)
end

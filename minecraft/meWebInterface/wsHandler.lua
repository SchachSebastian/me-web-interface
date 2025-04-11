local getMeInventory = require("getMeInventory")
local getMeInventoryDiff = getMeInventory.getMeInventoryDiff
local resetStorage = getMeInventory.resetStorage

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

local function wsHandler()
    while true do
        sendList(getMeInventoryDiff(), "inventory-update")
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

local getMeItems = require("getMeInventory")

print("Started")

local config = require("config")
local url = config.url
local maxItemsPerMessage = config.maxItemsPerMessage
local headers = {}
headers["Secret"] = config.secret

local ws = http.websocket(url, headers)

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
    sendList(getMeItems(), "item-update")
end

while true do
    pcall(wsHandler)
end

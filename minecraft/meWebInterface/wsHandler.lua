local getMeInventory = require("getMeInventory")
local getMeInventoryDiff = getMeInventory.getMeInventoryDiff
local resetStorage = getMeInventory.resetStorage

local craftingHandler = require("craftingHandler")
local handleCraftingRequest = craftingHandler.handleCraftingRequest

local getMeStorage = require("getMeStorage")

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
    while true do
        local message = ws.receive()
        if message then
            local decodedMessage = textutils.unserialiseJSON(message)
            local type = decodedMessage.type
            local data = decodedMessage.data
            if type == "crafting-request" then
                local fingerprint = data.fingerprint
                local count = data.count or 1
                local success, err = handleCraftingRequest(fingerprint, count)
                if not success then
                    print("Crafting error:", err)
                else
                    print("Crafting success:", fingerprint, count)
                end
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
end

local function sendInventory()
    while true do
        local inventory = getMeInventoryDiff()
        sendList(inventory, "inventory-update")
    end
end

local function sendStorage()
    while true do
        sleep(0.1)
        local data = getMeStorage()
        if data then
            ws.send(textutils.serialiseJSON({
                type = "storage-update",
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
    ws.send(initMessage)
    resetStorage()
    parallel.waitForAll(sendInventory, handleMessages, sendStorage, ping)
end

-- Startup delay
sleep(5)

while true do
    pcall(wsHandler)
end

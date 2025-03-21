local getMeItems = require("getMeInventory")

print("Started")

local url = "<url-goes-here>"
local headers = {}
headers["Secret"] = "<your-secret-goes-here>"

local ws = http.websocket(url, headers)

function wsHandler()
    sleep(1)
    local message = {
        type = "item-update",
        data = getMeItems()
    }
    local serialisedMessage = textutils.serialiseJSON(message)
    if ws then
       ws.send(serialisedMessage)
    end
end

while true do
    pcall(wsHandler)
end

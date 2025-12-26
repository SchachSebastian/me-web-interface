local verifySetup = require("verifySetup")
local wsHandler = require("wsHandler")
local config = require("config")

print("Starting web interface...")
print("Configuration loaded.")
local system = config.system
local url = config.url .. "/mc"
local maxItemsPerMessage = config.maxItemsPerMessage
print("System: " .. system)
print("Url: " .. url)
print("Items per message: " .. maxItemsPerMessage)


verifySetup()

while true do
    print("Starting web socket handler...")
    local success, error = pcall(wsHandler)
    if (error == "Terminated") then
        print("WebSocket handler terminated. Exiting...")
        break
    end
    print("Error: " .. error)
    local file = fs.open("error.log", "w")
    file.write(error)
    file.close()
    print("Reconnecting in 1 second...")
    sleep(1)
end

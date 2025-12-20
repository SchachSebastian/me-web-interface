local bridge = require("bridge")
local config = require("config")
local system = config.system


local function verifySetup()
    print("Verifying system setup...")

    -- Check if the bridge peripheral is available
    if bridge.peripheralDisabled then
        error("Peripheral is disabled, enable the " .. system .. "_bridge in the config", 0)
    else
        print("Peripheral " .. system .. "_bridge is enabled")
    end

    -- Test HTTP connectivity
    print("Testing http connectivity...")
    local testUrl = "https://example.tweaked.cc"
    print("Sending request to " .. testUrl)
    local request = http.get(testUrl)
    if request then
        print(request.readAll())
    else
        print("Response:" .. request)
        error("HTTP is not working, enable http in the config", 0)
    end
end

return verifySetup

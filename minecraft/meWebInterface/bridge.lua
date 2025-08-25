local config = require("config")
local system = config.system


local bridge = nil

if system == "me" then
    bridge = peripheral.find("me_bridge")
elseif system == "rs" then
    bridge = peripheral.find("rs_bridge")
end

return bridge

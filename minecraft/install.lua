local branch = "main"
local url = "https://raw.githubusercontent.com/SchachSebastian/me-web-interface/refs/heads/".. branch .."/minecraft/"

shell.run("wget " .. url .. "webInterface/wsHandler.lua","webInterface/wsHandler.lua")
shell.run("wget " .. url .. "webInterface/craftingHandler.lua","webInterface/craftingHandler.lua")
shell.run("wget " .. url .. "webInterface/inventory.lua","webInterface/inventory.lua")
shell.run("wget " .. url .. "webInterface/getStorage.lua","webInterface/getStorage.lua")
shell.run("wget " .. url .. "webInterface/util.lua","webInterface/util.lua")
shell.run("wget " .. url .. "webInterface/config.lua","webInterface/config.lua")
shell.run("wget " .. url .. "webInterface/bridge.lua","webInterface/bridge.lua")
shell.run("wget " .. url .. "webInterface/verifySetup.lua","webInterface/verifySetup.lua")
shell.run("wget " .. url .. "webInterface/entry.lua","webInterface/entry.lua")


shell.run("wget " .. url .. "startup.lua")

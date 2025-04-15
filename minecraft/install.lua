shell.run(
    "wget https://raw.githubusercontent.com/SchachSebastian/me-web-interface/refs/heads/main/minecraft/meWebInterface/wsHandler.lua",
    "meWebInterface/wsHandler.lua")
shell.run(
    "wget https://raw.githubusercontent.com/SchachSebastian/me-web-interface/refs/heads/main/minecraft/meWebInterface/craftingHandler.lua",
    "meWebInterface/craftingHandler.lua")

shell.run(
    "wget https://raw.githubusercontent.com/SchachSebastian/me-web-interface/refs/heads/main/minecraft/meWebInterface/getMeInventory.lua",
    "meWebInterface/getMeInventory.lua")
shell.run(
    "wget https://raw.githubusercontent.com/SchachSebastian/me-web-interface/refs/heads/main/minecraft/meWebInterface/getMeStorage.lua",
    "meWebInterface/getMeStorage.lua")

local configSuccess = shell.run(
    "wget https://raw.githubusercontent.com/SchachSebastian/me-web-interface/refs/heads/main/minecraft/meWebInterface/config.lua",
    "meWebInterface/config.lua")
if not configSuccess then
    print(
        "Failed to download config.lua, if this file already exists you may ignore this error, please edit it to your needs.")
    return
end

local success = shell.run(
    "wget https://raw.githubusercontent.com/SchachSebastian/me-web-interface/refs/heads/main/minecraft/startup.lua")
if not success then
    print(
        "Failed to download startup.lua, if this file already exists you may want to add shell.run('meWebInterface/wsHandler.lua') to it.")
    return
end

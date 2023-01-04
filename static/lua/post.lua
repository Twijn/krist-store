local args = {...}

local dataPath = "/kristify/data/"

if #args > 0 then
    dataPath = args[1]
end

print(dataPath)
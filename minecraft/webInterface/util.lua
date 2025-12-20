local function deepEqual(a, b)
    if type(a) ~= type(b) then
        return false
    end

    if type(a) == "table" then
        for key, value in pairs(a) do
            if not deepEqual(value, b[key]) then
                return false
            end
        end

        for key, value in pairs(b) do
            if not deepEqual(value, a[key]) then
                return false
            end
        end

        return true
    else
        return a == b
    end
end

local function getDiff(old, new)
    local diff = {}

    for key, value in pairs(new) do
        if not deepEqual(value, old[key]) then
            diff[key] = new[key]
        end
    end

    return diff
end

return {
    deepEqual = deepEqual,
    getDiff = getDiff
}
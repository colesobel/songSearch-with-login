function containsAll(spotifyTitle,lastFMTitle) {
    var flag = true
    lastFMTitle.toLowerCase().replace(/\(([^\)]+)\)/, '').split(' ').forEach(function(elem) {
        if (!spotifyTitle.toLowerCase().includes(elem)) {
            flag = false
        }
    })
    return flag
}

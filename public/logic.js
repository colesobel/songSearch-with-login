function containsAll(spotifyTitle,lastFMTitle) {
    var flag = true
    lastFMTitle.toLowerCase().split(' ').forEach(function(elem) {
        if (!spotifyTitle.toLowerCase().includes(elem)) {
            flag = false
        }
    })
    return flag
}


function createNonce() {
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('')
    var nonce = ''
    for (var i = 0; i < 20; i++) {
        var random = possible[Math.floor(Math.random() * possible.length)]
        nonce += random
    }
    return nonce
}

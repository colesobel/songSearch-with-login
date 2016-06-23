

    function containsAll(spotifyTitle,lastFMTitle) {
        var flag = true

        if (lastFMTitle.length <= spotifyTitle.length) {
            lastFMTitle.toLowerCase().replace(/\(([^\)]+)\)/, '').split(' ').forEach(function(elem) {
                if (!spotifyTitle.toLowerCase().includes(elem)) {
                    flag = false
                }
            })
        } else {
            spotifyTitle.toLowerCase().replace(/\(([^\)]+)\)/, '').split(' ').forEach(function(elem) {
                if (!lastFMTitle.toLowerCase().includes(elem)) {
                    flag = false
                }
            })
        }
        return flag
    }

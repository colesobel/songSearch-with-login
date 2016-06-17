function containsAll(spotifyTitle,lastFMTitle) {
    var flag = true
    lastFMTitle.toLowerCase().replace(/\(([^\)]+)\)/, '').split(' ').forEach(function(elem) {
        if (!spotifyTitle.toLowerCase().includes(elem)) {
            flag = false
        }
    })
    return flag
}

console.log(containsAll('Total Eclipse of the Heart (Sunset Strippers Verse Radio Edit)', 'Total Eclipse of the Heart'));

console.log(containsAll('Westlife', 'Westlife'));

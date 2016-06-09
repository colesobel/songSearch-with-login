$(document).ready(function() {
    var userName = ''
    var userPass = ''
    var hasAccount = false
    var userTrack = ''
    var userArtist = ''
    var spotifyTrackName = ''
    var spotifyArtistName = ''
    var apiKey = 'd78ab56ad21c652f6fcaed4ae1d11a2a'

    $('.message a').click(function() {
        $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
    });

    $('.main').hide()

    $('#login').click(function() {
        event.preventDefault()
        accessMongoLab(checkForExistingAccount)
    })

    $('#createUser').click(function() {
        event.preventDefault()
        createAccount()
    })

    function accessMongoLab(callback) {
        $.ajax({
            url: 'https://api.mlab.com/api/1/databases/songsearch/collections/playlist?apiKey=VhcajL6c-z_UWZkfhOGUxYR0bYEl8yEb'
        }).done(function(data) {
            callback(data)
        })
    }

    function checkForExistingAccount(data) {
        userName = $('#login-username').val()
        userPass = $('#login-user-pass').val()
        data.forEach(function(account) {
            if (account.userName === userName && account.passWord === userPass) {
                hasAccount = true
                $('.login-page').hide()
                $('.main').show()
                $('.main').css({
                    "background-color":"white",
                    'height': '100vh'})
            }
        })
        if (!hasAccount) {
            alert('no account found. Please try again or create a new account')
        }
    }

    function createAccount() {
        userName = $('#login-username').val()
        userPass = $('#login-user-pass').val()
        $.ajax({
            type: 'POST',
            url: 'https://api.mlab.com/api/1/databases/songsearch/collections/playlist?apiKey=VhcajL6c-z_UWZkfhOGUxYR0bYEl8yEb',
            contentType: 'application/json',
            data: JSON.stringify({
                userName: userName,
                passWord: userPass,
                tracks: {}
            })
        }).done(function() {
            alert('account created successfully')
            $('.login-page').hide()
            $('.main').show()
        })
    }




    //on click events
    $('#submit').on('click', checkUserInput)
    $('#view-playlist').on('click', getMongoLabData)
    $(document).on('click', '.result-tab', showPlayerHeader)
    $(document).on('click', '.green-heart', showRedHeart)




    function checkUserInput(callback) {
        userTrack = $('#song').val().trim()
        userArtist = $('#artist').val().trim()
        $('.container').children().hide(500)
        if (userTrack === '' && userArtist === '') {
            $('.no-input').html('No search criteria specified').slideDown(500)
            return
        } else if (userTrack === '' || userArtist === ''){
            $('.no-input').html('Please specify both a track and an artist').slideDown(500)
            return
        }
        getSimilarTracks()
    }



    function getSimilarTracks() {
        $('.container').children().hide(500)
        $.ajax({
            url: `http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${userArtist}&track=${userTrack}&api_key=${apiKey}&format=json`
        }).done(function(data) {
            checkForValidData(data)
        })
    }



    function checkForValidData(data) {
        if (data.message === 'Track not found' || data.similartracks.track.length === 0) {
            $('.error').html('Sorry, no track information found').slideDown(500)
        } else {
            data.similartracks.track.forEach(function(track) {
                appendSimilarTracks(data.similartracks.track)
            })
        }
    }


    function appendSimilarTracks(similarTracks) {
        $('.results').empty()
        $('.results').show(500)
        similarTracks.forEach(function(elem) {
            var trackTitle = elem.name
            var artistName = elem.artist.name
            var resultTab = document.createElement('div')
            $(resultTab).addClass('result-tab')
            $(resultTab).attr('data-track', trackTitle)
            $(resultTab).attr('data-artist', artistName)
            var img = document.createElement('img')
            img.src = elem.image[0]['#text']
            $(img).appendTo(resultTab)
            var trackInfo = document.createElement('p')
            trackInfo.innerHTML = `${trackTitle}, ${artistName}`
            $(resultTab).append(trackInfo)
            // var li = document.createElement('li')
            // $(li).addClass("list-group-item")
            // $(li).append(resultTab))
            $('.results').append(resultTab)
        })
    }

    function showPlayerHeader() {
    $('.player-header').show(500)
    $('.player').show(500)
    callToSpotify(this)
}

    function showRedHeart() {
        $(this).slideUp(500)
        $('.red-heart').slideDown(500)
    }

function callToSpotify(elem) {
    spotifyTrackName = $(elem).attr('data-track')
    spotifyArtistName = $(elem).attr('data-artist')
    $.ajax({
        url: `https://api.spotify.com/v1/search?q=${spotifyTrackName} ${spotifyArtistName}&type=track&market=US`
    }).done(function(data) {
        playSong(data.tracks.items)
    })
}

function playSong(tracks) {
    $('.player').empty()
    $('.player-header').empty()
    var greenHeart = document.createElement('img')
    greenHeart.src = "green-heart.png"
    $(greenHeart).addClass('green-heart')
    var redHeart = document.createElement('img')
    redHeart.src = "Red_Heart.gif"
    $(redHeart).addClass('red-heart')
    $('.player-header').append(greenHeart)
    $('.player-header').append(redHeart)
    $('.player-header').append(`<p> ${spotifyTrackName}, ${spotifyArtistName}</p>`)
    var found = false
    for (var i = 0; i < tracks.length; i++) {
        if (containsAll(tracks[i].name, spotifyTrackName.toLowerCase()) && containsAll(tracks[i].artists[0].name, spotifyArtistName.toLowerCase())) {
            $('.player').append(`<iframe src="${tracks[i].preview_url}" frameborder="0" allowfullscreen></iframe>`)
                found = true
                return
        }
    }
    if (found === false) {
        $('.player').append('<p>Sorry, no song preview available for this track</p>')
    }
}

    function getMongoLabData() {
        $.ajax({
            url: 'https://api.mlab.com/api/1/databases/songsearch/collections/playlist?apiKey=VhcajL6c-z_UWZkfhOGUxYR0bYEl8yEb'
        }).done(function(data) {
            displayUserPlaylist(data)
        })
    }

    function displayUserPlaylist(data) {
        $('#guide').hide(500)
        $('.results').hide(500)
        $('.player-header').hide(500)
        $('.player').hide(500)
        $('.my-playlist').show(500)
        $('.songs').show(500)
        data.forEach(function(account) {
            if (account.userName === userName) {
                for (track in account.tracks) {
                    var div = document.createElement('div')
                    $(div).addClass('playlist-result')
                    $(div).attr('data-track', track)
                    $(div).attr('data-artist', account.tracks[track])
                    $(div).html(`${track}, ${account.tracks[track]}`)
                    $('.songs').append(div)
                }
            }
        })
    }

})

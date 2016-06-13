// Youtube video search url https://www.googleapis.com/youtube/v3/search?part=snippet&q=higher+love+steve+winwood&type=video&key=AIzaSyAsA8OyLKjlemMUgQYPM5HWxt8pr88JHzw

$(document).ready(function() {
    var userName = ''
    var userPass = ''
    var hasAccount = false
    var userTrack = ''
    var userArtist = ''
    var spotifyTrackName = ''
    var spotifyArtistName = ''
    var apiKey = 'd78ab56ad21c652f6fcaed4ae1d11a2a'
    var currentSelections = {}
    var userTracks = {}
    var accessToken = ''
    var videoIds = []

    $('.message a').click(function() {
        $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
    });

    $('.main').hide()

    $('#login').click(function() {
        event.preventDefault()
        if ($('#login-username').val() !== '' && $('#login-user-pass').val() !== '') {
            accessMongoLab(checkForExistingAccount)
        } else {
            alert('Please enter a username and password')
        }
    })

    $('#createUser').click(function() {
        event.preventDefault()
        if ($('#create-username').val() !== '' && $('#create-user-pass').val() !== '') {
            accessMongoLab(ensureNoDuplicateAccount)
        } else {
            alert('Please enter a username and password')
        }
    })

    function accessMongoLab(callback) {
        $.ajax({
            url: 'https://api.mlab.com/api/1/databases/songsearch/collections/playlist?apiKey=VhcajL6c-z_UWZkfhOGUxYR0bYEl8yEb'
        }).done(function(data) {
            callback(data)
        })
    }

    function ensureNoDuplicateAccount(data) {
        var exists = false
        data.forEach(function(account) {
            if (account.userName === $('#create-username').val()) {
                exists = true
            }
        })
        if (exists) {
            alert('Username already exists. Please select another')
        } else {
            createAccount()
        }
    }

    function checkForExistingAccount(data) {
        userName = $('#login-username').val()
        userPass = $('#login-user-pass').val()
        data.forEach(function(account) {
            if (account.userName === userName && account.passWord === userPass) {
                hasAccount = true
                $('.login-page').hide()
                $('.main').show()
                $('.my-playlist').hide()
                // populateCurrentSelections()
            }
        })
        if (!hasAccount) {
            alert('no account found. Please try again or create a new account')
        }
    }

    function createAccount() {
        userName = $('#create-username').val()
        userPass = $('#create-user-pass').val()
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
            $('.my-playlist').hide()
            // populateCurrentSelections()
        })
    }

    // function populateCurrentSelections() {
    //     accessMongoLab(function(data) {
    //         data.forEach(function(account) {
    //             if (account.userName === userName && account.passWord === userPass) {
    //                 for (song in account.tracks) {
    //                     currentSelections[song] = account.tracks[song]
    //                 }
    //             }
    //         })
    //     })
    // }

    //on click events
    $('#submit').on('click', checkUserInput)
    $('#view-playlist').on('click', getMongoLabData)
    $(document).on('click', '.result-tab', showPlayerHeader)
    $(document).on('click', '.play-button', showPlayerHeader)
    $(document).on('click', '#thumbs-up', changeThumbColor)
    $(document).on('click', '.remove', getTracksToDelete )


    function checkUserInput(callback) {
        userTrack = $('#song').val().trim()
        userArtist = $('#artist').val().trim()
        $('.results-container').children().hide(500)
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
        $('.results-container').children().hide(500)
        $.ajax({
            url: `https://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${userArtist}&track=${userTrack}&api_key=${apiKey}&format=json`
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
        for(var i = 0; i < 50; i++) {
            var elem = similarTracks[i]
            var trackTitle = elem.name
            var artistName = elem.artist.name
            var resultTab = document.createElement('li')
            $(resultTab).addClass('result-tab')
            $(resultTab).addClass("list-group-item")
            $(resultTab).attr('data-track', trackTitle)
            $(resultTab).attr('data-artist', artistName)
            var img = document.createElement('img')
            img.src = elem.image[0]['#text']
            $(img).appendTo(resultTab)
            var trackInfo = document.createElement('p')
            trackInfo.innerHTML = `${trackTitle}, ${artistName}`
            $(resultTab).append(trackInfo)
            $('.results').append(resultTab)
        }
    }

    function showPlayerHeader() {
        $('.player-header').slideDown()
        $('.player').slideDown()
        if(this.tagName === 'I') {
            callToSpotify($(this).parent())
        } else {
            callToSpotify(this)
        }
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
        $('.player-header').append(`<p data-track="${spotifyTrackName}" data-artist="${spotifyArtistName}"> ${spotifyTrackName}, ${spotifyArtistName} &nbsp <i id="thumbs-up" class="fa fa-thumbs-o-up" aria-hidden="true"></i></p>`)
        var found = false
        for (var i = 0; i < tracks.length; i++) {
            if (containsAll(tracks[i].name, spotifyTrackName.toLowerCase()) && containsAll(tracks[i].artists[0].name, spotifyArtistName.toLowerCase())) {
                var audio = new Audio
                audio.src = tracks[i].preview_url
                audio.controls = 'controls'
                audio.autoplay = 'autoplay'
                $('.player').append(audio)
                    found = true
                    return
            }
        }
        if (found === false) {
            $('.player').append('<p>Sorry, no song preview available for this track</p>')
        }
    }

    function changeThumbColor() {
        $(this).addClass('thumbs-up-clicked', 'slow')
        currentSelections[$(this).parent().attr('data-track')] = $(this).parent().attr('data-artist')
        accessMongoLab(findUserPlayList)
    }


    function findUserPlayList(data) {
        var mongoId = ''
        data.forEach(function(account) {
            if (account.userName === userName) {
                mongoId = account._id.$oid;
                userTracks = account.tracks;
                for (song in userTracks) {
                    currentSelections[song] = userTracks[song]
                }
            }
        })
        updateDatabasePlaylist(mongoId, currentSelections)
    }


    function updateDatabasePlaylist(mongoId, currentSelections) {
        $.ajax({
            type: 'PUT',
            url: `https://api.mlab.com/api/1/databases/songsearch/collections/playlist/${mongoId}?apiKey=VhcajL6c-z_UWZkfhOGUxYR0bYEl8yEb`,
            contentType: "application/json",
            data: JSON.stringify( { "$set" : { 'tracks' : currentSelections } } )
        })
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
        $('.error').hide(500)
        $('.no-input').hide(500)
        $('.songs').empty()
        $('.my-playlist').show(500)
        $('.songs').show(500)
        data.forEach(function(account) {
            if (account.userName === userName) {
                for (track in account.tracks) {
                    var li = document.createElement('li')
                    $(li).addClass('playlist-result')
                    $(li).addClass('list-group-item')
                    $(li).attr('data-track', track)
                    $(li).attr('data-artist', account.tracks[track])
                    $(li).html(`${track}, ${account.tracks[track]} <i class="play-button fa fa-play-circle-o" aria-hidden="true"></i> <i class="remove fa fa-times" aria-hidden="true"></i>`)
                    $('.songs').append(li)
                }
            }
        })
    }

    function getTracksToDelete() {
        var trackToDelete = $(this).parent().attr('data-track')
        $.ajax({
            url: 'https://api.mlab.com/api/1/databases/songsearch/collections/playlist?apiKey=VhcajL6c-z_UWZkfhOGUxYR0bYEl8yEb'
        }).done(function(data) {
            data.forEach(function(account) {
                if (account.userName === userName) {
                    var mongoId = account._id.$oid
                    var tempTracks = account.tracks
                    delete tempTracks[trackToDelete]
                    updateDatabasePlaylist(mongoId, tempTracks)
                }
            })
            displayUserPlaylist(data)
        })
    }

    $(document).on('click', '#create-playlist', checkForAccessToken)

    function checkForAccessToken() {
        if (window.location.hash.includes('access_token')) {
            getAccessToken()
        } else {
            alert('You must grant Youtube access before uploading')
        }
    }

    function getAccessToken() {
        var fullHash = window.location.hash
        var firstEquals = fullHash.indexOf('=')
        var andSign = fullHash.indexOf('&')
        accessToken = fullHash.substring(firstEquals + 1, andSign)
        validateAccessToken(accessToken)
    }

    function validateAccessToken(accessToken) {
        $.ajax({
            url: `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
        }).done(function() {
            // UploadToYoutube(accessToken)
            getYoutubeVideoIds()
        })
    }

    function getYoutubeVideoIds() {
        accessMongoLab(function(data) {
            getMyAccount(data, function(account) {
                populateYoutubeIds(account.tracks);
            })
        })
    }

    function getMyAccount(data, callback) {
        data.forEach(function(account) {
            if (account.userName === userName && account.passWord === userPass) {
                callback(account)
            }
        })
    }

    function populateYoutubeIds(tracks) {
        for (song in tracks) {
            var searchString = `${song} ${tracks[song]}`
            console.log('setting search string to ' + searchString);
            getId(searchString)
        }
    }

    function getId(searchString) {
        console.log('getting id...');
        $.ajax({
            url: `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchString}&type=video&key=AIzaSyAsA8OyLKjlemMUgQYPM5HWxt8pr88JHzw`,
            success: function(data) {
                var videoId = data.items[0].id.videoId
                UploadToYoutube(accessToken, videoId)
            }
        })
    }

    function UploadToYoutube(accessToken, videoId) {
        console.log('uploading ' + videoId + ' to youtube with access token ' + accessToken);
        $.ajax({
            type: 'POST',
            url: `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key=AIzaSyAsA8OyLKjlemMUgQYPM5HWxt8pr88JHzw&access_token=${accessToken}`,
            contentType: 'application/json',
            data: JSON.stringify({
                 "snippet": {
                  "playlistId": "PLf9KlP7F4ZswNE5SatZiz95pjd0ATIym1",
                  "resourceId": {
                   "kind": "youtube#video",
                   "videoId": `${videoId}`
                  },
                  "position": 0
                 }
            })
        }).done(function() {
            console.log('video uploaded successfully')
        })
    }

})

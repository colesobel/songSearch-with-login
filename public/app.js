$(document).ready(function() {

    //Color Gradient Things
    var colors = new Array(
    [62,35,255],
    [60,255,60],
    [255,35,98],
    [45,175,230],
    [255,0,255],
    [255,128,0]);

    var step = 0;
    //color table indices for:
    // current color left
    // next color left
    // current color right
    // next color right
    var colorIndices = [0,1,2,3];

    //transition speed
    var gradientSpeed = 0.002;

    function updateGradient() {

        if ( $===undefined ) return;

        var c0_0 = colors[colorIndices[0]];
        var c0_1 = colors[colorIndices[1]];
        var c1_0 = colors[colorIndices[2]];
        var c1_1 = colors[colorIndices[3]];

        var istep = 1 - step;
        var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
        var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
        var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
        var color1 = "rgb("+r1+","+g1+","+b1+")";

        var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
        var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
        var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
        var color2 = "rgb("+r2+","+g2+","+b2+")";

        $('body').css({
        background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"}).css({
        background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"});

        step += gradientSpeed;
        if ( step >= 1 ){
        step %= 1;
        colorIndices[0] = colorIndices[1];
        colorIndices[2] = colorIndices[3];

        //pick two new target color indices
        //do not pick the same as the current one
        colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
        colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;

        }
    }


    $('.message a').click(function() {
        $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
    });

    //Global Variable Definition
    var userName = ''
    var userPass = ''
    var userTrack = ''
    var userArtist = ''
    var spotifyTrackName = ''
    var spotifyArtistName = ''
    var apiKey = 'd78ab56ad21c652f6fcaed4ae1d11a2a'
    var currentSelections = {}
    var userTracks = {}
    var accessToken = ''
    var playlistId = ''
    var isPlaylistPage = false
    var playlistName
    var youtubeAuthClicked = false
    var videoIds = []
    console.log('video ids');

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
        var hasAccount = false
        userName = $('#login-username').val()
        userPass = $('#login-user-pass').val()
        data.forEach(function(account) {
            if (account.userName === userName && account.passWord === userPass) {
                hasAccount = true
                $('.login-page').hide()
                $('.main').show()
                checkYoutubeAuthorization()
                $('.my-playlist').hide()
            } else if (account.userName === userName && account.passWord !== userPass) {
                hasAccount = true
                alert('Incorrect password. Please try again')
            }
        })
        if (!hasAccount) {
            alert('No account found. Please try again or create a new account')
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
            checkYoutubeAuthorization()
            $('.my-playlist').hide()
        })
    }

    function checkYoutubeAuthorization() {
        if (!isPlaylistPage) {
            $('#youtube-auth').hide()
            $('#create-playlist').hide()
            return
        }
        if (window.location.hash.includes('access_token')) {
            $('#youtube-auth').hide()
            $('#create-playlist').show()
        } else {
            $('#create-playlist').hide()
            $('#youtube-auth').show()
        }
    }

    //on click events
    $(document).on('click', '#youtube-auth', redirectToYoutubeAuth)
    $('#submit').on('click', function() {
        checkToUpdateDatabase()
        isPlaylistPage = false
        checkYoutubeAuthorization()
        checkUserInput()
    })
    $(document).on('click', '.result-tab', showPlayerHeader)
    $(document).on('click', '.play-button', showPlayerHeader)
    $(document).on('click', '#thumbs-up', changeThumbColor)
    $(document).on('click', '.remove', getTracksToDelete )
    $(document).on('click', '#view-playlist', function() {
        isPlaylistPage = true
        checkYoutubeAuthorization()
        getMongoLabData()
    })
    $(document).on('click', '.list-group-item', createActiveTab)


    function redirectToYoutubeAuth() {
        youtubeAuthClicked = true
        checkToUpdateDatabase()

    }

    function checkToUpdateDatabase() {
        if (isPlaylistPage) {
            accessMongoLab(getUserPlaylist)
        }
    }

    function getUserPlaylist(data) {
        var mongoId = ''
        data.forEach(function(account){
            if (account.userName === userName && account.passWord === userPass) {
                mongoId = account._id.$oid
                var tempTracks = {}
                $('.songs .list-group-item').each(function(index, elem) {
                    tempTracks[$(elem).attr('data-track')] = $(elem).attr('data-artist')
                })
                if (youtubeAuthClicked) {
                    updateDatabasePlaylist(mongoId, tempTracks, function() {
                        window.location = 'https://accounts.google.com/o/oauth2/auth?client_id=719644486942-miua9p0o58of75b40r06hcgfbkpb2njm.apps.googleusercontent.com&redirect_uri=https://project-3022223182424588945.firebaseapp.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.force-ssl+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutubepartner+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.upload&approval_prompt=force&response_type=token'
                    })
                } else {
                    updateDatabasePlaylist(mongoId, tempTracks)
                }
            }
        })
    }


    function createActiveTab() {
        $(this).addClass('active-result-tab')
        $('.list-group-item').not(this).removeClass('active-result-tab')

    }


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
            $('.results').empty()
            $('.results').show(500)
            data.similartracks.track.forEach(function(track) {
                appendSimilarTracks(track)
            })
        }
    }

    function appendSimilarTracks(elem) {
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
            url: `https://api.spotify.com/v1/search?q=${spotifyTrackName.replace(/\(([^\)]+)\)/, '')} ${spotifyArtistName.replace(/\(([^\)]+)\)/, '')}&type=track&market=US`
        }).done(function(data) {
            playSong(data.tracks.items)
        })
    }

    function playSong(tracks) {
        $('.audio').trigger('pause')
        $('.play').show()
        $('.player').empty()
        $('.player-header').empty()
        $('.player-header').append(`<p data-track="${spotifyTrackName}" data-artist="${spotifyArtistName}"> ${spotifyTrackName}, ${spotifyArtistName} &nbsp <i id="thumbs-up" class="fa fa-thumbs-o-up" aria-hidden="true"></i></p>`)
        if (isPlaylistPage) {
            $('#thumbs-up').hide()
        }
        var found = false
        for (var i = 0; i < tracks.length; i++) {
            if (containsAll(tracks[i].name, spotifyTrackName) && containsAll(tracks[i].artists[0].name, spotifyArtistName)) {
                var audio = new Audio
                audio.src = tracks[i].preview_url
                audio.controls = 'controls'
                audio.autoplay = 'autoplay'
                $(audio).addClass('audio')
                $('.player').append(audio)
                $(audio).on('play', function() {intervalId = setInterval(updateGradient,3)})
                $(audio).on('pause', function() {clearInterval(intervalId)})
                $(audio).on('ended', function() {clearInterval(intervalId)})
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

    function updateDatabasePlaylist(mongoId, currentSelections, callback) {
        $.ajax({
            type: 'PUT',
            url: `https://api.mlab.com/api/1/databases/songsearch/collections/playlist/${mongoId}?apiKey=VhcajL6c-z_UWZkfhOGUxYR0bYEl8yEb`,
            contentType: "application/json",
            data: JSON.stringify( { "$set" : { 'tracks' : currentSelections } } )
        }).done(function() {
            if (callback) {
                callback()
            } else {
            }
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
        $('.uploading-tracks').hide(500)
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
        $('.songs').sortable()
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
        playlistName = prompt('What would you like to name your playlist?')
        checkToUpdateDatabase()
        $('.play').hide()
        $('.my-playlist').hide()
        $('.uploading-tracks').html('Please wait while your tracks are being uploaded. This may take a few moments...').slideDown(500)
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
        }).done(function(data) {
            nameANewPlaylist()
        })
    }

    function nameANewPlaylist() {
        createPlaylistPostRequest(playlistName, 'My new playlist!')
    }

    function createPlaylistPostRequest(playlistName, description) {
        $.ajax({
            type: 'POST',
            url: `https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&key=AIzaSyAsA8OyLKjlemMUgQYPM5HWxt8pr88JHzw&access_token=${accessToken}`,
            contentType: 'application/json',
            data: JSON.stringify({
                "snippet": {
                    "title": `${playlistName}`,
                    "description": `${description}`
                }
            }),
            error: function(data) {
                if (data.status == 401) {
                    $('.results-container').children().hide()
                    alert('Oops, are you sure that you have a youtube channel under this account? We could\'nt find one. (Note: authorizing youtube access for a specific email address does not guarantee that you do have an existing youtube channel.)')
                    $('#guide').slideDown(500)
                } else {
                    alert('an unknown error occurred. Sorry! Please try again')
                }
            },
            success: function(data) {
                playlistId = data.id
                createYoutubeSearchStrings()
            }
        })
    }

    function createYoutubeSearchStrings() {
        var searchSongs = []
        $('.songs .list-group-item').each(function(index, elem) {
            searchSongs.unshift(`${$(elem).attr('data-track')} ${$(elem).attr('data-artist')}`);
        })
        populateYoutubeIds(searchSongs)
    }

    function populateYoutubeIds(tracks) {
        videoIds = []
        var getVideoIdsArray = tracks.map(function(track) {
            return function(callback) {
                $.ajax({
                    url: `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${track}&type=video&key=AIzaSyAsA8OyLKjlemMUgQYPM5HWxt8pr88JHzw`,
                    success: function(data) {
                        videoIds.push(data.items[0].id.videoId)
                        callback(null, track)
                    },
                    error: function(data) {
                        callback(data)
                    }
                })
            }
        })

        async.series(getVideoIdsArray, function(err, results) {
            if (err) {
                console.log(err);
            }
            if (results) {
                UploadToYoutube(accessToken, videoIds)
                console.log(results);
            }
        })
        // for (var i = 0; i < tracks.length; i++) {
        //     var searchString = tracks[i]
        //     $.ajax({
        //         url: `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchString}&type=video&key=AIzaSyAsA8OyLKjlemMUgQYPM5HWxt8pr88JHzw`,
        //         success: function(data) {
        //             videoIds.push(data.items[0].id.videoId)
        //         }
        //     })
        // }
    }

    function UploadToYoutube(accessToken, videoIds) {
        console.log('video ids: ', videoIds);
        var seriesArray = videoIds.map(function(videoId) {
            return function(callback) {
                console.log('uploading: ', videoId);
                $.ajax({
                    type: 'POST',
                    url: `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key=AIzaSyAsA8OyLKjlemMUgQYPM5HWxt8pr88JHzw&access_token=${accessToken}`,
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "snippet": {
                            "playlistId": playlistId,
                            "resourceId": {
                                "kind": "youtube#video",
                                "videoId": videoId
                            },
                            "position": 0
                        }
                    }),
                    success: function() {
                        callback(null, playlistId)
                    },
                    error: function(data) {
                        callback(data)
                    }
                })
            }
        })

        async.series(seriesArray, function(err, results) {
            if (err) {
                console.log(err);
            }
            if (results) {
                console.log(results);
            }
        })
        addListenButton()
    }

    function addListenButton() {
        $('#create-playlist').hide()
        $('#youtube-auth').hide()
        $('.listen').remove()
        var listen = document.createElement('a')
        $(listen).attr('href', `https://www.youtube.com/playlist?list=${playlistId}`)
        $(listen).attr('target', 'blank')
        $(listen).html('Listen!')
        $(listen).addClass('listen btn btn-success')
        $('.navbar').append(listen)
        $('.uploading-tracks').html('Click \'Listen!\' to listen to your playlist')
    }
})

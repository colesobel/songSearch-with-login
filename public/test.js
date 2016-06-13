$(document).ready(function() {
    $.ajax({
        type: 'POST',
        url: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key=AIzaSyAsA8OyLKjlemMUgQYPM5HWxt8pr88JHzw',
        contentType: 'application/json',
        data: JSON.stringify({
             "snippet": {
              "playlistId": "PLf9KlP7F4ZswNE5SatZiz95pjd0ATIym1",
              "resourceId": {
               "kind": "youtube#video",
               "videoId": "wa2nLEhUcZ0"
              },
              "position": 0
             }
        })
    })

})

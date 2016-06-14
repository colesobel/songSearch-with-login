Youtube video search url:  https://www.googleapis.com/youtube/v3/search?part=snippet&q=higher+love+steve+winwood&type=video&key=AIzaSyAsA8OyLKjlemMUgQYPM5HWxt8pr88JHzw


link to playlist insert console
https://developers.google.com/apis-explorer/#p/youtube/v3/youtube.playlistItems.insert?part=snippet&_h=2&resource=%257B%250A++%2522snippet%2522%253A+%250A++%257B%250A++++%2522playlistId%2522%253A+%2522PLf9KlP7F4ZswNE5SatZiz95pjd0ATIym1%2522%252C%250A++++%2522resourceId%2522%253A+%250A++++%257B%250A++++++%2522kind%2522%253A+%2522youtube%2523video%2522%252C%250A++++++%2522videoId%2522%253A+%2522wIct9ZyL2WA%2522%250A++++%257D%252C%250A++++%2522position%2522%253A+0%250A++%257D%250A%257D&



youtube client id:
719644486942-miua9p0o58of75b40r06hcgfbkpb2njm.apps.googleusercontent.com


youtube client secret:
3En8DBb_94Octqyk92-nEQLf



web auth server:
https://accounts.google.com/o/oauth2/auth?client_id=719644486942-miua9p0o58of75b40r06hcgfbkpb2njm.apps.googleusercontent.com&redirect_uri=https://project-3022223182424588945.firebaseapp.com&scope=https://www.googleapis.com/auth/youtube&response_type=token


url to post to to create a new playlist:
https://www.googleapis.com/youtube/v3/playlists?part=snippet&key=AIzaSyAsA8OyLKjlemMUgQYPM5HWxt8pr88JHzw

request body for creating a new playlist:
{
    "snippet":{
    "title":"Cole's test playlist"
    "description": "to test out my app"
    }
}

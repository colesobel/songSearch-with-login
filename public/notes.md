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


scope i might want:
https://www.googleapis.com/auth/plus.login


new oauth redirect:
https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/plus.login&redirect_uri=https://project-3022223182424588945.firebaseapp.com&response_type=token&client_id=719644486942-miua9p0o58of75b40r06hcgfbkpb2njm.apps.googleusercontent.com &state=%2Fprofile &nonce=ssAXGdhvuoRJ6Ny9NOEA

old scope:
https://gdata.youtube.com


sample oauth call to manage youtube account
https://accounts.google.com/o/oauth2/auth?client_id=719644486942-miua9p0o58of75b40r06hcgfbkpb2njm.apps.googleusercontent.com&redirect_uri=https://project-3022223182424588945.firebaseapp.com&scope=https://www.googleapis.com/auth/youtube.upload&response_type=token&pageId=none

scope samples

https://accounts.google.com/o/oauth2/auth?client_id=292824132082.apps.googleusercontent.com&immediate=false&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.force-ssl+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.upload+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutubepartner+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutubepartner-channel-audit&include_granted_scopes=false&proxy=oauth2relay307223767&redirect_uri=postmessage&origin=https%3A%2F%2Fdevelopers.google.com&response_type=token&state=876692737%7C0.1867024634&authuser=0&jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en.PM7kne_6Sm8.O%2Fm%3D__features__%2Fam%3DAQ%2Frt%3Dj%2Fd%3D1%2Frs%3DAGLTcCNEpwWC3dJ8XeNVUYc5dEna45UfWA&pageId=none

https://accounts.google.com/o/oauth2/auth?client_id=292824132082.apps.googleusercontent.com&immediate=false&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.force-ssl+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.upload+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutubepartner+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutubepartner-channel-audit&include_granted_scopes=false&proxy=oauth2relay501056387&redirect_uri=postmessage&origin=https%3A%2F%2Fdevelopers.google.com&response_type=token&state=849511373%7C0.32824205&authuser=0&jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en.bBVQ4dZwKjw.O%2Fm%3D__features__%2Fam%3DAQ%2Frt%3Dj%2Fd%3D1%2Frs%3DAGLTcCOTk2qFkPwb_b9sVA1qBE3hP6hJqg&pageId=none


https://www.googleapis.com/auth/youtube

var request = new XMLHttpRequest();
var lyrics = document.getElementById("lyrics");
var submit = document.getElementById("submit");
var artist = document.getElementById("artist");
var song = document.getElementById("song");
var formattedArtist;
var formattedSong;
var data;

//Fetches JSON data from the lyrics.ovh api
submit.addEventListener("click",function(){
  console.log("submit");
  lyrics.innerHTML = "";
  formattedArtist = formatInput(artist.value);
  formattedSong = formatInput(song.value);
  console.log(formattedArtist);
  request.open("GET","https://api.lyrics.ovh/v1/"+formattedArtist+"/"+formattedSong);
  request.addEventListener("load",whenLoaded);
  request.send();
});
//Listens for an enter keypress
document.addEventListener("keypress",function(key){
  if(key.keyCode ===13){
    console.log("submit");
    lyrics.innerHTML = "";
    formattedArtist = formatInput(artist.value);
    formattedSong = formatInput(song.value);
    console.log(formattedArtist);
    request.open("GET","https://api.lyrics.ovh/v1/"+formattedArtist+"/"+formattedSong);
    request.addEventListener("load",whenLoaded);
    request.send();
  }
})

function whenLoaded(){
  //data = JSON.parse(request.responseText);
  console.log("loaded");
  console.log(request.status);
  if(request.status === 404){
    lyrics.innerHTML += "Lyrics not found";
    console.log("Lyrics not found");
  }else{
  data = request.responseText;
  var output = format(data);
  lyrics.innerHTML += output;
  console.log(data);
  }
}
//Inserts an "_" at each space
function formatInput(input){
  var formatted = "";
  var pos = input.indexOf(" ");
  for(var i =0;i<input.length;i++){
    if(pos===i){
      formatted+= "_";
    }else{
      formatted+=input.substring(i,i+1);
    }
    pos = input.indexOf(" ", i);
  }
  return formatted;
}
//Format the JSON data
function format(data){
  var formatted =" ";
  //Position of the start of the lyrics
  var pos = data.indexOf(":")+1;
  //Index of the next \n
  var nextLinePos = data.indexOf("\\n",pos);
  //Iterate through each character
  for(var i=pos;i<data.length-1;i++){
    if(nextLinePos===i){
      //Add a break into the html if i is the start of \n
      formatted+= "<br>";
      i+=1;
    }else{
    formatted+= data.substring(i,i+1);
    }
    //Gets the next index of \n
    nextLinePos = data.indexOf("\\n",i);
  }
  return formatted;
}
//Spotify Web player
//https://developer.spotify.com/documentation/web-playback-sdk/quick-start/#
window.onSpotifyWebPlaybackSDKReady = ()=>{
  const token = "BQBL14QKoh9zulDtpSifoHOIWZOlMvV7nYQPtrlDb6qYCJKDTPSFAAf3ckU1X48lXDk-9KGwAbxa6u5oz7UKAsTIVNS8LKYlGTZdmqrGDQGWQGhWIliry-jFn9HG5LvmimqC-1YIYa_swGf81tHsnM22j3AAPz0HXHS1tJVk";
  const player = new Spotify.Player({
    name:"Web Playback",
    getoAuthToken: cb =>{ cb(token)}
  });

  player.connect();
}

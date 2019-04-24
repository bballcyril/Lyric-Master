var request = new XMLHttpRequest();
var itunesRequest = new XMLHttpRequest();

var lyrics = document.getElementById("lyrics");
var submit = document.getElementById("submit");
var artist = document.getElementById("artist");
var song = document.getElementById("song");
var player = document.getElementById("player");
var wrapper = document.getElementById("wrapper");

player.volume = 0.1;
var formattedArtist;
var formattedSong;
var data;

//Fetches JSON data from the lyrics.ovh api
submit.addEventListener("click",function(){
  if(!(artist.value.length==0||song.value.length==0)){
    lyrics.innerHTML = "Loading....";
    formattedArtist = formatInput(artist.value);
    formattedSong = formatInput(song.value);
    request.open("GET","https://api.lyrics.ovh/v1/"+formattedArtist+"/"+formattedSong);
    request.addEventListener("load",whenLoaded);
    request.send();

    //Webplayer
    itunesArtist = itunesFormat(artist.value);
    itunesSong = itunesFormat(song.value);
    itunesRequest.open("GET","https://itunes.apple.com/search?term="+itunesArtist+"&"+itunesSong);
    itunesRequest.addEventListener("load",loadItunes);
    itunesRequest.send();
  }else{
    lyrics.innerHTML = "";
    lyrics.innerHTML += "Please enter both fields";
  }
});
//Listens for an enter keypress
document.addEventListener("keypress",function(key){
  if(key.keyCode ===13){
    if(!(artist.value.length==0||song.value.length==0)){
      lyrics.innerHTML = "Loading....";
      formattedArtist = formatInput(artist.value);
      formattedSong = formatInput(song.value);
      request.open("GET","https://api.lyrics.ovh/v1/"+formattedArtist+"/"+formattedSong);
      request.addEventListener("load",whenLoaded);
      request.send();
      //Webplayer
      itunesArtist = itunesFormat(artist.value);
      itunesSong = itunesFormat(song.value);
      itunesRequest.open("GET","https://itunes.apple.com/search?term="+itunesArtist+"&"+itunesSong);
      itunesRequest.addEventListener("load",loadItunes);
      itunesRequest.send();
    }else{
      lyrics.innerHTML = "";
      lyrics.innerHTML += "Please enter both fields";
    }
  }
});

function whenLoaded(){
  //data = JSON.parse(request.responseText);
  console.log("loaded");
  console.log(request.status);
  //If lyrics are not found
  if(request.status === 404){
    lyrics.innerHTML = "";
    lyrics.innerHTML += "Lyrics not found";
    console.log("Lyrics not found");
  }else{
    lyrics.innerHTML = "";
    data = request.responseText;
    var output = format(data);
    lyrics.innerHTML += output;
    console.log(data);
  }
}
function loadItunes(){
  var items = JSON.parse(itunesRequest.responseText);
  var songObject;
  console.log(JSON.parse(itunesRequest.responseText));
  console.log(itunesFormat(artist.value),itunesFormat(song.value));
  //Searches for the preview url in each JSON result
  for(var i =0;i<items.resultCount;i++){
    var results = items.results[i].trackName.toLowerCase();
    if(results.includes(song.value.toLowerCase())){
      songObject = items.results[i];
      var previewUrl = songObject.previewUrl;
      console.log(previewUrl);
      //Updates the player
      wrapper.innerHTML = "<audio controls='controls' id='player'><source id = 'source' src ="+previewUrl+"></audio>";
      var player = document.getElementById("player");
      player.volume = 0.1;
      console.log(i);

      //Stops loop once item is found
       break;
    }else{
      wrapper.innerHTML = "<audio controls='controls' id='player'><source id = 'source' src ="+previewUrl+"></audio>";
      console.log("Song not found");
    }
  }
}
function itunesFormat(input){
  var formatted = "";
  var pos = input.indexOf(" ");
  for(var i =0;i<input.length;i++){
    if(pos===i){
      formatted+= "&";
    }else{
      formatted+=input.substring(i,i+1);
    }
    pos = input.indexOf(" ", i);
  }
  return formatted;
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

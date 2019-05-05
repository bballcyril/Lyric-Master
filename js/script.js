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
var lyricsFound = false;
//Fetches JSON data from the lyrics.ovh api
submit.addEventListener("click",function(){
  if(!(artist.value.length==0||song.value.length==0)){
    lyrics.innerHTML = "Loading....";
    //Searches for lyrics
    formattedArtist = insert("_",artist.value);
    formattedSong = insert("_",song.value);
    request.open("GET","https://api.lyrics.ovh/v1/"+formattedArtist+"/"+formattedSong);
    request.addEventListener("load",whenLoaded);
    request.send();

    //Webplayer
    itunesArtist = insert("&",artist.value);
    itunesSong = insert("&",song.value);
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
      //Searches for lyrics
      lyrics.innerHTML = "Loading....";
      formattedArtist = insert("_",artist.value);
      formattedSong = insert("_",song.value);
      request.open("GET","https://api.lyrics.ovh/v1/"+formattedArtist+"/"+formattedSong);
      request.addEventListener("load",whenLoaded);
      request.send();
      //Webplayer
      itunesArtist = insert("&",artist.value);
      itunesSong = insert("&",song.value);
      itunesRequest.open("GET","https://itunes.apple.com/search?term="+itunesArtist+"&"+itunesSong);
      itunesRequest.addEventListener("load",loadItunes);
      itunesRequest.send();
    }else{
      lyrics.innerHTML = "";
      lyrics.innerHTML += "Please enter both fields";
    }
  }
});
//Loads lyrics
function whenLoaded(){
  console.log("loaded");
  console.log(request.status);
  //If lyrics are not found
  if(request.status != 200){
    lyrics.innerHTML = "";
    lyrics.innerHTML += "Lyrics not found";
    lyricsFound = false;
    console.log(lyricsFound);
  }else{
    lyrics.innerHTML = "";
    data = request.responseText;
    var output = format(data);
    lyrics.innerHTML += output;
    lyricsFound = true;
    console.log(lyricsFound);
  }
}
//Loads the web player
function loadItunes(){
  var items = JSON.parse(itunesRequest.responseText);
  var songObject;
  //Searches for the preview url in each JSON result
  for(var i =0;i<items.resultCount;i++){
    var results = items.results[i].trackName.toLowerCase();
    if(results.includes(song.value.toLowerCase())){
      songObject = items.results[i];
      var previewUrl = songObject.previewUrl;
      //Updates the player
      wrapper.innerHTML = "<audio controls='controls' id='player'><source id = 'source' src ="+previewUrl+"></audio>";
      var player = document.getElementById("player");
      player.volume = 0.1;
      //Stops loop once item is found
      break;
    }else{
      wrapper.innerHTML = "<audio controls='controls' id='player'><source id = 'source' src ="+previewUrl+"></audio>";
    }
  }
}
//Inserts a given character at every space
function insert(character, input){
  var formatted = "";
  var pos = input.indexOf(character);
  for(var i =0;i<input.length;i++){
    if(pos===i){
      formatted+=character;
    }else{
      formatted+=input.substring(i,i+1);
    }
    pos = input.indexOf(character,i);
  }
  return formatted;
}
//Formats the JSON data (lyrics)
//Replaces the \n with a <br>
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

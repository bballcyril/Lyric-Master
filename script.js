var request = new XMLHttpRequest();
var lyrics = document.getElementById("lyrics");
var data;

//Gets the JSON data from the lyrics.ovh api
request.open("GET","https://api.lyrics.ovh/v1/Drake/One_dance");
request.addEventListener("load",whenLoaded);
request.send();

function whenLoaded(){
  //data = JSON.parse(request.responseText);
  data = request.responseText;
  var output = format(data);
  lyrics.innerHTML += output;
  console.log(data);
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

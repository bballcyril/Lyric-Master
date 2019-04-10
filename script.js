var request = new XMLHttpRequest();
var data;


request.open("GET","https://api.lyrics.ovh/v1/Drake/One_dance");
request.addEventListener("load",whenLoaded);
request.send();

function whenLoaded(){
  //data = JSON.parse(request.responseText);
  data = request.responseText;
  var lyrics = document.getElementById("lyrics");
  var output = format(data);
  lyrics.innerHTML += output;
  console.log(data);
}
//Format the JSON data
function format(data){
  var formatted =" ";
  var pos = data.indexOf(":")+1;
  var nextLinePos = data.indexOf("\\n",pos);

  for(var i=pos;i<data.length-1;i++){
    if(nextLinePos===i){
      formatted+= "<br>";
      i+=1;
    }else{
    formatted+= data.substring(i,i+1);
    }
    nextLinePos = data.indexOf("\\n",i);
  }
  return formatted;
}

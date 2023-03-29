// Create the button element
if (document.body) {
  setTimeout(() => {
    process();
  }, 2500);

  //fnDefineEvents();
  //addText();
} else {
  document.addEventListener("DOMContentLoaded", process);
  document.addEventListener("DOMContentLoaded", fnDefineEvents);
}

function process() {
  //console.log(videoIds);
  var element = document.getElementById("eval_btn");
  if (element == null) {
    var btn = document.createElement("input");
    btn.value = "Evaluate";
    btn.type = "submit";
    btn.id = "eval_btn";
    str = "results?search_query";

    //Add an event listener to the button
    /*if(window.location.toString().includes("results"))
      {
        button.addEventListener("click", function() {
          alert("Show Positivity Percentage");
        });
      }*/
    console.log("Hello");
    var voicebtn = document.getElementById("voice-search-button");
    voicebtn.parentNode.appendChild(btn);
    // Add the button to the page
  }

  console.log("wait");
  var videoIds = [];
  var videoId;
  var first11Chars;
  document.querySelectorAll("a#video-title").forEach((a) => {
    //console.log(a)
    var href = a.getAttribute("href");
    if (href.includes("/watch")) {
      videoId = href.split("v=")[1];
      if (typeof videoId === "string") {
        first11Chars = videoId.slice(0, 11);
        console.log(first11Chars);
        //videoIds.push(first11Chars);
      }
    } else if (href.includes("/shorts")) {
      videoId = href.split("shorts/")[1];
      if (typeof videoId === "string") {
        first11Chars = videoId.slice(0, 11);
        console.log(first11Chars);
      }
    }
    videoIds.push(first11Chars);
  });

    let json_data = [];
    async function processVideos() {
      
      for (let i = 0; i < videoIds.length; i++) {
        const videoId = videoIds[i];
        const isVideoInDB = await searchVideo(videoId);
        if (isVideoInDB.detail==0) {
          console.log("Prediction start for Video",i);
          const prediction = await predictScore(videoId);
          console.log("Prediction end for Video",i);
          console.log("Predicted Value = ",prediction.predicted_score);
          await addData(prediction);
        } 
        else{
          await holdScore(isVideoInDB);
        }
      }
    }
    
    async function searchVideo(videoId) {
      const response = await fetch(`http://localhost:8000/search/${videoId}`);
      const data = await response.json();
      return data;
    }
    
    async function predictScore(videoId) {
      const response = await fetch(`http://localhost:8000/predict/${videoId}`);
      const data = await response.json();
      await holdScore(data);
      return data;
    }
    
    async function addData(prediction) {
      const response = await fetch(`http://localhost:8000/add_data/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(prediction)
      });
      const data = await response.json();
      return data.predicted_score;
    }
    async function holdScore(videodata) {
      json_data.push(videodata);
      console.log("Score to be shown for video:",videodata.predicted_score);
    }
   
  async function process()
  {  
    await processVideos();
    console.log(json_data);
  }
  process();
  console.log(videoIds);

  fnDefineEvents();
}

function fnDefineEvents() {
  // Add an event listener to the button

  document
    .getElementById("eval_btn")
    .addEventListener("click", function (event) {
      addText();
    });
}
function addText() {
  var title = document.getElementsByClassName(
    "yt-simple-endpoint style-scope ytd-video-renderer"
  );
  console.log(title.length);
  for (let i = 0; i < title.length / 2; i++) {
    title[i * 2].innerHTML = title[i * 2].textContent + " Hello" + i.toString();
  }
  //title=title+" "+ "Hello";
  //document.getElementById("video-title").innerHTML=title;
}

//}

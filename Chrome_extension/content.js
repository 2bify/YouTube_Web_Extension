// Create the button element
if (document.body) {
  var element = document.getElementById("eval_btn");
  if (element == null) {
    var btn = document.createElement("input");
    btn.value = "Evaluate";
    btn.type = "submit";
    btn.id = "eval_btn";
    str = "results?search_query";

    //Add an event listener to the button
    console.log("Hello");
    var voicebtn = document.getElementById("voice-search-button");
    voicebtn.parentNode.appendChild(btn);
    // Add the button to the page
  }
  //Loading Div
  var loadingEl = document.createElement("div");
  loadingEl.id = "loading-overlay";
  loadingEl.classList.add("loading","hidden");
  loading_div2 = document.createElement("div");
  loading_div2.className = "uil-ring-css";
  loading_div2.style = 'transform:scale(0.79);';
  loading_div3 = document.createElement("div");

  loading_div2.appendChild(loading_div3);
  loadingEl.appendChild(loading_div2);
  loadingEl.appendChild(loading_div2);
  document.body.appendChild(loadingEl);

  function EventHandler(){
    var btn = document.getElementById("eval_btn");
    btn.value = "Show";
    btn.classList.add("show-btn");
    let overlay = document.getElementById("loading-overlay");
    if(overlay.classList.contains('hidden')){
      overlay.classList.remove('hidden');
    }
  }
  document
    .getElementById("eval_btn")
    .addEventListener("click", EventHandler);
  setTimeout(() => {
    process_overall(()=>{
      if (window.location.href.indexOf("youtube.com/results") > -1) {
        document
        .getElementById("eval_btn")
        .removeEventListener("click", EventHandler);
        console.log("after computation");
        document
        .getElementById("eval_btn")
        .addEventListener("click", function () {
          var btn = document.getElementById("eval_btn");
          if (btn.value == "Evaluate")
          {
            btn.value = "Show";
            btn.classList.add("show-btn");
          }
          else{
            console.log("inside callback");
            showResults();
            btn.disabled = true;
            btn.classList.add("disabled-btn");
          }
        });
      }
    });
  }, 2500);

} else {
  document.addEventListener("DOMContentLoaded", process);
  document.addEventListener("DOMContentLoaded", fnDefineEvents);
}

var json_data = [];
function process_overall(callback) {

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


    async function processVideos() {
      let stop=false;
      for (let i = 0; i < videoIds.length; i++) {
        if (window.location.href.indexOf("youtube.com/results") < 0) {
          break;
        }

        const videoId = videoIds[i];
        const isVideoInDB = await searchVideo(videoId);
        if (isVideoInDB==null) {
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
      await holdScore(data);
      return data.predicted_score;
    }
    async function holdScore(videodata) {
      if(videodata.hasOwnProperty('created_at')){
        delete videodata['created_at'];
      }
      if(videodata.hasOwnProperty('no_of_comments')){
        delete videodata['no_of_comments'];
      }
      if(videodata.hasOwnProperty('p_comments')){
        delete videodata['p_comments'];
      }
      json_data.push(videodata);
      console.log("Score to be shown for video:",videodata.predicted_score);
    }
   
  async function removeLoading(){
    let overlay = document.getElementById("loading-overlay");
    if(overlay && !overlay.classList.contains('hidden')){
        overlay.classList.add('hidden');
        console.log("Loading can be removed");
    }
  }
  async function process()
  {  
    await processVideos();
    await removeLoading();
    console.log(json_data);
    
  }
  async function all()
  {
    await process();
    await callback();
  }
  all();
  console.log(videoIds);
}
// function addText() {
//   var title = document.getElementsByClassName(
//     "yt-simple-endpoint style-scope ytd-video-renderer"
//   );
//   console.log(title.length);
//   for (let i = 0; i < title.length / 2; i++) {
//     title[i * 2].innerHTML = title[i * 2].textContent + " Hello" + i.toString();
//   }
// }

function showResults() {
  var first11Chars;
  document.querySelectorAll("a#video-title").forEach((a,index) => {
    var href = a.getAttribute("href");
    var title = a.getAttribute("title");
    if (href.includes("/watch")) {
      videoId = href.split("v=")[1];
      if (typeof videoId === "string") {
        first11Chars = videoId.slice(0, 11);
        //videoIds.push(first11Chars);
      }
    } else if (href.includes("/shorts")) {
      videoId = href.split("shorts/")[1];
      if (typeof videoId === "string") {
        first11Chars = videoId.slice(0, 11);
      }
    }
    var isMatch = json_data.find((obj) => obj.video_id === first11Chars);
    if (isMatch)
    {
      // console.log("The video ID matches!");
      // console.log(title);
      // a.textContent = title + " VALUE = " + isMatch.predicted_score.toString();
      
      var channel=a.parentElement.parentElement.parentElement.parentElement.querySelector("div#channel-info")
      if(channel.querySelector("div#show_val")){
        channel.removeChild(channel.querySelector("div#show_val"));
      }
      var scoreDiv = document.createElement("div");
      scoreDiv.id="show_val";
      scoreDiv.textContent = " VALUE = " + isMatch.predicted_score.toString();
      scoreDiv.style.display = "relative";
      scoreDiv.style.float = "right";
      scoreDiv.style.marginRight = "1px";
      a.parentElement.parentElement.parentElement.parentElement.querySelector("div#channel-info").appendChild(scoreDiv);
    }
    else
      console.log("The video ID does not match.");


  });
}
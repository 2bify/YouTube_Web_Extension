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
  //fnDefineEvents();

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


  document
    .getElementById("eval_btn")
    .addEventListener("click", function (event) {

      let overlay = document.getElementById("loading-overlay");
      if(overlay.classList.contains('hidden')){
        overlay.classList.remove('hidden');
      }
    });
  setTimeout(() => {
    process_overall();
  }, 2500);

} else {
  document.addEventListener("DOMContentLoaded", process);
  document.addEventListener("DOMContentLoaded", fnDefineEvents);
}

function process_overall() {

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
      let stop=false;
      for (let i = 0; i < videoIds.length; i++) {
        if (window.location.href.indexOf("youtube.com/results") < 0) {
          break;
        }

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
   
  async function removeLoading(){
    let overlay = document.getElementById("loading-overlay");
    if(overlay && !overlay.classList.contains('hidden')){
        overlay.classList.add('hidden');
      }
    console.log("Loading can be removed");
  }
  async function process()
  {  
    await processVideos();
    await removeLoading();
    console.log(json_data);
  }
  process();
  console.log(videoIds);

}
function addText() {
  var title = document.getElementsByClassName(
    "yt-simple-endpoint style-scope ytd-video-renderer"
  );
  console.log(title.length);
  for (let i = 0; i < title.length / 2; i++) {
    title[i * 2].innerHTML = title[i * 2].textContent + " Hello" + i.toString();
  }
}
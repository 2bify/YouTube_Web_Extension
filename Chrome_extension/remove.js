if(document.body)
{
  process();
}
else 
{
  document.addEventListener('DOMContentLoaded', process);
}

function process(){
    var element = document.getElementById("eval_btn");
    if(element){
        element.remove()
    }
    let overlay = document.getElementById("loading-overlay");
    if(overlay && !overlay.classList.contains('hidden')){
        overlay.classList.add('hidden');
    }
}

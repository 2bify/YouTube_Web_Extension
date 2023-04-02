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
    var element2 = document.querySelectorAll("#show_val");
    for (var i = 0; i < element2.length; i++) {
      if(element2)
      {
        element2[i].remove();
      }
    }
    let overlay = document.getElementById("loading-overlay");
    if(overlay && !overlay.classList.contains('hidden')){
        overlay.classList.add('hidden');
    }
}

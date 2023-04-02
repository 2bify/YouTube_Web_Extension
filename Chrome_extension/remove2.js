if(document.body)
{
  process();
}
else 
{
  document.addEventListener('DOMContentLoaded', process);
}

function process(){
    var element1 = document.getElementById("eval_btn");
    if(element1.value=="Show"){
        element1.value="Evaluate";
        element1.disabled=false;
        element1.classList.remove("disabled-btn");
        element1.classList.remove("show-btn");
    }
    var element2 = document.querySelectorAll("#show_val");
    for (var i = 0; i < element2.length; i++) {
      if(element2)
      {
        element2[i].remove();
      }
    }
}
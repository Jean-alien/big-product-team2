// const card = document.querySelector(".flip-card");

// card.addEventListener("click", function () {
//   card.classList.toggle("show");
// });

$(".flip-card card").on("click", (e)=>{
    
    let $clickedCard = $(e.target).closest(".card"); 
   
      if($(e.target).prop("tagName")!="I" && $clickedCard.find(".edit").is(":hidden")){
        //grab the containing .card regardless of what element was clicked inside the card  
        let $clickedCard = $(e.target).closest(".card");
  
        //locate the closest classes .back and .front and toggle (hide/show)
        $clickedCard.find(".back, .front").toggle();
        $clickedCard.find(".edit").hide();
          
        }
      else if($(e.target).prop("tagName")==="I"){
  
        if($(e.target).prop("className") == "bi bi-pencil-fill float-end")
        { 
          $clickedCard.find(".back").hide();
          $clickedCard.find(".front").hide();
          $clickedCard.find(".edit").show();  
        }
        else if($(e.target).prop("className") == "bi bi-x-lg float-end")
        { 
          $clickedCard.find(".front").show();
          $clickedCard.find(".edit").hide();  
        }
      }
    
     
  }); 
  
  
  $(".back, .edit").hide();  
  $("#quiz-things").hide(); 
  
  
  function calcHeight(value) {
    let numberOfLineBreaks = (value.match(/\n/g) || []).length;
    // min-height + lines x line-height + padding + border
    let newHeight = 20 + numberOfLineBreaks * 20 + 12 + 2;
    return newHeight;
  }
  
  let textarea = document.querySelector(".resize-ta");
  textarea.addEventListener("keyup", () => {
    textarea.style.height = calcHeight(textarea.value) + "px";
  });
  
  
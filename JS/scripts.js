
const usersText = document.getElementById("userRequest");
const resetButton = document.getElementById("resetButton");
let result1;
let result2;
let index2;
let click = false;
let seeMoreDivContainer = [];
let wordArray = [];

function eraseSeeMoreContainer (seeMoreDivContainer){
  for (let i = 0; i < seeMoreDivContainer.length; i++) {
    seeMoreDivContainer[i].remove();
  };
}

function resetPage(){
  document.getElementById("userRequest")
          .value = "";
  window.location.reload();
}

function createDiv() {
  
    resultDiv = document.getElementById("searchResult");
    printDiv = document.createElement("div"); 
    resultDiv.appendChild(printDiv);
    
    printId = document.createAttribute("id");  
    printId.value = "results";            
    printDiv.setAttributeNode(printId);

}

function createDivForSeeMore(index2) {
  
  seeMoreDiv = document.getElementById(`paragraph${index2}`);
  printDiv = document.createElement("div"); 
  seeMoreDiv.appendChild(printDiv);
  
  printId = document.createAttribute("id");  
  printId.value = `seeMore${index2}`;            
  printDiv.setAttributeNode(printId);

  seeMoreDivContainer.push(printDiv);

}

function createDetailParagraph(quote, index1, index2){
  
      result2 = document.querySelector(`#seeMore${index2}`);      
      
      exampleExists = quote.meanings[index1].definitions[index2].example;
      
      printParagraph = document.createElement("p"); 
      printParagraph.innerText = `${"Ejemplo: "}${quote.meanings[index1].definitions[index2].example}`;
      
      if(exampleExists){
        result2.appendChild(printParagraph);
      }
      else{
        printParagraph.innerText = "No hay ejemplos a mostrar";
        result2.appendChild(printParagraph);
      };
  
}

function retreiveDetailInfo(character, index1, index2){

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/es/${character}`)
  .then(response => response.json())  
  .then(data => {
      data.map(quote =>{
      
      createDivForSeeMore(index2);
      createDetailParagraph(quote, index1, index2);
      });
  })
  .catch(() => {
      console.log("Error")
      printMessage();
    });


}

function createParagraph(quote){
  
  //for (let index1 = 0; index1 < quote.meanings.length; index1++) {
    let index1 = 0;
    
    for (let index2 = 0; index2 < quote.meanings[0].definitions.length; index2++) {
      
      result1 = document.querySelector('#results')      
      
      printParagraph = document.createElement("p"); 
      printParagraph.innerText = `${index2 + 1}${". "}${quote.meanings[0].definitions[index2].definition}`;
      result1.appendChild(printParagraph); 

      printId = document.createAttribute("id"); 
      printId.value = `paragraph${index2}`;  
      printParagraph.setAttributeNode(printId);

      document.getElementById(`paragraph${index2}`).addEventListener("click", function() {
          eraseSeeMoreContainer(seeMoreDivContainer);
          retreiveDetailInfo(userRequest.value, index1, index2);
      });
      
    }
  //}
}

function printMessage(){
  createDiv()
  document.getElementById("results")
          .innerText = "No se han encontrado resultados para la palabra solicitada";
}

function dictionaryApi(character) {
    if(character !== "") {
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/es/${character}`)
        .then(response => response.json())  //response pasa el valor al parametro data
        .then(data => {
            //console.log(data);
            data.map(quote =>{  //estoy pasando cada elemento de data al parámetro quote
            createDiv();
            createParagraph(quote);
            });
        })
        .catch(() => {
            console.log("Error")
            printMessage();
          });
    }
  }

  function eraseResults(){
    let container = document.getElementById("results");
    if (container){
        container.remove();
    };
  }

  document.querySelector('#searchButton').addEventListener("click", function() {
    eraseResults();
    dictionaryApi(userRequest.value);
  });

  resetButton.addEventListener ("click", resetPage);





  
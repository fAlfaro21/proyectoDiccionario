
const usersText = document.getElementById("userRequest");
const resetButton = document.getElementById("resetButton");
let result1;
let result2;
let index2;
let click = false;
let seeMoreDivContainer = [];
let paragraphArray = [];
let detailParagraph = [];
let detailParagraphId = "";
let goBackButton = "";
let userRequestValue = "";
let requestDiv = "";
let getMainSearch;

function eraseSeeMoreContainer (seeMoreDivContainer){
  for (let i = 0; i < seeMoreDivContainer.length; i++) {
    seeMoreDivContainer[i].remove();
  };
}

function eraseContainer(){
  if (document.querySelector("#results")){
  document.querySelector("#results").remove();  
  }
}

function resetPage(){
  document.getElementById("userRequest")
        .value = "";
  eraseContainer();
  getMainSearch = [];
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
  //seeMoreDiv = document.getElementById(`paragraph${index2}`);
  seeMoreDiv = document.getElementById("searchResult");
  printDiv = document.createElement("div"); 
  seeMoreDiv.appendChild(printDiv);
  
  printId = document.createAttribute("id");  
  printId.value = `seeMore${index2}`;            
  printDiv.setAttributeNode(printId);

  seeMoreDivContainer.push(printDiv);
}

function eraseDetailResults(goBackButton){
  goBackButton.remove();
}

function createDetailParagraph(quote, index1, index2){
  
      result2 = document.querySelector(`#seeMore${index2}`); 
      detailParagraphId = `seeMore${index2}`;
      
      printDetailParagraph = document.createElement("h2");
      printDetailParagraph.innerText = userRequestValue;
      result2.appendChild(printDetailParagraph);

      printParagraph = document.createElement("h3"); 
      printParagraph.innerText = paragraphArray[index2];
      result2.appendChild(printParagraph);      
      
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
      return detailParagraphId;  
}

function createGoBackButton(index2, stringSearched){
      goBackButton = document.querySelector(`#seeMore${index2}`);
      printButton = document.createElement("button"); 
      printButton.innerText = "Volver";   
      goBackButton.appendChild(printButton);

      printId = document.createAttribute("id");  
      printId.value = `seeMoreInput${index2}`; 
      printButton.setAttributeNode(printId);

      goBackButton.addEventListener("click", function() {      
      eraseDetailResults(goBackButton);
      //Vuelve a poner lo que había
      userRequestDiv = document.getElementById("mainDiv");
      userRequestDiv.appendChild(requestDiv);

      getMainSearch = JSON.parse(window.localStorage.getItem(stringSearched));

      getMainSearch.map(quote =>{
        createDiv();
        createParagraph(quote);
        }); 
      });
}

function retreiveDetailInfo(stringSearched, index1, index2){
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/es/${stringSearched}`)
  .then(response => response.json())  
  .then(data => {
      data.map(quote =>{      
      createDivForSeeMore(index2);
      createDetailParagraph(quote, index1, index2);
      createGoBackButton(index2, stringSearched);
      });
  })
  .catch(() => {
      console.log("Error")
      printMessage();
    });
}

function eraseRequestDiv(){
    requestDiv = document.getElementById("requestDiv");
    document.getElementById("requestDiv").remove();
}

function createParagraph(quote){
    //console.log(quote);
    let index1 = 0;
    
    for (let index2 = 0; index2 < quote.meanings[0].definitions.length; index2++) {
      
      result1 = document.querySelector('#results')      
      
      printParagraph = document.createElement("p"); 
      printParagraph.innerText = `${index2 + 1}${". "}${quote.meanings[0].definitions[index2].definition}`;
      result1.appendChild(printParagraph); 

      printId = document.createAttribute("id"); 
      printId.value = `paragraph${index2}`;  
      printParagraph.setAttributeNode(printId);

      paragraphArray.push(`${quote.meanings[0].definitions[index2].definition}`);

      document.getElementById(`paragraph${index2}`).addEventListener("click", function() {
          //userRequestValue =  userRequest.value;
          eraseRequestDiv();
          eraseContainer();
          //eraseSeeMoreContainer(seeMoreDivContainer);//No lo utilizo
          retreiveDetailInfo(userRequestValue, index1, index2);          
      });
      
    }
}

function printMessage(){
  createDiv()
  document.getElementById("results")
          .innerText = "No se han encontrado resultados para la palabra solicitada";
}

function dictionaryApi(stringSearched) {
    if(stringSearched !== "") {
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/es/${stringSearched}`)
        .then(response => response.json())
        .then(data => {
            data.map(quote =>{  
            createDiv();
            createParagraph(quote);
            });            
            window.localStorage.setItem(stringSearched, JSON.stringify(data));
            console.log("He buscado en el API la palabra: " + stringSearched);
        })
        .catch(() => {
            console.log("Error")
            printMessage();
            //.catch(err => console.error(err));
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
    paragraphArray = [];
    eraseResults();
    userRequestValue =  userRequest.value;

    //Si la palabra buscada ya existe en el localStorage, no hace el fecth
    if(JSON.parse(window.localStorage.getItem(userRequestValue))){
        createDiv();
        JSON.parse(window.localStorage.getItem(userRequestValue)).map(quote =>{
            createDiv();
            createParagraph(quote);
            console.log("No he buscado en api: " + userRequestValue);
        });
    }
    //de lo contrario hace el fetch
    else{
      dictionaryApi(userRequest.value);
    }
  });

  resetButton.addEventListener ("click", resetPage);





  
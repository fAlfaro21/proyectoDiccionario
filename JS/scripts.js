const firebaseConfig = {
  apiKey: "AIzaSyCoOmtra5ckFJNXoBJIjGj2kxxgW7MLxt0",
  authDomain: "urban-monsters-fagr.firebaseapp.com",

  databaseURL: "https://urban-monsters-fagr-default-rtdb.europe-west1.firebasedatabase.app/",

  projectId: "urban-monsters-fagr",
  storageBucket: "urban-monsters-fagr.appspot.com",
  messagingSenderId: "796778185874",
  appId: "1:796778185874:web:cbdb57673ae9a836b7d24b"
};

//*************************************************************

const usersText = document.getElementById("userRequest");
const resetButton = document.getElementById("resetButton");
let data;
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
let next = 0;
let exampleExists = "";
let verification;
let noExamplesToShow;
let referenceId;
let FavouriteDefinitionExists;
let favouriteWord;

function eraseSeeMoreContainer (seeMoreDivContainer){
  for (let i = 0; i < seeMoreDivContainer.length; i++) {
    seeMoreDivContainer[i].remove();
  };
}

function eraseContainer(){
  if (document.querySelector("#favorites")){
    document.querySelector("#favorites").remove();  
    }
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
    printId.value = "favorites";            
    printDiv.setAttributeNode(printId);

    if (favouriteWord){
      printH3 = document.createElement("h3"); 
      printH3.innerText = "Favoritos";
      printDiv.appendChild(printH3);  
    }
  
    printDiv = document.createElement("div"); 
    resultDiv.appendChild(printDiv);
    
    printId = document.createAttribute("id");  
    printId.value = "results";            
    printDiv.setAttributeNode(printId);

    if (favouriteWord){
      printH3 = document.createElement("h3"); 
      printH3.innerText = "Otras definiciones";
      printDiv.appendChild(printH3);
    }
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
        noExamplesToShow = false;
      }
      else{
        printParagraph.innerText = "No hay ejemplos a mostrar";
        result2.appendChild(printParagraph);
        noExamplesToShow = true;
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

async function init() {
  // Acceder a la BD
  await firebase.initializeApp(firebaseConfig);  

  database = firebase.database();
  messagesRef = database.ref('messages');   //invoca a una referencia

  // Cuando cambien los datos (o en la primera carga)
  await messagesRef.on('value', response => { //esta todo el rato escuchando/observando: cuando alguien cambie el valor de la referencia, recojo el estado del array,lo parseo...
    const newdata = response.val();  //....lo parseo para saber cuál es el último
    data = Object.values(newdata);
    // Actualizar el valor del mensaje siguiente
    next = data.length; 
    // Pintar datos
    // document
    //   .querySelector("#messagesBox")
    //   .textContent = data.map(item =>
    //     `${item.timestamp}: ${item.text}, `);
  }); 
}

function saveFavorites(message, stringSearched) {
  database.ref('messages/' + next).update({
    id: next,
    timestamp: Date.now(),
    word: stringSearched,
    text: message
  });
}

function removeFavorites(){
  database.ref('messages/' + referenceId).remove();
}

function verifyIfIsInFavorites(FavouriteDefinition){
  data.forEach(element => {
    //console.log("Element.text: " + element.text);
    //console.log("Favourites Definition:"  + FavouriteDefinition);
    if(element.text == FavouriteDefinition){
      FavouriteDefinitionExists = true;
         };    
  });
}

function verifyIfExampleExists(){
  data.forEach(element => {
    if(element.text === exampleExists){
           verification = true;
           referenceId = element.id;
         };    
  });
}

function verifyIfWordIsFavourite(stringSearched){
  data.forEach(element => {
    //console.log("element.word " + element.word);
    if(element.word === stringSearched){
           favouriteWord = true;
         };    
  });
}

function createFavoritesButton(index2, stringSearched){
  verification = false;
  verifyIfExampleExists(stringSearched);

  favoritesButton = document.querySelector(`#seeMore${index2}`);
  printButton = document.createElement("button"); 
  if(verification){
    printButton.innerText = "Quitar de favoritos";
  }
  else{
    printButton.innerText = "Guardar";
  }     
  favoritesButton.appendChild(printButton);

  printId = document.createAttribute("id");  
  printId.value = "seeMoreButton"; 
  printButton.setAttributeNode(printId);

  document.querySelector("#seeMoreButton").addEventListener("click", function() {        
      if (verification == false){
        saveFavorites(exampleExists, stringSearched);
      }
      else{
        removeFavorites();
      }      
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
      if(noExamplesToShow == false){
      createFavoritesButton(index2, stringSearched);
      }
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
    
    for (let index2 = 0; index2 < quote.meanings[0].definitions.length; index2++) { //console.log("Data" + data);

      FavouriteDefinitionExists = false;
      verifyIfIsInFavorites(quote.meanings[0].definitions[index2].example);
      
      FavouriteDefinitionExists ?
      result1 = document.querySelector('#favorites') :  
      result1 = document.querySelector('#results');
      
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
            //console.log("He buscado en el API la palabra: " + stringSearched);
        })
        .catch(() => {
            console.log("Error")
            printMessage();
            //.catch(err => console.error(err));
          });
    }
  }

  function eraseResults(){
    let favoritesContainer = document.getElementById("favorites");
    if (favoritesContainer){
      favoritesContainer.remove();
  };
    let container = document.getElementById("results");
    if (container){
        container.remove();
    };
  }
 
 document.querySelector('#searchButton').addEventListener("click", function() {
    paragraphArray = [];
    eraseResults();
    userRequestValue =  userRequest.value;

    favouriteWord = false;
    verifyIfWordIsFavourite(userRequestValue);

    //Si la palabra buscada ya existe en el localStorage, no hace el fecth
    if(JSON.parse(window.localStorage.getItem(userRequestValue))){
        //createDiv();
        JSON.parse(window.localStorage.getItem(userRequestValue)).map(quote =>{
            createDiv();
            createParagraph(quote);
            //console.log("No he buscado en api: " + userRequestValue);
        });
    }
    //de lo contrario hace el fetch
    else{
        dictionaryApi(userRequest.value);
    }
  });

  resetButton.addEventListener ("click", resetPage);

  init();
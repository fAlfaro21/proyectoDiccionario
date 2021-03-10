  //pegamos el objeto de configuracion que viene de la pagina de firebase
  // const firebaseConfig = {
  //   apiKey: "AIzaSyCoOmtra5ckFJNXoBJIjGj2kxxgW7MLxt0",
  //   authDomain: "urban-monsters-fagr.firebaseapp.com",

  //   databaseURL: "https://urban-monsters-default-rtdb.europe-west1.firebasedatabase.app/",

  //   projectId: "urban-monsters-fagr",
  //   storageBucket: "urban-monsters-fagr.appspot.com",
  //   messagingSenderId: "796778185874",
  //   appId: "1:796778185874:web:cbdb57673ae9a836b7d24b"
  // };

  firebase.initializeApp(firebaseConfig);

  let siguiente = 0;

  // Actualizar el valor del mensaje siguiente
    firebase
      .database()
      .ref('messages')
      .on('value', response =>
        siguiente = response.val().length
    );

function myReadMessages() {

  //****************************************************************
  // Acceder a la BD: Para leer y escribir en una BD, se requiere de una instancia firebase.database.reference
  const database = firebase.database();

  //   Cargar nuevos mensajes o actualizaciones
  //   database.ref('messages/' + ultimo).update({
  //       timestamp:
  //       text:
  //   })    
  //****************************************************************
  // Pedir datos
  const myMessagesRef = database.ref('messages');
  //   const messagesRef = database.ref('messages/0/text'); //accede a la posición 0, y al texto. Se trata de una llamada al contenido.

  myMessagesRef.on('value', (myResponse) => { //Se trata de una tarea de lectura asíncrona (método on): cuando alguien cambie el valor de lo que hay en la referencia (ej: se mete uno nuevo, quita uno, etc), se va a disparar por el websocket, firebase le va avisar a mi aplicación del cambio. Entonces se disparará un evento value.
    const data = myResponse.val(); //abre el paquete para acceder a los datos
    //****************************************************************
    // Pintar datos
      document
      .querySelector("#messagesBox")
      .textContent = data.map((item) => //aquí tendré un array con lo que he solicitado
        `${item.timestamp}: ${item.text}, `);
    });
    }
    document
      .querySelector("#readBtn")
      .addEventListener("click", myReadMessages)          

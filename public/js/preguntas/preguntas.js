class Pregunta {
    constructor () {
        this.db = firebase.firestore();
        //const settings = { timestampsInSnapshots : true };
        //this.db.settings(settings);
    }
  
    crearPregunta (id_pregunta, preguntatxt, preguntaurl, respuesta1, respuesta2, respuesta3, respuesta4, correcta) {
  
        return this.db.collection('preguntas').add({
            id_pregunta : id_pregunta,
            preguntatxt : preguntatxt,
            preguntaurl : preguntaurl,
            respuesta1 : respuesta1,
            respuesta2 : respuesta2,
            respuesta3 : respuesta3,
            respuesta4 : respuesta4
        })
        .then( refDoc => {
          console.log(`Id de la pregunta => ${refDoc.id}`);
          return this.db.collection('correctas').add({
              id_pregunta: id_pregunta,
              correcta: correcta
          })
          .then(refDoc =>{
              console.log(`Id de la respuesta correcta => ${refDoc.id}`)
          })
          .catch(error => {
              console.log(`Error creando la correcta => ${error}`)
          })
        })
        .catch(error => {
          console.log(`Error creando la pregunta => ${error}`);
        })
    }

    consultarTodasPreguntas () {
      this.db.collection('preguntas')
          .onSnapshot(querySnapshot => {
              console.log(querySnapshot);
      })
    }
  
    subirImagenPregunta(file){
        const refStorage = firebase.storage().ref(`imgPreguntas/${file.name}`);
        const task = refStorage.put(file);
  
        task.on('state_changed',
          snapshot => {
              const porcentaje = snapshot.bytesTransferred / snapshot.totalBytes * 100;
              $('.progress-bar').attr('style',`width: ${porcentaje}%`);
          },
          err => {
              console.log(`Error subiendo el archivo => ${err.message}`,4000);
          },
          () => {
              task.snapshot.ref
                  .getDownloadURL()
                  .then( url => {
                      console.log(url);
                      sessionStorage.setItem('imgNewPreg', url);
                  })
                  .catch( error => { 
                      console.log(`Error obteniendo downloadURL => ${error}`, 4000);
                  })
          }
          )
    }
  
  }
  
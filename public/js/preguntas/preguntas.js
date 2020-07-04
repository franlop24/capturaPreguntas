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
            let preguntasExam = [];
            querySnapshot.forEach(pregunta => {
                let preguntaActual = {
                    id_pregunta : pregunta.data().id_pregunta,
                    preguntatxt : pregunta.data().preguntatxt,
                    preguntaurl : pregunta.data().preguntaurl,
                    respuesta1 : pregunta.data().respuesta1,
                    respuesta2 : pregunta.data().respuesta2,
                    respuesta3 : pregunta.data().respuesta3,
                    respuesta4 : pregunta.data().respuesta4
                }
                preguntasExam.push(preguntaActual);
                //console.log(preguntaActual);
            })
            console.log(preguntasExam);
            localStorage.setItem('preguntas', JSON.parse(preguntasExam));
        })
    }

    cuentaTerminados(){
        this.obtieneCorrectas()
        this.db.collection('alumnos')
        .where("activeExam1", "==", false)
        .onSnapshot(querySnapshot => {
            let preguntasExam = [];
            querySnapshot.forEach(alumno => {
                let preguntaActual = {
                    username : alumno.data().username,
                    //user: alumno.data().user,
                    respuestas: alumno.data().alumnExam,
                    carrera: alumno.data().alumnData.carrera
                }
                preguntasExam.push(preguntaActual);
                //calificaExamen(preguntaActual.user);
                //console.log(preguntaActual);
                preguntaActual.resultado = this.obtieneResultados(preguntaActual.respuestas);
                console.log(preguntaActual);
            })
            console.log(preguntasExam.length);
        })
    }

    obtieneResultados(dataAlumno){
        let cuentaCorrectas = 0;
        dataAlumno.test.forEach(respuesta => {
            let buscaenCorrectas = this.CorrectasExam.find(element => element.pregunta == respuesta.pregunta);
            if(buscaenCorrectas){
                if(buscaenCorrectas.correcta == respuesta.respuesta){
                    cuentaCorrectas++;
                }
            }
        })
        //console.log(cuentaCorrectas);
        return cuentaCorrectas;
    }

    cuentaPorTerminar(){
      this.db.collection('alumnos')
        .where("time", "==", 7200)
        .onSnapshot(querySnapshot => {
            let preguntasExam = [];
            querySnapshot.forEach(alumno => {
                let preguntaActual = {
                    username : alumno.data().username,
                    carrera: alumno.data().alumnData.carrera
                }
                preguntasExam.push(preguntaActual);
                //console.log(preguntaActual);
            })
            console.log(preguntasExam);
            console.log(preguntasExam.length);
        })
    }

    calificaExamen(userId){
        this.obtieneCorrectas();
        //let Calificar;
        this.db.collection('alumnos')
            .where("user","==", userId)
            .onSnapshot(querySnapshot => {
                let alumnoData = []
                querySnapshot.forEach(alumno => {
                    let alumnoActual = {
                        username: alumno.data().username,
                        carrera: alumno.data().alumnData.carrera,
                        respuestas: alumno.data().alumnExam
                    }
                    alumnoData.push(alumnoActual)
                })
                console.log(alumnoData[0]);
                //Calificar = alumnoData[0];
            
            let cuentaCorrectas = 0;
            alumnoData[0].respuestas.test.forEach(respuesta => {
                let buscaenCorrectas = this.CorrectasExam.find(element => element.pregunta == respuesta.pregunta);
                if(buscaenCorrectas){
                    if(buscaenCorrectas.correcta == respuesta.respuesta){
                        cuentaCorrectas++;
                    }
                }
            })
            console.log(cuentaCorrectas);
        })
    }

    obtieneCorrectas(){
        this.db.collection('correctas')
            .onSnapshot(querySnapshot => {
                let correctas = []
                querySnapshot.forEach(correcta => {
                    let correctaActual = {
                        pregunta: correcta.data().id_pregunta,
                        correcta: correcta.data().correcta
                    }
                    correctas.push(correctaActual);
                })
                this.CorrectasExam = correctas;
            })
    }

    cuentaTodos(){
      this.db.collection('alumnos')
        .onSnapshot(querySnapshot => {
            let preguntasExam = [];
            querySnapshot.forEach(alumno => {
                let preguntaActual = {
                    username : alumno.data().username
                }
                preguntasExam.push(preguntaActual);
                //console.log(preguntaActual);
            })
            console.log(preguntasExam.length);
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

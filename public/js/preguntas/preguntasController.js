$(() => {
    $('#btnLimpia').click(() => {
        Limpia();
    })
  
    $('#btnGuarda').click(() => {

      if($('#pregunta_txt').val() == '' ||
          $('#id_pregunta').val() == '' || 
          $('#res1').val() == '' || 
          $('#res2').val() == '' || 
          $('#res3').val() == '' || 
          $('#res4').val() == '' || 
          $('#correcta').val() == '' ||
          $('#id_examen').val() == ''
          ){
            return;
          }

      const pregunta = new Pregunta();
    
      const id_examen = $('#id_examen').val();
      const id_pregunta = $('#id_pregunta').val();
      const pregunta_txt = $('#pregunta_txt').val();
      const respuesta1 = $('#res1').val();
      const respuesta2 = $('#res2').val();
      const respuesta3 = $('#res3').val();
      const respuesta4 = $('#res4').val();
      const correcta = $('#correcta').val();
      const pregunta_url = sessionStorage.getItem('imgNewPreg') == 'null'
        ? null
        : sessionStorage.getItem('imgNewPreg')
  
      pregunta
        .crearPregunta(
          id_examen,
          id_pregunta,
          pregunta_txt,
          pregunta_url,
          respuesta1,
          respuesta2,
          respuesta3,
          respuesta4,
          correcta
        )
        .then(resp => {
          console.log(`Pregunta creada correctamente`, 4000)
          alert('Pregunta Almacenada correctamente')
          Limpia();
        })
        .catch(err => {
          console.log(`Error => ${err}`, 4000)
        })
    })
  
    $('#btnUploadFile').on('change', e => {
      const file = e.target.files[0];
      
      const pregunta = new Pregunta();
      pregunta.subirImagenPregunta(file);
    })
  })
  
  function Limpia(){
    $('#id_examen').val('');
    $('#id_pregunta').val('');
    $('#pregunta_txt').val('');
    $('#res1').val('');
    $('#res2').val('');
    $('#res3').val('');
    $('#res4').val('');
    $('#correcta').val('');
    $('#btnUploadFile').val('');
    $('.progress-bar').attr('style', `width: 0%`);
    sessionStorage.setItem('imgNewPreg', null);
  }
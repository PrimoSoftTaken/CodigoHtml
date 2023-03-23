const conexion = require('../database/conexion');

exports.save = (req, res) => {
    //* Captura las celdas requeridas por el id */
    const asambleaId = req.body.asambleaId;
    const delegadoId = req.body.delegadoId;

    /* query que busca la fecha de registro validado contra el id del usuario */
    const fechareg = `SELECT a.asamblea_id, d.delegado_id ,d.delegado_documento_identificacion , d.delegado_nombres , d.delegado_tipo, aa.fecha_hora_registro_entrada 
    FROM emodel.asamblea a, emodel.delegado d, emodel.asistencia_asamblea aa 
    where aa.delegado_id = d.delegado_id and aa.asamblea_id = a.asamblea_id and  
    aa.delegado_id = '${delegadoId}'`;
  
    /* Query de que inserta los en la tabla asistencia_asamblea los datos recibidos*/
    const insert = `INSERT INTO emodel.asistencia_asamblea (asamblea_id, delegado_id) VALUES ('${asambleaId}','${delegadoId}')`;
  
    /* método que valida si el campo fecha esta vacío y procede con el registro o devuelve indicando con un mensaje lo sucedido */
    conexion.query(fechareg, (error, results) => {
      if (error) {
        console.log(error);
        res.redirect('/');
      } else {
        if (results.fecha_hora_registro_entrada != "") {
          conexion.query(insert, (error, results) => {
            if (error) {
              console.log(error);
              const message = 'El usuario ya ha registrado su asistencia';
              res.send(`<script>if(confirm('${message}')){window.location.href='/'}</script>`);
            } else {
              console.log('registro satisfactorio')
              const message = 'La asistencia ha sido registrada satisfactoriamente';
              res.send(`<script>if(confirm('${message}')){window.location.href='/'}</script>`);
            }
          });
        } else {
          console.log('Usuario ya existe');
          const message = 'El usuario ya ha registrado su asistencia';
          res.send(`<script>if(confirm('${message}')){window.location.href='/'}</script>`);
        }
      }
    });
  }

exports.read = (req,res)=>{
    /* se asigna la cédula recibida a una constante */
    const cedula = (req.body.cedula);
    /* Query de búsqueda a la base de datos por el número de cedula*/
    const search = `SELECT a.asamblea_id, d.delegado_id ,d.delegado_documento_identificacion , d.delegado_nombres , d.delegado_tipo FROM emodel.asamblea a, emodel.delegado d WHERE  d.delegado_documento_identificacion = '${cedula}'`;
    
    /* método que ejecuta el query y devuelve el resultado o el error obtenidos */
    conexion.query(search, (error, results) =>{
        if (error){
            throw error;
        }else{
            res.render('consulta', {results:results.rows});
        }
    });
}

exports.pregunta = (req, res) => {
    /* Query de búsqueda una pregunta especifica por ID y envía el enunciado y el # de la pregunta*/
    const idPregunta = (req.body.pregunta_id);
    
    //const TexPregunta = `SELECT pa.pregunta_id, pa.orden_pregunta, pa.pregunta_enunciado FROM emodel.pregunta_asamblea pa WHERE pa.pregunta_id = '${idPregunta}'`;

    const TexPregunta = `SELECT pa.pregunta_id, pa.orden_pregunta, pa.pregunta_enunciado, po.pregunta_opcion_ordinal || po.pregunta_opcion_enunciado AS opcion_enunciado, crpm.votos_opcion FROM emodel.pregunta_asamblea pa INNER JOIN emodel.pregunta_opciones po ON pa.pregunta_id = po.pregunta_id LEFT OUTER JOIN emodel.calcula_resultado_pregunta_mayoria crpm ON crpm.opcion_id = po.pregunta_opcion_id WHERE pa.pregunta_id = '${idPregunta}' ORDER BY po.pregunta_id, po.pregunta_opcion_orden;`;
    
    conexion.query(TexPregunta, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.render('view_Selec_question', {results: results.rows});
        }
    });
}


exports.salaInOut = (req,res) => {
  const evento = (req.body.evento);
  const alterno = (req.body.alterno);
  const inOut = `call emodel.registrar_evento_asistencia_asamblea ('${evento}','${alterno}')`;

  /* console.log(evento+" - "+ alterno);
  const message = 'el usuario de código '+ alterno + "estado "+ evento ;
  res.send(`<script>if(confirm('${message}')){window.location.href='/checkInOut'}</script>`); */

  if (evento === "SALIDA"){
    conexion.query(inOut, (error, results) => {
      if (error) {
        console.log(error);
        const message = 'el usuario se encuentra fuera de la sala';
        res.send(`<script>if(confirm('${message}')){window.location.href='/checkInOut'}</script>`);
      } else {
        console.log(error);
        const message = 'el usuario se retira de la sala';
        res.send(`<script>if(confirm('${message}')){window.location.href='/checkInOut'}</script>`);
      }
    });
  }else{
    conexion.query(inOut, (error, results) => {
      if (error) {
        console.log(error);
        const message = 'el usuario se encuentra en la sala';
        res.send(`<script>if(confirm('${message}')){window.location.href='/checkInOut'}</script>`);
      } else {
        const message = 'el usuario reingresa a la sala';
        res.send(`<script>if(confirm('${message}')){window.location.href='/checkInOut'}</script>`);
      }
    });
  }
}
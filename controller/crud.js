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
    const search = `SELECT a.asamblea_id, d.delegado_id, d.delegado_codigo_alterno ,d.delegado_documento_identificacion , d.delegado_nombres , d.delegado_tipo FROM emodel.asamblea a, emodel.delegado d WHERE  d.delegado_documento_identificacion = '${cedula}'`;
    
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
  const idPregunta = req.body.pregunta_id;

  const TexPregunta = `SELECT pa.pregunta_id, pa.orden_pregunta, pa.pregunta_enunciado, po.pregunta_opcion_ordinal || po.pregunta_opcion_enunciado AS opcion_enunciado, crpm.votos_opcion, crpm.minimo_valor_triunfo umbral_minimo FROM emodel.pregunta_asamblea pa INNER JOIN emodel.pregunta_opciones po ON pa.pregunta_id = po.pregunta_id LEFT OUTER JOIN emodel.calcula_resultado_pregunta_mayoria crpm ON crpm.opcion_id = po.pregunta_opcion_id WHERE pa.pregunta_id = '${idPregunta}' ORDER BY po.pregunta_id, po.pregunta_opcion_orden;`;

  const votosp = `SELECT DISTINCT votos_validos 
                  FROM emodel.calcula_resultado_pregunta_cuociente rpc 
                  INNER JOIN emodel.pregunta_asamblea pa ON pa.pregunta_id = rpc.pregunta_id 
                  WHERE pa.bandera_votacion = 'A' AND cargo = 'PRINCIPAL';`;

  const votoss = `SELECT DISTINCT votos_validos 
                  FROM emodel.calcula_resultado_pregunta_cuociente rpc 
                  INNER JOIN emodel.pregunta_asamblea pa ON pa.pregunta_id = rpc.pregunta_id 
                  WHERE pa.bandera_votacion = 'A' AND cargo = 'SUPLENTES';`;

  const coucientep = `SELECT DISTINCT cuociente 
                    FROM emodel.calcula_resultado_pregunta_cuociente rpc 
                    INNER JOIN emodel.pregunta_asamblea pa ON pa.pregunta_id = rpc.pregunta_id 
                    WHERE pa.bandera_votacion = 'A' AND cargo = 'PRINCIPAL';`;
  
  const coucientes = `SELECT DISTINCT cuociente 
                    FROM emodel.calcula_resultado_pregunta_cuociente rpc 
                    INNER JOIN emodel.pregunta_asamblea pa ON pa.pregunta_id = rpc.pregunta_id 
                    WHERE pa.bandera_votacion = 'A' AND cargo = 'SUPLENTES';`;

  const curulesp = `SELECT po.pregunta_opcion_enunciado, rpc.curules_cuociente + rpc.cuociente_residuo AS cifra_repartidora, 
                    rpc.curules_cuociente, rpc.curules_residuo, rpc.curules_cuociente + rpc.curules_residuo total_curules 
                    FROM emodel.calcula_resultado_pregunta_cuociente rpc 
                    INNER JOIN emodel.pregunta_opciones po ON po.pregunta_opcion_id = rpc.opcion_id 
                    INNER JOIN emodel.pregunta_asamblea pa ON pa.pregunta_id = rpc.pregunta_id 
                    WHERE pa.bandera_votacion = 'A' AND cargo = 'PRINCIPAL' 
                    ORDER BY po.pregunta_opcion_orden;`; 

  const curuless = `SELECT po.pregunta_opcion_enunciado, rpc.curules_cuociente + rpc.cuociente_residuo AS cifra_repartidora, 
                    rpc.curules_cuociente, rpc.curules_residuo, rpc.curules_cuociente + rpc.curules_residuo total_curules 
                    FROM emodel.calcula_resultado_pregunta_cuociente rpc 
                    INNER JOIN emodel.pregunta_opciones po ON po.pregunta_opcion_id = rpc.opcion_id 
                    INNER JOIN emodel.pregunta_asamblea pa ON pa.pregunta_id = rpc.pregunta_id 
                    WHERE pa.bandera_votacion = 'A' AND cargo = 'SUPLENTES' 
                    ORDER BY po.pregunta_opcion_orden;`; 

                    
  if (idPregunta != "39") { 
    conexion.query(TexPregunta, (error, results) => {
      if (error) {
        throw error;
      } else {
        res.render('view_Selec_question', { results: results.rows });
      }
    });
  } else {
    conexion.query(TexPregunta, (error, results) => {
      if (error) {
        throw error;
      } else {
        conexion.query(votosp, (error1, results1) => {
          if (error1) {
            throw error1;
          } else {
            conexion.query(votoss, (error4, results4) => {
              if (error4) {
                throw error4;
              } else {
                conexion.query(coucientep, (error2, results2) => {
                  if (error2) {
                    throw error2;
                  } else {
                    conexion.query(coucientes, (error5, results5) => {
                      if (error5) {
                        throw error5;
                      } else {
                        conexion.query(curulesp, (error3, results3) => {
                          if (error3) {
                            throw error3;
                          } else {
                            conexion.query(curuless, (error6, results6) => {
                              if (error6) {
                                throw error6;
                              } else {
                                res.render('view_cociente', {
                                  results:results.rows,
                                  results1: results1.rows,
                                  results2: results2.rows,
                                  results3: results3.rows,
                                  results4: results4.rows,
                                  results5: results5.rows,
                                  results6: results6.rows,
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
}

exports.salaInOut = (req,res) => {
  const evento = (req.body.evento);
  const alterno = (req.body.alterno);
  const inOut = `call emodel.registrar_evento_asistencia_asamblea ('${evento}','${alterno}')`;

  const estadoSala = `select
  case aa.asistente_activo 
  when true then 'EN SALA' 
  when false then 'FUERA DE SALA' 
  end estado 
  from emodel.asistencia_asamblea aa 
  inner join emodel.delegado d 
  on d.delegado_id = aa.delegado_id 
  where asamblea_id = 1 and upper(d.delegado_codigo_alterno) = upper('${alterno}')`;
  
  if (evento === "SALIDA"){
    conexion.query(estadoSala, (error,results)=>{
    if(error){
      console.log(error);
      const message = 'ERROR: EL USUARIO NO EXISTE';
      res.send(`<script>if(confirm('${message}')){window.location.href='/checkInOut'}</script>`);
    }else{
      const estado = results.rows[0].estado;
      if (estado==="FUERA DE SALA"){
        const message = 'ERROR: EL USUARIO YA SE ENCUENTRA FUERA DE LA SALA';
        res.send(`<script>if(confirm('${message}')){window.location.href='/checkInOut'}</script>`);
      }else{
        conexion.query(inOut, (error, results) => {
          if (error) {
            console.log(error);
          }else{
            const message = 'el usuario se retira de la sala';
            res.send(`<script>if(confirm('${message}')){window.location.href='/checkInOut'}</script>`);
          }
      });
    }
  }
});
  }else{
    conexion.query(estadoSala, (error,results)=>{
      if(error){
        console.log(error);
        const message = 'ERROR: EL USUARIO NO EXISTE';
      res.send(`<script>if(confirm('${message}')){window.location.href='/checkInOut'}</script>`);
      }else{
        const estado = results.rows[0].estado;
        if (estado==="EN SALA"){
          const message = 'ERROR: EL USUARIO YA SE ENCUENTRA EN LA SALA';
          res.send(`<script>if(confirm('${message}')){window.location.href='/checkInOut'}</script>`);
        }else{
          conexion.query(inOut, (error, results) => {
            if (error) {
              console.log(error);
            }else{
              const message = 'el usuario reingresa a de la sala';
              res.send(`<script>if(confirm('${message}')){window.location.href='/checkInOut'}</script>`);
            }
        });
      }
    }
  });
  }
}

exports.cookie = (req, res) =>{
  const alterno = "req.body.alterno";
  const ipAddress = req.header('x-forwarded-for') || req.socket.remoteAddress;
  const cookieValue = JSON.stringify({ alterno, ipAddress }); // Crear un objeto con la información del dispositivo y la dirección IP
  res.cookie('miCookie', cookieValue, { maxAge: 24 * 60 * 60 * 1000 }); // Establecer la cookie con el objeto como valor y una caducidad de 24 horas
  const message = "Conexión establecida";
  console.log(`La dirección del cliente es: ${ipAddress}`);
  res.send(`<script>if(confirm('${message}')){window.location.href='/test'}</script>`);
}

exports.obtenerCookie = (req, res) => {
  const cookieValue = req.cookies.miCookie; // Obtener el valor de la cookie
  const cookieData = JSON.parse(cookieValue); // Analizar el valor de la cookie como un objeto JSON
  const alterno = cookieData.alterno;
  const ipAddress = cookieData.ipAddress;
  res.send(`Información de la cookie: <br>Dispositivo: ${alterno}<br>Dirección IP: ${ipAddress}`);
}
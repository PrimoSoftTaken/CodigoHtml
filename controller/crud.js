const conexion = require('../database/conexion');

exports.save = (req,res)=>{
    /* capturas las celdas requeridas por el id */
    const asambleaId = (req.body.asambleaId);
    const delegadoId = (req.body.delegadoId);
    const insert = `INSERT INTO emodel.asistencia_asamblea (asamblea_id, delegado_id) VALUES ('${asambleaId}','${delegadoId}')`;
    /* prueba de captura los datos */
    /* console.log(asambleaId + " - " + delegadoId); */

    /* Query de inserción a la base de datos de los campos "asamblea_id" y "delegado_id"*/
    conexion.query (insert, (error, results) => {
        if (error){
            throw error;
        }else{
            res.redirect('/');
        }
    });
}

exports.read = (req,res)=>{
    /* prueba de captura los datos */
    const cedula = (req.body.cedula);
    const search = `SELECT a.asamblea_id, d.delegado_id ,d.delegado_documento_identificacion , d.delegado_nombres , d.delegado_tipo FROM emodel.asamblea a, emodel.delegado d WHERE d.delegado_documento_identificacion = '${cedula}'`;
    
    /* Query de búsqueda a la base de datos por el número de cedula*/
    conexion.query(search, (error, results) =>{
        if (error){
            throw error;
        }else{
            res.render('consulta', {results:results.rows});
        }
    });
}
const express = require ('express');
const router = express.Router();
const conexion = require('./database/conexion');

router.get('/',(req,res)=> {
    res.render('index');
       /*  conexion.query('SELECT * FROM emodel.delegado', (error,results)=>{
        if (error){
            throw error;
        }else{
            res.send(results);
        }
    }); */
})

/* redirecciona a la pagina donde aparece el listado completo de delegados y lo ordena por fecha y hora de registro de ingreso a la Asamblea*/
router.get('/general', (req, res) => {
    const lgeneral = 'select d.delegado_id ,d.delegado_documento_identificacion , d.delegado_nombres , d.delegado_tipo ,aa.fecha_hora_registro_entrada from emodel.delegado d left outer join emodel.asistencia_asamblea aa on d.delegado_id  = aa.delegado_id order by aa.fecha_hora_registro_entrada  asc';
    conexion.query(lgeneral , (error,results)=>{
        if (error){
            throw error;
        }else{
            res.render('general', {results:results.rows});
        }
    });
})

router.get('/create', (req,res)=>{
    res.render('create');
})

router.get('/consulta', (req,res)=>{
    res.render('consulta');
})

router.get('/checkInOut', (req,res)=>{
    res.render('checkInOut');
})

const crud = require ('./controller/crud');
router.post('/save', crud.save);
router.post('/read', crud.read);
router.post('/pregunta', crud.pregunta);
router.post('/salaInOut', crud.salaInOut);

//enrutamiento para visualizar todas las preguntas 
router.get('/view_questions', (req, res) => {
    const lViewAll = `select pregunta_id, orden_pregunta, pregunta_enunciado,case bandera_votacion when 'E' then 'En espera de votación' when 'C' then 'Pregunta Votada' when 'A' then 'Pregunta en proceso de votación' end estado_pregunta from emodel.pregunta_asamblea pa order by pregunta_id`;

    conexion.query(lViewAll , (error,results)=>{
        if (error){
            throw error;
        } else {
            res.render('view_questions', { results: results.rows });
        }
    });
});


//enrutamiento para visualizar los delegados presentes en la asamblea para validar el Quorum
router.get('/estadoEnSala', (req, res) => {
    const courum = `select d.delegado_documento_identificacion ,d.delegado_nombres ,aa.fecha_hora_registro_entrada , case aa.asistente_activo when true then 'EN SALA' when false then 'FUERA DE SALA' end estado_asistencia from emodel.delegado d inner join emodel.asistencia_asamblea aa on d.delegado_id = aa.delegado_id and aa.asamblea_id = 1 order by estado_asistencia, fecha_hora_registro_entrada`;

    conexion.query(courum , (error,results)=>{
        if (error){
            throw error;
        } else {
            res.render('estadoEnSala', { results: results.rows });
        }
    });
 
})

module.exports = router;

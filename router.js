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

/* redirecciona a la pagina donde aparece el listado completo de delegados */
router.get('/general',(req,res)=>{
    conexion.query('select d.delegado_id ,d.delegado_documento_identificacion , d.delegado_nombres , d.delegado_tipo ,aa.fecha_hora_registro_entrada from emodel.delegado d left outer join emodel.asistencia_asamblea aa on d.delegado_id  = aa.delegado_id order by aa.fecha_hora_registro_entrada  asc', (error,results)=>{
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

const crud = require ('./controller/crud');
router.post('/save', crud.save);
router.post('/read', crud.read);

router.get('/contacto',(req,res)=>{
    res.send('Este es para una de las vistas');
});

module.exports = router;

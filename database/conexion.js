const { Pool } = require('pg');

/* conexión servidor remoto */
const pool = new Pool({
  user: 'adm_evoto',
  password: '4dm_3v0t0',
  host: '20.55.38.188',
  port: 5444,
  database: 'evoto'
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error adquiriendo el cliente', err.stack)
  }
  console.log('Conexión exitosa a la base de datos')
});

module.exports = pool;

/* conexión servidor local*/
/* const mysql = require('mysql');
const conexion = mysql.createConnection({
  user: 'khronos',
  password: '123456',
  host: 'localhost',
  port: 3306,
  database: 'asamblea'
});

conexion.connect((err, client, release)=>{
  if (err) {
    return console.error('Error adquiriendo el cliente', err.stack)
  }
  console.log('Conexión exitosa a la base de datos')
})

module.exports = mysql; */
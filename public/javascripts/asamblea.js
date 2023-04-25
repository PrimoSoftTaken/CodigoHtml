const login =document.querySelector("#btnregistrar");

login.addEventListener("click", (req, res)=>{
  const alterno = document.querySelector("#calterno");
  if (alterno != ""){
    
    const ipAddress = req.header('x-forwarded-for') || req.socket.remoteAddress;
    const cookieValue = JSON.stringify({ alterno, ipAddress }); // Crear un objeto con la información del dispositivo y la dirección IP
    document.cookie=`calterno=${calterno, cookieValue, { maxAge: 24 * 60 * 60 * 1000 }}`;
    res.redirect('/');
  }else{
    console.log("Código alterno no encontrado");
  }
});
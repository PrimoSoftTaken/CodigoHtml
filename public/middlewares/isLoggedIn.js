module.exports= (req, res, next)=>{
  if (req.cookies.calterno){
    const cookieValue = req.cookies.miCookie; // Obtener el valor de la cookie
    const cookieData = JSON.parse(cookieValue); // Analizar el valor de la cookie como un objeto JSON
    const alterno = cookieData.alterno;
    const ipAddress = cookieData.ipAddress;
    console.log(alterno,ipAddress);
    next();
  }else{
    res.redirect("/");
  }
}
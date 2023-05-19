module.exports = (req, res, next) => {
  if (req.cookies.calterno) {
    /* const cookieValue = req.cookies.calterno;
    const cookieData = JSON.parse(cookieValue);
    const asambleaId = cookieData.asambleaId;
    const nombre = cookieData.nombre;
    const alterno = cookieData.alterno;
    const ipAddress = cookieData.ipAddress; */
    next();
  } else {
    res.redirect('/login');
  }
};
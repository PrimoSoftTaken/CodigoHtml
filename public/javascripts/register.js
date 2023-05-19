let pregunta_id;
let pregEnunciado;

function register() {
  let invoto = document.getElementById('regvoto');
  invoto.addEventListener('click', capvoto);
}

function capvoto() {
  let selectedOption = document.querySelector('input[name="voto"]:checked');
  let pregunta_id = document.getElementById("pregunta_id").value;
  
  if (selectedOption && pregunta_id) {
    console.log("Opción seleccionada:", selectedOption.value);
    console.log("Pregunta ID:", pregunta_id);
    
  } else {
    alert("Por favor, selecciona una opción de voto");
  }
}

window.addEventListener("load",register);
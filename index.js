var num1,
  num2,
  numtotal = 0;
var operador = "";
var textoinput = document.querySelector(".result");
var textop = document.querySelector(".op span");
var operacion = document.querySelector(".op");
var spanIgual = document.querySelector(".op span.igual");
var teclas = document.querySelectorAll("article.cal .operacion");
var papelera = document.querySelector("svg.papelera");
var numdigital = "";
var igual = document.createElement("span");
var color1 = "";
var color2 = "";

//Bucle que recorre los "botones" de la calculadora digital
for (const tecla of teclas) {
  tecla.addEventListener("click", function (event) {
    console.log("pulso a la tecla digital: " + tecla.innerHTML);
    switch (tecla.innerHTML) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        if (operador != "") {
          numdigital = numdigital + tecla.innerHTML;
          console.log("num2: " + numdigital);
          textoinput.value = numdigital;
        } else {
          textoinput.value = textoinput.value + tecla.innerHTML;
          console.log("num1: " + textoinput.value);
        }
        break;
      case "+":
      case "-":
      case "÷":
      case "×":
      case "1/𝑥":
      case "𝑥²":
      case "²√𝑥":
      case "%":
        prepararOperacion(tecla.innerHTML);
        break;
      case "+/-":
        cambioSigno();
        break;
      case "=":
        calcular();
        break;
      case "C":
        clear();
        break;
      case "CE":
        borradoParcial();
        break;
      case "DEL":
        delNum();
        break;
    }
  });
}

document.addEventListener("keydown", function (event) {
  operacion = document.querySelector(".op");
  //guardamos el 1º numero si hemos pulsado algún operador
  if (
    event.key === "+" ||
    event.key === "-" ||
    event.key === "*" ||
    event.key === "/" ||
    event.key === "%"
  ) {
    prepararOperacion(event.key);
  }

  if (event.key >= "0" && event.key <= "9" && operador != "") {
    numdigital = numdigital + event.key;
    console.log("num2: " + numdigital);
    // if (isNaN(num1)) num1 = 0;
    console.log("se añade el digito/operacion al valor: " + numdigital);
  }

  //calculamos la operacion
  if (event.key === "Enter") {
    calcular();
  }

  //Borramos las operaciones y las variables
  if (event.key === "c") {
    clear();
  }

  //cambiamos los colores
  for (const tecla of teclas) {
    switch (tecla.innerHTML) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        color1 = "#443640";
        color2 = "#3c2d38";
        break;
    }
    if (tecla.innerHTML == event.key) {
      tecla.style.backgroundColor = color2;
      setTimeout(() => {
        tecla.style.backgroundColor = color1;
      }, 150);
    }
  }
});

//Preparamos la operación guardando el operador y el 1º numero
function prepararOperacion(tecla) {
  if (tecla == "*") operador = "×";
  else if (tecla == "/") operador = "÷";
  else if (tecla == "1/𝑥") operador = "1/";
  else if (tecla == "𝑥²") operador = "²";
  else if (tecla == "²√𝑥") operador = "²√";
  else operador = tecla;
  console.log("operador pulsado: " + operador);
  num1 = parseFloat(textoinput.value);
  if (!isNaN(num1)) {
    operacion = document.querySelector(".op");
    operacion.style.visibility = "visible";
    if (operador == "1/" || operador == "²√") {
      textop.textContent = operador + num1;
      calcularEspecial(operador);
    } else if (operador == "²") {
      textop.textContent = num1 + operador;
      calcularEspecial(operador);
    } else textop.textContent = num1 + operador;

    textoinput.placeholder = num1;
    //textoinput.value = "";
    console.log("se hace visible la operacion: " + textop.textContent);
  }
}

//Ejecutamos las operaciones pasandoles los dos números
function calcular() {
  console.log("empezamos a calcular");
  num2 = parseInt(textoinput.value);
  console.log("se asigna el num2:" + num2);
  switch (operador) {
    case "+":
      numtotal = add(num1, num2);
      break;
    case "-":
      numtotal = substract(num1, num2);
      break;
    case "×":
      numtotal = product(num1, num2);
      break;
    case "÷":
      numtotal = division(num1, num2);
      break;
    case "%":
      numtotal = porcierto(num1, num2);
      break;
  }
  console.log("obtenemos resultado:" + numtotal);
  //imprimimos el resultado por pantalla y en el "historial"

  textop.textContent = num1.toString() + operador + num2.toString();
  spanIgual.style.display = "block";
  operacion.appendChild(igual);
  textoinput.value = numtotal;

  //historial
  var historialOp = operacion.cloneNode(true);
  console.log("creamos una nueva fila para el historial");
  historial(numtotal, historialOp);
}

//Ejecutamos las operaciones especiales pasando el 1º numero
function calcularEspecial(operador) {
  console.log("empezamos a calcular especial");
  console.log("x = " + num1);
  switch (operador) {
    case "1/":
      numtotal = unoEntreX(num1);
      break;
    case "²":
      numtotal = alCuadrado(num1);
      break;
    case "²√":
      numtotal = raizCuadrada(num1);
      break;
  }
  console.log("obtenemos resultado:" + numtotal);
  spanIgual.style.display = "block";
  operacion.appendChild(igual);
  textoinput.value = numtotal;
  var historialOp = operacion.cloneNode(true);
  console.log("creamos una nueva fila para el historial");
  historial(numtotal, historialOp);
}

//Creamos "la fila" correspondiente a la operacion en el historial
function historial(result, op) {
  document.querySelector("aside .info .desc .text").style.display = "none";
  var filas = document.querySelector("aside .info .desc");

  var operacionDiv = document.createElement("div");
  operacionDiv.className = "operacion";

  operacionDiv.appendChild(op);
  var resultDiv = document.createElement("div");
  resultDiv.className = "result";
  resultDiv.textContent = result;
  operacionDiv.appendChild(resultDiv);
  filas.insertBefore(operacionDiv, filas.firstChild);
}

//Reseteamos todas las variables y ocultamos componentes
function clear() {
  console.log("reseteamos todo");
  num1 = 0;
  num2 = 0;
  numtotal = 0;
  textoinput.value = "";
  textop.textContent = "";
  textoinput.placeholder = "0";
  spanIgual.style.display = "none";
  operacion.style.visibility = "hidden";
  operacion = "";
  numdigital = "";
  operador = "";
}

//Borrador parcial que eliminar el parte del numero
function borradoParcial() {
  console.log("borrado parcial");
  textoinput.value = "";
  textoinput.placeholder = "0";
  numdigital = "";
}

//Eliminamos el último numero del texto
function delNum() {
  console.log("eliminamos el último numero del texto");
  textoinput.value = textoinput.value.slice(0, -1);
}

//Eliminamos el historial cuando pulsamos a la papelera
papelera.addEventListener("click", function (event) {
  var filasHistorial = document.querySelectorAll("aside .operacion");
  filasHistorial.forEach((fila) => {
    fila.remove();
  });
  document.querySelector("aside .info .desc .text").style.display = "block";
  console.log("eliminamos las filas y aparecemos texto");
});

//Función que suma 2 numeros
function add(a, b) {
  return a + b;
}
//Función que resta 2 numeros
function substract(a, b) {
  return a - b;
}
//Función que multiplica 2 numeros
function product(a, b) {
  return a * b;
}
//Función que divide 2 numeros
function division(a, b) {
  return a / b;
}
//Función que da el "a" por ciento de "b" numero
function porcierto(a, b) {
  return (a / 100) * b;
}
//Función que da el 1 % de un numero
function unoEntreX(x) {
  return 1 / x;
}
//Función que el cuadrado de un numero
function alCuadrado(x) {
  return x * x;
}
//Función que da la raiz cuadrado de un numero
function raizCuadrada(x) {
  return Math.sqrt(x);
}
//Función que cambia de signo un número
function cambioSigno() {
  textoinput.value = textoinput.value * -1;
  console.log("num1 ahora es : " + textoinput.value);
}

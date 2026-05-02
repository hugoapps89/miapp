document.addEventListener("DOMContentLoaded", () => {

const ingredientesBase = [
"Jamón de pavo","Salchicha de pavo","Salchicha asadera",
"Pepperoni","Salami","Champiñón","Piña","Tocino",
"Chorizo","Cebolla","Jalapeño","Aceitunas",
"Frijol","Pimiento verde"
];

// 🔥 TODOS LOS PAQUETES
const productos = [
{nombre:"Paquete #1", precio:180, pizzas:1, elegir:3, desc:"3 ingredientes + refresco + pan"},
{nombre:"Paquete #2", precio:210, pizzas:1, elegir:8, desc:"8 ingredientes + refresco + pan"},
{nombre:"Paquete #3 Ranchera", precio:185, desc:"Jamón, cebolla, chorizo, jalapeño y frijol"},
{nombre:"Paquete #4 Mitades", precio:180, desc:"Jamón/piña y jamón/champiñón"},
{nombre:"Paquete #5 Pastor", precio:210, desc:"Cebolla y piña"},
{nombre:"Paquete #6", precio:290, pizzas:2, elegir:3, desc:"2 pizzas (3 ingredientes c/u)"},
{nombre:"Paquete #7 Pierna", precio:210, pizzas:1, elegir:2, desc:"Pizza de pierna (2 ingredientes)"},
{nombre:"Paquete #8 Hawaiana", precio:155, desc:"Jamón y piña"},
{nombre:"Paquete #9", precio:260, pizzas:2, elegir:1, desc:"2 pizzas (1 ingrediente c/u)"},
{nombre:"Paquete #10", precio:140, pizzas:1, elegir:1, desc:"1 ingrediente"},
{nombre:"Paquete #11 Combinado", precio:280, desc:"Pepperoni + pastor"},
{nombre:"Paquete #12 Chistorra", precio:190, desc:"Jamón y tocino"},
{nombre:"Paquete #13", precio:385, pizzas:3, elegir:3, desc:"3 pizzas (3 ingredientes c/u)"},
{nombre:"Paquete #14", precio:220, desc:"2 pizzas jamón y queso"},
{nombre:"Paquete #15", precio:240, desc:"2 pizzas pepperoni"},
{nombre:"Paquete #16", precio:190, desc:"Pierna extra queso"},
{nombre:"Paquete #17", precio:330, pizzas:2, elegir:2, desc:"2 pizzas (2 ingredientes c/u)"}
];

let carrito = [];
let total = 0;

let productoActual = null;
let pizzaActual = 1;
let seleccionPizzas = [];
let maxIngredientes = 0;

const contenedor = document.getElementById("productos");

// 👉 Mostrar productos
productos.forEach((p,i)=>{
  contenedor.innerHTML += `
    <div class="card">
      <h3>${p.nombre}</h3>
      <div class="descripcion">${p.desc}</div>
      <div class="precio">$${p.precio}</div>
      <button onclick="seleccionar(${i})">Agregar</button>
    </div>
  `;
});

// 👉 Seleccionar paquete
window.seleccionar = function(i){
  const p = productos[i];

  if(p.elegir){
    productoActual = p;
    pizzaActual = 1;
    seleccionPizzas = [];
    maxIngredientes = p.elegir;
    abrirModal();
  }else{
    carrito.push(p);
    total += p.precio;
    render();
  }
}

// 👉 Abrir modal
function abrirModal(){
  document.getElementById("tituloModal").innerText = productoActual.nombre;
  document.getElementById("subtituloPizza").innerText =
    `Pizza ${pizzaActual} de ${productoActual.pizzas}`;

  const lista = document.getElementById("listaIngredientes");
  lista.innerHTML = "";

  ingredientesBase.forEach(ing=>{
    const label = document.createElement("label");
    label.innerHTML = `
      <input type="checkbox" value="${ing}">
      ${ing}
    `;
    lista.appendChild(label);
  });

  document.getElementById("contador").innerText = `0/${maxIngredientes}`;
  document.getElementById("modalIng").classList.remove("hidden");

  document.querySelectorAll("#listaIngredientes input")
    .forEach(c=>c.addEventListener("change", controlar));
}

// 👉 Controlar selección
function controlar(){
  const checks = document.querySelectorAll("#listaIngredientes input:checked");

  if(checks.length > maxIngredientes){
    this.checked = false;
    alert(`Máximo ${maxIngredientes}`);
  }

  document.getElementById("contador").innerText =
    `${checks.length}/${maxIngredientes}`;
}

// 👉 Confirmar ingredientes
window.confirmarIngredientes = function(){

  const seleccionados =
    [...document.querySelectorAll("#listaIngredientes input:checked")];

  if(seleccionados.length !== maxIngredientes){
    alert(`Debes elegir ${maxIngredientes}`);
    return;
  }

  seleccionPizzas.push(seleccionados.map(i=>i.value));

  if(pizzaActual < productoActual.pizzas){
    pizzaActual++;
    abrirModal();
  }else{
    carrito.push({
      nombre: productoActual.nombre,
      precio: productoActual.precio,
      pizzas: seleccionPizzas
    });

    total += productoActual.precio;
    cerrarModalDirecto();
    render();
  }
}

// 👉 Render carrito
function render(){
  const lista = document.getElementById("carrito");
  lista.innerHTML="";

  carrito.forEach((p,i)=>{
    let detalle = "";

    if(p.pizzas){
      p.pizzas.forEach((pizza,idx)=>{
        detalle += `<br><small>Pizza ${idx+1}: ${pizza.join(", ")}</small>`;
      });
    }

    lista.innerHTML += `
      <li>
        ${p.nombre} - $${p.precio}
        ${detalle}
        <button class="eliminar" onclick="eliminar(${i})">Eliminar</button>
      </li>
    `;
  });

  document.getElementById("total").innerText = total;
}

// 👉 Eliminar producto
window.eliminar = function(i){
  total -= carrito[i].precio;
  carrito.splice(i,1);
  render();
}

// 👉 Cerrar modal
window.cerrarModalDirecto = function(){
  document.getElementById("modalIng").classList.add("hidden");
}

window.cerrarModal = function(e){
  if(e.target.id === "modalIng"){
    cerrarModalDirecto();
  }
}

// 👉 ENVIAR PEDIDO (🔥 MEJORADO)
window.enviarPedido = function(){

  const nombre = document.getElementById("nombre").value;
  const direccion = document.getElementById("direccion").value;
  const obs = document.getElementById("observaciones").value;

  let mensaje = `🍕 *Nuevo Pedido*\n\n`;

  mensaje += `👤 *Cliente:* ${nombre}\n`;
  mensaje += `📍 *Dirección:* ${direccion}\n\n`;

  mensaje += `🧾 *Detalle del pedido:*\n`;

  carrito.forEach(p=>{
    mensaje += `\n🍕 *${p.nombre}* - $${p.precio}\n`;

    if(p.pizzas){
      p.pizzas.forEach((pizza,idx)=>{
        mensaje += `   🧩 Pizza ${idx+1}: ${pizza.join(", ")}\n`;
      });
    }
  });

  if(obs){
    mensaje += `\n📝 *Observaciones:*\n${obs}\n`;
  }

  mensaje += `\n💰 *Total: $${total}*`;

  window.open(`https://wa.me/529991641601?text=${encodeURIComponent(mensaje)}`);
}

});
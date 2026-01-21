

const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));

function limpiarRut(r) {
  return (r || "").toString().replace(/[^0-9kK]/g, '').toUpperCase();
}
function formatearRut(r) {
  r = limpiarRut(r);
  if (!r) return "";
  let cuerpo = r.slice(0, -1), dv = r.slice(-1);
  let conPuntos = '';
  while (cuerpo.length > 3) {
    conPuntos = '.' + cuerpo.slice(-3) + conPuntos;
    cuerpo = cuerpo.slice(0, -3);
  }
  conPuntos = cuerpo + conPuntos;
  return `${conPuntos}-${dv}`;
}
function calcularDV(numStr) {
  let suma = 0, mult = 2;
  for (let i = numStr.length - 1; i >= 0; i--) {
    suma += parseInt(numStr[i], 10) * mult;
    mult = mult === 7 ? 2 : mult + 1;
  }
  const res = 11 - (suma % 11);
  return res === 11 ? '0' : (res === 10 ? 'K' : String(res));
}
function validarRutValor(r) {
  r = limpiarRut(r);
  if (r.length < 2) return false;
  const cuerpo = r.slice(0, -1), dv = r.slice(-1);
  return calcularDV(cuerpo) === dv;
}
// ---------- Validación Email ----------
(function initEmail() {
  const email = document.querySelector('#email');
  if (!email) return;

  email.addEventListener('blur', () => {
    const ok = email.checkValidity();
    email.classList.toggle('is-valid', ok);
    email.classList.toggle('is-invalid', !ok);
  });
})();

// Autoformato + validación si existe #rut
(function initRut() {
  const rutInput = qs('#rut');
  if (!rutInput) return;
  rutInput.addEventListener('input', () => {
    const val = limpiarRut(rutInput.value);
    let out = val;
    if (val.length >= 2) out = formatearRut(val);
    rutInput.value = out;

    // 🔧 fuerza el cursor al final (después del guion)
    rutInput.selectionStart = rutInput.selectionEnd = rutInput.value.length;
  });
  rutInput.addEventListener('blur', () => {
    const ok = validarRutValor(rutInput.value);
    rutInput.classList.toggle('is-invalid', !ok);
    rutInput.classList.toggle('is-valid', ok);
  });
})();

// ---------- Password match (si existen #pass y #repass) ----------
(function initPass() {
  const pass = qs('#pass'), repass = qs('#repass'), check = qs('#checkpass');
  if (!pass || !repass) return;
  const checkFn = () => {
    const ok = pass.value && repass.value && pass.value === repass.value;
    if (check) check.textContent = ok ? '' : 'Las contraseñas no coinciden';
    repass.classList.toggle('is-invalid', !ok);
    repass.classList.toggle('is-valid', ok);
    return ok;
  };
  pass.addEventListener('input', checkFn);
  repass.addEventListener('input', checkFn);
  repass.addEventListener('blur', checkFn);
})();


/*********************************
 * BADGE CARRITO - CONCEGAS
 * Archivo: funciones.js
 *********************************/
(() => {
  const CART_KEY = "concegas_cart";

  const getBadge = () => document.getElementById("cartBadge");

  const readCart = () => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  };

  const getCartCount = () => {
    const cart = readCart();
    return cart.reduce((acc, item) => acc + (Number(item.qty) || 0), 0);
  };

  const renderCartBadge = () => {
    const badge = getBadge();
    if (!badge) return;

    const count = getCartCount();
    badge.textContent = count;
    badge.classList.toggle("d-none", count <= 0);
  };

  // 🔹 Al cargar la página
  document.addEventListener("DOMContentLoaded", renderCartBadge);

  // 🔹 Al presionar "Agregar"
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".btn-agregar")) return;

    // pequeño delay para esperar que localStorage se actualice
    setTimeout(renderCartBadge, 20);
  });

  // 🔹 Si el carrito cambia desde otra pestaña
  window.addEventListener("storage", (e) => {
    if (e.key === CART_KEY) renderCartBadge();
  });

  // 🔹 Exponer función por si otros scripts la necesitan
  window.updateCartBadge = renderCartBadge;
})();






/*********************************
 * REGISTRO → MENSAJE + REDIRECCIÓN LOGIN
 *********************************/
(function initRegistroRedirect() {
  const form = document.getElementById("formRegistro");
  const msg = document.getElementById("msgRegistroOk");

  if (!form || !msg) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Mostrar mensaje
    msg.classList.remove("d-none");

    // (opcional) deshabilitar botón para evitar doble click
    const btn = form.querySelector('input[type="submit"], button[type="submit"]');
    if (btn) btn.disabled = true;

    // Redirigir
    setTimeout(() => {
      window.location.assign("login.html");
    }, 2000);
  });
})();



function validarTelefono() {
  const tel = document.getElementById("telefono");
  const help = document.getElementById("helpTelefono");

  // solo números, 9 dígitos, comienza con 9
  const regex = /^9\d{8}$/;

  if (!regex.test(tel.value)) {
    tel.classList.add("is-invalid");
    tel.classList.remove("is-valid");
    help.classList.add("text-danger");
    help.textContent = "Teléfono inválido. Debe comenzar con 9 y tener 9 dígitos.";
    return false;
  } else {
    tel.classList.remove("is-invalid");
    tel.classList.add("is-valid");
    help.classList.remove("text-danger");
    help.textContent = "✔ Teléfono válido";
    return true;
  }
}




document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formClave");
  if (!form) return; // si no estamos en la página, salir

  const clave6 = document.getElementById("clave6");
  const helpClave = document.getElementById("helpClave6");
  const msgOk = document.getElementById("msgClaveOk");
  const msgError = document.getElementById("msgClaveError");

  const modalEl = document.getElementById("modalNuevaPass");

  // Si esto es null, el modal no está en el HTML o cambió el ID
  if (!modalEl) {
    console.error("No se encontró el modal #modalNuevaPass en el HTML");
    return;
  }

  // ✅ Crea/obtiene instancia del modal (robusto)
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

  function validarClave6() {
    const regex = /^\d{6}$/;
    const ok = regex.test(clave6.value);

    if (!ok) {
      clave6.classList.add("is-invalid");
      clave6.classList.remove("is-valid");
      helpClave.classList.add("text-danger");
      helpClave.textContent = "❌ Debe ser numérica y tener exactamente 6 dígitos";
    } else {
      clave6.classList.remove("is-invalid");
      clave6.classList.add("is-valid");
      helpClave.classList.remove("text-danger");
      helpClave.textContent = "✔ PIN válido";
    }
    return ok;
  }

  // 🔐 Si quieres validar PIN “real”, ponlo aquí:
  // const PIN_CORRECTO = "123456";
  // function pinEsCorrecto() { return clave6.value === PIN_CORRECTO; }

  clave6.addEventListener("keyup", validarClave6);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    msgOk.classList.add("d-none");
    msgError.classList.add("d-none");

    // 1) valida formato 6 dígitos
    if (!validarClave6()) {
      msgError.classList.remove("d-none");
      return;
    }

    // 2) SI QUIERES validar pin real, descomenta este bloque:
    /*
    if (!pinEsCorrecto()) {
      msgError.classList.remove("d-none");
      helpClave.textContent = "❌ PIN incorrecto";
      clave6.classList.add("is-invalid");
      clave6.classList.remove("is-valid");
      return;
    }
    */

    // ✅ Si llega aquí: ABRE MODAL
    msgOk.classList.remove("d-none");
    modal.show();
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const formNuevaPass = document.getElementById("formNuevaPass");
  if (!formNuevaPass) return;

  const pass1 = document.getElementById("passNuevaModal");
  const pass2 = document.getElementById("passNueva2Modal");
  const helpPass = document.getElementById("helpPassModal");
  const btnConfirmar = document.getElementById("btnConfirmarNuevaPass");

  function validarMatchPassModal() {
    const p1 = pass1.value.trim();
    const p2 = pass2.value.trim();

    // por defecto bloqueado
    btnConfirmar.disabled = true;

    // si están vacías
    if (p1 === "" || p2 === "") {
      helpPass.textContent = "";
      pass2.classList.remove("is-valid", "is-invalid");
      return false;
    }

    // si no coinciden
    if (p1 !== p2) {
      helpPass.textContent = "❌ Las contraseñas no coinciden";
      helpPass.classList.add("text-danger");
      pass2.classList.add("is-invalid");
      pass2.classList.remove("is-valid");
      return false;
    }

    // ✅ coinciden -> habilitar
    helpPass.textContent = "✔ Coinciden";
    helpPass.classList.remove("text-danger");
    pass2.classList.remove("is-invalid");
    pass2.classList.add("is-valid");
    btnConfirmar.disabled = false;
    return true;
  }

  pass1.addEventListener("keyup", validarMatchPassModal);
  pass2.addEventListener("keyup", validarMatchPassModal);

  // submit del modal
  formNuevaPass.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validarMatchPassModal()) return;

    // aquí haces tu acción real (guardar / api / etc.)
    alert("Contraseña cambiada ✅");
  });
});




//redirecciona el login a inicio
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // evita recargar la página

    const rut = document.getElementById("rut").value.trim();
    const pass = document.getElementById("pass").value.trim();

    // Validaciones simples
    if (rut === "" || pass === "") {
      alert("Debe completar todos los campos");
      return;
    }

    if (pass.length < 4) {
      alert("La contraseña es inválida");
      return;
    }

    // ✅ Si pasa todas las validaciones
    window.location.href = "inicio.html";
  });
});


//funcion para esconder la barra
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("toggleSidebar");
  const sidebar = document.getElementById("sidebar");

  if (!btn || !sidebar) return;

  btn.addEventListener("click", () => {
      sidebar.classList.toggle("hidden");
      btn.textContent = sidebar.classList.contains("hidden") ? "▶" : "◀";
  });
});
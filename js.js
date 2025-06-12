

// PARA QUE 1 Y 2 ESCRIBAN EN TEXTAREA ETC
window.addEventListener('DOMContentLoaded', function() {
    const modal = new bootstrap.Modal(document.getElementById('modal_bienvenida'));
    modal.show();
});
// Este script escucha las teclas 'a' y 'z' para incrementar y decrementar un contador
let counter = 0;
let counterVisita = 0;

document.addEventListener('keydown', function (event) {
    if (event.key === 'a' || event.key === 'A') {
        counter++;
        updateDisplay();
    } else if (event.key === 'z' || event.key === 'Z') {
        if (counter > 0) {
            counter--;
            updateDisplay();
        }
    } else if (event.key === 'd' || event.key === 'D') {
        counterVisita++;
        updateDisplay();
    } else if (event.key === 'c' || event.key === 'C') {
        if (counterVisita > 0) {
            counterVisita--;
            updateDisplay();
        }
    }
});

function updateDisplay() {
    const golesLocal = document.getElementById('goles_local');
    const golesVisita = document.getElementById('goles_visita');
    if (golesLocal) golesLocal.textContent = counter;
    if (golesVisita) golesVisita.textContent = counterVisita;
}

// PERIODO SUMA Y RESTA
let periodo = 0;

document.addEventListener('keydown', function (event) {
    if (event.key === 'p' || event.key === 'P') {
        if (periodo < 2) {
            periodo++;
            updatePeriodoDisplay();
        }
    } else if (event.key === 'o' || event.key === 'O') {
        if (periodo > 1) {
            periodo--;
            updatePeriodoDisplay();
        }
    }
});

function updatePeriodoDisplay() {
    const periodoDisplay = document.getElementById('periodo');
    if (periodoDisplay) periodoDisplay.textContent = periodo;
}

// FUULLSCREEN
document.getElementById('fullscreen-btn').addEventListener('click', function () {
    const elem = document.getElementById('master');
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { // Safari
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE11
        elem.msRequestFullscreen();
    }
});

// CRONOMETRO
let tiempoRestante = 25 * 60; // 25 minutos en segundos
let cronometroActivo = false;
let intervaloCronometro = null;

function actualizarCronometro() {
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    const cronometro = document.getElementById('cronometro');
    if (cronometro) {
        cronometro.textContent = 
            `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }
}
function pararCronometro() {
    if (cronometroActivo) {
        clearInterval(intervaloCronometro);
        cronometroActivo = false;
    }
    tiempoRestante = 25 * 60; // Reinicia el tiempo a 25 minutos
    actualizarCronometro();
}
function pararCronometroReal() {
    if (cronometroActivo) {
        clearInterval(intervaloCronometro);
        cronometroActivo = false;
    }
}
function iniciarPausarCronometro() {
    if (cronometroActivo) {
        clearInterval(intervaloCronometro);
        cronometroActivo = false;
    } else {
        cronometroActivo = true;
        intervaloCronometro = setInterval(() => {
            if (tiempoRestante > 0) {
                tiempoRestante--;
                actualizarCronometro();
            } else {
                clearInterval(intervaloCronometro);
                cronometroActivo = false;
            }
        }, 1000);
    }
}


// Inicializa el cronómetro al cargar la página
actualizarCronometro();
document.getElementById('input-logo-local').addEventListener('change', function(event) {
    const img = document.getElementById('logo-local');
    const file = event.target.files[0];
    if (file) {
        img.src = URL.createObjectURL(file);
    }
});

document.getElementById('input-logo-visitante').addEventListener('change', function(event) {
    const img = document.getElementById('logo-visitante');
    const file = event.target.files[0];
    if (file) {
        img.src = URL.createObjectURL(file);
    }
});

// Permite editar los nombres de los equipos al hacer clic

document.querySelectorAll('.equipos_fuente1').forEach(function(element) {
    element.addEventListener('keydown', function(e) {
        // Evita que otras funciones escuchen teclas mientras se edita
        e.stopPropagation();
        // Si se presiona Enter, salir de la edición
        if (e.key === 'Enter') {
            e.preventDefault();
            element.blur();
        }
    });
});

let modalAbierto = false;

document.addEventListener('keydown', function(event) {
    if ((event.key === 'r' || event.key === 'R') && !document.activeElement.isContentEditable && !modalAbierto) {
        modalAbierto = true;
        var modal = new bootstrap.Modal(document.getElementById('modal_tiempo_reset'));
        modal.show();

        // Cuando el modal se cierra, resetea la variable
        document.getElementById('modal_tiempo_reset').addEventListener('hidden.bs.modal', function handler() {
            modalAbierto = false;
            // Elimina el listener para evitar múltiples registros
            this.removeEventListener('hidden.bs.modal', handler);
        });
    }
});
document.getElementById('reset-grabado').onclick = function () {
    tiempoRestante = 25 * 60;
            actualizarCronometro();
            pararCronometro();

}

document.addEventListener('keydown', function(event) {
    if ((event.key === 'y' || event.key === 'Y') && !document.activeElement.isContentEditable && !modalAbierto) {
        modalAbierto = true;
        var modal = new bootstrap.Modal(document.getElementById('modal_tiempo_total_reset'));
        modal.show();

        // Cuando el modal se cierra, resetea la variable
        document.getElementById('modal_tiempo_total_reset').addEventListener('hidden.bs.modal', function handler() {
            modalAbierto = false;
            // Elimina el listener para evitar múltiples registros
            this.removeEventListener('hidden.bs.modal', handler);
        });
    }
});
document.getElementById('reset-TOTAL').onclick = function () {
    tiempoRestante = 25 * 60;
            // Reinicia goles
            counter = 0;
            counterVisita = 0;
            updateDisplay();
            // Reinicia logo local
            document.getElementById('logo-local').src = '';
        document.getElementById('logo-visitante').src = '';
            // Reinicia periodo
            periodo = 1;
            updatePeriodoDisplay();
            // Reinicia reloj
            tiempoRestante = 25 * 60;
            actualizarCronometro();
            pararCronometro();
            document.querySelectorAll('.equipos_fuente1').forEach(function(element) {
                element.textContent = 'EQUIPOS';});

}

let sancionContext = null; // 'local' o 'visitante'
let sancionesLocal = [];
let sancionesVisitante = [];
let sancionTimers = [];
let tiempoJuegoActivo = false;



document.addEventListener('keydown', function(event) {
    const active = document.activeElement;
    const isInput = (
        active.tagName === 'INPUT' ||
        active.tagName === 'TEXTAREA' ||
        active.isContentEditable
    );
    if (!isInput && !modalAbierto) {
        if (event.key === '1') {
            if (sancionesLocal.length < 4) {
                modalAbierto = true;
                sancionContext = 'local';
                document.getElementById('numero_sancion_input').value = '';
                const modal = new bootstrap.Modal(document.getElementById('modal_sancion'));
                modal.show();
                setTimeout(() => {
                    document.getElementById('numero_sancion_input').focus();
                }, 200);
                pararCronometroReal();
                pausarSanciones();
                document.getElementById('modal_sancion').addEventListener('hidden.bs.modal', function handler() {
                    modalAbierto = false;
                    this.removeEventListener('hidden.bs.modal', handler);
                });
            }
        }
        if (event.key === '2') {
            if (sancionesVisitante.length < 4) {
                modalAbierto = true;
                sancionContext = 'visitante';
                document.getElementById('numero_sancion_input').value = '';
                const modal = new bootstrap.Modal(document.getElementById('modal_sancion'));
                modal.show();
                setTimeout(() => {
                    document.getElementById('numero_sancion_input').focus();
                }, 200);
                pararCronometroReal();
                pausarSanciones();
                document.getElementById('modal_sancion').addEventListener('hidden.bs.modal', function handler() {
                    modalAbierto = false;
                    this.removeEventListener('hidden.bs.modal', handler);
                });
            }
        }
    }
});

// Aceptar con Enter en el input del modal
document.getElementById('numero_sancion_input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('confirmar_sancion_btn').click();
    }
});
// Confirmar sanción
document.getElementById('confirmar_sancion_btn').addEventListener('click', function() {
    const numero = document.getElementById('numero_sancion_input').value;
    if (!numero) return;
    const sancion = {
        numero: numero,
        tiempo: 120,
        activo: cronometroActivo, // Solo activa si el reloj principal está corriendo
        elemento: null,
        finalizada: false
    };
    let contenedor, lista;
    if (sancionContext === 'local') {
        contenedor = document.getElementById('sanciones-local');
        lista = sancionesLocal;
    } else {
        contenedor = document.getElementById('sanciones-visitante');
        lista = sancionesVisitante;
    }

    // Crear box visual

    const box = document.createElement('div');
    box.className = 'sancion-box';
    box.innerHTML = `<div class="sancion-numero">${numero}</div>
                     <div class="sancion-crono">02:00</div>`;
    contenedor.appendChild(box);
    sancion.elemento = box;
    lista.push(sancion);


// Permitir borrar la sanción con click derecho en cualquier momento
box.addEventListener('contextmenu', function(e) {
    e.preventDefault(); // Evita el menú contextual por defecto
    box.remove();
    // Elimina del array
    const idx = lista.indexOf(sancion);
    if (idx !== -1) lista.splice(idx, 1);
    // Detiene el timer de la sanción
    clearInterval(interval);
});
    // Timer
    const crono = box.querySelector('.sancion-crono');
    let interval = setInterval(() => {
        if (sancion.activo && sancion.tiempo > 0) {
            sancion.tiempo--;
            let min = Math.floor(sancion.tiempo / 60);
            let seg = sancion.tiempo % 60;
            crono.textContent = `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
            if (sancion.tiempo === 0) {
                clearInterval(interval);
                crono.textContent = "Ingresa";
                box.style.backgroundColor = "green";
                sancion.finalizada = true;
            }
        }
    }, 1000);
    sancionTimers.push({interval, sancion});

    // Permitir borrar solo si está finalizada
    box.addEventListener('click', function() {
        if (sancion.finalizada) {
            box.remove();
            // Elimina del array
            const idx = lista.indexOf(sancion);
            if (idx !== -1) lista.splice(idx, 1);
        }
    });

    // Cerrar modal
    bootstrap.Modal.getInstance(document.getElementById('modal_sancion')).hide();
});

// Sincroniza sanciones con el reloj principal
function pausarSanciones() {
    sancionesLocal.concat(sancionesVisitante).forEach(s => s.activo = false);
}
function reanudarSanciones() {
    sancionesLocal.concat(sancionesVisitante).forEach(s => {
        if (s.tiempo > 0) s.activo = true;
    });
}
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !document.activeElement.isContentEditable) {
        if (cronometroActivo) {
            pararCronometroReal(); // <--- Cambia esto
            pausarSanciones();
        } else {
            // Reanuda el cronómetro principal y las sanciones
            cronometroActivo = true;
            intervaloCronometro = setInterval(() => {
                if (tiempoRestante > 0) {
                    tiempoRestante--;
                    actualizarCronometro();
                } else {
                    clearInterval(intervaloCronometro);
                    cronometroActivo = false;
                }
            }, 1000);
            reanudarSanciones();
        }
        event.preventDefault();
    }
});
// Modifica tu función de cronómetro principal para actualizar sanciones

// Controlar timers de sanción con el tiempo de juego (Space)
function pausarSanciones() {
    sancionesLocal.concat(sancionesVisitante).forEach(s => s.activo = false);
}
function reanudarSanciones() {
    sancionesLocal.concat(sancionesVisitante).forEach(s => {
        if (s.tiempo > 0) s.activo = true;
    });
}

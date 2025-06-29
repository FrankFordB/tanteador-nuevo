let cronometroEstabaCorriendo = false;

// PARA QUE 1 Y 2 ESCRIBAN EN TEXTAREA ETC
// window.addEventListener('DOMContentLoaded', function() {
//     const modal = new bootstrap.Modal(document.getElementById('modal_bienvenida'));
//     modal.show();
// });

// GOLES
let counter = 0;
let counterVisita = 0;

document.addEventListener('keydown', function (event) {
    if ((event.key === 'a' || event.key === 'A' )&& !document.activeElement.isContentEditable && !modalAbierto) {
        counter++;
        updateDisplay();
    } else if (event.key === 'z' || event.key === 'Z') {
        if (counter > 0) {
            counter--;
            updateDisplay();
        }
    } else if ((event.key === 'd' || event.key === 'D')&& !document.activeElement.isContentEditable && !modalAbierto){
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
let periodo = 1;

document.addEventListener('keydown', function (event) {
    if ((!enEntretiempo)&& !document.activeElement.isContentEditable && !modalAbierto) { // <-- Solo permite cambiar periodo si NO está en entretiempo
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
    }
});

function updatePeriodoDisplay() {
    const periodoDisplay = document.getElementById('periodo');
    if (periodoDisplay) periodoDisplay.textContent = periodo;
}

// FULLSCREEN
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

// CRONÓMETRO PRINCIPAL
let minutosPeriodo = parseInt(document.getElementById('minutos_periodo').value);
let minutosEntretiempo = parseInt(document.getElementById('minutos_entretiempo').value);
let periodoActual = 1;
let cronometroInterval;
let segundosRestantes = minutosPeriodo * 60;
let enEntretiempo = false;
let cronometroPausado = true;

// Actualiza los minutos según el input
document.getElementById('minutos_periodo').addEventListener('input', function() {
    minutosPeriodo = parseInt(this.value) || 1;
    if (!enEntretiempo && periodoActual !== 2) {
        segundosRestantes = minutosPeriodo * 60;
        actualizarCronometro();
    }
});

document.getElementById('minutos_entretiempo').addEventListener('input', function() {
    minutosEntretiempo = parseInt(this.value) || 1;
});

document.addEventListener('keydown', function(event) {
    if (event.key === '0' && !document.activeElement.isContentEditable && !modalAbierto) {
        enEntretiempo = false;
        periodoActual = 2;
        segundosRestantes = minutosPeriodo * 60;
        document.getElementById('periodo').textContent = periodoActual;
        actualizarCronometro();
        cronometroPausado = true; // Espera Space para arrancar
        clearInterval(cronometroInterval);
        pausarSanciones();
    }
});
// Actualiza el cronómetro en pantalla
function actualizarCronometro() {
    let min = Math.floor(segundosRestantes / 60).toString().padStart(2, '0');
    let seg = (segundosRestantes % 60).toString().padStart(2, '0');
    document.getElementById('cronometro').textContent = `${min}:${seg}`;
}
function activarPantallaCompleta() {
    const elem = document.getElementById('master');
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { // Safari
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE11
        elem.msRequestFullscreen();
    }
}

document.getElementById('fullscreen-btn').addEventListener('click', activarPantallaCompleta);

document.addEventListener('keydown', function(event) {
    if ((event.key === 'm' || event.key === 'M') && !document.fullscreenElement) {
        activarPantallaCompleta();
    }
});
// Iniciar cronómetro principal
function iniciarCronometro() {
    clearInterval(cronometroInterval);
    cronometroInterval = setInterval(() => {
        if (segundosRestantes > 0) {
            segundosRestantes--;
            actualizarCronometro();
        } else {
            clearInterval(cronometroInterval);
            if (!enEntretiempo && periodoActual === 1) {
    // PASA A ENTRETIEMPO Y LO LARGA SOLO
    enEntretiempo = true;
    segundosRestantes = minutosEntretiempo * 60;
    document.getElementById('periodo').textContent = 'Entretiempo';
    actualizarCronometro();
    pausarSanciones();
    cronometroPausado = false; // El entretiempo arranca solo
    iniciarCronometro(); // Lanza el entretiempo automáticamente
} else if (enEntretiempo) {
    // PASA A SEGUNDO TIEMPO, PERO SOLO ARRANCA CON SPACE
    enEntretiempo = false;
    periodoActual = 2;
    segundosRestantes = minutosPeriodo * 60;
    document.getElementById('periodo').textContent = periodoActual;
    actualizarCronometro();
    cronometroPausado = true; // Espera Space para arrancar
    // NO LLAMES iniciarCronometro() aquí, espera Space
} else {
    mostrarGanador();

            }
        }
    },1000);
}
document.getElementById('ayuda-btn').addEventListener('click', function() {
    var modal = new bootstrap.Modal(document.getElementById('modal_ayuda'));
    modal.show();
});
// Barra espaciadora: pausa/reanuda cronómetro y sanciones
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !document.activeElement.isContentEditable) {
        event.preventDefault();
        if (cronometroPausado) {
            iniciarCronometro();
            reanudarSanciones();
            cronometroPausado = false;
        } else {
            clearInterval(cronometroInterval);
            pausarSanciones();
            cronometroPausado = true;
        }
    }
});

// Tecla para finalizar periodo antes de tiempo (ej: tecla "F")
document.addEventListener('keydown', function(e) {
    if (e.key.toLowerCase() === 'f') {
        if (cronometroInterval && segundosRestantes > 0) {
            let modal = new bootstrap.Modal(document.getElementById('modal_fin_anticipado'));
            modal.show();
        }
    }
});

// Confirmar fin anticipado
document.getElementById('confirmar_fin_anticipado').addEventListener('click', function() {
    let modal = bootstrap.Modal.getInstance(document.getElementById('modal_fin_anticipado'));
    modal.hide();
    clearInterval(cronometroInterval);
    if (!enEntretiempo && periodoActual === 1) {
    // PASA A ENTRETIEMPO Y LO LARGA SOLO
    enEntretiempo = true;
    segundosRestantes = minutosEntretiempo * 60;
    document.getElementById('periodo').textContent = 'Entretiempo';
    actualizarCronometro();
    pausarSanciones();
    cronometroPausado = false; // El entretiempo arranca solo
    iniciarCronometro(); // Lanza el entretiempo automáticamente
} else if (enEntretiempo) {
    // PASA A SEGUNDO TIEMPO, PERO SOLO ARRANCA CON SPACE
    enEntretiempo = false;
    periodoActual = 2;
    segundosRestantes = minutosPeriodo * 60;
    document.getElementById('periodo').textContent = periodoActual;
    actualizarCronometro();
    cronometroPausado = true; // Espera Space para arrancar
    // NO LLAMES iniciarCronometro() aquí, espera Space
} else {
    pausarSanciones();
    mostrarGanador();
}
});

// Mostrar el ganador en el modal
function mostrarGanador() {
    let golesLocal = parseInt(document.getElementById('goles_local').textContent) || 0;
    let golesVisita = parseInt(document.getElementById('goles_visita').textContent) || 0;
    let nombreLocal = document.getElementById('equipo_local_editable').textContent;
    let nombreVisita = document.getElementById('equipo_visitante_editable').textContent;
    let logoLocal = document.getElementById('logo-local').src;
    let logoVisita = document.getElementById('logo-visitante').src;
    let html = '';

    if (golesLocal > golesVisita) {
        html = `
            <img src="${logoLocal}" alt="Ganador" style="max-width:220px;max-height:220px;">
            <h1 style="font-size:2.5em;margin-top:20px;">¡Felicitaciones ${nombreLocal.toUpperCase()}!</h1>
            <h2 style="margin-top:10px;">Ganador del partido</h2>
        `;
    } else if (golesVisita > golesLocal) {
        html = `
            <img src="${logoVisita}" alt="Ganador" style="max-width:220px;max-height:220px;">
            <h1 style="font-size:2.5em;margin-top:20px;">¡Felicitaciones ${nombreVisita.toUpperCase()}!</h1>
            <h2 style="margin-top:10px;">Ganador del partido</h2>
        `;
    } else {
        html = `
            <div style="display:flex;justify-content:center;gap:40px;align-items:center;">
                <img src="${logoLocal}" alt="Local" style="max-width:180px;max-height:180px;">
                <img src="${logoVisita}" alt="Visitante" style="max-width:180px;max-height:180px;">
            </div>
            <h1 style="font-size:2.5em;margin-top:20px;">¡Felicitaciones!</h1>
            <h2 style="margin-top:10px;">PARTIDO EMPATADO</h2>
        `;
    }
    document.getElementById('ganador_body').innerHTML = html + '<canvas id="confetti-canvas" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2;"></canvas>';
    let modal = new bootstrap.Modal(document.getElementById('modal_ganador'));
    modal.show();
}
// LOGOS
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
        e.stopPropagation();
        if (e.key === 'Enter') {
            e.preventDefault();
            element.blur();
        }
    });
});

// MODALES DE RESET
let modalAbierto = false;

document.addEventListener('keydown', function(event) {
    if ((event.key === 'r' || event.key === 'R') && !document.activeElement.isContentEditable && !modalAbierto) {
        modalAbierto = true;
        var modal = new bootstrap.Modal(document.getElementById('modal_tiempo_reset'));
        modal.show();
        document.getElementById('modal_tiempo_reset').addEventListener('hidden.bs.modal', function handler() {
            modalAbierto = false;
            this.removeEventListener('hidden.bs.modal', handler);
        });
    }
});
document.getElementById('reset-grabado').onclick = function () {
    segundosRestantes = minutosPeriodo * 60;
    actualizarCronometro();
    clearInterval(cronometroInterval);
    cronometroPausado = true;
    pausarSanciones();
}
document.addEventListener('keydown', function(event) {
    if ((event.key === 'y' || event.key === 'Y') && !document.activeElement.isContentEditable && !modalAbierto) {
        modalAbierto = true;
        var modal = new bootstrap.Modal(document.getElementById('modal_reset_total'));
        modal.show();
        document.getElementById('modal_reset_total').addEventListener('hidden.bs.modal', function handler() {
            modalAbierto = false;
            this.removeEventListener('hidden.bs.modal', handler);
        });
    }
});

// Y en tu HTML debe existir un modal con id="modal_reset_total" y un botón de confirmación, por ejemplo:
document.getElementById('confirmar_reset_total').onclick = function () {
    // Aquí va el código de reset total:
    counter = 0;
    counterVisita = 0;
    updateDisplay();
    document.getElementById('logo-local').src = '';
    document.getElementById('logo-visitante').src = '';
    periodo = 1;
    periodoActual = 1;
    enEntretiempo = false;
    updatePeriodoDisplay();
    minutosPeriodo = parseInt(document.getElementById('minutos_periodo').value);
    segundosRestantes = minutosPeriodo * 60;
    actualizarCronometro();
    clearInterval(cronometroInterval);
    cronometroPausado = true;
    pausarSanciones();
    document.querySelectorAll('.equipos_fuente1').forEach(function(element) {
        element.textContent = 'EQUIPOS';
    });
    document.getElementById('sanciones-local').innerHTML = '';
    document.getElementById('sanciones-visitante').innerHTML = '';
    sancionesLocal = [];
    sancionesVisitante = [];
    // Cierra el modal
    bootstrap.Modal.getInstance(document.getElementById('modal_reset_total')).hide();
};

// SANCIONES
let sancionContext = null; // 'local' o 'visitante'
let sancionesLocal = [];
let sancionesVisitante = [];

// Atajos para sanciones
document.addEventListener('keydown', function(event) {
    const active = document.activeElement;
    const isInput = (
        active.tagName === 'INPUT' ||
        active.tagName === 'TEXTAREA' ||
        active.isContentEditable
    );
    if (!isInput && !modalAbierto && !enEntretiempo) { // <-- agrega !enEntretiempo aquí
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
                // Guarda el estado antes de pausar
                cronometroEstabaCorriendo = !cronometroPausado;
                clearInterval(cronometroInterval);
                pausarSanciones();
                cronometroPausado = true;
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
                // Guarda el estado antes de pausar
                cronometroEstabaCorriendo = !cronometroPausado;
                clearInterval(cronometroInterval);
                pausarSanciones();
                cronometroPausado = true;
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
    let contenedor, lista;
    if (sancionContext === 'local') {
        contenedor = document.getElementById('sanciones-local');
        lista = sancionesLocal;
    } else {
        contenedor = document.getElementById('sanciones-visitante');
        lista = sancionesVisitante;
    }

    // Buscar si ya existe una sanción activa para ese número
    let sancionExistente = lista.find(s => s.numero === numero && !s.finalizada);

    if (sancionExistente) {
        // Guardar el tiempo restante ANTES de sumar
        let tiempoRestantePrevio = sancionExistente.tiempo;

        // Sumar 120 segundos a la sanción existente
        sancionExistente.tiempo += 120;

        // Actualizar el cronómetro visual del box original
        let min = Math.floor(sancionExistente.tiempo / 60);
        let seg = sancionExistente.tiempo % 60;
        sancionExistente.elemento.querySelector('.sancion-crono').textContent =
            `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;

        // Solo crear el box "Jugador N" si el cronómetro estaba corriendo antes de abrir el modal
        if (cronometroEstabaCorriendo) {
            const boxN = document.createElement('div');
            boxN.className = 'sancion-box sancion-nueva';
            boxN.innerHTML = `<div class="sancion-numero" style="text-align: center;">Jugador N</div>
                  <div class="sancion-crono">${Math.floor(tiempoRestantePrevio/60).toString().padStart(2, '0')}:${(tiempoRestantePrevio%60).toString().padStart(2, '0')}</div>`;
            contenedor.appendChild(boxN);
            
            // Estructura para el box N, igual que las sanciones normales
            const sancionN = {
    numero: 'N',
    tiempo: tiempoRestantePrevio,
    activo: !cronometroPausado,
    elemento: boxN,
    finalizada: false
};
            lista.push(sancionN);

            // Timer para el box "N"
            const cronoN = boxN.querySelector('.sancion-crono');
            let intervalN = setInterval(() => {
                if (sancionN.activo && sancionN.tiempo > 0) {
                    sancionN.tiempo--;
                    let minN = Math.floor(sancionN.tiempo / 60);
                    let segN = sancionN.tiempo % 60;
                    cronoN.textContent = `${minN.toString().padStart(2, '0')}:${segN.toString().padStart(2, '0')}`;
                    if (sancionN.tiempo === 0) {
                        clearInterval(intervalN);
                        cronoN.textContent = "Ingresa";
                        boxN.style.backgroundColor = "green";
                        sancionN.finalizada = true;
                    }
                }
            }, 1000);

            // Permitir borrar el box "N" con click derecho
            boxN.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                boxN.remove();
                const idx = lista.indexOf(sancionN);
                if (idx !== -1) lista.splice(idx, 1);
                clearInterval(intervalN);
            });

            // Permitir borrar el box "N" solo si está en verde
            boxN.addEventListener('click', function() {
                if (sancionN.finalizada) {
                    boxN.remove();
                    const idx = lista.indexOf(sancionN);
                    if (idx !== -1) lista.splice(idx, 1);
                }
            });
        }

        // Cerrar modal y salir
        bootstrap.Modal.getInstance(document.getElementById('modal_sancion')).hide();
        return;
    }

    // Si no existe, crear nueva sanción normalmente
    const sancion = {
        numero: numero,
        tiempo: 120,
        activo: !cronometroPausado,
        elemento: null,
        finalizada: false
    };

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
        e.preventDefault();
        box.remove();
        const idx = lista.indexOf(sancion);
        if (idx !== -1) lista.splice(idx, 1);
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

    // Permitir borrar solo si está finalizada
    box.addEventListener('click', function() {
        if (sancion.finalizada) {
            box.remove();
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

// Inicializa el cronómetro al cargar la página
actualizarCronometro();
// Modifica tu función de cronómetro principal para actualizar sanciones

function lanzarConfites() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d');
    let confetti = [];
    for (let i = 0; i < 120; i++) {
        // Evita el centro (40% a 60% del ancho)
        let x;
        do {
            x = Math.random() * canvas.width;
        } while (x > canvas.width * 0.4 && x < canvas.width * 0.6);
        confetti.push({
            x: x,
            y: Math.random() * -canvas.height,
            r: Math.random() * 2 + 3,
            d: Math.random() * 50 + 50,
            color: `hsl(${Math.random() * 360}, 90%, 60%)`,
            tilt: Math.random() * 10 - 10,
            tiltAngle: 0,
            tiltAngleIncremental: (Math.random() * 0.07) + 0.05
        });
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach(c => {
            ctx.beginPath();
            ctx.lineWidth = c.r;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + c.r / 3, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.r * 2);
            ctx.stroke();
        });
        update();
        requestAnimationFrame(draw);
    }
    function update() {
        confetti.forEach(c => {
            c.y += 1.2 + c.r / 6; // Más lento
            c.x += Math.sin(0.01);
            c.tiltAngle += c.tiltAngleIncremental;
            c.tilt = Math.sin(c.tiltAngle) * 15;
            if (c.y > canvas.height) {
                // Reaparece arriba, evitando el centro
                let x;
                do {
                    x = Math.random() * canvas.width;
                } while (x > canvas.width * 0.4 && x < canvas.width * 0.6);
                c.x = x;
                c.y = -10;
            }
        });
    }
    draw();
}
document.getElementById('modal_ganador').addEventListener('shown.bs.modal', lanzarConfites);
document.getElementById('modal_ganador').addEventListener('hidden.bs.modal', function() {
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});
// Funciones de validación
function validarCampos(ids) {
    for (let id of ids) {
        if (document.getElementById(id).value === "") {
            alert("Por favor, llene todos los campos numéricos.");
            return false;
        }
    }
    return true;
}

// Limpiar DOM
function limpiarDOM(idResultado) {
    document.getElementById(idResultado).innerHTML = "";
}

// Escenario A: Carburantes
function calcularCarburantes() {
    if (!validarCampos(['c-inicial', 'c-consumo', 'c-reabastecimiento', 'c-critico'])) return;

    let inicial = parseFloat(document.getElementById('c-inicial').value);
    let consumo = parseFloat(document.getElementById('c-consumo').value);
    let reabast = parseFloat(document.getElementById('c-reabastecimiento').value);
    let critico = parseFloat(document.getElementById('c-critico').value);

    let deficitDiario = consumo - reabast;
    let resultadoHTML = `<h3>Resultados:</h3>`;

    if (deficitDiario <= 0) {
        resultadoHTML += `<p class="exito">El reabastecimiento supera o iguala al consumo. La reserva es estable.</p>`;
    } else {
        let diasParaCritico = (inicial - critico) / deficitDiario;
        if (diasParaCritico <= 0) {
            resultadoHTML += `<p class="alerta">¡Atención! La reserva ya está en nivel crítico o por debajo.</p>`;
        } else {
            resultadoHTML += `<p>Días estimados hasta alcanzar el nivel crítico: <strong>${Math.ceil(diasParaCritico)} días</strong>.</p>`;
            resultadoHTML += `<p class="alerta">Déficit de combustible diario: ${deficitDiario} litros.</p>`;
        }
    }
    document.getElementById('resultado-carburantes').innerHTML = resultadoHTML;
}

// Escenario B: Alimentos
function calcularAlimentos() {
    if (!validarCampos(['a-precio-ant', 'a-precio-act', 'a-cantidad'])) return;

    let producto = document.getElementById('a-producto').value || "Producto";
    let pAnt = parseFloat(document.getElementById('a-precio-ant').value);
    let pAct = parseFloat(document.getElementById('a-precio-act').value);
    let cantidad = parseFloat(document.getElementById('a-cantidad').value);

    let gastoAnt = pAnt * cantidad;
    let gastoAct = pAct * cantidad;
    let diferencia = gastoAct - gastoAnt;
    let porcentaje = ((pAct - pAnt) / pAnt) * 100;

    let claseImpacto = diferencia > 0 ? "alerta" : "exito";

    document.getElementById('resultado-alimentos').innerHTML = `
        <h3>Impacto Mensual - ${producto}</h3>
        <p>Gasto Anterior: ${gastoAnt.toFixed(2)} Bs</p>
        <p>Gasto Actual: ${gastoAct.toFixed(2)} Bs</p>
        <p class="${claseImpacto}">Incremento de Gasto: ${diferencia.toFixed(2)} Bs (${porcentaje.toFixed(1)}%)</p>
    `;
}

// Escenario C: Transporte
function calcularTransporte() {
    if (!validarCampos(['t-dist-normal', 't-dist-desvio', 't-costo-km', 't-viajes'])) return;

    let distNormal = parseFloat(document.getElementById('t-dist-normal').value);
    let distDesvio = parseFloat(document.getElementById('t-dist-desvio').value);
    let costoKm = parseFloat(document.getElementById('t-costo-km').value);
    let viajes = parseFloat(document.getElementById('t-viajes').value);

    let costoAdicionalViaje = (distDesvio - distNormal) * costoKm;
    let costoAdicionalSemanal = costoAdicionalViaje * viajes;

    document.getElementById('resultado-transporte').innerHTML = `
        <h3>Cálculo de Desvío</h3>
        <p>Costo adicional por viaje: ${costoAdicionalViaje.toFixed(2)} Bs</p>
        <p class="alerta">Gasto extra por semana: ${costoAdicionalSemanal.toFixed(2)} Bs</p>
    `;
}
// Escenario D: Compras Familiares
function calcularCompras() {
    if (!validarCampos(['d-presupuesto', 'd-precio', 'd-cantidad'])) return;

    let presupuesto = parseFloat(document.getElementById('d-presupuesto').value);
    let precio = parseFloat(document.getElementById('d-precio').value);
    let cantidad = parseFloat(document.getElementById('d-cantidad').value);

    let totalCompra = precio * cantidad;
    let diferencia = presupuesto - totalCompra;
    
    let resultadoHTML = `<h3>>> Salida de Datos: Análisis Presupuestario</h3>
                         <p>Total de la compra proyectada: ${totalCompra.toFixed(2)} Bs</p>`;

    if (diferencia >= 0) {
        resultadoHTML += `<p class="exito">[OK] El presupuesto es suficiente. Saldo a favor: +${diferencia.toFixed(2)} Bs</p>
                          <p>Clasificación del gasto: <span style="color:var(--neon-primario)">Sostenible</span></p>`;
    } else {
        resultadoHTML += `<p class="alerta">[CRÍTICO] Presupuesto insuficiente. Monto faltante: ${Math.abs(diferencia).toFixed(2)} Bs</p>
                          <p>Clasificación del gasto: <span class="alerta">Riesgo Alto (Déficit)</span></p>`;
    }

    document.getElementById('resultado-compras').innerHTML = resultadoHTML;
}

// Escenario E: Rumor de Escasez
function calcularEscasez() {
    if (!validarCampos(['e-demanda', 'e-porcentaje', 'e-stock'])) return;

    let demandaNormal = parseFloat(document.getElementById('e-demanda').value);
    let aumentoPorcentaje = parseFloat(document.getElementById('e-porcentaje').value);
    let stock = parseFloat(document.getElementById('e-stock').value);

    // Modelo matemático del requerimiento: Nueva demanda = demanda + demanda * aumento%
    let nuevaDemanda = demandaNormal + (demandaNormal * (aumentoPorcentaje / 100));
    let impacto = nuevaDemanda - demandaNormal;
    let stockRestante = stock - nuevaDemanda;

    let resultadoHTML = `<h3>>> Salida de Datos: Proyección de Demanda</h3>
                         <p>Demanda proyectada por pánico: ${nuevaDemanda.toFixed(0)} unidades</p>
                         <p>Impacto del rumor: +${impacto.toFixed(0)} unidades adicionales solicitadas</p>`;

    if (stockRestante >= 0) {
        resultadoHTML += `<p class="exito">[OK] El sistema soporta el pánico. Stock restante: ${stockRestante.toFixed(0)} unidades.</p>`;
    } else {
        resultadoHTML += `<p class="alerta">[CRÍTICO] COLAPSO DE INVENTARIO. Faltan ${Math.abs(stockRestante).toFixed(0)} unidades para cubrir la sobredemanda.</p>`;
    }

    document.getElementById('resultado-escasez').innerHTML = resultadoHTML;
}

// Escenario F: Pérdida del Poder Adquisitivo
function calcularPoderAdquisitivo() {
    if (!validarCampos(['f-ingreso', 'f-gasto-ant', 'f-gasto-act'])) return;

    let ingreso = parseFloat(document.getElementById('f-ingreso').value);
    let gastoAnt = parseFloat(document.getElementById('f-gasto-ant').value);
    let gastoAct = parseFloat(document.getElementById('f-gasto-act').value);

    let aumentoGasto = gastoAct - gastoAnt;
    let saldoAnt = ingreso - gastoAnt;
    let saldoAct = ingreso - gastoAct;
    
    // Porcentaje de pérdida de poder adquisitivo en relación al ingreso
    let perdidaPoder = (aumentoGasto / ingreso) * 100;

    let resultadoHTML = `<h3>>> Salida de Datos: Análisis Económico</h3>
                         <p>Saldo / Ahorro mensual histórico: ${saldoAnt.toFixed(2)} Bs</p>
                         <p>Saldo / Ahorro mensual actual: ${saldoAct.toFixed(2)} Bs</p>
                         <p class="alerta">[Peligroso] Incremento de la carga de gastos: +${aumentoGasto.toFixed(2)} Bs</p>`;

    if(saldoAct < 0){
        resultadoHTML += `<p class="alerta">[CRÍTICO] Nivel de afectación: EXTREMO. La familia está operando con pérdidas y necesita deuda para sobrevivir.</p>`;
    } else {
        resultadoHTML += `<p>Pérdida neta de poder adquisitivo del salario: <strong class="alerta">-${perdidaPoder.toFixed(1)}%</strong></p>`;
    }

    document.getElementById('resultado-poder').innerHTML = resultadoHTML;
}
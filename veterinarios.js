const formularioVeterinario = document.getElementById("formularioVeterinario");
const tablaVeterinarios = document.getElementById("tablaVeterinarios");
const totalVeterinarios = document.getElementById("totalVeterinarios");
const botonRegistrar = formularioVeterinario.querySelector('button[type="submit"]');

function generarIdVeterinario() {
    const veterinarios = JSON.parse(localStorage.getItem("veterinarios")) || [];
    let id;
    do {
        id = Math.floor(100000 + Math.random() * 900000).toString();
    } while (veterinarios.some(function(veterinario) {
        return veterinario.idVeterinario === id;
    }));
    return id;
}

let idVeterinarioEditando = null;

function mostrarVeterinarios() {
    const veterinarios = JSON.parse(localStorage.getItem("veterinarios")) || [];
    tablaVeterinarios.innerHTML = "";

    const fotoPorDefecto = "https://wikimedia.org";

    veterinarios.forEach(function(veterinario) {
        const fila = document.createElement("tr");

        // Validamos que existan las propiedades para evitar campos vacíos raros
        const id = veterinario.idVeterinario || "---";
        const matricula = veterinario.matricula || "Sin matrícula";
        const nombre = veterinario.nombreVeterinario || "Sin nombre";
        const especializacion = veterinario.especializacion || "General";
        const valor = veterinario.valorConsulta || 0;
        const foto = (veterinario.fotoVeterinario && veterinario.fotoVeterinario.trim() !== "") 
            ? veterinario.fotoVeterinario 
            : fotoPorDefecto;

        fila.innerHTML = `
            <td>${matricula}</td>
            <td style="display: flex; align-items: center; gap: 10px;">
                <img src="${foto}" alt="Foto" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid #ccc;">
                <span>${nombre}</span>
            </td>
            <td>${especializacion}</td>
            <td>$${valor}</td>
            <td>
                <div class="acciones-veterinario">
                    <button
                        class="btn-accion btn-editar"
                        onclick="editarVeterinario('${id}')">
                        <span>✎</span> Editar
                    </button>
                    <button
                        class="btn-accion btn-eliminar"
                        onclick="eliminarVeterinario('${id}')">
                        <span>×</span> Eliminar
                    </button>
                </div>
            </td>
        `;
        tablaVeterinarios.appendChild(fila);
    });

    totalVeterinarios.textContent = veterinarios.length;
}

formularioVeterinario.addEventListener("submit", function(event) {
    event.preventDefault();

    // Capturamos el input de foto de forma segura si es que existe en el HTML
    const inputFoto = document.getElementById("fotoVeterinario");
    const urlFoto = inputFoto ? inputFoto.value.trim() : "";

    const nuevoVeterinario = {
        nombreVeterinario: document.getElementById("nombreVeterinario").value.trim(),
        matricula: document.getElementById("matricula").value.trim(),
        especializacion: document.getElementById("especializacion").value.trim(),
        valorConsulta: parseFloat(document.getElementById("valorConsulta").value) || 0,
        fotoVeterinario: urlFoto
    };

    const veterinarios = JSON.parse(localStorage.getItem("veterinarios")) || [];

    if (idVeterinarioEditando === null) {
        nuevoVeterinario.idVeterinario = generarIdVeterinario();
        veterinarios.push(nuevoVeterinario);
    } else {
        const indice = veterinarios.findIndex(function(veterinario) {
            return veterinario.idVeterinario === idVeterinarioEditando;
        });

        if (indice !== -1) {
            nuevoVeterinario.idVeterinario = idVeterinarioEditando;
            veterinarios[indice] = nuevoVeterinario;
        }
    }

    localStorage.setItem("veterinarios", JSON.stringify(veterinarios));
    formularioVeterinario.reset();

    idVeterinarioEditando = null;
    botonRegistrar.textContent = "Registrar veterinario";

    mostrarVeterinarios();
});

function editarVeterinario(id) {
    const veterinarios = JSON.parse(localStorage.getItem("veterinarios")) || [];
    const veterinario = veterinarios.find(function(veterinario) {
        return veterinario.idVeterinario === id;
    });

    if (!veterinario) {
        return;
    }

    document.getElementById("nombreVeterinario").value = veterinario.nombreVeterinario;
    document.getElementById("matricula").value = veterinario.matricula;
    document.getElementById("especializacion").value = veterinario.especializacion;
    document.getElementById("valorConsulta").value = veterinario.valorConsulta;
    
    const inputFoto = document.getElementById("fotoVeterinario");
    if (inputFoto) {
        inputFoto.value = veterinario.fotoVeterinario || "";
    }

    idVeterinarioEditando = id;
    botonRegistrar.textContent = "Guardar cambios";

    formularioVeterinario.scrollIntoView({
        behavior: "smooth",
        block: "start"
    }); 
}

function eliminarVeterinario(id) {
    const confirmar = confirm("¿Estás seguro de que querés eliminar este veterinario?");
    if (!confirmar) {
        return;
    }

    let veterinarios = JSON.parse(localStorage.getItem("veterinarios")) || [];
    veterinarios = veterinarios.filter(function(veterinario) {
        return veterinario.idVeterinario !== id;
    });

    localStorage.setItem("veterinarios", JSON.stringify(veterinarios));

    if (idVeterinarioEditando === id) {
        formularioVeterinario.reset();
        idVeterinarioEditando = null;
        botonRegistrar.textContent = "Registrar veterinario";
    }

    mostrarVeterinarios();
}

mostrarVeterinarios();

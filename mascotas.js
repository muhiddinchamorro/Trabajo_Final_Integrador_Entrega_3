const formularioMascota = document.getElementById("formularioMascota");
const formularioEditar = document.getElementById("formularioEditar");
const tablaMascotas = document.getElementById("tablaMascotas");
const totalMascotas = document.getElementById("totalMascotas");
const botonRegistrar = formularioMascota.querySelector('button[type="submit"]');
const botonEditar = formularioEditar.querySelector('button[type="submit"]');
const modalEditar = new bootstrap.Modal(document.getElementById('modal-editar'));

function generarIdMascota() {
    const mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];

    let id;

    do {
        id = Math.floor(100000 + Math.random() * 900000).toString();
    } while (mascotas.some(function(mascota) {
        return mascota.idMascota === id;
    }));

    return id;
}

let idMascotaEditando = null;


function mostrarMascotas() {
    const mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];

    tablaMascotas.innerHTML = "";

    mascotas.forEach(function(mascota) {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${mascota.nombreMascota}</td>
            <td>${mascota.nombreDuenio}</td>
            <td>${mascota.color}</td>
            <td>${mascota.edad}</td>
            <td>${mascota.peso} kg</td>
            <td>
                <div class="acciones-mascota">
                    <button
                        class="btn-accion btn-editar"
                        onclick="editarMascota('${mascota.idMascota}')">
                        <span>✎</span> Editar
                    </button>

                    <button
                        class="btn-accion btn-eliminar"
                        onclick="eliminarMascota('${mascota.idMascota}')">
                        <span>×</span> Eliminar
                    </button>
                </div>
            </td>
        `;
        tablaMascotas.appendChild(fila);
    });

    totalMascotas.textContent = mascotas.length;
}


formularioMascota.addEventListener("submit", function(event) {
    event.preventDefault();

    const nuevaMascota = {
        nombreMascota: document.getElementById("nombreMascota").value.trim(),
        nombreDuenio: document.getElementById("nombreDuenio").value.trim(),
        color: document.getElementById("colorMascota").value.trim(),
        edad: parseInt(document.getElementById("edadMascota").value),
        peso: parseFloat(document.getElementById("pesoMascota").value)
    };

    const mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];

    if (idMascotaEditando === null) {

        
        nuevaMascota.idMascota = generarIdMascota();

        mascotas.push(nuevaMascota);

    } else {

       
        const indice = mascotas.findIndex(function(mascota) {
            return mascota.idMascota === idMascotaEditando;
        });

        if (indice !== -1) {
            nuevaMascota.idMascota = idMascotaEditando;
            mascotas[indice] = nuevaMascota;
        }
    }

    localStorage.setItem("mascotas", JSON.stringify(mascotas));

    formularioMascota.reset();

    idMascotaEditando = null;
    botonRegistrar.textContent = "Registrar mascota";

    mostrarMascotas();
});


function editarMascota(id) {
    const mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];

    const mascota = mascotas.find(function(mascota) {
        return mascota.idMascota === id;
    });

    if (!mascota) {
        return;
    }

    idMascotaEditando = id;

    document.getElementById("edit-nombreMascota").value = mascota.nombreMascota;
    document.getElementById("edit-nombreDuenio").value = mascota.nombreDuenio;
    document.getElementById("edit-colorMascota").value = mascota.color;
    document.getElementById("edit-edadMascota").value = mascota.edad;
    document.getElementById("edit-pesoMascota").value = mascota.peso;
    
    modalEditar.show();

    botonEditar.textContent = "Guardar cambios";
}

formularioEditar.addEventListener("submit", event => {
    event.preventDefault();
    if (!idMascotaEditando) return;

    const mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];
    
    const indice = mascotas.findIndex(m => m.idMascota === idMascotaEditando)
    if (indice === -1) return;

    mascotas[indice] = {
        idMascota: idMascotaEditando,
        nombreMascota: document.getElementById("edit-nombreMascota").value.trim(),
        nombreDuenio: document.getElementById("edit-nombreDuenio").value.trim(),
        color: document.getElementById("edit-colorMascota").value.trim(),
        edad: parseInt(document.getElementById("edit-edadMascota").value),
        peso: parseFloat(document.getElementById("edit-pesoMascota").value)
    };
    localStorage.setItem("mascotas",JSON.stringify(mascotas));
    formularioEditar.reset();
    idMascotaEditando= null;
    modalEditar.hide();
    mostrarMascotas();
} ) ;




function eliminarMascota(id) {
    const confirmar = confirm("¿Estás seguro de que querés eliminar esta mascota?");

    if (!confirmar) {
        return;
    }

    let mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];

    mascotas = mascotas.filter(function(mascota) {
        return mascota.idMascota !== id;
    });

    localStorage.setItem("mascotas", JSON.stringify(mascotas));

   
    if (idMascotaEditando === id) {
        formularioMascota.reset();
        idMascotaEditando = null;
        botonRegistrar.textContent = "Registrar mascota";
    }

    mostrarMascotas();
}


mostrarMascotas();
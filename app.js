document.addEventListener("DOMContentLoaded", async function() {
    const productos = [
        { nombre: "Tobilleras para MMA", valor: 30000 },
        { nombre: "Guantines para MMA", valor: 22300 },
        { nombre: "Vendas de boxeo", valor: 12000 },
        { nombre: "Guantes de boxeo", valor: 65000 },
        { nombre: "Saco de entrenamiento", valor: 35500 },
    ];
    const url = 'https://forecast9.p.rapidapi.com/';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'b161d24a36mshb2c3d9b2624270cp13034fjsn0f21592aa88b',
            'X-RapidAPI-Host': 'forecast9.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        const climaContainer = document.getElementById("clima-container");

        // Mostrar los resultados en el contenedor
        if (result.current) {
            climaContainer.innerHTML = `
                <h2>Informe del clima</h2>
                <p>Ubicación: ${result.location || 'Ubicación no disponible'}</p>
                <p>Temperatura: ${result.current.temp_f !== undefined ? result.current.temp_f + '°F' : 'Temperatura no disponible'}</p>
                <p>Condición: ${result.current.condition.text || 'Condición no disponible'}</p>
            `;
        } else {
            climaContainer.innerHTML = '<p>Información del clima no disponible.</p>';
        }

    } catch (error) {
        console.error(error);
    }
    const itemsCarrito = JSON.parse(localStorage.getItem("itemsCarrito")) || [];

    const agregarAlCarrito = (producto) => {
        const itemExistente = itemsCarrito.find(item => item.nombre === producto.nombre);
        if (itemExistente) {
            itemExistente.cantidad += 1;
        } else {
            itemsCarrito.push({ ...producto, cantidad: 1 });
        }
        localStorage.setItem("itemsCarrito", JSON.stringify(itemsCarrito));
        actualizarCarrito();
    };

    const removerDelCarrito = (indice) => {
        itemsCarrito.splice(indice, 1);
        localStorage.setItem("itemsCarrito", JSON.stringify(itemsCarrito));
        actualizarCarrito();
    };

    const vaciarCarrito = () => {
        Swal.fire({
            title: "Vaciar carrito",
            text: "¿Estás seguro de que deseas vaciar el carrito?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, vaciar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                itemsCarrito.length = 0;
                localStorage.removeItem("itemsCarrito");
                actualizarCarrito();
                Swal.fire("Carrito vaciado", "El carrito ha sido vaciado correctamente.", "success");
            }
        });
    };

    const actualizarCarrito = () => {
        const itemsCarritoContainer = document.getElementById("itemsCarrito");
        const totalCarritoContainer = document.getElementById("total-valor");

        itemsCarritoContainer.innerHTML = "";
        let total = 0;

        itemsCarrito.forEach((item, indice) => {
            total += item.valor * item.cantidad;

            const li = document.createElement("li");
            li.innerHTML = `
                ${item.nombre} - Cantidad: ${item.cantidad} - 
                Subtotal: $${item.valor * item.cantidad} 
                <button class="remover-del-carrito" data-indice="${indice}">Remover</button>
            `;
            itemsCarritoContainer.appendChild(li);
        });

        totalCarritoContainer.textContent = total;
        
        const botonesRemover = document.querySelectorAll(".remover-del-carrito");
        botonesRemover.forEach(boton => {
            boton.addEventListener("click", (event) => {
                const indice = event.target.getAttribute("data-indice");
                removerDelCarrito(indice);
            });
        });
    };

    const botonesAgregar = document.querySelectorAll(".agregar-al-carrito");
    botonesAgregar.forEach((boton, indice) => {
        boton.addEventListener("click", () => {
            agregarAlCarrito(productos[indice]);
        });
    });

    const botonVaciarCarrito = document.getElementById("vaciar-carrito");
    botonVaciarCarrito.addEventListener("click", () => {
        vaciarCarrito();
    });

    actualizarCarrito();
});

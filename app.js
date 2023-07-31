document.addEventListener("DOMContentLoaded", function() {
    const products = [
        { name: "Tibieras para MMA", value: 30000 },
        { name: "Guantines para MMA", value: 22300 },
        { name: "Vendas de boxeo", value: 12000 },
        { name: "Guantes de boxeo", value: 65000 },
        { name: "heavybag", value: 35500 },
    ];

    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    const addToCart = (product) => {
        const existingItem = cartItems.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({ ...product, quantity: 1 });
        }
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        updateCart();
    };

    const removeFromCart = (index) => {
        cartItems.splice(index, 1);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        updateCart();
    };

    const clearCart = () => {
        cartItems.length = 0;
        localStorage.removeItem("cartItems");
        updateCart();
    };

    const updateCart = () => {
        const cartItemsElement = document.getElementById("itemCarrito");
        const cartTotalElement = document.getElementById("totalCarrito");
        const totalValueElement = document.getElementById("total-value");

        cartItemsElement.innerHTML = "";
        let total = 0;

        for (const [index, item] of cartItems.entries()) {
            const li = document.createElement("li");
            const img = document.createElement("img");
            const productName = document.createElement("span");
            const productValue = document.createElement("span");
            const productQuantity = document.createElement("span");

            img.src = `img/${item.name.toLowerCase().replace(/ /g, "-")}.jpg`;
            img.alt = item.name;
            img.classList.add("imgCarritoItem");
            productName.textContent = item.name;
            productName.classList.add("nombreCarritoItem");
            productValue.textContent = item.value;
            productValue.classList.add("cart-product-value");
            productQuantity.textContent = item.quantity;
            productQuantity.classList.add("cart-product-quantity");

            li.appendChild(img);
            li.appendChild(productName);
            li.appendChild(document.createTextNode(" - Valor: $"));
            li.appendChild(productValue);
            li.appendChild(document.createTextNode(" - Cantidad: "));
            li.appendChild(productQuantity);

            cartItemsElement.appendChild(li);

            const removeButton = document.createElement("button");
            removeButton.textContent = "Eliminar";
            removeButton.addEventListener("click", () => {
                removeFromCart(index);
            });
            li.appendChild(removeButton);

            total += item.value * item.quantity;
        }

        totalValueElement.textContent = total;
    };

    const buttons = document.querySelectorAll(".add-to-cart");

    buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
            addToCart(products[index]);
        });
    });

    const clearCartButton = document.getElementById("clear-cart");
    clearCartButton.addEventListener("click", () => {
        clearCart();
    });

    updateCart();
});

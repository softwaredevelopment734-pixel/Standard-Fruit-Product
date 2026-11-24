const products = [
    {
        name: "Apple Cider",
        image: "images/apple-cider.jpg",
        bottlePrice: 750,

        descriptionEnglish:
            "Apple Cider Vinegar is beneficial for heart diseases.It works in Arthritis.Control cholestrol level and remove access body fats.",
     
    },
    {
        name: "Grapes Cider",
        image: "images/grapes-cider.jpg",
        bottlePrice: 750,

        descriptionEnglish:
            "According to hadith its a good curry.It cures the acidity of stomach and usefull for different type of allergy.",      
    },
    {
        name: "Jaman Cider",
        image: "images/jaman-cider.jpg",
        bottlePrice: 750,

        descriptionEnglish:
            "Its a usefull gift for diabetes patients.Usefull for esthma and it works in kidney infection",
    }
];
const productList = document.getElementById("product-list");
console.log("Product list:", productList);

products.forEach(function(product, index) {
    console.log(index, product.name);

    productList.innerHTML += `
    <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <button class="add-to-cart" data-index="${index}">
            Add to Cart
        </button>

        <button class="buy-now" data-index="${index}">
            Buy Now
        </button>
    </div>
`;
});

// Move Jaman Card into Jaman Background Area
const jamanArea = document.getElementById("jaman-area");

const jamanCard = productList.querySelector(
    ".product-card:nth-child(3)"
);

jamanArea.prepend(jamanCard);
jamanCard.classList.add("jaman-card");

// Shopping Cart
let cartCounter = 0;
let cart = [];

const cartDisplay = document.getElementById("cart-count");
const cartItemsDisplay = document.getElementById("cart-items");

const buttons = document.querySelectorAll(".add-to-cart");

buttons.forEach(function(button) {
    button.addEventListener("click", function() {
        const index = button.dataset.index;
        const selectedProduct = products[index];

        cart.push(selectedProduct.name);

        cartItemsDisplay.innerHTML = "";

        cart.forEach(function(item, index) {
            cartItemsDisplay.innerHTML += `
                <p>
                    ${item}
                    <button onclick="removeFromCart(${index})">Remove</button>
                </p>
            `;
        });

        cartCounter++;
        cartDisplay.textContent = cartCounter;

        alert("Product Added Successfully!");
    });
});

function removeFromCart(index) {
    cart.splice(index, 1);

    cartCounter = cart.length;
    cartDisplay.textContent = cartCounter;

    cartItemsDisplay.innerHTML = "";

    cart.forEach(function(item, index) {
        cartItemsDisplay.innerHTML += `
            <p>
                ${item}
                <button onclick="removeFromCart(${index})">Remove</button>
            </p>
        `;
    });
}
// Buy Now
const buyButtons = document.querySelectorAll(".buy-now");

buyButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const index = button.dataset.index;
        const selectedProduct = products[index];

        const whatsappMessage =
            `I want to buy: ${selectedProduct.name}`;

        const whatsappNumber = "923085360901";

        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        window.location.href = whatsappURL;
    });
});
// Contact Form
const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = contactForm.querySelector("input").value;
    const message = contactForm.querySelector("textarea").value;

    const whatsappMessage =
        `Name: ${name}\nMessage: ${message}`;

    const whatsappNumber = "923085360901";

    const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    window.location.href = whatsappURL;
});
// Checkout Button
const checkoutButton = document.getElementById("checkout-btn");
const checkoutArea = document.getElementById("checkout-area");

let checkoutQuantities = [];

checkoutButton.addEventListener("click", function() {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    checkoutQuantities = cart.map(function() {
        return {
            bottles: 0,
        };
    });

    showCheckout();
});

function showCheckout() {

    checkoutArea.innerHTML = "<h2>Checkout</h2>";

    let grandTotal = 0;

    cart.forEach(function(item, index) {

        const selectedProduct = products.find(function(product) {
            return product.name === item;
        });

        const bottleTotal =
            checkoutQuantities[index].bottles * selectedProduct.bottlePrice;

        grandTotal += bottleTotal;

        checkoutArea.innerHTML += `
            <div class="checkout-item">

                <h3>${item}</h3>

                <p>Bottle Rs. ${selectedProduct.bottlePrice}</p>

                <button data-index="${index}" data-type="bottles" data-change="-1">−</button>

                <span>${checkoutQuantities[index].bottles}</span>

                <button data-index="${index}" data-type="bottles" data-change="1">+</button>

                <h4>Product Total: Rs. ${bottleTotal}</h4>

            </div>
        `;
    });

    checkoutArea.innerHTML += `
        <h2>Grand Total: Rs. ${grandTotal}</h2>
    `;

    checkoutArea.innerHTML += `
        <div class="customer-form">

            <h2>Customer Information</h2>

            <input type="text" id="customer-name" placeholder="Full Name">

            <input type="tel" id="customer-phone" placeholder="Phone Number">

            <textarea id="customer-address" placeholder="Complete Address"></textarea>

            <button id="place-order">
                Place Order
            </button>

        </div>
    `;
}
// Bottle Quantity Plus Minus
checkoutArea.addEventListener("click", function(event) {

    const button = event.target;

    if (button.dataset.type !== "bottles") {
        return;
    }

    const index = Number(button.dataset.index);
    const change = Number(button.dataset.change);

    checkoutQuantities[index].bottles = Math.max(
        0,
        checkoutQuantities[index].bottles + change
    );

    showCheckout();
});


// PLACE ORDER - FIRESTORE + WHATSAPP

checkoutArea.addEventListener("click", async function(event) {

    if (event.target.id !== "place-order") {
        return;
    }

    const customerName =
        document.getElementById("customer-name").value.trim();

    const customerPhone =
        document.getElementById("customer-phone").value.trim();

    const customerAddress =
        document.getElementById("customer-address").value.trim();

    if (!customerName || !customerPhone || !customerAddress) {
        alert("Please fill all customer information!");
        return;
    }

    let orderMessage = "NEW ORDER\n\n";

    orderMessage += `Name: ${customerName}\n`;
    orderMessage += `Phone: ${customerPhone}\n`;
    orderMessage += `Address: ${customerAddress}\n\n`;

    orderMessage += "ORDER DETAILS:\n";

    let grandTotal = 0;
    let orderDetails = [];

    cart.forEach(function(item, index) {

        const product = products.find(function(p) {
            return p.name === item;
        });

        const bottles = checkoutQuantities[index].bottles;
        const bottleTotal = bottles * product.bottlePrice;

        grandTotal += bottleTotal;

        orderDetails.push(
            `${item} - Bottles: ${bottles} - Total: Rs. ${bottleTotal}`
        );

        orderMessage += `\n${item}\n`;
        orderMessage += `Bottle: ${bottles} = Rs. ${bottleTotal}\n`;
    });

    if (grandTotal === 0) {
        alert("Please select at least one bottle!");
        return;
    }

    orderMessage += `\nGRAND TOTAL: Rs. ${grandTotal}`;

    try {

        await db.collection("orders").add({

            customerName: customerName,
            customerPhone: customerPhone,
            customerAddress: customerAddress,
            orderDetails: orderDetails.join("\n"),
            grandTotal: grandTotal,
            status: "Pending",
            createdAt: firebase.firestore.FieldValue.serverTimestamp()

        });

        alert("Order Saved Successfully!");

        const whatsappNumber = "923085360901";

        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;

        window.location.href = whatsappURL;

    } catch (error) {

        console.error("Order Save Error:", error);
        alert("Order could not be saved. Please try again.");

    }

});
        
// PRODUCT DETAILS POPUP

const productDetails = document.getElementById("product-details");
// LOAD CUSTOMER REVIEWS FROM FIREBASE
async function loadReviews(productName) {

    const reviewsContainer =
        document.getElementById("customer-reviews");

    reviewsContainer.innerHTML = "<p>Loading reviews...</p>";

    try {
        const snapshot = await db.collection("reviews")
            .where("productName", "==", productName)
            .get();

        reviewsContainer.innerHTML = "";

        if (snapshot.empty) {
            reviewsContainer.textContent = "No reviews yet.";
            return;
        }

        snapshot.forEach(function(doc) {

            const review = doc.data();

            const reviewBox = document.createElement("div");
            reviewBox.className = "review-item";

            const customerName = document.createElement("h4");
            customerName.textContent = review.customerName;

            const customerReview = document.createElement("p");
            customerReview.textContent = review.reviewText;

            reviewBox.appendChild(customerName);
            reviewBox.appendChild(customerReview);

            reviewsContainer.appendChild(reviewBox);
        });

    } catch (error) {
        console.error("Loading Reviews Error:", error);
        reviewsContainer.textContent = "Could not load reviews.";
    }
}
console.log("Popup found:", productDetails);
console.log("Details button:", document.getElementById("close-details"));

document.addEventListener("click", function(event) {

    const clickedElement = event.target;

    if (
        !clickedElement.matches(".product-card img, .product-card h3")
    ) {
        return;
    }

    const productCard = clickedElement.closest(".product-card");

    const addButton = productCard.querySelector(".add-to-cart");

    const productIndex = Number(addButton.dataset.index);

    const selectedProduct = products[productIndex];

    document.getElementById("details-name").textContent =
        selectedProduct.name;
        console.log("Price element:",
            document.getElementById("detail-price"));
        document.getElementById("details-price").textContent =
    "Bottle Price: Rs. " + selectedProduct.bottlePrice;

    document.getElementById("details-image").src =
        selectedProduct.image;

    document.getElementById("details-english").textContent =
        selectedProduct.descriptionEnglish;

    document.getElementById("details-urdu").textContent =
        selectedProduct.descriptionUrdu;
    loadReviews(selectedProduct.name);
    productDetails.hidden = false;
});

// CLOSE BUTTON

document.getElementById("close-details").addEventListener("click", function() {
    productDetails.hidden = true;
});

// CLOSE WHEN CLICKING OUTSIDE

productDetails.addEventListener("click", function(event) {
    if (event.target === productDetails) {
        productDetails.hidden = true;
    }
});
// SUBMIT CUSTOMER REVIEW
document.getElementById("submit-review").addEventListener("click", function() {
    const name = document.getElementById("review-name").value.trim();
    const review = document.getElementById("review-text").value.trim();

    if (name === "" || review === "") {
        alert("Please enter your name and review!");
        return;
    }

    const reviewBox = document.createElement("div");
    reviewBox.className = "review-item";

    const customerName = document.createElement("h4");
    customerName.textContent = name;

    const customerReview = document.createElement("p");
    customerReview.textContent = review;

    reviewBox.appendChild(customerName);
    reviewBox.appendChild(customerReview);

    document.getElementById("customer-reviews").appendChild(reviewBox);

    document.getElementById("review-name").value = "";
    document.getElementById("review-text").value = "";

    alert("Thank you! Your review has been submitted.");
});
// LOAD NEW PRODUCTS FROM FIREBASE

async function loadAdminProducts() {

    try {

        const snapshot = await db.collection("products").get();

        snapshot.forEach(function(doc) {

            const data = doc.data();

            const alreadyExists = products.some(function(product) {
                return product.name === data.name;
            });

            if (alreadyExists) {
                return;
            }

            const newProduct = {
                name: data.name,
                image: data.image,
                bottlePrice: Number(data.price),
                descriptionEnglish: data.description
            };

            products.push(newProduct);

            const index = products.length - 1;

            productList.innerHTML += `
                <div class="product-card">

                    <img src="${newProduct.image}"
                        alt="${newProduct.name}">

                    <h3>${newProduct.name}</h3>

                    <button class="add-to-cart"
                        data-index="${index}">
                        Add to Cart
                    </button>

                    <button class="buy-now"
                        data-index="${index}">
                        Buy Now
                    </button>

                </div>
            `;

            const card = productList.lastElementChild;

            card.querySelector(".add-to-cart")
                .addEventListener("click", function() {

                    cart.push(newProduct.name);

                    cartCounter++;
                    cartDisplay.textContent = cartCounter;

                    cartItemsDisplay.innerHTML = "";

                    cart.forEach(function(item, i) {
                        cartItemsDisplay.innerHTML += `
                            <p>
                                ${item}
                                <button onclick="removeFromCart(${i})">
                                    Remove
                                </button>
                            </p>
                        `;
                    });

                    alert("Product Added Successfully!");

                });

            card.querySelector(".buy-now")
                .addEventListener("click", function() {

                    const message =
                        `I want to buy: ${newProduct.name}`;

                    const url =
                        `https://wa.me/923085360901?text=${encodeURIComponent(message)}`;

                    window.location.href = url;

                });

        });

    } catch (error) {

        console.error("Product Loading Error:", error);

    }

}

loadAdminProducts();
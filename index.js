import { menuArray } from './data.js';

const userIn = document.getElementById('user');
const cardIn = document.getElementById('card');
const cvvIn = document.getElementById('cvv');

// Set cart Object
const cartObj = {
    id: 0,
    products: [],
    total: 0,
}

let modalIsOpen = false;

// Listen to click events
document.addEventListener('click', (e) => {
    e.target.dataset.btnId && handleAddButtonClick(e.target.dataset.btnId);
    e.target.dataset.delId && handleDelButtonClick(e.target.dataset.delId);
    if (e.target.id === 'purchase-btn' && cartObj.products.length > 0) {
        handleCompleteOrder();
    } else if (e.target.id === 'purchase-btn') {
        alert('Cart is empty')
    }
    e.target.id === 'modal-overlay' && closeModal();
    e.target.id === 'pay-btn' && completePurchase();
})

// Handle Add Product
const handleAddButtonClick = (id) => {
    if (!document.getElementById('order-products')) {
        return alert('Click on order again button!');
    }
    const selectedFood = menuArray.find(food => food.id === id);

    if (!cartObj.products.includes(selectedFood)) {
        cartObj.products.push(selectedFood);
        selectedFood.qty = 1
    } else {
        selectedFood.qty++
    }
    render();
}

// Handle remove product
const handleDelButtonClick = (id) => {
    const filterdFood = cartObj.products.filter((food) => {
        return !(food.id === id);
    })
    cartObj.products = filterdFood;
    render();
}

// Handle modal visualization
const handleCompleteOrder = () => {
    document.getElementById('modal-overlay').style.display = 'flex';
    modalIsOpen = !modalIsOpen;
}

const closeModal = () => {
    if (modalIsOpen) {
        document.getElementById('modal-overlay').style.display = 'none';
        modalIsOpen = !modalIsOpen;
    }
}

const orderAgain = () => {
    window.location.reload();
}

// Handle purchase
const completePurchase = () => {
    if (modalIsOpen) {
        const username = userIn.value;
        const cardnum = cardIn.value;
        const cvv = cvvIn.value;
        const total = cartObj.total;
        if (cardnum.length === 16 && cvv.length === 3) {
            console.log({ username, cardnum, cvv, total });
            document.getElementById('payment-gateway').innerHTML = `
            <div style="background: #16DB99; width: 100%; heigth: 100%;">
                <h3 style="color: #ffffff">Procesing purchase...</h3>
                <img style="width: 80%; max-width:200px; margin-bottom: 40px;" src="https://samherbert.net/svg-loaders/svg-loaders/tail-spin.svg" alt="svg-loaders">
            </div>
            `
            setTimeout(() => {
                closeModal();
                document.getElementById('order-resume').innerHTML = `
                <h2 id="final-message" style="text-align:center;">Thanks, ${username}! Your order is on its way!</h2>
                <button id="order-again" class="purchase-btn">Order again</button>
            `
                document.getElementById('order-again').addEventListener('click', orderAgain);
            }, 3000)
        } else {
            alert('Invalid information / Incomplete data');
        }
    }
}

// Create html content
const getHtmlContent = () => {
    // Set initial values
    let orderHtmlContent;
    let totalAmount = '0';
    const menuHtmlContent = menuArray.map((product) => {
        const { name, ingredients, emoji, price, id } = product;
        return `
            <div class="product" id="${id}">
                <div class="icon">${emoji}</div>
                <div class="prod-desc">
                    <h2 class="prod-name">${name}</h2>
                    <p class="prod-ingre">${ingredients.join(', ')}</p>
                    <p class="prod-price">$${price}</p>
                </div>
                <img data-btn-id="${id}" class="add-btn" src="images/add.svg" alt="add"/>
            </div>
        `;
    })

    // Render cart conditionally
    if (cartObj.products.length === 0) {
        orderHtmlContent = `
                <div class="order-element">
                    <h2>The cart is empty :(</h2>
                    <p></p>
                </div>
        `
    } else {
        orderHtmlContent = cartObj.products.map((productInCart) => {
            const { id, name, price, qty } = productInCart;
            return `
                <div class="order-element">
                    <h2>${name}</h2><span data-del-id="${id}" class="remove-btn">remove</span>
                    <p>${qty}x $${price}</p>
                </div>
            `;
        })
        totalAmount = cartObj.products.reduce((accumulator, product) => {
            return accumulator + (product.price * product.qty);
        }, 0)
    }

    cartObj.total = totalAmount;

    return [menuHtmlContent, orderHtmlContent];
}

const render = () => {
    const [menuHtmlContent, orderHtmlContent] = getHtmlContent();

    document.getElementById('product-list').innerHTML = menuHtmlContent.join('');

    typeof orderHtmlContent === 'string'
        ? document.getElementById('order-products').innerHTML = orderHtmlContent
        : document.getElementById('order-products').innerHTML = orderHtmlContent.join('');

    document.getElementById('total-amount').textContent = `$${cartObj.total}`;
}

render();
// cart open close
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const closeCart = document.querySelector("#close-cart");

//open cart
cartIcon.onclick = () =>{
    cart.classList.add("active");
}

//close cart
closeCart.onclick = () =>{
    cart.classList.remove("active");
}

//add to cart
//cart working js
if(document.readyState == 'loading'){
    document.addEventListener("DOMContentLoaded", ready);
}
else{
    ready();
}

function ready() {
    //remove item from cart
    const removeCartButtons = document.getElementsByClassName("cart-remove");
    for(let button of removeCartButtons){
        button.addEventListener('click', removeCartItem);
    }

    //quantity change
    const quantityInputs = document.getElementsByClassName("cart-quantity");
    for(let input of quantityInputs){
        input.addEventListener('change', quantityChanged);
    }

    //add to cart
    const addCartButtons = document.getElementsByClassName("add-cart");
    for(let button of addCartButtons){
        button.addEventListener('click', addCartClicked);
    }
    loadCartItems();
    updateCartIcon();
}

//remove cart Item
function removeCartItem(event){
    const buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
    saveCartItem();
    updateCartIcon();
}

//quantity change
function quantityChanged(event){
    const input = event.target;
    if(isNaN(input.value) || input.value <= 0){
        input.value = 1;
    }
    updateTotal();
    saveCartItem();
    updateCartIcon();
}

//add cart function 
function addCartClicked(event){
    const button = event.target;
    const shopProduct = button.parentElement;
    const title = shopProduct.getElementsByClassName('product-title')[0].innerText;
    const price = shopProduct.getElementsByClassName('price')[0].innerText;
    const productImg = shopProduct.getElementsByClassName('product-img')[0].src;
    addProductToCart(title, price, productImg);
    updateTotal();
    saveCartItem();
    updateCartIcon();
}

function addProductToCart(title, price, productImg){
    const cartShopBox = document.createElement("div");
    cartShopBox.classList.add('cart-box');
    const cartItems = document.getElementsByClassName('cart-content')[0];
    const cartItemsNames = cartItems.getElementsByClassName('cart-product-title');
    for(let itemName of cartItemsNames){
        if(itemName.innerText == title){
            alert("You have already added this item to the cart");
            return;
        }
    }
    const cartBoxContent = `
        <img src="${productImg}" alt="" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <i class="fa-regular fa-trash-can cart-remove"></i>`;
    
    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);
    cartShopBox.getElementsByClassName('cart-remove')[0].addEventListener('click', removeCartItem);
    cartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener('change', quantityChanged);
    saveCartItem();
    updateCartIcon();
}

//update total
function updateTotal(){
    const cartContent = document.getElementsByClassName('cart-content')[0];
    const cartBoxes = cartContent.getElementsByClassName('cart-box');
    let total = 0;
    for(let cartBox of cartBoxes){
        const priceElement = cartBox.getElementsByClassName('cart-price')[0];
        const quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        const price = parseFloat(priceElement.innerText.replace('$', ''));
        const quantity = quantityElement.value;
        total += price * quantity;
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('total-price')[0].innerText = "$" + total;

    //save total to local storage
    localStorage.setItem('cartTotal', total);
}


//keeping the trace
function saveCartItem(){
    const cartContent = document.getElementsByClassName('cart-content')[0];
    const cartBoxes = cartContent.getElementsByClassName('cart-box');
    const cartItems = [];
    for(let cartBox of cartBoxes){
        const title = cartBox.getElementsByClassName('cart-product-title')[0].innerText;
        const price = cartBox.getElementsByClassName('cart-price')[0].innerText;
        const quantity = cartBox.getElementsByClassName('cart-quantity')[0].value;
        const productImg = cartBox.getElementsByClassName('cart-img')[0].src;
        cartItems.push({title, price, quantity, productImg});
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function loadCartItems(){
    var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    for(let item of cartItems){
        addProductToCart(item.title, item.price, item.productImg);
        var cartContent = document.getElementsByClassName('cart-content')[0];
        var cartBoxes = cartContent.getElementsByClassName('cart-box');
        var lastCartBox = cartBoxes[cartBoxes.length - 1];
        lastCartBox.getElementsByClassName('cart-quantity')[0].value = item.quantity;
    }
    updateTotal();
    updateCartIcon();
}


//quantity in cart icon
function updateCartIcon() {
    var cartBoxes = document.getElementsByClassName('cart-box');
    var quantity = 0;
    for(var i=0; i< cartBoxes.length; i++){
        var cartBox = cartBoxes[i];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        quantity += parseInt(quantityElement.value);
    }
    var cartIcon = document.querySelector("#cart-icon");
    cartIcon.setAttribute("data-quantity",quantity);
}

//clear cart afer payment
function clearCart(){
    const cartContent = document.getElementsByClassName('cart-content')[0];
    cartContent.innerHTML = '';
    updateTotal();
    localStorage.removeItem('cartItems');
}
const payBtn = document.querySelector('.btn-buy');

payBtn.addEventListener('click', ()=>{
    fetch('/stripe-checkout',{
        method: 'post',
        headers: new Headers({'content-Type': 'application/json'}),
        body: JSON.stringify({
            items: JSON.parse(localStorage.getItem('cartItems')),
        }),
    })
    .then((res)=>res.json())
    .then((data)=>{
        if(data.url){
            location.href = data.url;
            clearCart();
        }
    })
    .catch((err)=>console.log(err));
});
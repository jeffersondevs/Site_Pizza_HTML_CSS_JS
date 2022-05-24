
let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el)


// Listagem das pizzas
pizzaJson.map((item, index) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    // preencher as informações em pizzaIitem

    pizzaItem.setAttribute("data-key", index);
    pizzaItem.querySelector('.pizza-item--img IMG').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest(".pizza-item").getAttribute("data-key");
        modalQt = 1;
        modalKey = key;

        c(".pizzaBig img").src = pizzaJson[key].img; //add img pizza tela do carrinho
        c(".pizzaInfo h1").innerHTML = pizzaJson[key].name; //add nome da pizza carrinho
        c(".pizzaInfo--desc").innerHTML = pizzaJson[key].description; //add descrição da pizza carrinho
        c(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c(".pizzaInfo--size.selected").classList.remove("selected");
        cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add("selected");
            }
            size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex]

        });


        c(".pizzaInfo--qt").innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);


    });

    c('.pizza-area').append(pizzaItem);

});

// Eventos do MODAL

function closeModal() {    // função para fechar o modal(carrinho) botão cancelar
    c(".pizzaWindowArea").style.opacity = 0;
    setTimeout(() => {
        c(".pizzaWindowArea").style.display = "none"
    }, 500);
}
cs(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach((item) => {
    item.addEventListener("click", closeModal);
});

// botão de quantidade de pizza
c(".pizzaInfo--qtmenos").addEventListener("click", () => {
    if (modalQt > 1) {
        modalQt--;
        c(".pizzaInfo--qt").innerHTML = modalQt;
    } else { // animação de erro quando tentar adc pizzas < 1
        c(".pizzaInfo--qtarea").classList.add("animation-error");
        setTimeout(() => {
            c(".pizzaInfo--qtarea").classList.remove("animation-error");
        }, 0500);
    }
});

c(".pizzaInfo--qtmais").addEventListener("click", () => {
    modalQt++;
    c(".pizzaInfo--qt").innerHTML = modalQt;
});

// Escolher/Mudança na caixinha tamanho 
cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
    size.addEventListener("click", (e) => {
        c(".pizzaInfo--size.selected").classList.remove("selected");
        size.classList.add("selected");
    });
});

// Botão adc pizza 
c(".pizzaInfo--addButton").addEventListener("click", () => {
    let size = parseInt(c(".pizzaInfo--size.selected").getAttribute("data-key"));

    // adc ao carrinho
    let identifier = pizzaJson[modalKey].id+"@"+size;

    let key = cart.findIndex((item) => item.identifier == identifier);

    if(key > -1){
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });

    }
    updateCart();
    closeModal();
});

c(".menu-openner").addEventListener("click", ()=> {
    if(cart.length > 0){
        c("aside").style.left = "0"
    }
   
});

c(".menu-closer").addEventListener("click", () => {
    c("aside").style.left = "100vw";
})


// colocando no carrinho
function updateCart() {
    c(".menu-openner span").innerHTML = cart.length;

    if(cart.length > 0) {
        c("aside").classList.add("show");
        c(".cart").innerHTML = "";

        //declarando as variaveis do carrinho
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt; //colocar dentro do for a expressao dos itens


            let cartItem = c(".models .cart--item").cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = "P";
                    break;
                case 1:
                    pizzaSizeName = "M";
                    break;
                case 2:
                    pizzaSizeName = "G";
                    break;

            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector("img").src = pizzaItem.img;
            cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
            cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;
            cartItem.querySelector(".cart--item-qtmenos").addEventListener("click", ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;               // alterar qtd pizzas dentro do carrinho
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            })
            cartItem.querySelector(".cart--item-qtmais").addEventListener("click", ()=>{
                cart[i].qt++;
                updateCart();
            });

            c(".cart").append(cartItem);
           
        }

        //mostrando e calculando no carrinho os itens
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
        c(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        c("aside").classList.remove("show");
        c("aside").style.left = "100vw";
    }
}

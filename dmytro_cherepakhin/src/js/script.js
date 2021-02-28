import $ from 'jquery';
import 'slick-carousel';

// loading the products
const products = [{
    number: 1,
    id: "card__buy_1",
    name: "CBD 500 mg Orange Flavor Tincture",
    rating: 2.5,
    price: 49.99,
    image: "./images/cbdFeaturedProducts_item_1.png",
    quantity: 0,

}, {
    number: 2,
    id: "card__buy_2",
    name: "Black ICE CBD Muscle Rub 200 mg",
    rating: 2.5,
    price: 49.99,
    image: "./images/cbdFeaturedProducts_item_2.png",
    quantity: 0,
}, {
    number: 3,
    id: "card__buy_3",
    name: "CBD+Curcumin Coffee 750 mg",
    rating: 2.5,
    price: 79.99,
    image: "./images/cbdFeaturedProducts_item_3.png",
    quantity: 0,
}, {
    number: 4,
    id: "card__buy_4",
    name: "coconut extra large",
    rating: 2.5,
    price: 15.55,
    image: "./images/cbdFeaturedProducts_item_4.jpg",
    quantity: 0,
}, {
    number: 5,
    id: "card__buy_5",
    name: "meringue pie",
    rating: 2.5,
    price: 12.70,
    image: "./images/cbdFeaturedProducts_item_5.jpg",
    quantity: 0,
}];

// document.addEventListener("DOMContentLoaded", function () {
//     for (let i = 0; i < products.length; i++) {
//         let elemName = document.querySelector(`#card__name_${products[i].number}`);
//         elemName.append(document.createTextNode(products[i].name));

//         let elemPrice = document.querySelector(`#card_price_${products[i].number}`);
//         elemPrice.textContent = `$${products[i].price} USD`;
//     }
// })


// The tabs:
const tabsInput = document.querySelectorAll('input[name="tab-btn"]');
const divFrame = document.querySelectorAll('.cbdAbout__frame');

document.addEventListener("DOMContentLoaded", chooseFrame);
for (let elem of tabsInput) {
    elem.addEventListener("click", chooseFrame);

}

function chooseFrame() {
    for (let i = 0; i < divFrame.length; i++) {
        if (tabsInput[i].checked) {
            divFrame[i].classList.remove('hide');
            divFrame[i].classList.add("show");
        } else {
            divFrame[i].classList.remove('show');
            divFrame[i].classList.add("hide");
        }
    }
}

// The rating:
const stars = document.querySelectorAll('.rating_star');
const ratingSecondLayer = document.querySelector('.rating__layer-2');
let rating = 2.5;
let number = 1;

document.addEventListener("DOMContentLoaded", setRating);

function setRating() {
    ratingSecondLayer.style.width = `${rating*20}%`;
}

for (let i = 0; i < 5; i++) {
    stars[i].addEventListener("mousedown", function () {
        rating = (rating * number + (i + 1)) / (number + 1);
        number += 1;
        setRating();
    })
}

// Slider:
$('.cbdFeaturedProducts__slicker').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true,
                dots: false
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
});

// Accordion:

const acc = document.getElementsByClassName("accordion-item-header");

for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("mousedown", function () {
        this.classList.toggle("active");
        let panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}


// Slider_2:
$('.cbdEveryDay__slicker').slick({
    dots: false,
    infinite: true,
    speed: 1000,
});

// stick-menu:
const cbdAbout = document.getElementById("cbdAbout");
const header = document.querySelector('#header');
window.addEventListener('scroll', function () {
    let opacity = 0;
    if (pageYOffset < 500) {
        opacity = pageYOffset * 0.002;

    } else {
        opacity = 1;
    }
    header.style.backgroundColor = `rgba(110,119,74,${opacity})`;
});

// map:
window.initMap = function () {
    const uluru = {
        lat: 50.00,
        lng: 36.25930
    };
    const map = new google.maps.Map(document.getElementById("map"), {
        center: uluru,
        zoom: 9,
    });
    const image = "../images/marker.png";
    const marker = new google.maps.Marker({
        position: uluru,
        map,
        title: "We are here :)",
    });
};

// scroling:
const anchors = document.querySelectorAll('a.scroll-to')
for (let anchor of anchors) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const blockID = anchor.getAttribute('href')
        document.querySelector(blockID).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    })
}

// show cart:
const cartButton = document.querySelector(".header__cart_link");
const cartWindow = document.querySelector(".cart__window");
cartButton.addEventListener('click', function (e) {
    e.preventDefault();
    cartWindow.classList.toggle("show");
})

// list of items:
let shoppingList = [];
// console.log(products)
const cart = document.querySelector(".header__cart_link");
const buyCards = document.querySelectorAll(".card__buy");
const cartRowSecond = document.querySelector("#cart__window_row-second");
const spanTotalprice = document.querySelector("#totalPrice");

for (let card of buyCards) {
    card.addEventListener('click', function (e) {
        // e.preventDefault();
        let idn = e.target.id;
        let index = getId(products, idn)
        let indexOfSoppingList = getId(shoppingList, idn)
        if (indexOfSoppingList === undefined) {
            // console.log(indexOfSoppingList);
            shoppingList.push(products[index])
            shoppingList[shoppingList.length - 1].quantity = 1;
            indexOfSoppingList = getId(shoppingList, idn);
            cart.textContent = `CART (${shoppingList.length})`;
            // cartRowSecond.textContent = `CuuuART (${products[index].price})`;

            cartRowSecond.insertAdjacentHTML('beforebegin', `<div class="cart__window_row-product">
            <div class="cart__window_item">
                <img class="cart__window_item-img" src="${products[index].image}"
                    alt="${products[index].name}">
            </div>
            <div class="cart__window_info">
                <p class="cart__window_info-name">${products[index].name}</p>
                <div class="cart__window_info-prices">
                    <p class="cart__window_info-price">$${products[index].price} USD</p>
                    <p class="cart__window_info-total" id="quantityProducts-${indexOfSoppingList+1}">$${shoppingList[indexOfSoppingList].price} USD</p>
                </div>
            </div>
            <div class="cart__window_control">
                <div class="cart__window_control-plus">
                    <a href="#" class="cart__window_control-plusLink"></a>
                </div>
                <div class="cart__window_control-number"><span id="controlNumber-${shoppingList.length}">1</span></div>
                <div class="cart__window_control-minus"><a href="#"
                        class="cart__window_control-minusLink"></a></div>
            </div> `);


        } else {

            // let newQuantity = shoppingList[indexOfSoppingList].quantity + 1;
            shoppingList[indexOfSoppingList].quantity += 1;
            let total = shoppingList[indexOfSoppingList].quantity * shoppingList[indexOfSoppingList].price;
            document.querySelector(`#quantityProducts-${indexOfSoppingList+1}`).textContent = `$${total.toFixed(2)} USD`
        }

        let totalPrice = 0;
        // console.log(shoppingList);
        for (let i = 0; i < shoppingList.length; i++) {
            totalPrice = totalPrice + shoppingList[i].price * (shoppingList[i].quantity);
        }
        cartRowSecond.textContent = `$${totalPrice.toFixed(2)} USD`;
        document.querySelector(`#controlNumber-${indexOfSoppingList+1}`).textContent = `${shoppingList[indexOfSoppingList].quantity}`
        // cartRowSecond.textContent = `CuuuART (${products[index].price})`;
    })
}

function getId(array, id) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === id) {
            return i;
        }
    }
}

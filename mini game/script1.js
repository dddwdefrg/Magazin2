const products = [...document.querySelectorAll(".name")]
  .map(el => el.textContent.trim());

let total = 0;

function getListItems() {
    return $('.listtt li').map(function () {
        return $(this).text().trim();
    }).get();
}

function getCartItems() {
    return $('.cart-item').map(function () {
        return $(this).text().split('|')[1].trim();
    }).get();
}

function compareListAndCart(budget, total) {
    const listItems = getListItems();
    const cartItems = getCartItems();

    const missing = listItems.filter(item => !cartItems.includes(item));
    const extra = cartItems.filter(item => !listItems.includes(item));

    const allBought = missing.length === 0;
    const budgetEnough = total <= budget;

    return { listItems, cartItems, missing, extra, allBought, budgetEnough };
}

$(document).ready(function () {
    let budjet = Math.floor(Math.random() * (10000001 - 50000) + 50000);
    $('.bud').text("Твой бюджет: " + budjet);
    let x = Math.floor(Math.random() * 8) + 1
    let y;
    for(let i = 0; i < x; i++){
        y = Math.floor(Math.random() * 78);
        $('.listtt').append(`<li>${products[y]}</li>`);
    }
    $('#promo').change(function(){
        if($('#promo').val() == "АРМЕН ПУШКА"){
            budjet = 999999999999999999999;
            $('.bud').text("Твой бюджет: " + budjet);
        } else{
            alert("Нэт");
        }
    });

$('.buy-all').click(function () {

    const result = compareListAndCart(budjet, total);
    let message = "";

    // Зелений фон = успіх
    function successScreen(text) {
        $('body').css({
            background: '#58d05e',   // Зелений
            color: '#000',
            transition: '0.4s'
        });

        $('#cart, .list, .products-container').remove(); // ховаємо інтерфейс (заміни селектори під себе)

        $('body').append(`
            <div class="finish-message" style="
                font-size: 32px;
                padding: 30px;
                text-align: center;
                font-weight: bold;
            ">${text}</div>
        `);
    }

    // Червоний фон = помилка
    function errorScreen(text) {
        $('body').css({
            background: '#ff4a4a',   // Червоний
            color: '#fff',
            transition: '0.4s'
        });

        $('#cart, .list, .products-container').remove();

        $('body').append(`
            <div class="finish-message" style="
                font-size: 32px;
                padding: 30px;
                text-align: center;
                font-weight: bold;
            ">${text}</div>
        `);
    }

    // ЛОГІКА ПЕРЕВІРКИ

    // Увесь список куплено?
    const all = result.allBought;

    // Бюджет ок?
    const bud = result.budgetEnough;

    // Є зайві продукти?
    const extra = result.extra.length > 0;

    // Є пропущені продукти?
    const missing = result.missing.length > 0;


    // -------- УСПІШНІ ВИПАДКИ --------

    // 1. Усе куплено, бюджет не перевищено, без зайвих
    if (all && bud && !extra) {
        successScreen(`Бюджет не перевищено ✔  
Усе куплено за списком!`);
        return;
    }

    // 2. Усе куплено, бюджет ок, але куплено зайві товари
    if (all && bud && extra) {
        successScreen(`Бюджет не перевищено ✔  
Але ти купив зайве:  
${result.extra.join(', ')}`);
        return;
    }


    // -------- ПОМИЛКИ / НЕВДАЛІ ВИПАДКИ --------

    let errorText = "Є проблеми:\n\n";

    if (!all) {
        errorText += `• Не куплено: ${result.missing.join(', ')}\n`;
    }

    if (!bud) {
        errorText += `• Бюджет перевищено (потрібно ${total}, було ${budjet})\n`;
    }

    if (extra) {
        errorText += `• Куплено зайве: ${result.extra.join(', ')}\n`;
    }

    errorScreen(errorText.replace(/\n/g, '<br>'));
});

});
$('#cart-button').click(function () {
    $('#cart-products').slideToggle();
});
$('.buy').click(function () {
    let card = $(this).closest('.card');
    let name = card.find('.name').text();
    let price = parseInt(card.find('.cost').text());
    let img = card.find('.img').attr("src");

    total += price;

    $('.cart-list').append(`
        <div class="cart-item" data-price="${price}">
            <img src="${img}" width="40" height="40" style="border:2px solid black; border-radius:8px;"> |
            ${name} | ${price} грн | <span class="del" style="cursor:pointer;">🗑️</span>
        </div>
    `);

    $('.zag').text(`Общая стоимость: ${total} грн`);
});
$('.cart-list').on('click', '.del', function () {

    let item = $(this).closest('.cart-item');
    let price = parseInt(item.data('price')); 

    total -= price;

    item.remove();
    alertify.succes("Deleted")
    if (total <= 0) {
        total = 0;
        $('.zag').text(' ');
    } else {
        $('.zag').text(`Общая стоимость: ${total} грн`);
    }
});
$('.clear-cart').click(function () {
    $('.cart-list').empty();
    total = 0;
    $('.zag').text(' ');
});




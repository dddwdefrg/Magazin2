let total = 0;
$(document).ready(function () {
    let budjet = Math.floor(Math.random() * (10000001 - 50000) + 50000);
    $('.bud').text("Хз какой бюджет наверное много");
    $('#promo').change(function(){
        if($('#promo').val() == "АРМЕН ПУШКА"){
            $('.bud').text("Все равно хз");
        } else{
            alert("Так а толку от промокода то даун");
        }
    });

$('.buy-all').click(function () {

    let message = "";

    // Зелений фон = успіх
    function successScreen(text) {
        $('body').css({
            background: '#58d05e',   // Зелений
            color: '#000',
            transition: '0.4s'
        });

        $('#cart, .products, .bud').remove(); // ховаємо інтерфейс (заміни селектори під себе)

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

        $('#cart, .products, .bud').remove();

        $('body').append(`
            <div class="finish-message" style="
                font-size: 32px;
                padding: 30px;
                text-align: center;
                font-weight: bold;
            ">${text}</div>
        `);
    }


    // -------- УСПІШНІ ВИПАДКИ --------

   
    if (total <= budjet) {
        successScreen(`Ну короче твой бюджет был ${budjet} а ты потратил всего ${total}, ну типо молодец хорош красавчик`);
        return;
    }




    // -------- ПОМИЛКИ / НЕВДАЛІ ВИПАДКИ --------

       if (total > budjet) {
        errorScreen(`Ну короче ты проиграл потому что из ${budjet} ты потратил ${total}, это аж на ${total-budjet} больше`);
        return;
    }

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

    $('.zag').text(`Хз сколько`);
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
        $('.zag').text(`Хз сколько`);
    }
});
$('.clear-cart').click(function () {
    $('.cart-list').empty();
    total = 0;
    $('.zag').text(' ');
});




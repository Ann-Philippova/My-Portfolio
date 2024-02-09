$(document).ready(function() {

    // мобильное меню
    const navIcon = document.querySelector('.nav-icon');
    const overlay = document.querySelector('#overlay');
    const mobileMenu = document.querySelector('.mobile-menu');
    const bodyNoscroll = document.body;

    navIcon.addEventListener('click', function () {
        this.classList.toggle('nav-icon--active');
        overlay.classList.toggle('overlay--active');
        mobileMenu.classList.toggle('mobile-menu--active');
        bodyNoscroll.classList.toggle('noscroll');
    });

    const mobileNavLinks = document.querySelectorAll('.mobile-menu__item a');

    mobileNavLinks.forEach(function(item){
        item.addEventListener('click', function(){
            navIcon.classList.remove('nav-icon--active');
            overlay.classList.remove('overlay--active');
            mobileMenu.classList.remove('mobile-menu--active');
            bodyNoscroll.classList.remove('noscroll');
        })
    });

    // Закрываем моб.меню при ресайзе экрана
    window.addEventListener('resize', function(){
        navIcon.classList.remove('nav-icon--active');
        overlay.classList.remove('overlay--active');
        mobileMenu.classList.remove('mobile-menu--active');
        bodyNoscroll.classList.remove('noscroll');
    });

    // Стрелочка вверх
    const backTopButton = document.querySelector('#backtop');

    backTopButton.style.opacity = 0;

    document.addEventListener('scroll', function(){
        if (window.pageYOffset > 500) {
            backTopButton.style.opacity = 1;
        } else {
            backTopButton.style.opacity = 0;
        }
    });

    // Паралакс для кавычек
    const paralaxScene = document.querySelector('.contacts');
    const paralaxImg = document.querySelectorAll('.move');
    paralaxScene.addEventListener('mousemove', function(e){
        let x = e.clientX / window.innerWidth;
        let y = e.clientY / window.innerHeight;
        for (let item of paralaxImg) {
            item.style.transform = 'translate(-' + x * 50 + 'px, -' + y * 50 + 'px)';
        }
    });

    // PageNav
    $('#header-menu').onePageNav({
        currentClass: 'active',
        changeHash: false,
        scrollSpeed: 750,
        scrollThreshold: 0.5,
        filter: '',
        easing: 'swing'
    });

    // убираем активный класс у пункта меню, если вернулись наверх страницы
    $(window).scroll(function() {
        const height = $(window).scrollTop();
        const elements = $('.nav__item');
        const navShadow = $('.nav')
        if(height < 100){
            elements.removeClass('active');
            navShadow.removeClass('nav--shadow');
        } else {
            navShadow.addClass('nav--shadow')
        }
    });

    // Подключаем MixItUp
    let mixBlockEl = document.querySelector('#mix-cards');

    let mixer = mixitup(mixBlockEl, {
        classNames: {
            block: ""
        }
    });

    // при разрешении меньше 768 сбрасываем настройки и показываем все карточки
    window.addEventListener('resize', function(){
        if (document.documentElement.clientWidth < 768) {
            mixer.show()
            .then(function(state) {
                console.log(state.totalShow === state.totalTargets); // true
            });
        }
    });

    // перемещение фейкового плейсхолдера в contact form
    // находим все поля ввода данных
    const formItems = document.querySelectorAll('.form-item__input');

    // обходим все найденные поля
    formItems.forEach (function(item){

        // находим родительский див для каждого элемента
        const thisParent = item.closest('.form-item');
        // в родителе находим фейковый плейсхолдер
        const thisPlaceholder = thisParent.querySelector('.form-item__fake-placeholder');

        // проверяем если инпут в фокусе, то добавляем класс active 
        item.addEventListener('focus', function(){
            thisPlaceholder.classList.add('active');
            this.classList.add('active');
        });

        // при потере фокуса инпутом проверяем пусто ли поле ввода,
        // если пусто, то класс active убираем, если нет - оставляем
        item.addEventListener('blur', function(){
            if (item.value.length > 0) {
                thisPlaceholder.classList.add('active');
                this.classList.remove('active');
            } else {
                thisPlaceholder.classList.remove('active');
                this.classList.remove('active');
            }
        });
    });

    // проверяем правильность заполнения формы
    $('.contact-form').validate({
        // прописываем правила, которые должны соблюдаться:
        rules: {
            email: { //значение из аттрибута name в инпутах
                required: true,
                email: true
            },
            message: {
                required: true
            }
        },
        // прописываем ссобщения при нарушении правил:
        messages: {
            email: {
                required: 'Введите Ваш email',
                email: 'Некорректный email'
            },
            message: {
                required: 'Введите, пожалуйста, текст сообщения'
            }
        },
        // если все правила соблюдены, отправляем форму:
        submitHandler: function (form) {
            ajaxFormSubmit();
        }
    });

    /* Функция, отвечающая за отправку формы на сервер без перезагрузки страницы */
    // AJAX запрос на сервер

    function ajaxFormSubmit() {
        
        // сохраняем в строку данные, введенные в форму:
        let string = $('.contact-form').serialize();
    
        // формируем ajax запрос
        $.ajax({
            type: "POST", // тип запроса - POST
            url: "php/mail.php", // куда отправляем запрос
            data: string, // какие данные отправляем (здесь переменную string)
    
            // если отправка прошла успешно:
            success: function (html) {
                $('.contact-form').slideUp(500);
                $('#answer').html(html);
            }
        });
        // чтобы по submit ничего больше не выполнялось - возвращаем false, чтобы прервать цепочку срабатывания остальных функций
        return false;
    }

})
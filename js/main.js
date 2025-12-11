// main.js - Script principal pour le projet DHTML

$(document).ready(function () {
    console.log("Application DHTML initialisée");

    // Gestion du bouton Login
    $('.login-btn').on('click', function (e) {
        e.preventDefault();
        console.log("Redirection vers la page de login");

        // Effet de transition avant la redirection
        $(this).addClass('loading');

        setTimeout(() => {
            window.location.href = 'pages/login.html';
        }, 300);
    });

    // Gestion des liens de navigation avec des effets
    $('nav a').on('click', function (e) {
        e.preventDefault();
        const href = $(this).attr('href');

        // Effet de chargement
        $('#affichage').fadeOut(200, function () {
            $(this).html('<p>Chargement...</p>').fadeIn(200);
        });

        // Simuler un chargement puis rediriger
        setTimeout(() => {
            window.location.href = href;
        }, 800);
    });

    // Animation d'entrée pour le contenu principal
    $('#affichage').hide().fadeIn(1000);

    // Effet de parallaxe léger sur le logo
    let mouseX = 0, mouseY = 0;

    $(document).mousemove(function (e) {
        mouseX = (e.pageX - $(window).width() / 2) / 100;
        mouseY = (e.pageY - $(window).height() / 2) / 100;

        $('.logo').css({
            'transform': `translate(${mouseX}px, ${mouseY}px)`
        });
    });

    // Messages d'accueil dynamiques
    const messages = [
        "Bienvenue dans l'application DHTML",
        "Explorez nos fonctionnalités",
        "Développé par l'équipe N2MF",
        "CODE4WARD - Excellence en développement"
    ];

    let currentMessage = 0;

    function rotateMessages() {
        $('#affichage p').fadeOut(500, function () {
            currentMessage = (currentMessage + 1) % messages.length;
            $(this).text(messages[currentMessage]).fadeIn(500);
        });
    }

    // Rotation des messages toutes les 4 secondes
    setInterval(rotateMessages, 4000);

    // Effet de survol sur les membres de l'équipe
    $('.member').hover(
        function () {
            $(this).css({
                'transform': 'scale(1.05)',
                'transition': 'all 0.3s ease'
            });
        },
        function () {
            $(this).css({
                'transform': 'scale(1)',
                'transition': 'all 0.3s ease'
            });
        }
    );

    // Fonction utilitaire pour les transitions de page
    function navigateWithTransition(url) {
        $('body').fadeOut(300, function () {
            window.location.href = url;
        });
    }

    // Gestion des erreurs de navigation
    $(window).on('beforeunload', function () {
        console.log("Navigation en cours...");
    });

    // Console de développement avec style
    console.log("%c🚀 Application N2MF - CODE4WARD",
        "background: linear-gradient(135deg, #00ff88, #00cc66); color: #0f0f23; padding: 10px; font-size: 16px; font-weight: bold; border-radius: 5px;");
    console.log("%cDéveloppeurs: NIEKENA, NAJORO, MALALA, FABRICE",
        "color: #00ff88; font-size: 12px;");
});
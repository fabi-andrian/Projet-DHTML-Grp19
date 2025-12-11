$(document).ready(function () {

    // Fonction pour calculer le déterminant d'une matrice 3x3
    function calculerDeterminant3x3(matrice) {
        // Formule du déterminant pour une matrice 3x3 :
        // det = a11(a22*a33 - a23*a32) - a12(a21*a33 - a23*a31) + a13(a21*a32 - a22*a31)

        const [[a11, a12, a13],
            [a21, a22, a23],
            [a31, a32, a33]] = matrice;

        return a11 * (a22 * a33 - a23 * a32)
            - a12 * (a21 * a33 - a23 * a31)
            + a13 * (a21 * a32 - a22 * a31);
    }

    // Fonction pour récupérer les valeurs des champs d'entrée
    function obtenirCoefficients() {
        const coefficients = {
            // Matrice principale A (coefficients des variables)
            A: [
                [parseFloat($('#a11').val()) || 0, parseFloat($('#a12').val()) || 0, parseFloat($('#a13').val()) || 0],
                [parseFloat($('#a21').val()) || 0, parseFloat($('#a22').val()) || 0, parseFloat($('#a23').val()) || 0],
                [parseFloat($('#a31').val()) || 0, parseFloat($('#a32').val()) || 0, parseFloat($('#a33').val()) || 0]
            ],
            // Vecteur des termes constants b
            b: [
                parseFloat($('#b1').val()) || 0,
                parseFloat($('#b2').val()) || 0,
                parseFloat($('#b3').val()) || 0
            ]
        };

        return coefficients;
    }

    // Fonction pour créer les matrices pour chaque variable (règle de Cramer)
    function creerMatricesVariables(A, b) {
        // Pour x1 : remplacer la 1ère colonne de A par b
        const Ax = [
            [b[0], A[0][1], A[0][2]],
            [b[1], A[1][1], A[1][2]],
            [b[2], A[2][1], A[2][2]]
        ];

        // Pour x2 : remplacer la 2ème colonne de A par b
        const Ay = [
            [A[0][0], b[0], A[0][2]],
            [A[1][0], b[1], A[1][2]],
            [A[2][0], b[2], A[2][2]]
        ];

        // Pour x3 : remplacer la 3ème colonne de A par b
        const Az = [
            [A[0][0], A[0][1], b[0]],
            [A[1][0], A[1][1], b[1]],
            [A[2][0], A[2][1], b[2]]
        ];

        return { Ax, Ay, Az };
    }

    // Fonction pour formater les nombres (arrondir à 6 décimales max)
    function formaterNombre(nombre) {
        if (Math.abs(nombre) < 1e-10) {
            return 0; // Traiter les très petits nombres comme zéro
        }

        // Arrondir à 6 décimales et supprimer les zéros inutiles
        return Math.round(nombre * 1000000) / 1000000;
    }

    // Fonction principale pour résoudre le système
    function resoudreSysteme() {
        try {
            // Récupérer les coefficients
            const { A, b } = obtenirCoefficients();

            // Calculer le déterminant principal (Δ)
            const detPrincipal = calculerDeterminant3x3(A);
            $('#det-main').text(formaterNombre(detPrincipal));

            // Vérifier si le système a une solution unique
            if (Math.abs(detPrincipal) < 1e-10) {
                // Le déterminant est nul ou très proche de zéro
                $('#status-message')
                    .removeClass('success warning')
                    .addClass('error')
                    .text('Système impossible ou indéterminé (déterminant = 0)')
                    .show();

                // Effacer les solutions
                $('#solution-x1, #solution-x2, #solution-x3').text('---');
                $('#det-x, #det-y, #det-z').text('---');

                return;
            }

            // Créer les matrices pour chaque variable
            const { Ax, Ay, Az } = creerMatricesVariables(A, b);

            // Calculer les déterminants pour chaque variable
            const detX = calculerDeterminant3x3(Ax);
            const detY = calculerDeterminant3x3(Ay);
            const detZ = calculerDeterminant3x3(Az);

            // Afficher les déterminants
            $('#det-x').text(formaterNombre(detX));
            $('#det-y').text(formaterNombre(detY));
            $('#det-z').text(formaterNombre(detZ));

            // Calculer les solutions selon la règle de Cramer : xi = Δxi / Δ
            const x1 = detX / detPrincipal;
            const x2 = detY / detPrincipal;
            const x3 = detZ / detPrincipal;

            // Afficher les solutions
            $('#solution-x1').text(formaterNombre(x1));
            $('#solution-x2').text(formaterNombre(x2));
            $('#solution-x3').text(formaterNombre(x3));

            // Message de succès
            $('#status-message')
                .removeClass('error warning')
                .addClass('success')
                .text('Système résolu avec succès !')
                .show();

        } catch (error) {
            // Gestion des erreurs
            console.error('Erreur lors de la résolution:', error);
            $('#status-message')
                .removeClass('success warning')
                .addClass('error')
                .text('Erreur lors du calcul. Vérifiez vos données.')
                .show();
        }
    }

    // Fonction pour effacer tous les champs
    function effacerChamps() {
        // Vider tous les champs d'entrée
        $('#a11, #a12, #a13, #a21, #a22, #a23, #a31, #a32, #a33, #b1, #b2, #b3').val('');

        // Cacher la section des résultats
        $('#results-section').removeClass('results-visible').addClass('results-hidden');

        // Effacer les valeurs affichées
        $('#det-main, #det-x, #det-y, #det-z').text('0');
        $('#solution-x1, #solution-x2, #solution-x3').text('0');
        $('#status-message').hide();
    }

    // Fonction pour charger un exemple
    function chargerExemple() {
        // Exemple de système :
        // 2x1 + 1x2 + 1x3 = 5
        // 1x1 + 3x2 + 2x3 = 11
        // 1x1 + 2x2 + 3x3 = 12
        // Solution : x1 = 1, x2 = 2, x3 = 3

        $('#a11').val('2');
        $('#a12').val('1');
        $('#a13').val('1');
        $('#b1').val('5');

        $('#a21').val('1');
        $('#a22').val('3');
        $('#a23').val('2');
        $('#b2').val('11');

        $('#a31').val('1');
        $('#a32').val('2');
        $('#a33').val('3');
        $('#b3').val('12');

        // Message informatif
        $('#status-message')
            .removeClass('success error')
            .addClass('warning')
            .text('Exemple chargé ! Cliquez sur "Résoudre" pour voir la solution.')
            .show();
    }

    // Événements des boutons
    $('#solve-btn').click(function () {
        // Afficher la section des résultats avec animation
        $('#results-section').removeClass('results-hidden').addClass('results-visible');

        // Résoudre le système après un petit délai pour l'animation
        setTimeout(resoudreSysteme, 100);
    });

    $('#clear-btn').click(function () {
        effacerChamps();
    });

    $('#example-btn').click(function () {
        chargerExemple();
    });

    // Validation en temps réel : s'assurer que seuls des nombres sont entrés
    $('input[type="number"]').on('input', function () {
        const valeur = $(this).val();

        // Vérifier si la valeur est un nombre valide
        if (valeur !== '' && isNaN(parseFloat(valeur))) {
            $(this).addClass('error-input');
        } else {
            $(this).removeClass('error-input');
        }
    });

    // Permettre la résolution avec la touche Entrée
    $('input[type="number"]').keypress(function (e) {
        if (e.which === 13) { // Touche Entrée
            $('#solve-btn').click();
        }
    });

    // Animation d'entrée au chargement de la page
    setTimeout(function () {
        $('.explanation-card, .input-section').addClass('fade-in');
    }, 100);
});

// CSS supplémentaire pour les animations et la validation
$('<style>')
    .prop('type', 'text/css')
    .html(`
        .error-input {
            border-color: #ef4444 !important;
            box-shadow: 0 0 10px rgba(239, 68, 68, 0.3) !important;
        }
        
        .fade-in {
            animation: fadeInUp 0.6s ease-out;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `)
    .appendTo('head');
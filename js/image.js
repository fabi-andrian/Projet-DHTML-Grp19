$(document).ready(function () {
    // Variables globales pour stocker les dimensions
    let currentWidth = 300;
    let currentHeight = 200;
    let originalWidth = 300;
    let originalHeight = 200;

    // Références aux éléments DOM
    const $image = $('#dynamic-image');
    const $widthInput = $('#width-input');
    const $heightInput = $('#height-input');
    const $currentDimensions = $('#current-dimensions');
    const $currentRatio = $('#current-ratio');

    /**
     * Fonction pour mettre à jour les dimensions de l'image
     * @param {number} width - Nouvelle largeur
     * @param {number} height - Nouvelle hauteur
     */
    function updateImageDimensions(width, height) {
        currentWidth = width;
        currentHeight = height;

        // Appliquer les nouvelles dimensions à l'image
        $image.css({
            width: width + 'px',
            height: height + 'px'
        });

        // Mettre à jour l'affichage des informations
        updateImageInfo();
    }

    /**
     * Fonction pour calculer le PGCD (Plus Grand Commun Diviseur)
     * @param {number} a - Premier nombre
     * @param {number} b - Deuxième nombre
     * @returns {number} - PGCD des deux nombres
     */
    function gcd(a, b) {
        while (b !== 0) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    /**
     * Fonction pour simplifier un ratio en fraction
     * @param {number} width - Largeur
     * @param {number} height - Hauteur
     * @returns {string} - Ratio simplifié (ex: "4:3", "16:9")
     */
    function simplifyRatio(width, height) {
        // Calculer le PGCD
        const divisor = gcd(width, height);

        // Simplifier la fraction
        const simplifiedWidth = width / divisor;
        const simplifiedHeight = height / divisor;

        return simplifiedWidth + ':' + simplifiedHeight;
    }

    /**
     * Fonction pour mettre à jour les informations affichées (dimensions et ratio)
     */
    function updateImageInfo() {
        // Mettre à jour l'affichage des dimensions
        $currentDimensions.text(currentWidth + ' × ' + currentHeight + ' px');

        // Calculer et afficher le ratio simplifié
        const ratio = simplifyRatio(currentWidth, currentHeight);
        $currentRatio.text(ratio);
    }

    /**
     * Fonction pour synchroniser tous les contrôles avec les nouvelles valeurs
     * @param {number} width - Largeur à synchroniser
     * @param {number} height - Hauteur à synchroniser
     */
    function synchronizeControls(width, height) {
        // Mettre à jour les sliders sans déclencher leur événement
        $('#width-slider').slider('value', width);
        $('#height-slider').slider('value', height);

        // Mettre à jour les champs input
        $widthInput.val(width);
        $heightInput.val(height);

        // Mettre à jour l'image
        updateImageDimensions(width, height);
    }

    // Configuration du slider pour la largeur
    $('#width-slider').slider({
        range: "min",        // Affiche une barre de progression depuis le minimum
        value: currentWidth, // Valeur initiale
        min: 50,            // Valeur minimum
        max: 800,           // Valeur maximum
        step: 10,           // Pas d'incrémentation

        // Événement déclenché pendant le glissement
        slide: function (event, ui) {
            $widthInput.val(ui.value);
            updateImageDimensions(ui.value, currentHeight);
        },

        // Événement déclenché à la fin du glissement
        stop: function (event, ui) {
            currentWidth = ui.value;
        }
    });

    // Configuration du slider pour la hauteur
    $('#height-slider').slider({
        range: "min",
        value: currentHeight,
        min: 50,
        max: 600,
        step: 10,

        slide: function (event, ui) {
            $heightInput.val(ui.value);
            updateImageDimensions(currentWidth, ui.value);
        },

        stop: function (event, ui) {
            currentHeight = ui.value;
        }
    });

    // Gestion des champs input pour la largeur
    $widthInput.on('input change', function () {
        let newWidth = parseInt($(this).val());

        // Validation des limites
        if (newWidth < 50) {
            newWidth = 50;
            $(this).val(50);
        } else if (newWidth > 800) {
            newWidth = 800;
            $(this).val(800);
        }

        // Vérifier que la valeur est un nombre valide
        if (!isNaN(newWidth)) {
            synchronizeControls(newWidth, currentHeight);
        }
    });

    // Gestion des champs input pour la hauteur
    $heightInput.on('input change', function () {
        let newHeight = parseInt($(this).val());

        // Validation des limites
        if (newHeight < 50) {
            newHeight = 50;
            $(this).val(50);
        } else if (newHeight > 600) {
            newHeight = 600;
            $(this).val(600);
        }

        if (!isNaN(newHeight)) {
            synchronizeControls(currentWidth, newHeight);
        }
    });

    // Gestion de l'import d'image
    $('#image-upload').on('change', function (event) {
        const file = event.target.files[0];

        // Vérifier qu'un fichier a été sélectionné et que c'est une image
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();

            // Ajouter un effet de chargement
            $image.addClass('loading');

            reader.onload = function (e) {
                // Créer une nouvelle image pour obtenir les dimensions originales
                const img = new Image();

                img.onload = function () {
                    // Stocker les dimensions originales
                    originalWidth = this.naturalWidth;
                    originalHeight = this.naturalHeight;

                    // Calculer de nouvelles dimensions proportionnelles
                    // en gardant un maximum de 400px pour la largeur
                    let newWidth = Math.min(originalWidth, 400);
                    let newHeight = (originalHeight * newWidth) / originalWidth;

                    // Ajuster si la hauteur dépasse les limites
                    if (newHeight > 600) {
                        newHeight = 600;
                        newWidth = (originalWidth * newHeight) / originalHeight;
                    }

                    // Arrondir les valeurs
                    newWidth = Math.round(newWidth);
                    newHeight = Math.round(newHeight);

                    // Mettre à jour l'image source
                    $image.attr('src', e.target.result);

                    // Synchroniser tous les contrôles avec les nouvelles dimensions
                    synchronizeControls(newWidth, newHeight);

                    // Retirer l'effet de chargement
                    setTimeout(() => {
                        $image.removeClass('loading');
                    }, 300);
                };

                img.src = e.target.result;
            };

            // Lire le fichier comme URL de données
            reader.readAsDataURL(file);
        } else {
            alert('Veuillez sélectionner un fichier image valide.');
        }
    });

    // Bouton de réinitialisation
    $('#reset-btn').on('click', function () {
        // Calculer les dimensions initiales pour l'affichage
        // (proportionnelles aux dimensions originales de l'image)
        let resetWidth, resetHeight;

        // Si une image a été importée, utiliser ses dimensions originales
        // mais les adapter pour l'affichage (max 400px largeur)
        if (originalWidth && originalHeight) {
            resetWidth = Math.min(originalWidth, 400);
            resetHeight = (originalHeight * resetWidth) / originalWidth;

            // Ajuster si la hauteur dépasse les limites
            if (resetHeight > 600) {
                resetHeight = 600;
                resetWidth = (originalWidth * resetHeight) / originalHeight;
            }

            // Arrondir les valeurs
            resetWidth = Math.round(resetWidth);
            resetHeight = Math.round(resetHeight);
        } else {
            // Si aucune image importée, utiliser les dimensions par défaut
            resetWidth = 300;
            resetHeight = 200;
        }

        // Synchroniser tous les contrôles avec les dimensions de réinitialisation
        synchronizeControls(resetWidth, resetHeight);

        // Effet visuel de réinitialisation
        $image.addClass('loading');
        setTimeout(() => {
            $image.removeClass('loading');
        }, 300);
    });

    // Gestion du redimensionnement de la fenêtre
    $(window).on('resize', function () {
        // Ajuster si nécessaire les dimensions maximales
        // Cette fonction peut être étendue pour un comportement responsive
        updateImageInfo();
    });

    // Initialisation : mettre à jour les informations au chargement
    updateImageInfo();

    // Effet d'entrée progressif pour les éléments
    setTimeout(() => {
        $('.control-panel, .image-container, .image-info').addClass('loaded');
    }, 100);
}); 
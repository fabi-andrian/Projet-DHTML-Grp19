$(document).ready(function () {
    // Variables globales pour la gestion du panneau
    let currentLayer = 0; // Index de la couche actuellement active
    let totalLayers = 4; // Nombre total de couches publicitaires
    let rotationInterval; // Variable pour stocker l'intervalle de rotation automatique
    let isAutoRotating = true; // État de la rotation automatique

    // Durée de rotation (en millisecondes) - correspond à l'animation CSS
    const ROTATION_DURATION = 4000; // 4 secondes par couche

    /**
     * Initialise le panneau publicitaire
     * Configure les événements et démarre la rotation automatique
     */
    function initPanneau() {
        console.log('Initialisation du panneau publicitaire...');

        // Masquer toutes les couches au départ
        $('.layer').removeClass('active');

        // Afficher la première couche
        $('.layer-1').addClass('active');

        // Mettre à jour les indicateurs
        updateIndicators();

        // Configurer les événements des indicateurs
        setupIndicatorEvents();

        // Configurer les flèches de navigation
        setupNavigationArrows();

        // Démarrer la rotation automatique
        startAutoRotation();

        // Événements pour pause/reprise au hover
        setupHoverEvents();

        console.log('Panneau publicitaire initialisé avec succès !');
    }

    /**
     * Démarre la rotation automatique des couches
     */
    function startAutoRotation() {
        if (rotationInterval) {
            clearInterval(rotationInterval);
        }

        rotationInterval = setInterval(function () {
            if (isAutoRotating) {
                nextLayer();
            }
        }, ROTATION_DURATION);

        console.log('Rotation automatique démarrée');
    }

    /**
     * Arrête la rotation automatique
     */
    function stopAutoRotation() {
        if (rotationInterval) {
            clearInterval(rotationInterval);
            rotationInterval = null;
        }
        console.log('Rotation automatique arrêtée');
    }

    /**
     * Passe à la couche suivante
     */
    function nextLayer() {
        currentLayer = (currentLayer + 1) % totalLayers;
        showLayer(currentLayer);
    }

    /**
     * Passe à la couche précédente
     */
    function previousLayer() {
        currentLayer = (currentLayer - 1 + totalLayers) % totalLayers;
        showLayer(currentLayer);
    }

    /**
     * Affiche la couche spécifiée
     * @param {number} layerIndex - Index de la couche à afficher (0-3)
     */
    function showLayer(layerIndex) {
        // Vérifier que l'index est valide
        if (layerIndex < 0 || layerIndex >= totalLayers) {
            console.error('Index de couche invalide:', layerIndex);
            return;
        }

        // Masquer toutes les couches
        $('.layer').removeClass('active');

        // Afficher la couche demandée
        $(`.layer-${layerIndex + 1}`).addClass('active');

        // Mettre à jour l'index actuel
        currentLayer = layerIndex;

        // Mettre à jour les indicateurs
        updateIndicators();

        console.log(`Couche ${layerIndex + 1} activée`);
    }

    /**
     * Met à jour l'état visuel des indicateurs
     */
    function updateIndicators() {
        // Retirer la classe active de tous les indicateurs
        $('.indicator').removeClass('active');

        // Ajouter la classe active à l'indicateur correspondant
        $('.indicator').eq(currentLayer).addClass('active');
    }

    /**
     * Configure les flèches de navigation (style Stories)
     */
    function setupNavigationArrows() {
        // Vérifier si les flèches existent déjà, sinon les créer
        if (!$('.panneau-nav-arrows').length) {
            createNavigationArrows();
        }

        // Événements pour la flèche précédente
        $('.nav-arrow.prev').off('click').on('click', function (e) {
            e.stopPropagation();
            console.log('Flèche précédente cliquée');

            // Pause temporaire de la rotation
            pauseAutoRotation();
            previousLayer();

            // Animation de clic
            $(this).addClass('clicked');
            setTimeout(() => $(this).removeClass('clicked'), 150);

            // Reprendre après 3 secondes
            setTimeout(resumeAutoRotation, 3000);
        });

        // Événements pour la flèche suivante
        $('.nav-arrow.next').off('click').on('click', function (e) {
            e.stopPropagation();
            console.log('Flèche suivante cliquée');

            // Pause temporaire de la rotation
            pauseAutoRotation();
            nextLayer();

            // Animation de clic
            $(this).addClass('clicked');
            setTimeout(() => $(this).removeClass('clicked'), 150);

            // Reprendre après 3 secondes
            setTimeout(resumeAutoRotation, 3000);
        });

        // Effets hover sur les flèches
        $('.nav-arrow')
            .off('mouseenter mouseleave')
            .on('mouseenter', function () {
                $(this).addClass('hover');
            })
            .on('mouseleave', function () {
                $(this).removeClass('hover');
            });
    }

    /**
     * Crée les flèches de navigation dans le DOM
     */
    function createNavigationArrows() {
        const arrowsHTML = `
            <div class="panneau-nav-arrows">
                <button class="nav-arrow prev" type="button" aria-label="Story précédente">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="nav-arrow next" type="button" aria-label="Story suivante">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        `;

        // Ajouter les flèches au panneau
        $('.panneau-container').append(arrowsHTML);
        console.log('Flèches de navigation créées');
    }
    function setupIndicatorEvents() {
        $('.indicator').off('click').on('click', function () {
            // Récupérer l'index de l'indicateur cliqué
            const clickedIndex = $(this).index();

            console.log(`Indicateur ${clickedIndex + 1} cliqué`);

            // Pause temporaire de la rotation automatique
            pauseAutoRotation();

            // Afficher la couche correspondante
            showLayer(clickedIndex);

            // Reprendre la rotation automatique après un délai
            setTimeout(function () {
                resumeAutoRotation();
            }, 2000); // 2 secondes de pause
        });

        // Effets hover sur les indicateurs
        $('.indicator').off('mouseenter mouseleave')
            .on('mouseenter', function () {
                if (!$(this).hasClass('active')) {
                    $(this).css('transform', 'scale(1.1)');
                }
            })
            .on('mouseleave', function () {
                if (!$(this).hasClass('active')) {
                    $(this).css('transform', 'scale(1)');
                }
            });
    }

    /**
     * Configure les événements de hover sur le panneau
     */
    function setupHoverEvents() {
        $('.panneau-container')
            .off('mouseenter mouseleave')
            .on('mouseenter', function () {
                // Pause la rotation automatique au survol
                isAutoRotating = false;
                // Afficher les flèches de navigation
                $('.panneau-nav-arrows').addClass('visible');
                console.log('Rotation automatique mise en pause (hover)');
            })
            .on('mouseleave', function () {
                // Reprend la rotation automatique quand on quitte le survol
                isAutoRotating = true;
                // Masquer les flèches de navigation
                $('.panneau-nav-arrows').removeClass('visible');
                console.log('Rotation automatique reprise (leave hover)');
            });
    }

    /**
     * Met en pause la rotation automatique
     */
    function pauseAutoRotation() {
        isAutoRotating = false;
        console.log('Rotation automatique mise en pause');
    }

    /**
     * Reprend la rotation automatique
     */
    function resumeAutoRotation() {
        isAutoRotating = true;
        console.log('Rotation automatique reprise');
    }

    /**
     * Gestion des contrôles clavier (optionnel)
     */
    function setupKeyboardControls() {
        $(document).off('keydown.panneau').on('keydown.panneau', function (e) {
            // Vérifier si on est sur la page du panneau
            if (!$('.panneau-container').length) return;

            switch (e.keyCode) {
                case 37: // Flèche gauche
                    e.preventDefault();
                    pauseAutoRotation();
                    previousLayer();
                    setTimeout(resumeAutoRotation, 2000);
                    break;

                case 39: // Flèche droite
                    e.preventDefault();
                    pauseAutoRotation();
                    nextLayer();
                    setTimeout(resumeAutoRotation, 2000);
                    break;

                case 32: // Barre d'espace - pause/reprendre
                    e.preventDefault();
                    if (isAutoRotating) {
                        pauseAutoRotation();
                    } else {
                        resumeAutoRotation();
                    }
                    break;
            }
        });
    }

    /**
     * Fonction utilitaire pour obtenir des informations sur l'état du panneau
     */
    function getPanneauStatus() {
        return {
            currentLayer: currentLayer + 1,
            totalLayers: totalLayers,
            isAutoRotating: isAutoRotating,
            rotationActive: !!rotationInterval
        };
    }

    /**
     * Fonction de nettoyage lors de la destruction
     */
    function destroyPanneau() {
        stopAutoRotation();
        $(document).off('keydown.panneau');
        $('.indicator').off('click mouseenter mouseleave');
        $('.panneau-container').off('mouseenter mouseleave');
        $('.nav-arrow').off('click mouseenter mouseleave');
        console.log('Panneau publicitaire détruit');
    }

    // Initialisation au chargement de la page
    initPanneau();

    // Configuration des contrôles clavier (optionnel)
    setupKeyboardControls();

    // Nettoyage lors de la fermeture de la page
    $(window).on('beforeunload', function () {
        destroyPanneau();
    });

    // Exposition de certaines fonctions pour usage externe (optionnel)
    window.PanneauControls = {
        nextLayer: nextLayer,
        previousLayer: previousLayer,
        showLayer: showLayer,
        pauseAutoRotation: pauseAutoRotation,
        resumeAutoRotation: resumeAutoRotation,
        getStatus: getPanneauStatus
    };

    console.log('Script panneau.js chargé avec succès !');
});
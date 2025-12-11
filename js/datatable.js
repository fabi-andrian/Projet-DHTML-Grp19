// ===== DATATABLE.JS - Gestion des produits avec graphiques =====

// Variables globales
// let produits = []; // Tableau pour stocker les produits
let quantityChart = null; // Instance du graphique des quantités
let amountChart = null; // Instance du graphique des montants
const MAX_PRODUITS = 10; // Limite maximale de produits

// ===== DONNÉES DE DÉMO =====
let produits = [
    {
        id: 1,
        designation: "Riz",
        quantite: 80,
        prix: 900,
        montant: 72000
    },
    {
        id: 2,
        designation: "Manioc",
        quantite: 50,
        prix: 1400,
        montant: 70000
    },
    {
        id: 3,
        designation: "Sucre",
        quantite: 20,
        prix: 5000,
        montant: 100000
    }
];

// Couleurs pour les graphiques
const CHART_COLORS = [
    '#00ff88', '#00cc66', '#007bff', '#ffc107', '#dc3545',
    '#6f42c1', '#fd7e14', '#20c997', '#e83e8c', '#6c757d'
];

// Initialisation au chargement de la page
// document.addEventListener('DOMContentLoaded', function () {
//     console.log('Initialisation de DataTable...');

//     // Initialiser les événements
//     initEventListeners();

//     // // Charger les données depuis le localStorage (si disponibles)
//     // chargerDonnees();

//     // Mettre à jour l'affichage initial
//     mettreAJourTableau();
//     mettreAJourStatistiques();
//     creerGraphiques();

//     console.log('DataTable initialisé avec succès!');
// });
document.addEventListener('DOMContentLoaded', function () {
    console.log('Initialisation de DataTable...');
    initEventListeners();
    mettreAJourTableau();
    mettreAJourStatistiques();
    creerGraphiques();
    console.log('DataTable initialisé avec succès!');
});

// === GESTION DES ÉVÉNEMENTS ===
function initEventListeners() {
    // Bouton ajouter produit
    document.getElementById('ajouterProduit').addEventListener('click', afficherModalAjout);

    // Bouton exporter données
    document.getElementById('exporterDonnees').addEventListener('click', exporterDonnees);

    // Bouton actualiser graphiques
    document.getElementById('actualiserGraphique').addEventListener('click', function () {
        mettreAJourGraphiques();
        afficherNotification('Graphiques actualisés!', 'success');
    });

    // Gestion des boutons de basculement des graphiques
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const chartType = this.dataset.chart;
            const container = this.closest('.chart-container');

            // Mettre à jour les boutons actifs
            container.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Changer le type de graphique
            if (container.querySelector('#quantityChart')) {
                changerTypeGraphique('quantity', chartType);
            } else {
                changerTypeGraphique('amount', chartType);
            }
        });
    });
}

// === GESTION DES PRODUITS ===
function afficherModalAjout() {
    if (produits.length >= MAX_PRODUITS) {
        afficherNotification(`Limite de ${MAX_PRODUITS} produits atteinte!`, 'error');
        return;
    }

    // Créer une modal simple avec prompt (en attendant une vraie modal)
    const designation = prompt('Désignation du produit:');
    if (!designation || designation.trim() === '') return;

    const quantite = parseInt(prompt('Quantité:'));
    if (isNaN(quantite) || quantite <= 0) {
        afficherNotification('Quantité invalide!', 'error');
        return;
    }

    const prix = parseFloat(prompt('Prix unitaire (Ar):'));
    if (isNaN(prix) || prix <= 0) {
        afficherNotification('Prix invalide!', 'error');
        return;
    }

    // Ajouter le produit
    ajouterProduit(designation.trim(), quantite, prix);
}

function ajouterProduit(designation, quantite, prix) {
    const produit = {
        id: Date.now(), // ID unique basé sur le timestamp
        designation: designation,
        quantite: quantite,
        prix: prix,
        montant: quantite * prix
    };

    produits.push(produit);

    // Sauvegarder et mettre à jour l'affichage
    sauvegarderDonnees();
    mettreAJourTableau();
    mettreAJourStatistiques();
    mettreAJourGraphiques();

    afficherNotification('Produit ajouté avec succès!', 'success');
}

function supprimerProduit(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
        produits = produits.filter(p => p.id !== id);

        sauvegarderDonnees();
        mettreAJourTableau();
        mettreAJourStatistiques();
        mettreAJourGraphiques();

        afficherNotification('Produit supprimé!', 'success');
    }
}

function modifierProduit(id) {
    const produit = produits.find(p => p.id === id);
    if (!produit) return;

    const nouvelleDesignation = prompt('Nouvelle désignation:', produit.designation);
    if (!nouvelleDesignation || nouvelleDesignation.trim() === '') return;

    const nouvelleQuantite = parseInt(prompt('Nouvelle quantité:', produit.quantite));
    if (isNaN(nouvelleQuantite) || nouvelleQuantite <= 0) {
        afficherNotification('Quantité invalide!', 'error');
        return;
    }

    const nouveauPrix = parseFloat(prompt('Nouveau prix unitaire (Ar):', produit.prix));
    if (isNaN(nouveauPrix) || nouveauPrix <= 0) {
        afficherNotification('Prix invalide!', 'error');
        return;
    }

    // Mettre à jour le produit
    produit.designation = nouvelleDesignation.trim();
    produit.quantite = nouvelleQuantite;
    produit.prix = nouveauPrix;
    produit.montant = nouvelleQuantite * nouveauPrix;

    sauvegarderDonnees();
    mettreAJourTableau();
    mettreAJourStatistiques();
    mettreAJourGraphiques();

    afficherNotification('Produit modifié!', 'success');
}

// === MISE À JOUR DU TABLEAU ===
function mettreAJourTableau() {
    const tableBody = document.getElementById('tableBody');

    if (produits.length === 0) {
        // Afficher l'état vide
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="5" class="empty-message">
                    <div class="empty-state">
                        <span class="empty-icon">📦</span>
                        <p>Aucun produit enregistré</p>
                        <small>Cliquez sur "Ajouter Produit" pour commencer</small>
                    </div>
                </td>
            </tr>
        `;
    } else {
        // Afficher les produits
        let html = '';
        produits.forEach(produit => {
            html += `
                <tr data-id="${produit.id}">
                    <td class="col-designation">${produit.designation}</td>
                    <td class="col-quantity">${produit.quantite}</td>
                    <td class="col-price">${produit.prix.toFixed(2)} Ar</td>
                    <td class="col-amount">${produit.montant.toFixed(2)} Ar</td>
                    <td class="col-actions">
                        <button onclick="modifierProduit(${produit.id})" class="btn-edit" title="Modifier">✏️</button>
                        <button onclick="supprimerProduit(${produit.id})" class="btn-delete" title="Supprimer">🗑️</button>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    }

    // Mettre à jour les totaux
    mettreAJourTotaux();

    // Mettre à jour le compteur de produits
    document.getElementById('totalProduits').textContent = produits.length;
}

function mettreAJourTotaux() {
    const totalQuantite = produits.reduce((sum, p) => sum + p.quantite, 0);
    const totalMontant = produits.reduce((sum, p) => sum + p.montant, 0);

    document.getElementById('totalQuantite').textContent = totalQuantite;
    document.getElementById('totalMontant').textContent = totalMontant.toFixed(2) + ' Ar';
}

// === CALCUL DES STATISTIQUES ===
function mettreAJourStatistiques() {
    if (produits.length === 0) {
        // Réinitialiser toutes les statistiques
        document.getElementById('prixMoyen').textContent = '0.00 Ar';
        document.getElementById('prixMin').textContent = '0.00 Ar';
        document.getElementById('prixMax').textContent = '0.00 Ar';
        document.getElementById('valeurStock').textContent = '0.00 Ar';
        return;
    }

    // Calculer les statistiques
    const prix = produits.map(p => p.prix);
    const prixMoyen = prix.reduce((sum, p) => sum + p, 0) / prix.length;
    const prixMin = Math.min(...prix);
    const prixMax = Math.max(...prix);
    const valeurStock = produits.reduce((sum, p) => sum + p.montant, 0);

    // Mettre à jour l'affichage
    document.getElementById('prixMoyen').textContent = prixMoyen.toFixed(2) + ' Ar';
    document.getElementById('prixMin').textContent = prixMin.toFixed(2) + ' Ar';
    document.getElementById('prixMax').textContent = prixMax.toFixed(2) + ' Ar';
    document.getElementById('valeurStock').textContent = valeurStock.toFixed(2) + ' Ar';
}

// === GESTION DES GRAPHIQUES ===
function creerGraphiques() {
    creerGraphiqueQuantite();
    creerGraphiqueMontant();
}

function creerGraphiqueQuantite() {
    const ctx = document.getElementById('quantityChart').getContext('2d');

    quantityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Quantité',
                data: [],
                backgroundColor: CHART_COLORS,
                borderColor: CHART_COLORS,
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 46, 0.95)',
                    titleColor: '#f7fafc',
                    bodyColor: '#cbd5e0',
                    borderColor: 'rgba(0, 255, 136, 0.3)',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#cbd5e0'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#cbd5e0',
                        maxTicksLimit: 5
                    }
                }
            }
        }
    });
}

function creerGraphiqueMontant() {
    const ctx = document.getElementById('amountChart').getContext('2d');

    amountChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Montant (Ar)',
                data: [],
                backgroundColor: CHART_COLORS,
                borderColor: CHART_COLORS,
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 46, 0.95)',
                    titleColor: '#f7fafc',
                    bodyColor: '#cbd5e0',
                    borderColor: 'rgba(0, 255, 136, 0.3)',
                    borderWidth: 1,
                    callbacks: {
                        label: function (context) {
                            return 'Montant: ' + context.parsed.y.toFixed(2) + ' Ar';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#cbd5e0',
                        callback: function (value) {
                            return value.toFixed(0) + ' Ar';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#cbd5e0',
                        maxTicksLimit: 5
                    }
                }
            }
        }
    });
}

function mettreAJourGraphiques() {
    if (!quantityChart || !amountChart) return;

    if (produits.length === 0) {
        // Effacer les données des graphiques
        quantityChart.data.labels = [];
        quantityChart.data.datasets[0].data = [];
        amountChart.data.labels = [];
        amountChart.data.datasets[0].data = [];
    } else {
        // Préparer les données
        const labels = produits.map(p => p.designation.length > 15 ?
            p.designation.substring(0, 15) + '...' : p.designation);
        const quantities = produits.map(p => p.quantite);
        const amounts = produits.map(p => p.montant);

        // Mettre à jour le graphique des quantités
        quantityChart.data.labels = labels;
        quantityChart.data.datasets[0].data = quantities;

        // Mettre à jour le graphique des montants
        amountChart.data.labels = labels;
        amountChart.data.datasets[0].data = amounts;
    }

    // Actualiser les graphiques
    quantityChart.update();
    amountChart.update();
}

function changerTypeGraphique(chartName, type) {
    const chart = chartName === 'quantity' ? quantityChart : amountChart;

    // Détruire l'ancien graphique
    chart.destroy();

    // Recréer avec le nouveau type
    if (chartName === 'quantity') {
        const ctx = document.getElementById('quantityChart').getContext('2d');
        quantityChart = new Chart(ctx, {
            type: type,
            data: {
                labels: produits.map(p => p.designation.length > 15 ?
                    p.designation.substring(0, 15) + '...' : p.designation),
                datasets: [{
                    label: 'Quantité',
                    data: produits.map(p => p.quantite),
                    backgroundColor: CHART_COLORS,
                    borderColor: CHART_COLORS,
                    borderWidth: 2
                }]
            },
            options: getChartOptions(type, 'Quantité')
        });
    } else {
        const ctx = document.getElementById('amountChart').getContext('2d');
        amountChart = new Chart(ctx, {
            type: type,
            data: {
                labels: produits.map(p => p.designation.length > 15 ?
                    p.designation.substring(0, 15) + '...' : p.designation),
                datasets: [{
                    label: 'Montant (Ar)',
                    data: produits.map(p => p.montant),
                    backgroundColor: CHART_COLORS,
                    borderColor: CHART_COLORS,
                    borderWidth: 2
                }]
            },
            options: getChartOptions(type, 'Montant (Ar)')
        });
    }
}

function getChartOptions(type, label) {
    const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: type === 'pie' || type === 'doughnut',
                position: 'bottom',
                labels: {
                    color: '#cbd5e0',
                    padding: 15,
                    usePointStyle: true
                }
            },
            tooltip: {
                backgroundColor: 'rgba(26, 26, 46, 0.95)',
                titleColor: '#f7fafc',
                bodyColor: '#cbd5e0',
                borderColor: 'rgba(0, 255, 136, 0.3)',
                borderWidth: 1
            }
        }
    };

    if (type === 'bar') {
        baseOptions.scales = {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: '#cbd5e0' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#cbd5e0', maxTicksLimit: 5 }
            }
        };
    }

    return baseOptions;
}

// === SAUVEGARDE ET CHARGEMENT DES DONNÉES ===
function sauvegarderDonnees() {
    try {
        localStorage.setItem('datatable_produits', JSON.stringify(produits));
    } catch (error) {
        console.warn('Impossible de sauvegarder dans localStorage:', error);
    }
}

// function chargerDonnees() {
//     try {
//         const data = localStorage.getItem('datatable_produits');
//         if (data) {
//             produits = JSON.parse(data);
//         }
//     } catch (error) {
//         console.warn('Impossible de charger depuis localStorage:', error);
//         produits = [];
//     }
// }

// === EXPORT DES DONNÉES ===
function exporterDonnees() {
    if (produits.length === 0) {
        afficherNotification('Aucune donnée à exporter!', 'error');
        return;
    }

    // Créer le contenu CSV
    let csvContent = 'Désignation,Quantité,Prix Unitaire (Ar),Montant (Ar)\n';

    produits.forEach(produit => {
        csvContent += `"${produit.designation}",${produit.quantite},${produit.prix},${produit.montant}\n`;
    });

    // Ajouter les totaux
    const totalQuantite = produits.reduce((sum, p) => sum + p.quantite, 0);
    const totalMontant = produits.reduce((sum, p) => sum + p.montant, 0);
    csvContent += `\nTOTAUX,${totalQuantite},-,${totalMontant}`;

    // Télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `produits_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    afficherNotification('Données exportées avec succès!', 'success');
}

// === SYSTÈME DE NOTIFICATIONS ===
function afficherNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="notification-close">×</button>
    `;

    // Ajouter les styles si nécessaire
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 1000;
                animation: slideIn 0.3s ease;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }
            .notification-success { background: linear-gradient(135deg, #00ff88, #00cc66); }
            .notification-error { background: linear-gradient(135deg, #dc3545, #c82333); }
            .notification-info { background: linear-gradient(135deg, #007bff, #0056b3); }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }

    // Ajouter au DOM
    document.body.appendChild(notification);

    // Supprimer automatiquement après 3 secondes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Ajout des styles pour les boutons d'action dans le tableau
const actionStyles = document.createElement('style');
actionStyles.textContent = `
    .btn-edit, .btn-delete {
        background: none;
        border: none;
        font-size: 1rem;
        cursor: pointer;
        padding: 4px;
        margin: 0 2px;
        border-radius: 4px;
        transition: all 0.2s ease;
    }
    .btn-edit:hover { background: rgba(0, 255, 136, 0.2); }
    .btn-delete:hover { background: rgba(220, 53, 69, 0.2); }
`;
document.head.appendChild(actionStyles);
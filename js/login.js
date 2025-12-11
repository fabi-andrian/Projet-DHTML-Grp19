// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#loginForm'); // Correction : utiliser form au lieu de data

    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Empêche l'envoi réel du formulaire

        // Réinitialiser les messages d'erreur
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.style.display = 'none');

        // Récupérer les valeurs
        const nom = document.getElementById('nom').value.trim();
        const email = document.getElementById('email').value.trim();
        const motdepasse = document.getElementById('motdepasse').value;
        const motdepasse2 = document.getElementById('motdepasse2').value; // Correction de l'ID
        const enregistrer = document.getElementById('choix').checked;

        let isValid = true;

        // Validation du nom
        if (!nom) {
            document.getElementById('nomError').style.display = 'block';
            isValid = false;
        }

        // Validation de l'email (basique)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            document.getElementById('emailError').style.display = 'block';
            isValid = false;
        }

        // Validation du mot de passe
        if (!motdepasse || motdepasse.length < 6) {
            document.getElementById('motdepasseError').style.display = 'block';
            isValid = false;
        }

        // Validation de la confirmation
        if (motdepasse !== motdepasse2) {
            document.getElementById('motdepasse2Error').style.display = 'block';
            isValid = false;
        }

        // Si tout est valide
        if (isValid) {
            // Affichage dans la console pour test
            console.log("=== DONNÉES DU FORMULAIRE ===");
            console.log("Nom:", nom);
            console.log("Email:", email);
            console.log('Mot de passe:', motdepasse);
            console.log("Confirmation:", motdepasse2);
            console.log("Enregistrer le mot de passe:", enregistrer);

            // Afficher le message de succès
            document.getElementById('successMessage').style.display = 'block';

            // Réinitialiser le formulaire après 2 secondes
            setTimeout(() => {
                form.reset();
                document.getElementById('successMessage').style.display = 'none';
            }, 2000);
        }
    });

    // Validation en temps réel pour améliorer l'UX
    document.getElementById('nom').addEventListener('input', function () {
        if (this.value.trim()) {
            document.getElementById('nomError').style.display = 'none';
        }
    });

    document.getElementById('email').addEventListener('input', function () {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(this.value.trim())) {
            document.getElementById('emailError').style.display = 'none';
        }
    });

    document.getElementById('motdepasse').addEventListener('input', function () {
        if (this.value.length >= 6) {
            document.getElementById('motdepasseError').style.display = 'none';
        }
        // Vérifier aussi la confirmation si elle est remplie
        const motdepasse2 = document.getElementById('motdepasse2').value;
        if (motdepasse2 && this.value === motdepasse2) {
            document.getElementById('motdepasse2Error').style.display = 'none';
        }
    });

    document.getElementById('motdepasse2').addEventListener('input', function () {
        const motdepasse = document.getElementById('motdepasse').value;
        if (this.value === motdepasse) {
            document.getElementById('motdepasse2Error').style.display = 'none';
        }
    });
});
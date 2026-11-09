// ========== RÉGLAGE : ton numéro WhatsApp (sans + ni espaces) ==========
const NUMERO_WHATSAPP = '22962257379';

// ========== 1. ON RÉCUPÈRE LES ÉLÉMENTS DE LA PAGE ==========
const boutonsFiltre = document.querySelectorAll('.filtre');
const produits = document.querySelectorAll('.produit');
const boutonsAjout = document.querySelectorAll('.bouton-panier');

const boutonPanier = document.querySelector('.panier');
const compteur = document.getElementById('compteur-panier');
const fond = document.getElementById('fond-panier');
const tiroir = document.getElementById('tiroir-panier');
const boutonFermer = document.getElementById('fermer-panier');
const panierVide = document.getElementById('panier-vide');
const listePanier = document.getElementById('liste-panier');
const totalPanier = document.getElementById('total-panier');
const boutonCommander = document.getElementById('commander');

const formulaire = document.getElementById('formulaire-newsletter');
const champEmail = document.getElementById('email');
const messageFormulaire = document.getElementById('message-formulaire');

// Le panier est une liste. Chaque article = { nom, prix, quantite }
let panier = [];

// ========== 2. FONCTIONS UTILES ==========
function formater(montant) {
  return montant.toLocaleString('fr-FR') + ' FCFA';
}

function calculerTotal() {
  let total = 0;
  panier.forEach(function (article) {
    total += article.prix * article.quantite;
  });
  return total;
}

function ouvrirPanier() {
  tiroir.classList.add('ouvert');
  fond.classList.add('visible');
  document.body.classList.add('panier-ouvert');
}

function fermerPanier() {
  tiroir.classList.remove('ouvert');
  fond.classList.remove('visible');
  document.body.classList.remove('panier-ouvert');
}

// Redessine le panier à chaque changement
function mettreAJourPanier() {
  let nombreArticles = 0;
  listePanier.innerHTML = '';

  panier.forEach(function (article, index) {
    nombreArticles += article.quantite;

    const ligne = document.createElement('li');
    ligne.className = 'ligne-panier';

    const infos = document.createElement('div');
    const nom = document.createElement('strong');
    nom.textContent = article.nom;
    const detail = document.createElement('span');
    detail.textContent = article.quantite + ' × ' + formater(article.prix);
    infos.append(nom, detail);

    const retirer = document.createElement('button');
    retirer.type = 'button';
    retirer.className = 'retirer';
    retirer.textContent = '✕';
    retirer.setAttribute('aria-label', 'Retirer ' + article.nom);
    retirer.addEventListener('click', function () {
      panier.splice(index, 1);
      mettreAJourPanier();
    });

    ligne.append(infos, retirer);
    listePanier.appendChild(ligne);
  });

  compteur.textContent = nombreArticles;
  totalPanier.textContent = formater(calculerTotal());
  panierVide.hidden = panier.length > 0;
}

// ========== 3. LES FILTRES ==========
boutonsFiltre.forEach(function (bouton) {
  bouton.addEventListener('click', function () {
    const choix = bouton.dataset.filtre;

    boutonsFiltre.forEach(function (autre) {
      autre.classList.remove('actif');
    });
    bouton.classList.add('actif');

    produits.forEach(function (produit) {
      const visible = choix === 'tous' || produit.dataset.categorie === choix;
      produit.classList.toggle('masque', !visible);
    });
  });
});

// ========== 4. AJOUTER AU PANIER ==========
boutonsAjout.forEach(function (bouton) {
  bouton.addEventListener('click', function () {
    const nom = bouton.dataset.nom;
    const prix = Number(bouton.dataset.prix);

    const existant = panier.find(function (article) {
      return article.nom === nom;
    });

    if (existant) {
      existant.quantite += 1;
    } else {
      panier.push({ nom: nom, prix: prix, quantite: 1 });
    }

    mettreAJourPanier();

    // Petit retour visuel
    bouton.textContent = 'Ajouté ✓';
    boutonPanier.classList.add('rebond');
    setTimeout(function () {
      bouton.textContent = 'Ajouter au panier';
      boutonPanier.classList.remove('rebond');
    }, 1000);
  });
});

// ========== 5. OUVRIR / FERMER LE PANIER ==========
boutonPanier.addEventListener('click', ouvrirPanier);
boutonFermer.addEventListener('click', fermerPanier);
fond.addEventListener('click', fermerPanier);
document.addEventListener('keydown', function (evenement) {
  if (evenement.key === 'Escape') {
    fermerPanier();
  }
});

// ========== 6. COMMANDER PAR WHATSAPP ==========
boutonCommander.addEventListener('click', function () {
  if (panier.length === 0) {
    return;
  }
  if (NUMERO_WHATSAPP.includes('X')) {
    alert('Remplace le numéro WhatsApp en haut du fichier js/script.js.');
    return;
  }

  let texte = 'Bonjour ÉRYS, je souhaite commander :\n';
  panier.forEach(function (article) {
    texte += '- ' + article.nom + ' x' + article.quantite + '\n';
  });
  texte += 'Total : ' + formater(calculerTotal());

  const lien = 'https://wa.me/' + NUMERO_WHATSAPP + '?text=' + encodeURIComponent(texte);
  window.open(lien, '_blank');
});

// ========== 7. FORMULAIRE NEWSLETTER ==========
formulaire.addEventListener('submit', function (evenement) {
  evenement.preventDefault();
  messageFormulaire.textContent = 'Merci ! ' + champEmail.value + ' est bien inscrite 🧡';
  formulaire.reset();
});

// On affiche le panier vide au chargement
mettreAJourPanier();
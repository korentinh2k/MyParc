import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, doc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD1rPEYCjsm04DASULnobVBaLCqWQGYvkw",
    authDomain: "myparc.firebaseapp.com",
    projectId: "myparc",
    storageBucket: "myparc.appspot.com",
    messagingSenderId: "668679679961",
    appId: "1:668679679961:web:a0b390a197f0304308f3c8",
    measurementId: "G-FZHRNWXXCS"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUserUID = null; // Stocke l'UID de l'utilisateur connecté
let vehicleId = new URLSearchParams(window.location.search).get("vehicleId"); // Récupérer l'ID du véhicule de l'URL

// Fonction pour rediriger vers la liste des entretiens
function redirectToList() {
    window.location.href = `listEntretien.html?vehicleId=${vehicleId}`;
}

// Fonction pour afficher les détails du véhicule
async function displayVehicleDetails() {
    const vehicleTitle = document.getElementById("vehicleTitle");

    if (!vehicleId) {
        vehicleTitle.innerText = "Aucun ID de véhicule fourni.";
        return;
    }

    try {
        const vehicleDoc = await getDoc(doc(db, "vehicles", vehicleId));

        if (vehicleDoc.exists()) {
            const vehicleData = vehicleDoc.data();
            vehicleTitle.innerText = `Entretien(s) du véhicule : ${vehicleData.name || "Marque inconnue"} ${vehicleData.model || "Modèle inconnu"}`;
        } else {
            vehicleTitle.innerText = "Véhicule introuvable.";
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des détails du véhicule :", error);
        vehicleTitle.innerText = "Erreur lors du chargement des données.";
    }
}

// Fonction pour ajouter un entretien
async function addMaintenance() {
    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value;

    if (!date || !description) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    try {
        if (!vehicleId) {
            alert("ID du véhicule manquant.");
            return;
        }

        const maintenanceData = {
            date: date,
            description: description,
            vehicleId: vehicleId,
            createdAt: new Date(),
        };

        await addDoc(collection(db, "maintenance"), maintenanceData);

        alert("Entretien ajouté avec succès !");
        redirectToList();
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'entretien :", error);
        alert("Impossible d'ajouter l'entretien.");
    }
}

// Vérification de l'utilisateur connecté
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserUID = user.uid;
        displayVehicleDetails();
    } else {
        alert("Vous n'êtes pas connecté.");
        window.location.href = "index.html";
    }
});

// Exposer les fonctions nécessaires globalement
window.redirectToList = redirectToList;
window.addMaintenance = addMaintenance;

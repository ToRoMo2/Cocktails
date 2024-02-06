<style>

#appli{
  padding: 50px;
}

#titre{
  font-size: 30px;
  text-align: center;
  margin-left: 13rem;
  font-weight: bold;
  color: black;
}

</style>
<template>
  <div>
    
      <v-app-bar app>
        <v-spacer><p id="titre">Carte des cocktails</p></v-spacer>
        <template v-if="!isLoggedIn">
          <v-btn @click="goToLogin" color="green">Se connecter</v-btn>
        </template>
        <template v-else>
          <v-btn @click="logout" color="red">Se déconnecter</v-btn>
        </template>
        <v-btn v-if="isLoggedIn" @click="openAddCocktailDialog" color="primary">Ajouter un cocktail</v-btn>

      </v-app-bar>
      <v-dialog v-model="addCocktailDialog" max-width="800">
  <v-card>
    <v-card-title>Ajouter un cocktail</v-card-title>
    <v-card-text>
      <AddCocktailForm @cocktailAdded="handleCocktailAdded" />
    </v-card-text>
    <v-card-actions>
      <v-btn @click="closeAddCocktailDialog">Fermer</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
      
      <div id="appli">
        
        <SearchBar v-model="recherche" />

        <CategorieBox v-model="selected" :isLoggedIn="isLoggedIn"/>

        <CocktailsListe :rechercher="recherche" :categorie="selected" :isLoggedIn="isLoggedIn"/>
      </div>

  </div>
</template>

<script setup>
import Swal from 'sweetalert2';
import SearchBar from "../components/SearchBar.vue";
import CocktailsListe from "../components/CocktailsListe.vue";
import CategorieBox from "@/components/CategorieBox.vue";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';
import {jwtDecode} from 'jwt-decode';
import AddCocktailForm from "@/components/AddCocktailForm.vue";

const isLoggedIn = ref(false);
const recherche = ref("");
const selected = ref([]);
const addCocktailDialog = ref(false);

const route = useRoute();
const router = useRouter();

onMounted(() => {
  // Extrait le token du stockage local
  const token = localStorage.getItem('token');

  if (token) {
    // Vérifiez le token pour déterminer si l'utilisateur est connecté
    const decodedToken = jwtDecode(token);

    // Vous pouvez également effectuer d'autres vérifications ici en fonction des informations dans le token

    isLoggedIn.value = true;
  }
});


// ... Autres fonctions et propriétés ...

function openAddCocktailDialog() {
  addCocktailDialog.value = true;
}

function closeAddCocktailDialog() {
  addCocktailDialog.value = false;
}

function handleCocktailAdded() {
  // Ajoutez ici la logique à exécuter une fois que le cocktail a été ajouté
  // par exemple, vous pourriez mettre à jour la liste des cocktails
  // ou effectuer d'autres actions nécessaires.
  closeAddCocktailDialog();
}

function goToLogin() {
  router.push({ name: 'Login' });
}

function logout() {
  // Supprimer le token du stockage local
  localStorage.removeItem('token');

  // Mettre à jour l'état de connexion
  isLoggedIn.value = false;

  Swal.fire({
    icon: 'success',
    title: 'Vous êtes déconnecté',
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 2000,  // La notification disparaîtra après 2 secondes
  });

  // Rediriger vers la page d'accuei
  router.push({ name: 'home' });
}


</script>




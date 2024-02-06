<style scoped>
ul {
    list-style-position: inside;
    /* Place les puces à l'intérieur de la zone de liste */
    padding-left: 0;
    /* Supprime le retrait par défaut de la liste */
}
li {
    margin-bottom: 5px;
    /* Ajuste l'écart entre les éléments de la liste */
}
.v-card--reveal {
    bottom: 0;
    opacity: 1 !important;
    position: absolute;
    width: 100%;
}
.img-fluid {
    max-width: 15vw;
    height: 20vw;
    border-radius: 20px;
}
#liste-recette {
    width: 20vw;
    padding: 2.5em;
    margin: 15px;
    background-color: rgb(245, 255, 250);
    border-radius: 20px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}
.btn-recette {
    color: #356859;
}
::-webkit-scrollbar {
    width: 5px;
}
::-webkit-scrollbar-track {
    background: lightcyan;
}
::-webkit-scrollbar-thumb {
    background: teal;
}
* {
    scrollbar-width: 5px;
    scrollbar-color: teal lightcyan;
}
#recette-card {
    background-color: lightcyan;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    overflow-y: visible;

}
pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: 'Arial';
}
</style>


<template>
  <v-card id="liste-recette">
    <v-card-title>{{ cocktail.nom_cocktail }}</v-card-title>
    <img :src="cocktail.Photo" class="img-fluid" alt="" />
    <v-card-actions id="deletemodif">
      <v-btn class="btn-recette" @click="reveal = !reveal">Voir Recette</v-btn>
      <div v-if="props.isLoggedIn">
        <v-btn color="rgb(231, 76, 60)" @click="deleteCocktail">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn color="rgb(52, 152, 219)" @click="modifyCocktail">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </div>
      <v-dialog v-model="dialog" max-width="600px">
        <!-- Utilisez le formulaire de modification ici -->
        <ModifyCocktailForm
          :initialValues="{
            idCocktail: cocktail.id_cocktail,
            nomCocktail: cocktail.nom_cocktail,
            photoCocktail: cocktail.Photo,
            instructionsCocktail: cocktail.Instructions,
            ingredients: cocktail.Ingredients, // Assurez-vous que votre modèle de données contient la propriété 'Ingredients'
            selectedCategories: cocktail.Categories // Assurez-vous que votre modèle de données contient la propriété 'Categories'
          }"
          @cocktailAddedOrModified="onCocktailAddedOrModified"
        />
      </v-dialog>

    </v-card-actions>
    <v-expand-transition>
      <v-card v-if="reveal !== null && reveal" class="transition-fast-in-fast-out v-card--reveal" style="height: 100%" id="recette-card">
        <v-card-text class="pb-0">
          <v-card-actions class="pt-0">
            <v-btn text color="teal accent-4" @click="reveal = !reveal">Fermer</v-btn>
          </v-card-actions>
          <p class="text-h4 text--primary"><br>{{ cocktail.nom_cocktail }}</p>
          <br>
          <br>
          <h3>Ingrédients</h3>
          <br>
          <template v-for="ingredient in Ingredients">
            <ul v-if="ingredient.nom_cocktail === cocktail.nom_cocktail">
              <li>{{ ingredient.ingredients }}</li>
            </ul>
          </template>
          <br>
          <br>
          <h3>Recette</h3>
          <br>
          <pre>{{ cocktail.Instructions }}</pre>
          <br>
        </v-card-text>
      </v-card>
    </v-expand-transition>
  </v-card>
</template>

<script setup>
import { ref, inject } from 'vue';
import axios from 'axios';
import ModifyCocktailForm from './ModifyCocktailForm.vue';
import Swal from 'sweetalert2';

const api = inject("API_URL");
const props = defineProps(['cocktail', 'isLoggedIn', 'Ingredients', 'api']);
const reveal = ref(false);
const dialog = ref(false);

const modifyCocktail = () => {
  dialog.value = true;
};

const deleteCocktail = async () => {
  try {
    // Remplacez l'URL par celle de votre backend qui gère la suppression des cocktails
    await axios.get(api + "?action=deleteCocktail&id=" + props.cocktail.id_cocktail);
    console.log('Cocktail supprimé avec succès');
    // Émettre un événement pour notifier le composant parent de la suppression du cocktail
    // Assurez-vous d'avoir déclaré cette fonction dans la section 'methods' de votre composant
    // $emit('cocktailDeleted', props.cocktail.id_cocktail);
  } catch (error) {
    console.error('Erreur lors de la suppression du cocktail', error);
  }
  Swal.fire({
    icon: 'error',
    title: 'Cocktail supprimé avec succès',
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 2000,  // La notification disparaîtra après 2 secondes
  });
  //recharger la liste avec un timer de 2 seconde
  setTimeout(function () {
    window.location.reload();
  }, 2000);
  
  
};

const onCocktailAddedOrModified = () => {
  // Rafraîchir la liste des cocktails ou effectuer d'autres actions nécessaires
  // ...

  // Fermer le dialogue après ajout ou modification
  dialog.value = false;
};
</script>
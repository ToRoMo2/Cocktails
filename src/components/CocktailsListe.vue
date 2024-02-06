<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  margin-left: 5vw;
  margin-right: auto;
}
</style>


<template>
  <div>
    <div class="container">
      <CocktailComponent v-for="(cocktail) in cocktails" :key="cocktail.id_cocktail" :cocktail="cocktail"
        :Ingredients="Ingredients" :isLoggedIn="props.isLoggedIn" :api="api" />
    </div>
  </div>
</template>
<script setup>

import { ref, watch, defineProps, inject } from 'vue'
import CocktailComponent from './CocktailComponent.vue';
import axios from 'axios';
// api appelle le main
// 1 DAO pour cocktail 1 DAO pour catégorie
// le main appelle les DAO
// if else dans le main pour les 2 DAO 

const cocktails = ref([]);
const Ingredients = ref([]);
const props = defineProps(['rechercher', 'categorie', 'isLoggedIn']);
const api = inject("API_URL");

// initialise les valeurs de l'api
axios.get(api).then((response) => {
  cocktails.value = response.data;
})

axios.get(api + "?action=getIngredientsByCocktail").then((response) => {
  Ingredients.value = response.data;
  console.log(Ingredients.value[0].ingredients)
})

watch(props, async (newValue) => {
    try {
        const response = await axios.get(api + "?nom=" + newValue.rechercher + "&cat=" + newValue.categorie + "");
        cocktails.value = response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des cocktails', error);
    }
});

const handleCocktailDeleted = (deletedCocktailId) => {
    // Filtrer les cocktails et supprimer celui qui a été supprimé
    cocktails.value = cocktails.value.filter(cocktail => cocktail.id_cocktail !== deletedCocktailId);
};
</script>
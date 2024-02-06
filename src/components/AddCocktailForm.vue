<style scoped>
  /* Add your custom styles here */

  /* Adjust form container styles */
  .form-container {
    max-width: 600px;
    margin: auto;
  }

  /* Adjust text field styles */
  .custom-text-field {
    width: 100%;
    margin-bottom: 16px;
  }

  /* Adjust textarea styles */
  .custom-textarea {
    width: 100%;
    margin-bottom: 16px;
  }

  /* Adjust ingredient row styles */
  .ingredient-row {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }

  /* Adjust select styles */
  .custom-select {
    width: 100%;
    margin-bottom: 16px;
  }

  /* Adjust button styles */
  .custom-button {
    margin-top: 16px;
  }

  .swal2-container {
  z-index: 10000; /* ou une valeur plus élevée que celle de votre formulaire */
}
</style>

<template>
  <v-form @submit.prevent="addCocktail">
    <v-container class="form-container">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field class="custom-text-field" v-model="nomCocktail" label="Nom du cocktail" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="photoCocktail" label="URL de la photo" required></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea class="custom-textarea" v-model="instructions" label="Instructions" required></v-textarea>
        </v-col>
      </v-row>
      <v-row>
  <v-col cols="12">
    <h3>Ingrédients</h3>
    <v-row class="ingredient-row" v-for="(ingredient, index) in ingredients" :key="index">
      <v-col cols="6">
        <!-- Utiliser une liste déroulante pour les ingrédients existants -->
        <v-select
          v-model="ingredient.nom_ingredient"
          :items="existingIngredientsList"
          outlined
          label="Ingrédient"
          item-text="text"
          item-value="value"
        ></v-select>
      </v-col>
      <v-col cols="4">
        <!-- Champ de saisie pour la quantité -->
        <v-text-field v-model="ingredient.quantite" label="Quantité" required></v-text-field>
      </v-col>
      <v-col cols="2">
        <!-- Bouton pour ajouter un nouvel ingrédient -->
        <v-btn @click="addIngredient">+</v-btn>
      </v-col>
    </v-row>
  </v-col>
</v-row>
      <v-row>
    <v-col cols="12">
      <h3>Catégories</h3>

      <v-select 
        :items="categories"
        multiple="multiple"
        v-model="selectedCategories"
        chips
      ></v-select>
      </v-col>
</v-row>
      <v-row>
        <v-col cols="12">
          <v-btn class="custom-button" type="submit" color="primary">Ajouter Cocktail</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup>
import { ref, inject, defineEmits, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';


const nomCocktail = ref('');
const photoCocktail = ref('');
const instructions = ref('');
const ingredients = ref([{ nom: '', quantite: '' }]);
const selectedCategories = ref([]);
const categories = ref([]);
const api = inject("API_URL");
const existingIngredientsList = ref([]);
const newIngredient = ref('');


const initialValues = inject('initialValues', null);

if (initialValues) {
nomCocktail.value = initialValues.nomCocktail;
photoCocktail.value = initialValues.photoCocktail;
instructionsCocktail.value = initialValues.instructionsCocktail;
}

const getExistingIngredients = async () => {
  try {
    const response = await axios.get(api + "?action=getIngredients");
    console.log('Response from getExistingIngredients:', response.data);

    if (Array.isArray(response.data) && response.data.length > 0) {
      // Utilisez existingIngredientsList pour rendre la liste réactive
      existingIngredientsList.value = response.data.map(ingredient => ({
        text: ingredient.nom_ingredient,
        value: ingredient.nom_ingredient
      }));

      console.log('Ingredients retrieved successfully', existingIngredientsList.value);
    } else {
      console.warn('No ingredients data received or the data is not an array.');
    }
  } catch (error) {
    console.error('Error fetching ingredients', error);
  }
};




const { $emit } = defineEmits();
const addCocktail = async () => {
// const selectedCategoriesArray = Array.isArray(selectedCategories.value) ? selectedCategories.value : [];
// console.log(selectedCategoriesArray);
try {
  // Envoie de la requête GET au serveur pour ajouter le cocktail
  const response = await axios.get(
    api +
      '?action=addCocktail&' +
      `nom=${nomCocktail.value}&image=${photoCocktail.value}&instructions=${instructions.value}&categories=${selectedCategories.value}
      &ingredients=${JSON.stringify(ingredients.value)}`
    // ... ajoutez les autres paramètres ici ...

  );

  // sweet alert
  Swal.fire({
    icon: 'success',
    title: 'Cocktail ajouté avec succès',
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 2000,  // La notification disparaîtra après 2 secondes
  });
  // const response = await axios.post(
  //   api+'?action=addCocktail',{
  //     nom: nomCocktail.value,
  //     photo: photoCocktail,
  //     instructions: instructions,
  //     ingredients: ingredients,
  //     categories: selectedCategoriesArray

  //   }
  // )

  console.log('Cocktail ajouté avec succès', response.data);
  console.log("nom du cocktail", nomCocktail.value);

  // Réinitialiser le formulaire après l'ajout réussi
  nomCocktail.value = '';
  photoCocktail.value = '';
  instructions.value = '';
  ingredients.value = [{ nom: '', quantite: '' }];
  selectedCategories.value = [];

  // Émettre un événement pour informer le composant parent de l'ajout du cocktail
  // $emit('cocktailAddedOrModified', response.data);
} catch (error) {
  console.error('Erreur lors de l\'ajout du cocktail', error);
}

setTimeout(() => {
    window.location.reload();
  }, 2000);



};

const addIngredient = () => {
  // Ajouter le nouvel ingrédient à la liste
  ingredients.value.push({ nom: newIngredient.value, quantite: '' });

  // Réinitialiser le champ de saisie du nouvel ingrédient
  newIngredient.value = '';
};

onMounted(async () => {
  getExistingIngredients();
try {
  const response = await axios.get(api + "?action=getCategories");
  categories.value = response.data.map(element => element.nom_categorie);
  
  // Initialiser le tableau selectedCategories avec des valeurs booléennes à false
  // selectedCategories.value = new Array(categories.value.length).fill(false);
} catch (error) {
  console.error('Erreur lors de la récupération des catégories', error);
}
});
</script>
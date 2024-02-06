<style scoped>
/* Ajoutez le style pour le fond blanc du formulaire */
.v-form {
  background-color: #fff;
  padding: 20px; /* Ajoutez un remplissage pour séparer du bord */
  border-radius: 10px; /* Ajoutez des coins arrondis si nécessaire */
  overflow-y: auto;
}

ul {
  list-style-position: inside;
  padding-left: 0;
}

li {
  margin-bottom: 5px;
}

/* Autres styles inchangés... */
</style>

<template>
  <v-form @submit.prevent="modifyCocktail">
    <!-- Champs du formulaire avec v-model correctement lié -->
    <v-text-field v-model="nomCocktail" label="Nom du cocktail" required></v-text-field>
    <v-text-field v-model="photoCocktail" label="URL de la photo" required></v-text-field>
    <v-textarea v-model="Instructions" label="Instructions" required></v-textarea>

    <!-- Champs d'ingrédients avec v-model correctement lié -->
    <v-row v-for="(ingredient, index) in existingIngredients" :key="index">
  <v-col cols="6">
    <v-text-field
      v-if="!ingredient.editing"
      v-model="ingredient.nom"
      label="Ingrédient"
      readonly
    ></v-text-field>
    <v-text-field
      v-else
      v-model="ingredient.nom"
      label="Ingrédient"
      required
    ></v-text-field>
  </v-col>
  <v-col cols="4">
    <v-text-field
      v-if="!ingredient.editing"
      v-model="ingredient.quantite"
      label="Quantité"
      readonly
    ></v-text-field>
    <v-text-field
      v-else
      v-model="ingredient.quantite"
      label="Quantité"
      required
    ></v-text-field>
  </v-col>
  <v-col cols="2">
    <v-btn @click="toggleIngredientEditing(index)">
      {{ ingredient.editing ? 'Enregistrer' : 'Éditer' }}
    </v-btn>
    <!-- Bouton pour retirer l'ingrédient -->
    <v-btn v-if="index > 0" @click="removeIngredient(index)">-</v-btn>
  </v-col>
</v-row>

<!-- Ajouter un nouvel ingrédient avec sa quantité -->
<v-row>
  <v-col cols="6">
    <v-text-field v-model="newIngredient.nom" label="Nouvel ingrédient" required></v-text-field>
  </v-col>
  <v-col cols="4">
    <v-text-field v-model="newIngredient.quantite" label="Quantité" required></v-text-field>
  </v-col>
  <v-col cols="2">
    <v-btn @click="addNewIngredient">+</v-btn>
  </v-col>
</v-row>
    <!-- Champs de catégories avec v-model correctement lié (les categorie deja affilié au cocktails sont cochées) -->
    <v-select 
  v-model="selectedCategories"
  :items="categories"
  label="Catégories"
  multiple
  outlined
></v-select>

    <v-btn type="submit" color="primary">Modifier Cocktail</v-btn>
  </v-form>
</template>

<script setup>
import { ref, inject, defineProps, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const props = defineProps(['initialValues']);
const api = inject("API_URL");
const idCocktail = ref(props.initialValues.idCocktail);
const nomCocktail = ref(props.initialValues.nomCocktail);
const photoCocktail = ref(props.initialValues.photoCocktail);
const Instructions = ref(props.initialValues.instructionsCocktail);
const ingredients = ref(props.initialValues.ingredients);
const allCategories = ref([]); // Variable pour toutes les catégories disponibles
const selectedCategories = ref([]);// Convertir la chaîne en tableau // Modifier pour un tableau vide au départ

const categories = ref([]);
const existingIngredients = ref([]);
const newIngredient = ref({ nom: '', quantite: '' });

// Méthode pour récupérer les catégories depuis le serveur
const getCategories = async () => {
  try {
    const response = await axios.get(api + "?action=getCategories");
    categories.value = response.data.map(element => element.nom_categorie);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories', error);
  }
};

// Méthode pour récupérer les catégories du cocktail depuis le serveur
// Méthode pour récupérer les catégories du cocktail depuis le serveur
const getCategoriesByCocktail = async () => {
  try {
    const response = await axios.get(api + `?action=getCategoriesByCocktail&cocktail=${props.initialValues.nomCocktail}`);
    
    console.log('Response from getCategoriesByCocktail:', response.data);
    
    // Initialiser toutes les catégories disponibles
    allCategories.value = response.data.map(category => ({ text: category.nom_categorie, value: category.nom_categorie }));
    
    // Initialiser les catégories sélectionnées (cochées)
    selectedCategories.value = response.data.map(category => category.nom_categorie);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories', error);
  }
};

const removeIngredient = (index) => {
  ingredients.splice(index, 1);
};

const addNewIngredient = () => {
  existingIngredients.value.push({ ...newIngredient.value, editing: false });
  newIngredient.value = { nom: '', quantite: '' };
};


// Méthode pour récupérer les ingrédients existants depuis le serveur
// Méthode pour récupérer les ingrédients existants depuis le serveur
const getIngredientsByCocktail = async () => {
  try {
    const response = await axios.get(api + `?action=getIngredientsByCocktail2&cocktail=${props.initialValues.nomCocktail}`);
    
    // Assurez-vous que response.data est un tableau d'objets ingrédient
    if (Array.isArray(response.data)) {
      // Utilisez map pour extraire le nom de chaque ingrédient et sa quantité
      existingIngredients.value = response.data.map(ingredient => ({
        nom: ingredient.nom_ingredient,
        quantite: ingredient.Quantité
      }));

      console.log('Existing ingredients:', existingIngredients.value);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des ingrédients', error);
  }
};


const toggleIngredientEditing = (index) => {
  existingIngredients.value[index].editing = !existingIngredients.value[index].editing;
};

// Méthode pour modifier le cocktail
const modifyCocktail = async () => {
  console.log(idCocktail.value)
  try {
    // Construire l'objet de données à envoyer au serveur
    const data = {
      id: idCocktail.value,
      nom: nomCocktail.value,
      image: photoCocktail.value,
      instructions: Instructions.value,
      categories: selectedCategories.value.join(','),
      ingredients: JSON.stringify(existingIngredients.value) // Utiliser existingIngredients plutôt que ingredients
    };

    // Construire l'URL avec les paramètres
    const url = api +`?action=updateCocktail&id=${data.id}&nom=${data.nom}&image=${data.image}&instructions=${data.instructions}&categories=${data.categories}&ingredients=${data.ingredients}`;

    // Envoi de la requête GET au serveur pour modifier le cocktail
    const response = await axios.get(url);

    console.log('Cocktail modifié avec succès', response.data);

    // Émettre une alerte de réussite
    Swal.fire({
      icon: 'success',
      title: 'Cocktail modifié avec succès',
      showConfirmButton: false,
      timer: 1500
    });

    setTimeout(function () {
      window.location.reload();
    }, 2000);
    // Assurez-vous d'avoir déclaré cette fonction dans la section 'methods' de votre composant
    // $emit('cocktailAddedOrModified', response.data);
  } catch (error) {
    console.error('Erreur lors de la modification du cocktail', error);
  }
};



// Appel des méthodes lors de la création du composant
onMounted(() => {
  getCategories();
  getCategoriesByCocktail(); // Appeler cette méthode pour récupérer les catégories affiliées au cocktail
  getIngredientsByCocktail();
});
</script>

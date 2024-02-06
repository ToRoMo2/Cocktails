<style scoped>
.v-combobox {
  text-align: left;
  max-width: 400px;
}
.category-container {
  text-align: left;
  max-width: 400px;
  margin: 20px;
}
#category-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

#btn_sup {
  margin: 10px;
}

#btn_ajout {
  margin: 10px;
}

#btn_modif {
  margin: 10px;
}

#btn_annuler {
  margin: 10px;
}

.icon-large {
  font-size: 35px;
}
</style>

<template>
  <div id="category-container">
    <v-snackbar v-model="notification.show" :color="notification.color">
      <span class="text-center">{{ notification.text }}</span>
    </v-snackbar>
    <v-combobox
      v-model="selected"
      clearable
      multiple
      label="Categories"
      :items="libelle"
      variant="outlined"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <template v-slot:selection="{ item, index }">
        <v-chip v-if="index < 2">
          <span>{{ item.title }}</span>
        </v-chip>

        <span
          v-if="index === 2"
          class="text-grey text-caption align-self-center"
        >
          (+{{ selected.length - 2 }} autres)
        </span>
      </template>
    </v-combobox>
    <div v-if="props.isLoggedIn">
      <v-btn
        :disabled="selected.length === 0"
        v-if="!addingCategory && !editingCategory"
        id="btn_sup"
        @click="deleteSelectedCategory"
        icon
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>

      <v-text-field

        v-if="addingCategory == true"

        v-model="newCategoryName"
        label="Nouvelle catégorie"
        ref="ajout"
        @keyup.escape="cancelAddingCategory"
        @keyup.enter="addCategory"
        type="text"
        variant="outlined"
      ></v-text-field>


      <v-btn
        v-if="addingCategory == false && editingCategory == false"
        @click="toggleAddingCategory()"
        icon
      >

        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <div v-show="newCategoryName.trim() !== ''">
        Appuyez sur Entrée pour valider
      </div>

      <v-btn v-if="addingCategory" @click="cancelAddingCategory" icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-text-field
        v-if="editingCategory == true"

        v-model="editedCategoryName"
        label="Modifier catégorie"
        ref="modif"
        @keyup.escape="cancelEditingCategory"
        @keyup.enter="updateCategory"
        type="text"
        variant="outlined"
      ></v-text-field>
      <div v-show="editedCategoryName.trim() !== ''">
        Appuyez sur Entrée pour valider
      </div>

      <v-btn v-if="editingCategory" @click="cancelEditingCategory" icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-btn
        :disabled="selected.length === 0"
        v-if="!addingCategory && !editingCategory"
        id="btn_modif"
        @click="toggleEditingCategory"
        icon
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, inject } from "vue";
import axios from "axios";
const api = inject("API_URL")
const selected = ref([]);
const libelle = ref([]);
const categories = ref([]);
const addingCategory = ref(false);
const editingCategory = ref(false);
const editedCategoryName = ref("");
const newCategoryName = ref("");
const notification = ref({ show: false, text: "", color: "" });
const props = defineProps(["isLoggedIn"]);
const emit = defineEmits(["update:modelValue"]);

axios.get(api + "?action=getCategories").then((response) => {
  categories.value = response.data;
  categories.value.forEach((element) => {
    libelle.value.push(element.nom_categorie);
  });
});

async function fetchCategories() {
  try {
    categories.value = [];
    libelle.value = [];
    const response = await axios.get(api + "?action=getCategories");
    categories.value = response.data;
    categories.value.forEach((element) => {
      libelle.value.push(element.nom_categorie);
    });
  } catch (error) {
    console.error(error);
  }
}

function cancelAddingCategory() {
  newCategoryName.value = "";
  addingCategory.value = false;
}

function cancelEditingCategory() {
  editedCategoryName.value = "";
  editingCategory.value = false;
}

function toggleAddingCategory() {
  addingCategory.value = !addingCategory.value;
  newCategoryName.value = addingCategory ? "" : newCategoryName.value;
}

async function addCategory() {
  if (newCategoryName.value.trim() !== "") {
    await axios.get(api + "?action=addCategorie&cat=" + newCategoryName.value);
    fetchCategories();
    console.log(newCategoryName.value);
    newCategoryName.value = "";
    addingCategory.value = false;
    showNotification("Catégorie ajouter avec succès", "success");
  } else {
    console.error("Veuillez entrer un nom de catégorie");
  }
}

async function deleteSelectedCategory() {
  if (selected.value.length > 0) {
    const categorieSupp = selected.value[0];
    if (categorieSupp) {
      const response = await axios.get(
        api + "?action=deleteCategorie&cat=" + selected.value[0]
      );
      fetchCategories();
      selected.value = [];
      emit("update:modelValue", selected.value);
      showNotification("Catégorie supprimée avec succès", "success");
    }
  } else {
    console.error("Aucune catégorie sélectionnée");
    showNotification("Aucune catégorie sélectionnée", "error");
  }
}

function toggleEditingCategory() {
  editingCategory.value = !editingCategory.value;
  editedCategoryName.value = editingCategory.value
    ? selected.value[0]
    : editedCategoryName.value;
}
async function updateCategory() {
  if (editedCategoryName.value.trim() !== "") {
    try {
      await axios.get(
        api +
          "?action=updateCategorie&cat=" +
          selected.value[0] +
          "&newCat=" +
          editedCategoryName.value
      );
      fetchCategories();
      editedCategoryName.value = "";
      editingCategory.value = false;
      selected.value = [];
      emit("update:modelValue", selected.value);
      showNotification("Catégorie modifier avec succès", "success");
    } catch (error) {
      console.error("Erreur modification catégorie:", error);
      showNotification("Erreur modification catégorie", "error");
    }
  }
}
function showNotification(text, color) {
  notification.text = text;
  notification.color = color;
  notification.show = true;

  setTimeout(() => {
    notification.show = false;
  }, 3000);
}
</script>
<template>
  <div>
    <v-card id="login-card">
      <v-card-title>Login</v-card-title>
      <v-card-subtitle>Veuillez vous connecter pour Ajouter/Modifier/Supprimer des cocktails</v-card-subtitle>

      <v-card-text>
        <v-text-field
          v-model="username"
          label="Nom d'utilisateur"
          outlined
          dense
          ref="username"
          
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Mot de passe"
          outlined
          dense
          type="password"
          @keyup.enter="login"
        ></v-text-field>


      </v-card-text>
      <v-card-actions>
        <v-btn @click="login">Se connecter</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Afficher le message si le serveur est hors ligne -->
    <div v-if="serverOffline" class="error-container">
    <div class="server-offline-message">Le serveur est hors ligne</div>
    </div>
    <!-- Afficher le message si l'identification échoue -->
    <div v-if="loginError" class="error-container">
    <div class="login-error-message">Nom d'utilisateur ou mot de passe incorrect</div>
    </div>
  </div>
</template>

<script>
import authService from '@/services/authService';

export default {
  data() {
    return {
      username: '',
      password: '',
      serverOffline: false,
      loginError: false,
    };
  },
  methods: {
    async login() {
      try {
        const response = await authService.login(this.username, this.password);
        const token = response.data.token;

        // Réinitialiser les états d'erreur
        this.serverOffline = false;
        this.loginError = false;

        // Stocker le token dans le stockage local (localStorage)
        localStorage.setItem('token', token);

        // Rediriger vers la page d'accueil ou effectuer toute autre action après la connexion réussie
        this.$router.push({ name: 'home' });
      } catch (error) {
        console.error('Erreur de connexion:', error);

        // Vérifier si l'erreur est due à un serveur hors ligne
        if (error.response && error.response.status === 500) {
          this.serverOffline = true;
        } else if (error.response && error.response.status === 401) {
          // Erreur d'authentification (nom d'utilisateur ou mot de passe incorrect)
          this.loginError = true;
        } else  {
          // Erreur de connexion refusée (serveur hors ligne ou inaccessible)
          this.serverOffline = true;
        }

        // Afficher l'erreur complète dans la console
        console.error('Erreur complète:', error);
      }
    },
  },
  //des le lancement de la page, on active la saisie dans le champ username
  mounted() {
    this.$refs.username.focus();
  },
};
</script>

<style scoped>
#login-card {
  max-width: 500px;
  margin: 0 auto;
  margin-top: 50px;
}

.server-offline-message,
.login-error-message {
  color: red;
  margin-top: 10px;
}

.error-container {
  text-align: center;
  margin-top: 20px;
}

.error-message {
  font-size: 16px;
  font-weight: bold;
}
</style>

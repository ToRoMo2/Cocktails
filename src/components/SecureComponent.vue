<script>
import authService from '@/services/authService';

export default {
  data() {
    return {
      data: null,
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const response = await authService.fetchData();
        this.data = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    },
  },
};
</script>
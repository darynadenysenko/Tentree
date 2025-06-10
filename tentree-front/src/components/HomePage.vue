<template>
  <div class="min-h-screen bg-[#F8F1E5]">
    <div class="flex justify-between items-center py-4 px-4">
      <!-- Greeting -->
      <h1 class="text-poppins font-bold text-3xl">Hi {{ userInfo.firstName }}!</h1>

      <!-- Profile icon -->
      <div class="flex justify-center items-center w-16 h-16 rounded-full border-2 border-black text-black cursor-pointer hover:bg-gray-200" @click="goToProfile">
        <i class="fas fa-user text-3xl"></i>
      </div>
    </div>

    <!-- Search Section -->
    <div class="flex justify-between items-center py-4 px-4">
      <!-- Search by Name -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search spots by name"
        class="px-4 py-2 border border-gray-300 rounded-md w-1/3"
        @input="searchSpots"
      />

      <div class="space-x-4">
        <!-- Search by Country -->
        <select v-model="searchByCountry" class="px-4 py-2 border border-gray-300 rounded-md" @change="searchSpots">
          <option value="">Search by Country</option>
          <option v-for="country in countries" :key="country.ID" :value="country.ID">
            {{ country.Name }}
          </option>
        </select>

        <!-- Sort by Price -->
        <select v-model="priceSortOrder" class="px-4 py-2 border border-gray-300 rounded-md" @change="searchSpots">
          <option value="">Sort by Price</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>
    </div>
    <div v-if="filteredSpots.length === 0" class="text-center text-xl text-gray-500">
      No spots found matching your criteria.
    </div>

    <!--Display spots-->
    <div v-for="spot in spots" :key="spot.ID" class="flex bg-green-800 bg-opacity-10 hover:bg-gray-200 mb-3 ml-3 mr-3 rounded-lg spot-card">
        <img 
          :src="spot.photos?.[0]?.URL "
          alt="Spot Photo"
          class="w-40 h-25 object-cover rounded-md"
        />
      <router-link :to="`/spotinfo/${spot.ID}`" class="block text-black px-3 py-3">
        <p class="font-bold text-2xl">{{ spot.Name }}</p>
        <p> {{ spot.city.country.Name }}, {{ spot.city.Name }}, {{ spot.Street }}
        </p>
        <p v-if="spot.Price">Price per night: ${{ spot.Price }}</p>
      </router-link>
    </div>

  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      userInfo: {}, 
      spots: [], // All spots fetched from backend
      filteredSpots: [], // Spots that match the search and filter criteria
      searchQuery: '', // Search input for spot name
      searchByCountry: '', // Country ID for filtering spots
      priceSortOrder: '', // Sort by price 
      countries: [], // Array to hold the fetched countries
    };
  },
  mounted() {
    this.fetchAllSpots();
    this.fetchCountries();
    this.fetchUserData();
  },
  methods: {
    fetchUserData() {
      const token = localStorage.getItem('authToken'); // Get token from localStorage
      if (token) {
        fetch('http://localhost:3000/users/home', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Send token in Authorization header
          },
        })
          .then(response => response.json()) // Parse the JSON response
          .then(data => {
            if (data.error) {
              console.error(data.error);
            } else {
              this.userInfo = data; // save user info to 'userInfo'
            }
          })
          .catch(error => {
            console.error('Error fetching user info:', error);
          });
      }
    },
    fetchCountries() {
      fetch('http://localhost:3000/countries') 
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
          this.countries = data; // Store the countries in the 'countries' array
        })
        .catch(error => {
          console.error('Error fetching countries:', error);
        });
    },
    goToProfile() {
      this.$router.push('/profile');
    },
    fetchAllSpots() {
      let url = 'http://localhost:3000/spots/filterspots?';

      //if user entered search query, append it to the URL
      if (this.searchQuery) {
        url += `searchQuery=${this.searchQuery}&`;
      }

      //if user selected a country, append it to the URL
      if (this.searchByCountry) {
        url += `countryId=${this.searchByCountry}&`;
      }

      //if user selected a price sort order, append it to the URL
      if (this.priceSortOrder) {
        url += `priceSortOrder=${this.priceSortOrder}&`;
      }

      fetch(url)
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
          this.spots = data; // Store all fetched spots in 'spots'
          this.filteredSpots = data; // Initially, all spots are filtered
        })
        .catch(error => {
          console.error('Error fetching spots:', error);
        });
    },

  searchSpots() {
    this.fetchAllSpots(); // Re-fetch spots when search or filters are applied
  },
    
  },
};
</script>

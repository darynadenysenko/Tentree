<template>
    <div  class="min-h-screen bg-[#F8F1E5]"> 

        <!--Top line with logo and buttons-->
        <div class="flex items-center justify-between border-t-2 border-[#D1C7B7] py-1 px-3">

            <!-- Logo Section (Left side) -->
            <div class="flex items-center">
                <img src="../assets/logo.png" alt="Logo" class="w-[80px] h-[80px] object-contain"/> 
            </div>

            <!-- Buttons Section (Right side) -->
            <div class="flex space-x-[10px]">
                
                <button @click="goToLogin" class="font-poppins font-semibold px-4 py-1 border border-black text-black bg-transparent hover:bg-[#7D6E47] rounded-[4px]">
                    Log In
                </button>
                
                <button @click="goToRegistration" class="font-poppins font-semibold px-4 py-1 bg-[#2C3B22] text-white hover:bg-[#7D6E47] rounded-[4px] h-[40px]">
                  Sign Up
                </button>
            </div>
        </div>

        <!--Image section-->
        <img
            src="../assets/LandingPage.png"  
            alt="Image"
            class="w-full h-auto object-contain" 
        />

        <!-- Text Section -->
        <div class="absolute top-[155px] left-10 text-left">
            <h1 class="text-6xl font-bold text-white leading-tight">
                Epic Spots.<br />
                Zero Hassle.
            </h1>
            <p class="text-white mt-4 text-2xl">Find and book top-rated camping spots in seconds.</p>

        </div>

        <!-- Popular Spots Section -->
        <div class="px-6 py-8">
            <h2 class="text-3xl font-semibold mb-6 text-[#2C3B22]">Top-Rated Spots</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div v-for="spot in topSpots" :key="spot.ID" class="bg-[#2C3B22] bg-opacity-20 rounded-lg shadow p-4 hover:shadow-md transition">
                
                    <img
                        :src="spot.photos?.[0]?.URL || 'https://via.placeholder.com/300x200'"
                        alt="Spot Photo"
                        class="w-full h-[180px] object-cover rounded"
                    />
                    <h3 class="text-xl font-bold mt-3">{{ spot.Name }}</h3>
                    <p class="text-gray-800 text-sm">
                        {{ spot.city?.Name }}, {{ spot.city?.country?.Name }}
                    </p>
                    <p class="mt-2 font-semibold text-yellow-800">
                        ⭐ {{ averageRating(spot.reviews) }} / 5 ({{ spot.reviews.length }} reviews)
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'LandingPage',
  data() {
    return {
      topSpots: [], // hold the top-rated spots
    };
  },
  mounted() {
    this.fetchTopSpots();
  },
  methods: {
    goToLogin() {
      this.$router.push('/login');  
    },
    goToRegistration() {
      this.$router.push('/registration');
    },

    averageRating(reviews) {
      if (!reviews || reviews.length === 0) return 'No rating'; 
      const total = reviews.reduce((sum, r) => sum + (r.Rating || 0), 0); //Start at 0, and for each review, add its Rating to the running total
      return (total / reviews.length).toFixed(1); // Calculate the average rating and round to 1 decimal 
    },

    fetchTopSpots() {
      fetch('http://localhost:3000/spots/spots/toprated')
        .then(res => res.json()) // Parse the JSON response
        .then(data => {
          this.topSpots = data; //save the top-rated spots to 'topSpots'
        })
        .catch(err => {
          console.error('Error loading top spots:', err);
        });
    }
  }
};
</script>
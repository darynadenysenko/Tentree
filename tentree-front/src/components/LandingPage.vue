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
                    Find a Spot
                </button>
                
                <button class="font-poppins font-semibold px-4 py-1 bg-[#2C3B22] text-white hover:bg-[#7D6E47] rounded-[4px] h-[40px]">
                List Your Spot
                </button>
            </div>
        </div>

        <!--Image section-->
        <img
            src="../assets/LandingPage.png"  
            alt="Hero Image"
            class="w-full h-auto object-contain" 
        />

        <!-- Text Section -->
        <div class="absolute top-[155px] left-10 text-left">
            <h1 class="text-6xl font-poppins font-bold text-white leading-tight">
                Epic Spots.<br />
                Zero Hassle.
            </h1>
        </div>

        <!-- Popular Spots Section -->
        <div class="px-6 py-8">
            <h2 class="text-3xl font-semibold mb-6 text-[#2C3B22]">Top-Rated Spots</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div v-for="spot in topSpots" :key="spot.ID" class="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
                
                    <img
                        :src="spot.photos?.[0]?.URL || 'https://via.placeholder.com/300x200'"
                        alt="Spot Photo"
                        class="w-full h-[180px] object-cover rounded"
                    />
                    <h3 class="text-xl font-bold mt-3">{{ spot.Name }}</h3>
                    <p class="text-gray-600 text-sm">
                        {{ spot.city?.Name }}, {{ spot.city?.country?.Name }}
                    </p>
                    <p class="mt-2 text-yellow-600">
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
      topSpots: [], // This will hold the top-rated spots
    };
  },
  mounted() {
    this.fetchTopSpots();
  },
  methods: {
    // This method will navigate to the Login Page when the button is clicked
    goToLogin() {
      this.$router.push('/login');  
    },
    averageRating(reviews) {
      if (!reviews || reviews.length === 0) return 'No rating';
      const total = reviews.reduce((sum, r) => sum + (r.Rating || 0), 0);
      return (total / reviews.length).toFixed(1);
    },
    fetchTopSpots() {
      fetch('http://localhost:3000/spots/spots/toprated')
        .then(res => res.json())
        .then(data => {
          this.topSpots = data;
        })
        .catch(err => {
          console.error('Error loading top spots:', err);
        });
    }
  }
};
</script>
<template>
  <div class="min-h-screen bg-[#F8F1E5] px-3 py-3">
    <!-- Header with Logo and Profile Icon -->
    <div class="flex items-center justify-between py-1 px-3">
      <div class="flex items-center">
        <img src="../assets/logo.png" alt="Logo" class="w-[80px] h-[80px] object-contain" />
      </div>
      <div
        class="flex justify-center items-center w-16 h-16 rounded-full border-2 border-black text-black cursor-pointer hover:bg-gray-200"
        @click="goToProfile"
      >
        <i class="fas fa-user text-3xl"></i>
      </div>
    </div>

    <!-- Images-->
    <div class="flex overflow-x-auto space-x-4 py-4">
      <img
        v-for="(photo, index) in spot.photos"
        :key="index"
        :src="photo.URL"
        alt="Spot Photo"
        class="w-[400px] h-[250px] object-cover rounded-md"
      />
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="flex justify-center items-center h-screen">
      <p class="text-2xl font-semibold">Loading...</p>
    </div>

    <!-- Spot Details -->
    <div v-else class="py-4">
      <div class="mt-6">
        <h1 class="text-3xl font-bold">{{ spot.Name }}</h1>

        <div class="flex items-center space-x-2 mt-2">
          <span>{{ starDisplay }}</span>
          <p>{{ spot.reviews.length }} reviews</p>
        </div>

        <p class="text-md font-semibold mt-2">
          {{ spot.Street }}, {{ spot.city.Name }}, {{ spot.city.country.Name }}
        </p>
        <p class="text-md font-medium mt-2">{{ spot.Description }}</p>
        <p class="text-lg font-bold mt-2">Price per night: ${{ spot.Price }}</p>

        <!-- Amenities -->
        <div class="flex flex-wrap items-center gap-3 mt-4">
          <div
            v-for="amenity in spot.camping_spot_amenities"
            :key="amenity.CampingSpot_ID"
            class="flex items-center space-x-1"
          >
            <i class="fas fa-check-circle text-green-800"></i>
            <span>{{ amenity.amenities.Name }}</span>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="mt-10">

        <div v-if="spot.reviews.length === 0" class="text-gray-500 italic">
          No reviews yet. Be the first to leave one!
        </div>

        <div v-else class="flex overflow-x-auto space-x-4 pb-4">
          <div
            v-for="review in spot.reviews"
            :key="review.ID"
            class="min-w-[300px] bg-white p-4 rounded-md shadow flex-shrink-0"
          >
            <div class="flex items-center justify-between mb-1">
              <p class="font-semibold text-[#2C3B22]">
                {{ review.user?.FirstName || 'Anonymous' }}
              </p>
              <p class="text-yellow-600 font-bold text-sm">
                {{ '⭐'.repeat(review.Rating) }}
              </p>
            </div>
            <p class="text-gray-700 text-sm">{{ review.Comment }}</p>
          </div>
        </div>
      </div>

      <!-- Availability Button -->
      <div class="flex justify-center mt-6">
        <button
          @click="goToAvailability"
          class="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
        >
          Check Availability
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default({
    name: 'SpotInfoPage',
    data() {
        return {
        spot: {}, 
        loading: true, // if the data is still being fetched
        }
    },
    mounted() {
        this.fetchSpotDetails();
        
    },
    computed: {
      averageRating() {
        if (!this.spot.reviews || this.spot.reviews.length === 0) return 0; //if no reviews, return 0
        const total = this.spot.reviews.reduce((sum, review) => sum + (review.Rating || 0), 0); //start at zero and add each review's rating to the total
        return total / this.spot.reviews.length; //calculate the average rating
      },

      starDisplay() {
        const stars = Math.round(this.averageRating);
        return '⭐'.repeat(stars);
      }
    },
    methods: {
        fetchSpotDetails() {
        const spotId = this.$route.params.id; // Get the 'id' from the route parameters
        fetch(`http://localhost:3000/spots/${spotId}`)
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
            this.spot = data; // Store the spot details
            this.loading = false; // Set loading to false once data is fetched
            })
            .catch(error => {
            console.error('Error fetching spot details:', error);
            this.loading = false; // Set loading to false even if there's an error
            });
        },
        goToAvailability() {
          this.$router.push(`/availability/${this.spot.ID}`); // Navigate to the availability page for the current spot
        },        
        goToProfile() {
          this.$router.push('/profile'); // Navigate to the profile page
        },
        goToPhotos() {
          this.$router.push(`/photos/${this.spot.ID}`); // Navigate to the photos page for the current spot
        },

    }
   
})
</script>

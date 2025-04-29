<template>
    <div  class="min-h-screen bg-[#F8F1E5]">
        <div class="flex items-center justify-between border-t-2 border-[#D1C7B7] py-1 px-3">

            <!-- Logo Section (Left side) -->
            <div class="flex items-center">
                    <img src="../assets/logo.png" alt="Logo" class="w-[80px] h-[80px] object-contain"/> 
                </div>
            <!-- Profile icon -->
            <div class="flex justify-center items-center w-16 h-16 rounded-full border-2 border-black text-black cursor-pointer hover:bg-gray-200" @click="goToProfile">
                <i class="fas fa-user text-3xl"></i>
            </div>
        </div>

        <!-- Image Section -->
        <div class="flex overflow-x-auto space-x-4 py-4">
            <img 
                v-for="(photo, index) in spot.photos" 
                :key="index" 
                :src="photo.URL" 
                alt="Spot Photo" 
                class="w-[400px] h-[250px] object-cover rounded-md" 
            />
        </div>
        <div v-if="loading" class="flex justify-center items-center h-screen">
            <p class="text-2xl font-semibold">Loading...</p>
        </div>
        <div v-else class="flex overflow-x-auto space-x-4 py-4">
            <!-- Spot Details -->
        <div class="mt-6">
        <h1 class="text-3xl font-bold">{{ spot.Name }}</h1>
        
        <div class="flex items-center space-x-2 mt-2">
            <span>⭐⭐⭐⭐⭐</span> <!-- Static rating for now, can be dynamic based on reviews -->
            <p>{{spot.reviews.length}} reviews</p>
        </div>
        
        <p class="text-md font-semibold mt-2">{{ spot.Street }}, {{ spot.city.Name }}, {{ spot.city.country.Name }}</p>
        <p class="text-md font-medium mt-2">{{ spot.Description }}</p>
        <p class="text-lg font-bold mt-2">Price per night: ${{ spot.Price }}</p>

        <div class="flex items-center space-x-3 mt-4">
            <!-- Amenities List -->
             <div v-for="amenity in spot.camping_spot_amenities " :key="amenity.CampingSpot_ID" class="flex items-center space-x-1">
            <i class="fas fa-check-circle text-green-500"></i>
            <span>{{ amenity.amenities.Name }}</span>
            </div> 
        </div>

        
        </div>
        </div>

        <div class="mt-6">
    <button
        @click="goToAvailability"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
    >
        Check Availability
    </button>
    </div>

        

     
    </div>
    
</template>
<script>
export default({
    name: 'SpotInfoPage',
    data() {
        return {
        spot: {}, // This will store the details of the spot
        loading: true, // This will indicate if the data is still being fetched
        }
    },
    mounted() {
        this.fetchSpotDetails();
        
    },
    methods: {
        fetchSpotDetails() {
        const spotId = this.$route.params.id; // Get the 'id' from the route parameters
        fetch(`http://localhost:3000/spots/${spotId}`)
            .then(response => response.json())
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
        this.$router.push(`/availability/${this.spot.ID}`);
        },        
        goToProfile() {
            this.$router.push('/profile');
        },
        goToPhotos() {
            this.$router.push(`/photos/${this.spot.ID}`); // Navigate to the photos page for the current spot
        },

    }
   
})
</script>

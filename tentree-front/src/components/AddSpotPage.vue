<template>
    <div class="min-h-screen bg-[#F8F1E5]">
        <div v-if="!isSubmitted" class="flex justify-between items-center py-4 px-4">
            <!-- Add Spot -->
            <h1 class="text-poppins text-[#2C3B22] font-bold text-3xl">Add Spot</h1>

            <!-- Logo  -->
            <div class="flex items-center">
                <img src="../assets/logo.png" alt="Logo" class="w-[80px] h-[80px] object-contain"/> 
            </div>
        </div>

        <!--Success Message-->
        <div v-if="isSubmitted" class=" text-center py-[100px]">
            <h2 class="text-4xl text-green-800 font-bold">Spot Added Successfully!</h2>
            <p class="text-lg mt-2">Your camping spot has been successfully added to the system.</p>
        </div>

        <div v-if="isSubmitted" class="space-x-10 text-center py-[100px]">
            <button @click="goToProfile()" class="bg-transparent">
                <u> 
                    Go to Profile
                </u>
            </button>
            <button @click="goToHomePage()" class="bg-transparent">
                <u> 
                    Go to Home Page
                </u>
            </button>
        </div>

        <!-- Form -->

        <form v-if="!isSubmitted" @submit.prevent="submitForm" class="space-y-4">
            <!-- Title -->
            <div class="mr-4 ml-4">
                <label for="title" class="block text-lg font-medium">Title</label>
                <input type="text" v-model="title" id="title" required              
                class="mt-1 block w-[700px] py-3 px-3 border border-gray-300 rounded-md" />               
            </div>

            <!-- Description -->
            <div class="mr-4 ml-4 border-b border-green-800">
                <label for="description" class="block text-lg font-medium">Description</label>
                <textarea v-model="description" id="description" maxlength="500" rows="4" required
                class="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md"></textarea> 
                <p class="text-right text-sm text-gray-500">{{ description.length }}/500</p>
            </div>

            <!-- Address Section -->

            <p class="text-xl font-semibold ml-5"> Address </p>
            <div class="ml-4 mr-4 border-b border-green-800 flex justify-between items-center ">
                
                <!--Country-->
                <div class="mr-4 ml-4 mb-6 w-[400px]">
                    <label for="country" class="block text-lg font-medium">Country</label>
                    <select v-model="country" id="country" required class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md">                
                        <option value="" disabled>Select a country</option>
                        <option v-for="country in countries" :key="country.ID" :value="country.ID">
                            {{ country.Name }}
                        </option>
                    </select>
                </div>

                <!--City-->
                <div class="mr-4 ml-4 mb-6 ">
                    <label for="city" class="block text-lg font-medium">City</label>
                    <input v-model="city" id="city" type="text" required
                    class="mt-1 block w-[400px] px-4 py-2 border border-gray-300 rounded-md" />
                </div>

                <!--Street-->

                <div class="mr-4 ml-4 mb-6">
                    <label for="street" class="block text-lg font-medium">Street</label>
                    <input v-model="street" id="street" type="text" required
                    class="mt-1 block w-[400px] px-4 py-2 border border-gray-300 rounded-md" />               
                </div>

            </div>

            <!-- Amenities Section -->
            <div class="mr-4 ml-4">
                <label class="block text-lg font-medium">Amenities</label>
                
                <!-- Display Amenities -->
                <div class="flex flex-wrap gap-2 mt-2">
                <span v-for="amenity in amenities" :key="amenity.ID" @click="chooseAmenity(amenity)"
                    :class="{'bg-[#16461A] text-white': selectedAmenities.includes(amenity.ID),
                    'bg-[#FEFBF6] text-black': !selectedAmenities.includes(amenity.ID)
                    }"
                    class="px-6 py-1 mr-10 rounded-3xl border cursor-pointer"
                >
                    {{ amenity.Name }}
                    <span v-if="selectedAmenities.includes(amenity.ID)" class="ml-2">✔</span>
                </span>
                </div>
            </div>

            <div class="flex space-x-[100px] items-center ">
            
                <!-- Price Input -->

                <div class="mr-4 mt-5 ml-4">
                    <label for="price" class="block text-lg font-medium">Price per Night</label>
            
                    <div class="flex items-center space-x-2">
                    
                        <input type="number" v-model="price" id="price" min="10" max="10000" step="5" 
                            class="w-24 text-center py-2 border border-gray-300 rounded-md" 
                        />
                    </div>
                </div>

                <!--Max guests-->
                <div class="mr-4 mt-5 ml-4">
                    <label for="price" class="block text-lg font-medium">Max Guests</label>
            
                    <div class="flex items-center space-x-2">
                    
                        <input type="number" v-model="maxGuests" id="maxGuests" min="1" max="50" step="1" 
                            class="w-24 text-center py-2 border border-gray-300 rounded-md" 
                        />
                    </div>
                </div>

            </div>

            <!-- Submit Button -->
            <div class="flex py-5 justify-center">
                <button type="submit" class="w-40 py-2 px-4 bg-[#16461A] text-white rounded-md hover:bg-green-600">
                Submit
                </button>
            </div>

            
        </form>         

       
    </div>

    
</template>
<script>
export default {
    name: "AddSpotPage",
    mounted() {
        this.getCountries();
        this.getAmenities();
    },
    data() {
        return {
        title: '',
        description: '',
        country: '',       
        countries: [], 
        amenities:[],
        selectedAmenities: [],
        city: '',
        street: '',
        price: '',
        maxGuests : '',
        isSubmitted: false,
        };
  },
  methods: {
    submitForm() {
        if (!this.title || !this.description || !this.city || !this.street || !this.country) {
        alert("Please fill out all required fields.");
        return;
        }


        const spotData = {
        Name: this.title,
        Description: this.description,
        Price: this.price,
        MaxGuests: this.maxGuests,
        Street: this.street,
        CityName: this.city,
        CountryID: this.country,
        amenities: this.selectedAmenities 
        };

        fetch('http://localhost:3000/spots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Token for authentication
        },
        body: JSON.stringify(spotData) //Send the spotData object as JSON in the request body
        })
        .then(response => response.json()) //When server responds, convert the response from JSON into a JavaScript object
        .then(data => {
            console.log('Spot created:', data);
            this.isSubmitted = true;
        })
        .catch(error => {
            console.error('Error creating spot:', error);
        });

    },
    chooseAmenity(amenity) {
      const index = this.selectedAmenities.indexOf(amenity.ID); //check if the amenity is already in selected amenities array
      if (index === -1) { //not found
        // Add to selected if not already selected
        this.selectedAmenities.push(amenity.ID);
      } else {
        // Remove from selected if already selected
        this.selectedAmenities.splice(index, 1); //go to position index and remove 1 item
      }
    },
    getAmenities() {
        fetch('http://localhost:3000/amenities')
        .then(response => response.json()) //When server responds convert the response from JSON to a JavaScript object
        .then(data => {
            this.amenities = data; // Store the fetched amenities in the component's data
        })
        .catch(error => {
            console.error('Error fetching amenities:', error);
        });
    },
    getCountries() {
        fetch('http://localhost:3000/countries')
        .then(response => response.json()) //When server responds convert the response from JSON to a JavaScript object
        .then(data => {
            this.countries = data; // Store the fetched countries in the component's data
        })
        .catch(error => {
            console.error('Error fetching countries:', error);
        });

    },
    goToProfile() {
        this.$router.push('/profile');
    },
    goToHomePage() {
        this.$router.push('/home');
    }


  }
}
</script>

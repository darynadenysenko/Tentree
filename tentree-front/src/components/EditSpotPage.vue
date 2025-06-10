<template>
    <div class="min-h-screen bg-[#F8F1E5]">
      <div v-if="!isSubmitted" class="flex justify-between items-center py-4 px-4">
        <h1 class="text-poppins text-[#2C3B22] font-bold text-3xl">Edit Spot</h1>
        <img src="../assets/logo.png" alt="Logo" class="w-[80px] h-[80px] object-contain" />
      </div>
  
      <div v-if="isSubmitted" class="text-center py-[100px]">
        <h2 class="text-4xl text-green-800 font-bold">Spot Updated Successfully!</h2>
        <p class="text-lg mt-2">Your camping spot changes have been saved.</p>
        <div class="space-x-10 mt-6">
          <button @click="goToProfile" class="bg-transparent underline text-lg">Go to Profile</button>
          <button @click="goToHomePage" class="bg-transparent underline text-lg">Go to Home Page</button>
        </div>
      </div>
  
      <!-- Edit Form -->
      <form v-if="!isSubmitted" @submit.prevent="submitForm" class="space-y-4">
        <!-- Title -->
        <div class="mx-4">
          <label class="block text-lg font-medium">Title</label>
          <input v-model="title" type="text" required class="w-[700px] py-3 px-3 border border-gray-300 rounded-md" />
        </div>
  
        <!-- Description -->
        <div class="mx-4 border-b border-green-800">
          <label class="block text-lg font-medium">Description</label>
          <textarea v-model="description" maxlength="500" rows="4" required
            class="w-full px-3 py-3 border border-gray-300 rounded-md"></textarea>
          <p class="text-right text-sm text-gray-500">{{ description.length }}/500</p>
        </div>
  
        <!-- Address -->
        <p class="text-xl font-semibold ml-5">Address</p>
        <div class="flex flex-wrap justify-between mx-4 border-b border-green-800 pb-4">
          <div class="mb-4 w-[400px]">
            <label class="block text-lg font-medium">Country</label>
            <select v-model="country" required class="w-full px-4 py-2 border border-gray-300 rounded-md">
              <option value="" disabled>Select a country</option>
              <option v-for="c in countries" :key="c.ID" :value="c.ID">{{ c.Name }}</option>
            </select>
          </div>
          <div class="mb-4 w-[400px]">
            <label class="block text-lg font-medium">City</label>
            <input v-model="city" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div class="mb-4 w-[400px]">
            <label class="block text-lg font-medium">Street</label>
            <input v-model="street" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>
  
        <!-- Amenities -->
        <div class="mx-4">
          <label class="block text-lg font-medium">Amenities</label>
          <div class="flex flex-wrap gap-2 mt-2">
            <span v-for="amenity in amenities" :key="amenity.ID" @click="toggleAmenity(amenity)"
                  :class="['cursor-pointer px-6 py-1 rounded-3xl border', selectedAmenities.includes(amenity.ID) ? 'bg-[#16461A] text-white' : 'bg-[#FEFBF6] text-black']">
              {{ amenity.Name }}
              <span v-if="selectedAmenities.includes(amenity.ID)" class="ml-2">✔</span>
            </span>
          </div>
        </div>
  
        <!-- Price & Max Guests -->
        <div class="flex space-x-[100px] items-center mx-4 mt-4">
          <div>
            <label class="block text-lg font-medium">Price per Night</label>
            <input v-model.number="price" type="number" min="10" max="10000" step="5"
                   class="w-24 text-center py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label class="block text-lg font-medium">Max Guests</label>
            <input v-model.number="maxGuests" type="number" min="1" max="50" step="1"
                   class="w-24 text-center py-2 border border-gray-300 rounded-md" />
          </div>
        </div>
  
        <!-- Submit -->
        <div class="flex py-5 justify-center">
          <button type="submit" class="w-40 py-2 px-4 bg-[#16461A] text-white rounded-md hover:bg-green-800">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'EditSpotPage',
    data() {
      return {
        title: '',
        description: '',
        country: '',
        countries: [],
        amenities: [],
        selectedAmenities: [],
        city: '',
        street: '',
        price: '',
        maxGuests: '',
        spotId: null,
        isSubmitted: false,
      };
    },
    mounted() {      
      this.getCountries();
      this.getAmenities();
      this.fetchSpotDetails();
    },
    methods: {
      fetchSpotDetails() {
        this.spotId = this.$route.params.spotId; // Get the spot ID from the route parameters
        fetch(`http://localhost:3000/spots/${this.spotId}`, { // Fetch the spot details
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })
          .then((res) => res.json()) //Convert response to JSON
          .then((data) => { //Copy spot details into component data
            this.title = data.Name;
            this.description = data.Description;
            this.price = data.Price;
            this.maxGuests = data.MaxGuests;
            this.street = data.Street;
            this.city = data.city.Name;
            this.country = data.city.country.ID;
            this.selectedAmenities = data.camping_spot_amenities.map((a) => a.amenities.ID);
          })
          .catch((err) => console.error('Failed to load spot:', err));
      },

      submitForm() {
        const spotData = { // Prepare the data to be sent to the server
          Name: this.title,
          Description: this.description,
          Price: this.price,
          MaxGuests: this.maxGuests,
          Street: this.street,
          CityName: this.city,
          CountryID: this.country,
          amenities: this.selectedAmenities,
        };
  
        fetch(`http://localhost:3000/spots/${this.spotId}`, { // Send a PUT request to update the spot
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify(spotData), // Convert the spotData object to JSON
        })
          .then((res) => res.json()) // Convert response to JavaScript object
          .then(() => {
            this.isSubmitted = true; // Set isSubmitted to true to show success message
          })
          .catch((err) => console.error('Failed to update spot:', err));
      },

      toggleAmenity(amenity) {
        const index = this.selectedAmenities.indexOf(amenity.ID); // Check if the amenity is already selected
        if (index === -1) this.selectedAmenities.push(amenity.ID); // If not selected, add it to the array
        else this.selectedAmenities.splice(index, 1); // If selected, remove it from the array
      },


      getAmenities() { // Fetch the list of amenities from the server
        fetch('http://localhost:3000/amenities')
          .then((res) => res.json()) // Convert response to JavaScript object
          .then((data) => (this.amenities = data)); // Store the amenities in the component data
      },

      getCountries() {
        fetch('http://localhost:3000/countries') // Fetch the list of countries from the server
          .then((res) => res.json()) // Convert response to JavaScript object
          .then((data) => (this.countries = data));
      },
      goToProfile() {
        this.$router.push('/profile');
      },
      goToHomePage() {
        this.$router.push('/home');
      },
    },
  };
  </script>
  
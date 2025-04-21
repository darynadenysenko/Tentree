<template>
    <div  class="min-h-screen bg-[#F8F1E5]">
        <div class="flex justify-between items-center py-4 px-4">
            <!-- My Profile -->
            <h1 class="text-poppins font-bold text-3xl text-[#2C3B22]">My Profile</h1>
            
            <!-- Logo -->
            <div class="flex items-center">
                <img src="../assets/logo.png" alt="Logo" class="w-[80px] h-[80px] object-contain"/> 
            </div>
        </div>
        <div  class=" h-[100px] mr-5 ml-5 rounded-lg flex justify-between items-center bg-[#FCF6ED]">
            <!-- Left: Profile Icon & Name -->
            <div class="flex items-center">
                <div class=" ml-4 w-16 h-16 rounded-full border-2 border-black flex justify-center items-center">
                    <i class="fas fa-user text-2xl text-black"></i>
                </div>
                <div class="ml-4">
                    <h2 class="text-2xl font-bold">{{ userInfo.firstName }} {{ userInfo.lastName }}</h2>
                    <p class="text-gray-600">{{ userInfo.email }}</p>
                </div>
            </div>

            <!-- Right: Edit Profile & Logout buttons -->
            <div class="px-4">
                <button @click="editProfile" class="bg-[#2C3B22] text-white hover:bg-green-800 font-medium px-4 py-2 rounded mr-4">Edit Profile</button>
                <button @click="logout" class="font-medium  bg-transparent text-[#903030] hover:bg-red-100 border border-black px-6 py-2 rounded">Log Out</button>
            </div>         
        </div>
    
    <!-- Tab navigation below the profile header -->
    <div class="tabs font-medium text-2xl my-5 gap-40 flex justify-center border-b">
      <button class="px-4 py-4"
        v-for="tab in tabs" 
        :key="tab.name" 
        :class="['tab-button', { 'active': activeTab === tab.name, 'bg-[#F6ECD9]': activeTab == tab.name, 'border-b-2': activeTab==tab.name, 'border-black': activeTab==tab.name }]" 
        @click="setActiveTab(tab.name)"
      >
        {{ tab.label }}
      </button>
    </div>

    
    <!-- Tab content -->
    <div class="tab-content p-6">
      <div v-if="activeTab === 'myBookings'">
        <h3 class="font-bold text-xl">My Bookings</h3>
        <div v-for="booking in userBookings" :key="booking.id" class="booking-item">
          <p>{{ booking.name }}</p>
          <p>{{ booking.date }}</p>
        </div>
      </div>
      
      <div v-if="activeTab === 'mySpots'">
        <!-- Display Spots -->
        <div v-for="spot in spots" :key="spot.ID" class="bg-[#FCF6ED] flex items-center py-3 px-2 my-3 rounded-md">
          <!-- Left side: Spot photo or default camera icon -->
          <div class="flex items-center">
            <img 
              v-if="spot.photos && spot.photos.length > 0" :src="spot.photos[0].URL" alt="Spot photo" 
              class="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div 
              v-else class="mr-4 w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center"
            >
              <i class="fas fa-camera text-gray-600"></i>
            </div>
          </div>

          <!-- Spot Name and Address -->
          <div class="ml-4 flex flex-col">
            <p class="text-lg font-bold">{{ spot.Name }}</p>
            <p class="text-sm text-gray-500"> {{ spot.city.country.Name }}, {{ spot.city.Name }}, {{ spot.Street }} </p>
          </div>

          <!-- Edit and Delete buttons -->
          <div class="flex ml-auto mr-2 items-center space-x-4 ">
            <button @click="editSpot(spot.ID)" class="bg-[#2C3B22] hover:bg-green-800 h-[30px] w-[60px] text-white rounded-lg">Edit</button>
            <button @click="deleteSpot(spot.ID)" class="bg-red-800 hover:bg-red-700 h-[30px] w-[70px] text-white rounded-lg">Delete</button>
          </div>
        </div>
        <!-- Add New Spot Button -->
        <div class="flex justify-center">
          <button @click="addNewSpot" class="mt-4 px-6 py-2 bg-[#2C3B22] text-white rounded-md hover:bg-green-800">
            Add New Spot
          </button>
        </div>
        

      </div>
      
      <div v-if="activeTab === 'reviewsGiven'">
        <h3 class="font-bold text-xl">Reviews Given</h3>
        <!-- List of reviews given -->
      </div>

      <div v-if="activeTab === 'reviewsReceived'">
        <h3 class="font-bold text-xl">Reviews Received</h3>
        <!-- List of reviews received -->
      </div>
    </div>
    </div>

</template>
<script>
  export default {
    name: 'ProfilePage',
    data() {
      return {
        userInfo: {},  
        spots: [],      
        userBookings: [
          { id: 1, name: 'Mountain View Camp', date: 'Jul 15 - 17, 2024' },
          { id: 2, name: 'Forest Haven', date: 'May 20 - 22, 2023' },
        ],
        tabs: [
          { name: 'myBookings', label: 'My Bookings' },
          { name: 'mySpots', label: 'My Spots' },
          { name: 'reviewsGiven', label: 'Reviews Given' },
          { name: 'reviewsReceived', label: 'Reviews Received' },
        ],
        activeTab: 'myBookings', // Default active tab
      };
    },
    mounted() {
      this.fetchUserSpots();

      const token = localStorage.getItem('authToken');  // Get token from localStorage
      
      if (token) {
        fetch('http://localhost:3000/users/profile', {  
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // Send token in Authorization header
          },
        })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            console.error(data.error);
          } else {
            this.userInfo = data;  // Display user info
          }
        })
        .catch(error => {
          console.error('Error fetching user info:', error);
        });
      }
    },
    methods:
    {
      editProfile(){
        this.$router.push('/editprofile');
      },
      addNewSpot(){
        this.$router.push('/addspot');

      },
      fetchUserSpots() {
        fetch('http://localhost:3000/spots/myspots', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`, 
          },
        })
        .then(response => response.json())
        .then(data => {
          this.spots = data; // Store the fetched spots
        })
        .catch(error => {
          console.error('Error fetching spots:', error);
        })
      },
      setActiveTab(tabName) {
          this.activeTab = tabName;  // Switch to the clicked tab
      },
      logout() {
        localStorage.removeItem('authToken');
        this.$router.push('/');
      }
    }
}
  
  
</script>
  
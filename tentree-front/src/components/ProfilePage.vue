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
        <div  class=" h-[100px] mr-5 ml-5 rounded-lg flex justify-between items-center bg-green-900 bg-opacity-10">
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
    <div class="tabs font-medium text-xl my-5 border-b">
      <button class="px-[79px] py-4 rounded-md"
        v-for="tab in tabs" 
        :key="tab.name" 
        :class="['tab-button', { 'active': activeTab === tab.name, 'bg-green-900 text-white': activeTab == tab.name, 'border-b-2': activeTab==tab.name, 'border-black': activeTab==tab.name }]" 
        @click="setActiveTab(tab.name)"
      >
        {{ tab.label }}
      </button>
    </div>

    
    <!-- Tab content -->

    <!-- My bookings tab -->

    <div class="tab-content p-6">
      <div v-if="userBookings.length > 0">
        <div v-if="activeTab === 'myBookings'">
          <div v-for="booking in userBookings" :key="booking.id" class="booking-item bg-green-900 bg-opacity-15 flex items-center py-3 px-2 my-3 rounded-md">
            <div class="ml-4 flex flex-col">
              <p class="text-lg font-bold">{{ booking.campingspot.Name }}</p>
              <p>{{ new Date(booking.StartDate).toLocaleDateString() }} - {{ new Date(booking.EndDate).toLocaleDateString() }}</p>
            </div>
            <div class="flex ml-auto mr-2 items-center space-x-4" >
              <button v-if="canLeaveReview(booking)" @click="leaveReview(booking.ID)" class="bg-[#2C3B22] hover:bg-green-800 h-[30px] w-[150px] text-white rounded-lg">Leave Review</button>
              <button @click="bookAgain(booking.campingspot.ID)" class="bg-white text-black border border-black hover:bg-green-800 h-[30px] w-[150px] rounded-lg">Book Again</button>

            </div>  
          </div>
        </div>
      </div>
      <div v-else>
        <p class="text-gray-500">You don't have any bookings yet.</p>
      </div>
      

      <!-- My Spots tab -->

      <div v-if="activeTab === 'mySpots'">
        <!-- Display Spots -->
        <div v-for="spot in spots" :key="spot.ID" class="bg-green-900 bg-opacity-10 flex items-center py-3 px-2 my-3 rounded-md">
          <!-- Spot photo or default camera icon -->
          <router-link :to="`/photos/${spot.ID}`">
            <div class="flex items-center">
              <img v-if="spot.photos && spot.photos.length > 0" :src="spot.photos[0].URL" alt="Spot photo" 
                class="w-16 h-16 rounded-full object-cover mr-4" />
              <div v-else class="mr-4 w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <i class="fas fa-camera text-gray-600"></i>
              </div>
            </div>
          </router-link>

          <!-- Spot Name and Address -->
          <div class="ml-4 flex flex-col">
            <p class="text-lg font-bold">{{ spot.Name }}</p>
            <p class="text-sm text-gray-500"> {{ spot.city.country.Name }}, {{ spot.city.Name }}, {{ spot.Street }} </p>
          </div>

          <!-- Edit and Delete buttons -->
          <div class="flex ml-auto mr-2 items-center space-x-4 ">
            <button @click="setAvailability(spot.ID)" class="bg-[#2C3B22] hover:bg-green-800 h-[30px] w-[150px] text-white rounded-lg">Set Availability</button>
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
      

      <!-- Reviews Given tab -->
      <div v-if="activeTab === 'reviewsGiven'">
        <div v-if="reviewsGiven.length > 0">
          <div v-for="review in reviewsGiven" :key="review.ID" class="bg-green-900 bg-opacity-10 p-4 rounded-lg mb-3">

            <p class="text-lg font-semibold">{{ review.campingspot.Name }}</p>
            <p class="text-sm text-gray-600 mb-2">{{ new Date(review.CreatedAt).toLocaleDateString() }}</p>
            <p class="mb-1">Rating: {{ review.Rating }}/5</p>
            <p class="italic text-gray-700">"{{ review.Comment }}"</p>
          </div>
        </div>
        <div v-else>
          <p class="text-gray-500">You haven't given any reviews yet.</p>
        </div>
      </div>

      <!-- Reviews Received tab -->

      <div v-if="activeTab === 'reviewsReceived'">
        <div v-if="spots.length > 0">
          <div v-for="spot in spots" :key="spot.ID" class="mb-6">
            <h4 class="text-lg font-semibold">{{ spot.Name }}</h4>

            <div v-if="spot.reviews && spot.reviews.length > 0">
              <div v-for="review in spot.reviews" :key="review.ID" class="bg-green-900 bg-opacity-10 mt-2 p-4 rounded-md">
                <p class="text-sm text-gray-600">
                  From: {{ review.user.FirstName }} {{ review.user.LastName }}
                </p>
                <p class="text-sm text-gray-500 mb-1">{{ new Date(review.CreatedAt).toLocaleDateString() }}</p>
                <p>Rating: {{ review.Rating }}/5</p>
                <p class="italic">"{{ review.Comment }}"</p>
              </div>
            </div>

            <div v-else>
              <p class="text-gray-500 italic">No reviews yet for this spot.</p>
            </div>
          </div>
        </div>

        <div v-else>
          <p class="text-gray-500">You don’t own any spots yet.</p>
        </div>
      </div>

      <!-- Booking Requests tab -->

      <div v-if="activeTab === 'bookingRequests'">
        <div v-if="bookingRequests.length === 0" class="text-gray-500">No booking requests available.</div>

        <!-- Display Booking Requests -->
      <div v-for="request in bookingRequests" :key="request.ID" class="bg-green-900 bg-opacity-10 p-4 mb-4 rounded-md shadow">
        <p class="font-bold text-lg">{{ request.campingspot.Name }}</p>
        <p class="text-sm text-gray-700">{{ new Date(request.StartDate).toLocaleDateString() }} – {{ new Date(request.EndDate).toLocaleDateString() }}</p>
        <p class="text-sm text-gray-800 mt-1">
          Requested by: {{ request.user.FirstName }} {{ request.user.LastName }} ({{ request.user.Email }})
        </p>
        <p class="text-sm text-gray-600 mt-1">Status: {{ request.status.Name }}</p>

        <div class="mt-2 flex space-x-2" v-if="request.status.Name === 'Pending' && new Date(request.StartDate) > new Date()">
          <button @click="updateBookingStatus(request.ID, 'Confirmed')" class="bg-green-800 text-white px-4 py-1 rounded hover:bg-green-700">
            Accept
          </button>
          <button @click="updateBookingStatus(request.ID, 'Rejected')" class="bg-red-700 text-white px-4 py-1 rounded hover:bg-red-700">
            Reject
          </button>
        </div>
      </div>
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
        userBookings: [],
        reviewsGiven: [],
        bookingRequests: [],
        tabs: [
          { name: 'myBookings', label: 'My Bookings' },
          { name: 'mySpots', label: 'My Spots' },
          { name: 'reviewsGiven', label: 'Reviews Given' },
          { name: 'reviewsReceived', label: 'Reviews Received' },
          { name: 'bookingRequests', label: 'Booking Requests' }
        ],
        activeTab: 'myBookings', // Default active tab
      };
    },
    mounted() {       
      this.fetchUserInfo();  
      this.fetchUserSpots();
    },
    methods:
    {
      bookAgain(spotId) {
        this.$router.push(`/spotinfo/${spotId}`);  // Redirect to booking page
      },

      //Allow review only if the booking is in the past and does not have a review yet
      canLeaveReview(booking) {
        const now = new Date(); // Current date and time
        const endDate = new Date(booking.EndDate); //booking end date
        const isPastBooking = now > endDate; // check if the booking is in the past

        const hasReview = !!booking.review; // check if this booking has a review

        return isPastBooking && !hasReview; 
      },


      updateBookingStatus(bookingId, status) {
        const token = localStorage.getItem('authToken');

        fetch(`http://localhost:3000/bookings/${bookingId}/status`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ statusName: status }) // Send the new status as JSON
        })
        .then(response => { 
          if (!response.ok) {
            throw new Error('Failed to update booking');
          }
          return response.json(); // Parse the JSON response
        })
        .then(() => {
          // Refresh booking requests list
          this.fetchBookingRequests();
        })
        .catch(error => {
          console.error('Error updating booking status:', error);
        });
      },

      fetchBookingRequests() {
        const token = localStorage.getItem('authToken'); // Get token from localStorage

        fetch(`http://localhost:3000/bookings/incoming/${this.userInfo.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json()) // Parse the JSON response
          .then(data => {
            this.bookingRequests = data; // Store the fetched booking requests
          })
          .catch(error => {
            console.error('Error fetching booking requests:', error);
          });
      },

      editSpot(spotId) {
        this.$router.push(`/editspot/${spotId}`);  // Redirect to edit spot page
      },

      deleteSpot(spotId) {
        const confirmed = confirm('Are you sure you want to delete this spot?');
        if (!confirmed) return;

        const token = localStorage.getItem('authToken');

        fetch(`http://localhost:3000/spots/${spotId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to delete spot.');
            }
            // Remove the spot from the list in the frontend
            this.spots = this.spots.filter(s => s.ID !== spotId);
          })
          .catch(error => {
            console.error('Error deleting spot:', error);
            alert('Failed to delete the spot. It may have existing bookings or dependencies.');
          });
      },

      // Fetch reviews given by the user
      fetchReviewsGiven() {
        const token = localStorage.getItem('authToken'); // Get token from localStorage

        if (token) {
          fetch(`http://localhost:3000/reviews/user/${this.userInfo.id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }            
          })
          .then(response => response.json()) // Parse the JSON response
          .then(data => {
            this.reviewsGiven = data; // Store the fetched reviews given by the user
          })
          .catch(error => {
            console.error('Error fetching reviews:', error);
          });
        }
      },
      setAvailability(spotId) {
        this.$router.push(`/setavailability/${spotId}`);  // Redirect to availability page
      },
      leaveReview(bookingId) {
        this.$router.push(`/review/${bookingId}`);  // Redirect to leave review page
      },


      fetchUserInfo(){
        const token = localStorage.getItem('authToken');  // Get token from localStorage
      
      if (token) {
        fetch('http://localhost:3000/users/profile', {  
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // Send token in Authorization header
          },
        })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
          if (data.error) {
            console.error(data.error);
          } else {
            this.userInfo = data;  // Save user info to 'userInfo'
            this.fetchUserBookings(); 
            this.fetchReviewsGiven();            
            this.fetchBookingRequests();
          }
        })
        .catch(error => {
          console.error('Error fetching user info:', error);
        });
      }
      },

      fetchUserBookings() {
        const token = localStorage.getItem('authToken');

        if (token) {
          fetch(`http://localhost:3000/bookings/user/${this.userInfo.id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          .then(response => response.json()) // Parse the JSON response
          .then(data => {
            this.userBookings = data; // Save the real bookings here
          })
          .catch(error => {
            console.error('Error fetching bookings:', error);
          });
        }
      },

      editProfile(){
        this.$router.push('/editprofile'); // Redirect to edit profile page
      },
      addNewSpot(){
        this.$router.push('/addspot'); // Redirect to add new spot page
      },


      fetchUserSpots() {
        fetch('http://localhost:3000/spots/myspots', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`, 
          },
        })
        .then(response => response.json()) // Parse the JSON response
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
  
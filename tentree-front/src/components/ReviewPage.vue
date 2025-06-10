<template>
    <div class="min-h-screen bg-[#F8F1E5] flex items-center flex-col"> 
        
      <div v-if="loading">
          <p>Loading...</p>
      </div>
      <div v-else>
          <h1 class="text-4xl font-medium py-4">Leave a Review for {{ spot.Name }}</h1>
      </div>

      <textarea v-model="reviewText" placeholder="Write your review..." rows="5" cols="50" class="textarea mt-[50px] mb-6 rounded-md px-3 py-3"></textarea>

      <div class="stars flex space-x-1">
        <span
            v-for="n in 5"
            :key="n"
            @click="rating = n"
            @mouseover="hoverRating = n"
            @mouseleave="hoverRating = 0"
            class="cursor-pointer text-3xl"
        >
          <i class="fas fa-star" :class="(n <= (hoverRating || rating)) ? 'text-yellow-400' : 'text-gray-300'"></i>
        </span>
      </div>


      <button @click="submitReview" :disabled="!reviewText" 
      :class="['submit-button font-bold py-2 px-4 rounded mt-4', reviewText ? 'bg-[#16461A] hover:bg-green-700 text-white cursor-pointer' : 'bg-gray-500 text-white cursor-not-allowed']">
          Submit Review
      </button>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>

    </div>
</template>
    


<script>
export default{
    name: 'ReviewPage',
    data() {
        return {
            spot: {}, // Spot details
            reviewText: '', 
            rating: 0,
            hoverRating: 0, // store the rating when hovered over
            loading: true, // indicate if the data is still being fetched
            userInfo: {}, 
            bookingId: null, 
        }
    },
    mounted() {
        this.fetchUserData(); // Fetch user data when the component is mounted
        this.fetchBookingDetails(); // Fetch booking details when the component is mounted
        this.bookingId = this.$route.params.id;
    },
    methods:{
        fetchBookingDetails() {
          const bookingId = this.$route.params.id;

          fetch(`http://localhost:3000/bookings/${bookingId}`)
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
              if (data.error) {
                console.error(data.error);
              } else {
                this.spot = data.campingspot; // Store the spot details
                this.loading = false; // Set loading to false after data is fetched
              }
            })
            .catch(error => {
              console.error('Error fetching booking details:', error);
              this.loading = false;
            });
        },

        fetchUserData() {
            const token = localStorage.getItem('authToken'); // Get token from localStorage
            if (token) {
                fetch('http://localhost:3000/users/review', {
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
        
        async submitReview() {
        if (!this.reviewText ) {
          this.error = 'Please fill out the review ';
          alert(this.error);
          return;
        }

        const token = localStorage.getItem('authToken');

        const reviewData = { // Prepare the review data
          userId: this.userInfo.id, 
          spotId: this.spot.ID,
          comment: this.reviewText,
          rating: this.rating,
          bookingId: this.bookingId,
        };

        try {
          const res = await fetch(`http://localhost:3000/reviews/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData) // Send review data as JSON
          });

          if (res.ok) {
            this.success = 'Review submitted successfully!';
            this.error = '';
            this.reviewText = ''; // Clear the review text
            this.reviewRating = 0; // Reset the rating
          } else {
            const result = await res.json();
            this.error = result.error || 'Failed to submit review.';
          }
        } catch (err) {
          console.error('Error submitting review:', err);
          this.error = 'Something went wrong. Try again.';
        }
      }
    }
}
</script>

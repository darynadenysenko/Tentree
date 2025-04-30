<template>
    
  <div class="review-page">
    <div v-if="loading">
        <p>Loading...</p>
    </div>
    <div v-else>
        <h1>Leave a Review for {{ spot.Name }}</h1>
    </div>

    <textarea
      v-model="reviewText"
      placeholder="Write your review..."
      rows="5"
      cols="50"
      class="textarea"
    ></textarea>

    <div class="stars flex space-x-1">
  <span
    v-for="n in 5"
    :key="n"
    @click="rating = n"
    @mouseover="hoverRating = n"
    @mouseleave="hoverRating = 0"
    class="cursor-pointer text-3xl"
  >
  <i class="fas fa-star" :class="(n <= (hoverRating || rating)) ? 'text-yellow-400' : 'text-gray-400'"></i>

  </span>
</div>


    <button
      @click="submitReview"
      :disabled="!reviewText || reviewRating === 0"
      class="submit-button"
    >
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
            spot: {}, // This will store the details of the spot being reviewed
            reviewText: '', // This will store the details of the review
            rating: 0, // This will store the rating given by the user
            hoverRating: 0, // This will store the rating when hovered over
            loading: true, // This will indicate if the data is still being fetched
            userInfo: {}, // This will store user information
        }
    },
    mounted() {
        this.fetchUserData(); // Fetch user data when the component is mounted
        this.fetchBookingDetails(); // Fetch booking details when the component is mounted
    },
    methods:{
        fetchBookingDetails() {
      const bookingId = this.$route.params.id;

      fetch(`http://localhost:3000/bookings/${bookingId}`)
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            console.error(data.error);
          } else {
            this.spot = data.campingspot; // assuming your backend sends campingspot inside booking
            this.loading = false;
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
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        console.error(data.error);
                    } else {
                        this.userInfo = data; // Display user info
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

      const reviewData = {
        userId: this.userInfo.id, 
        spotId: this.spot.ID,
        text: this.reviewText,
        rating: this.rating,
      };

      try {
        const res = await fetch('http://localhost:3000/reviews', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(reviewData)
        });

        if (res.ok) {
          this.success = 'Review submitted successfully!';
          this.error = '';
          this.reviewText = '';
          this.reviewRating = 0;
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

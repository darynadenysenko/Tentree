<template>
  <!--Background-->

  <div class="min-h-screen bg-cover bg-center flex justify-center items-center"
    :style="{ backgroundImage: 'url(' + require('@/assets/Login.png') + ')' }">

    <!-- Calendar container -->
    <div class="bg-green-50 rounded-xl shadow-lg p-6 w-[650px]">
      <div v-if="loading" class="flex justify-center items-center h-screen">
        <p class="text-2xl font-semibold">Loading...</p>
      </div>
      
      <!-- Spot info -->

      <div v-else class="flex flex-col space-y-2 py-4">
        <h1 class="text-3xl font-bold mb-1">{{ spot.Name }}</h1>
        <h2 class="text-lg text-gray-600 mb-4">
          {{ spot.city.country.Name }}, {{ spot.city.Name }}, {{ spot.Street }}
        </h2>
        <h3 class="text-xl mb-6">Price per night: ${{ spot.Price }}</h3>
      </div>

      <!-- Navigation buttons -->
      <div class="flex justify-between items-center mb-4">
        <button
          class="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
          @click="changeMonth(-1)"
          :disabled="isCurrentMonth"
          :class="{ 'opacity-50 cursor-not-allowed': isCurrentMonth }"
        >
          ←
        </button>
        <h2 class="font-semibold">{{ months[selectedMonth] }} {{ selectedYear }}</h2>
        <button @click="changeMonth(1)" class="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300">→</button>
      </div>

      <div class="grid grid-cols-7 gap-1 text-center mb-4">
        <div class="font-bold" v-for="d in daysOfWeek" :key="d">{{ d }}</div>
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="[
            'p-2 rounded',
            getDateClass(day) === 'empty' && 'bg-transparent cursor-default', //days before 1st of the month
            getDateClass(day) === 'past' && 'bg-gray-400 text-gray-600 line-through cursor-not-allowed opacity-60',
            getDateClass(day) === 'available' && 'bg-green-800 text-white cursor-pointer',
            getDateClass(day) === 'booked' && 'bg-red-600 text-white cursor-not-allowed',
            getDateClass(day) === 'selected' && 'bg-green-800 border-black border-2 text-white cursor-pointer',
            getDateClass(day) === 'disabled' && 'bg-gray-200 text-gray-400 cursor-not-allowed' //not specified by owner
          ]"
          @click="selectDate(day)"
        >
          {{ day ? new Date(day).getDate() : '' }} <!--Display only day number, if day is null show nothing-->
        </div> 
      </div>

      <p v-if="startDate && endDate">
        <strong>Selected Dates:</strong>
        {{ new Date(startDate).toLocaleDateString() }} -
        {{ new Date(endDate).toLocaleDateString() }}
        <br />
        Total price: $
        {{
          this.spot.Price *
          ((new Date(this.endDate) - new Date(this.startDate)) / (1000 * 60 * 60 * 24))
        }}
      </p>

      <div class="flex justify-around my-4">
        <div class="flex items-center gap-2">
          <span class="w-5 h-5 bg-green-800 rounded"></span> Available
        </div>
        <div class="flex items-center gap-2">
          <span class="w-5 h-5 bg-red-500 rounded"></span> Booked
        </div>
        <div class="flex items-center gap-2">
          <span class="w-5 h-5 bg-gray-200 rounded"></span> Not specified by owner
        </div>
        <div class="flex items-center gap-2">
          <span class="w-5 h-5 bg-gray-400 rounded"></span> Past dates
        </div>
      </div>

      <button
        class="mt-4 px-4 py-2 bg-green-800 text-white rounded hover:bg-green-900 disabled:opacity-50"
        :disabled="!startDate || !endDate"
        @click="submitBooking"
      >
        Confirm Booking
      </button>

      <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
      <p v-if="success" class="text-green-600 mt-2">{{ success }}</p>
    </div>
  </div>
</template>

  
  <script>
  export default {
    name: 'AvailabilityPage',
    data() {
        return {
            spot: {},
            userInfo: {},
            loading: true,
            availability: [],
            startDate: null,
            endDate: null,
            calendarDays: [],
            selectedMonth: new Date().getMonth(),
            selectedYear: new Date().getFullYear(),
            months: [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
            ],
            daysOfWeek: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
            error: '',
            success: '',
        };
    },
    mounted() {
      this.fetchSpotDetails();
      this.fetchAvailability();
      this.generateCalendar();
      this.fetchUserData(); 
    },
    computed: {
        isCurrentMonth() {
          const now = new Date(); // Get the current date
          // Check if the selected month and year match the current month and year
          return (
            this.selectedMonth === now.getMonth() &&
            this.selectedYear === now.getFullYear()
          );
        }
    },
    methods: {
      changeMonth(direction) { // direction can be -1 (previous) or 1 (next)
        let newMonth = this.selectedMonth + direction; 

        if (newMonth < 0) {
          this.selectedMonth = 11;
          this.selectedYear--;
        } else if (newMonth > 11) {
          this.selectedMonth = 0;
          this.selectedYear++;
        } else {
          this.selectedMonth = newMonth;
        }
        this.generateCalendar();
      },

      fetchUserData() {
        const token = localStorage.getItem('authToken'); // Get token from localStorage
        if (token) {
          fetch('http://localhost:3000/users/booking', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`, // Send token in Authorization header
              },
          })
          .then(response => response.json())
          .then(data => { //wait for the response
              if (data.error) { // Check if there's an error in the response
                console.error(data.error); 
              } else {
                this.userInfo = data; // Save data to this.userInfo
              }
          })
          .catch(error => {
              console.error('Error fetching user info:', error);
          });
        }
      },

      fetchSpotDetails() {
        const spotId = this.$route.params.id; // Get the 'id' from the route parameters
        fetch(`http://localhost:3000/spots/${spotId}`)
          .then(response => response.json()) // wait for the response and convert it from JSON into a usable JavaScript object
          .then(data => {
            this.spot = data; // Store the spot details
            this.loading = false; // Set loading to false once data is fetched
          })
          .catch(error => {
          console.error('Error fetching spot details:', error);
          this.loading = false; // Set loading to false even if there's an error
        });
      },

      async fetchAvailability() {
        const spotId = this.$route.params.id
        const res = await fetch(`http://localhost:3000/availability/${spotId}`); // Fetch availability data for the spot
        const data = await res.json(); //Wait for the server to respond and pars the JSON into a usable JavaScript array
        
        //take raw data and transform each item before saving it
        this.availability = data.map(a => ({
          ...a, //copy all properties from the original object
          Date: a.Date.split('T')[0], //Separate date from time and keep only the date part
          isBooked: !a.IsAvailable 
        }));
      },

      generateCalendar() {
        const days = []; // Array to hold the days of the month
        // Get the selected year and month from the component's data
        const year = this.selectedYear;
        const month = this.selectedMonth;

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0); // last day of the month

        const startDay = firstDay.getDay(); // Day of week the month starts on (0 = Sunday, 1 = Monday, etc.)

        // Fill the empty slots before the 1st of the month
        for (let i = 0; i < startDay; i++) {
          days.push(null);
        }

        // Fill the real days
        for (let day = 1; day <= lastDay.getDate(); day++) {
          const paddedMonth = (month + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1; '0' padding for single-digit months
          const paddedDay = day.toString().padStart(2, '0');
          const isoDate = `${year}-${paddedMonth}-${paddedDay}`; // Format date as YYYY-MM-DD
          days.push(isoDate); // Add the formatted date to the days array
        }

        this.calendarDays = days; // Save the generated days to the component's data
      },

      getDateClass(date) {
        if (!date) return 'empty'; // Empty slots before the 1st of the month

        const today = new Date().toISOString().split('T')[0];
        if (date < today) return 'past'; // Tag past dates 

        const booked = this.availability.find(a => a.Date === date && a.isBooked);
        if (booked) return 'booked';

        //mark selected date
        if (this.startDate && !this.endDate && this.startDate === date) {
          return 'selected';
        }

        //mark selected date range
        if (this.startDate && this.endDate && date >= this.startDate && date <= this.endDate) {
          return 'selected';
        }

        // Check if the date is available
        const available = this.availability.find(a => a.Date === date && !a.isBooked);
        if (available) return 'available';

        // If the date is not available and not booked, return 'disabled'
        return 'disabled';
      },

      selectDate(date) {
        if (!date) return; // Ignore empty slots

        const today = new Date().toISOString().split('T')[0];
        if (date < today) return; // Ignore past dates

        const isBooked = this.availability.find(a => a.Date === date && a.isBooked);
        if (isBooked) return; // Ignore booked dates

        // If the same date is clicked twice to deselect
        if (this.startDate === date && !this.endDate) {
          this.startDate = null;
          return;
        }


        if (!this.startDate) { // If no selected days, start date = clicked date, end date = null
          this.startDate = date;
          this.endDate = null;
        }        
        //if no end date is selected 
        else if (!this.endDate) {
          if (date < this.startDate) { // If the clicked date is before the start date, set it as the new start date
            this.endDate = this.startDate;
            this.startDate = date;
          } else {
            this.endDate = date;
          }
        } else { // If both dates are selected, reset the start date to the clicked date
          this.startDate = date;
          this.endDate = null;
        }
      },

      async submitBooking() {
        if (!this.startDate || !this.endDate) return;   // If no dates are selected, do nothing

        const spotId = this.$route.params.id; // Get the spot ID from the route parameters

        // Prepare the booking data
        const bookingData = {
          userId: this.userInfo.id,
          campingSpotId: spotId,
          startDate: this.startDate,
          endDate: this.endDate,
          price:
            this.spot.Price *
            (new Date(this.endDate) - new Date(this.startDate)) /
            (1000 * 60 * 60 * 24),
        };

        // Send the booking request to the server
        try {
          const res = await fetch('http://localhost:3000/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData), // Turns booking info (a JavaScript object) into JSON format to send it
          });

          if (res.ok) {
            this.success = 'Booking submitted successfully!';
            this.error = '';
            this.startDate = null;
            this.endDate = null;
            await this.fetchAvailability(); // Refresh availability data after booking

            //Redirect after 2 seconds
            setTimeout(() => {
              this.$router.push('/home');
            }, 2000);
          } else {
            const result = await res.json(); // Wait for the server to respond and parse the JSON into a JavaScript object
            this.error = result.error || 'Booking failed.';
          }
        } catch (err) {
          this.error = 'Something went wrong. Try again.';
          console.error(err);
        }
      }
    },


  };
  </script>
  
  
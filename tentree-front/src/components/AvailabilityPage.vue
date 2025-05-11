<template>
    <div class="booking-page">
        <div v-if="loading" class="flex justify-center items-center h-screen">
            <p class="text-2xl font-semibold">Loading...</p>
        </div>
        <div v-else class="flex overflow-x-auto space-x-4 py-4">
        <h1> {{ spot.Name}}</h1>
        <h2> {{ spot.city.country.Name }}, {{ spot.city.Name }}, {{ spot.Street }}</h2>
        <h3>Price per night: ${{ spot.Price }}</h3>
        </div>


  
      <!-- Month/Year Dropdowns -->
      <!--<div class="dropdowns">
        <select v-model="selectedMonth" @change="generateCalendar">
          <option v-for="(month, index) in months" :key="index" :value="index">{{ month }}</option>
        </select>
  
        <select v-model="selectedYear" @change="generateCalendar">
          <option v-for="year in years" :key="year">{{ year }}</option>
        </select>
      </div>-->
      <!-- Calendar Navigation with arrows on the same line -->
<div class="flex justify-between items-center mb-4">
  <button 
    @click="changeMonth(-1)" 
    :disabled="isCurrentMonth"
    :class="{ disabled: isCurrentMonth }"
  >
    ←
  </button>
  <h2>{{ months[selectedMonth] }} {{ selectedYear }}</h2>
  <button @click="changeMonth(1)">→</button>
</div>

  
      <!-- Custom Calendar Grid -->
      <div class="calendar">
        <div class="day-name" v-for="d in daysOfWeek" :key="d">{{ d }}</div>
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="calendar-cell"
          :class="getDateClass(day)"
          @click="selectDate(day)"
        >
          {{ day ? new Date(day).getDate() : '' }}
        </div>
      </div>
  
      <!-- Selected Info & Actions -->
      <p v-if="startDate && endDate">
        <strong>Selected Dates:</strong> {{ new Date(startDate).toLocaleDateString() }} - {{ new Date(endDate).toLocaleDateString() }}
        Total price: ${{this.spot.Price * ((new Date(this.endDate) - new Date(this.startDate)) / (1000 * 60 * 60 * 24))}}
      </p>

  
      <div class="legend">
        <div><span class="legend-box available"></span> Available</div>
        <div><span class="legend-box booked"></span> Booked</div>
        <div><span class="legend-box selected"></span> Your Selection</div>
      </div>
  
      <button @click="submitBooking" :disabled="!startDate || !endDate">
        Confirm Booking
      </button>
  
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
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
            years: [2024, 2025, 2026],
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
            const now = new Date();
            return (
            this.selectedMonth === now.getMonth() &&
            this.selectedYear === now.getFullYear()
            );
        }
    },
    methods: {
        changeMonth(direction) {
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

      async fetchAvailability() {
        const spotId = this.$route.params.id
        const res = await fetch(`http://localhost:3000/availability/${spotId}`);
        const data = await res.json();
        this.availability = data.map(a => ({
          ...a,
          Date: a.Date.split('T')[0],
          isBooked: !a.IsAvailable
        }));
      },
      generateCalendar() {
  const days = [];
  const year = this.selectedYear;
  const month = this.selectedMonth;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0); // last day of the month

  const startDay = firstDay.getDay(); // Day of week (0=Sun)

  // Fill the empty slots before the 1st of the month
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // Fill the real days
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const paddedMonth = (month + 1).toString().padStart(2, '0');
    const paddedDay = day.toString().padStart(2, '0');
    const isoDate = `${year}-${paddedMonth}-${paddedDay}`;
    days.push(isoDate);
  }

  this.calendarDays = days;
},




getDateClass(date) {
  if (!date) return 'empty';

  const booked = this.availability.find(a => a.Date === date && a.isBooked);
  if (booked) return 'booked';

  if (this.startDate && !this.endDate && this.startDate === date) {
    return 'selected';
  }

  if (this.startDate && this.endDate) {
    if (date >= this.startDate && date <= this.endDate) {
      return 'selected';
    }
  }

  const available = this.availability.find(a => a.Date === date && !a.isBooked);
  if (available) return 'available';

  return 'disabled';
},

      selectDate(date) {
  if (!date) return;

  const isBooked = this.availability.find(a => a.Date === date && a.isBooked);
  if (isBooked) return;

  if (!this.startDate) {
    // First click
    this.startDate = date;
    this.endDate = null;
  } else if (!this.endDate) {
    // Second click
    if (date < this.startDate) {
      // If second selected date is before the first, swap them
      this.endDate = this.startDate;
      this.startDate = date;
    } else {
      this.endDate = date;
    }
  } else {
    // Reset if both dates already selected
    this.startDate = date;
    this.endDate = null;
  }
},

async submitBooking() {
  if (!this.startDate || !this.endDate) return;

  const spotId = this.$route.params.id;

  const bookingData = {
    userId: this.userInfo.id,
    campingSpotId: spotId,
    startDate: this.startDate,
    endDate: this.endDate,
    price: this.spot.Price * (new Date(this.endDate) - new Date(this.startDate)) / (1000 * 60 * 60 * 24), // Calculate total price
  };

  try {
    const res = await fetch('http://localhost:3000/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });

    if (res.ok) {
      this.success = 'Booking submitted successfully!';
      this.error = '';
      this.startDate = null;
      this.endDate = null;
      await this.fetchAvailability();
    } else {
      const result = await res.json();
      this.error = result.error || 'Booking failed.';
    }
  } catch (err) {
    this.error = 'Something went wrong. Try again.';
    console.error(err);
  }}}

  };
  </script>
  
  <style scoped>
  .booking-page {
    padding: 2rem;
    max-width: 700px;
    margin: 0 auto;
    background-color: #f4f9f4;
    border-radius: 12px;
  }
  
  .dropdowns {
    margin-bottom: 1rem;
    display: flex;
    gap: 1rem;
  }
  
  .calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .day-name {
    font-weight: bold;
  }
  
  .calendar-cell {
    padding: 10px;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .empty {
    background-color: #e2e2e2;
    cursor: default;
  }
  
  .available {
    background-color: #3d8ef8;
    color: white;
  }
  
  .booked {
    background-color: #f84e4e;
    color: white;
    cursor: not-allowed;
  }
  
  .selected {
    background-color: #32c958;
    color: white;
  }
  
  .disabled {
    background-color: #dcdcdc;
    color: #999;
  }
  
  .legend {
    display: flex;
    justify-content: space-around;
    margin: 1rem 0;
  }
  
  .legend-box {
    width: 20px;
    height: 20px;
    display: inline-block;
    margin-right: 0.5rem;
    border-radius: 4px;
  }
  
  .available.legend-box {
    background-color: #3d8ef8;
  }
  
  .booked.legend-box {
    background-color: #f84e4e;
  }
  
  .selected.legend-box {
    background-color: #32c958;
  }
  
  button {
    margin-top: 1rem;
    padding: 0.6rem 1.2rem;
    background-color: #3d5018;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .error {
    color: red;
  }
  
  .success {
    color: green;
  }
  </style>
  
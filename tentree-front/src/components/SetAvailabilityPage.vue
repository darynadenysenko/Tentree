<template>
  <!-- Background -->
    <div class="min-h-screen bg-cover bg-center flex justify-center items-center"
    :style="{ backgroundImage: 'url(' + require('@/assets/Login.png') + ')' }">
    <div class="p-8 w-[650px] mx-auto bg-green-50 rounded-xl">
      <div v-if="loading" class="flex justify-center items-center h-screen">
        <p class="text-2xl font-semibold">Loading...</p>
      </div>

      <!-- Display spot info -->
    <div v-else>
      <h1 class="text-3xl font-bold mb-1">{{ spot.Name }}</h1>
      <h2 class="text-lg text-gray-600 mb-4">
        {{ spot.city.country.Name }}, {{ spot.city.Name }}, {{ spot.Street }}
      </h2>
      <h3 class="text-xl mb-6">Price per night: ${{ spot.Price }}</h3>

      <!-- Calendar Navigation -->
      <div class="flex justify-between items-center mb-4">
        <button
          class="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
          @click="changeMonth(-1)"
          :disabled="isCurrentMonth"
        >
          ←
        </button>
        <h2 class="font-semibold text-lg">{{ months[selectedMonth] }} {{ selectedYear }}</h2>
        <button
          @click="changeMonth(1)"
          class="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
        >
          →
        </button>
      </div>

      <!-- Calendar Grid -->
      <div class="grid grid-cols-7 gap-2 text-center mb-4">
        <div class="font-bold" v-for="d in daysOfWeek" :key="d">{{ d }}</div>
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="p-2 rounded cursor-pointer text-sm font-medium"
          :class="[
            !day && 'bg-gray-200 cursor-default',
            getDateClass(day).includes('available') && 'bg-green-800 text-white',
            getDateClass(day).includes('unavailable') && 'bg-red-600 text-white',
            getDateClass(day).includes('unset') && 'bg-yellow-400 text-black',
            getDateClass(day).includes('selected') && 'outline outline-2 outline-black'
          ]"
          @click="toggleAvailability(day)"
        >
        
          <span v-if="day && !isNaN(new Date(day))"> 
            {{ new Date(day).getDate() }}
          </span>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex justify-between gap-2 text-sm mb-6">
        <div class="flex items-center gap-2"><span class="w-4 h-4 bg-green-800 rounded"></span> Available</div>
        <div class="flex items-center gap-2"><span class="w-4 h-4 bg-red-600 rounded"></span> Unavailable</div>
        <div class="flex items-center gap-2"><span class="w-4 h-4 bg-yellow-400 rounded"></span> Unset</div>
      </div>

      <!-- Buttons -->
      <div class="flex gap-4 mb-4">
        <button
          @click="applyAvailability(true)"
          class="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
        >
          Set Available
        </button>
        <button
          @click="applyAvailability(false)"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Set Unavailable
        </button>
      </div>

      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
      <p v-if="success" class="text-green-600 text-sm">{{ success }}</p>
    </div>
  </div>
  </div>
</template>

  
<script>
  export default {
    name: 'SetAvailabilityPage',
    data() {
      return {
        availabilityMap: new Map(),
        selectedDates: new Set(),
        spot: {},
        userInfo: {},
        loading: true,
        availability: [],
        calendarDays: [],
        selectedMonth: new Date().getMonth(),
        selectedYear: new Date().getFullYear(),
        months: [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ],
        daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        error: '',
        success: ''
      };
    },
    computed: {
      isCurrentMonth() {
        const now = new Date(); // Get the current date
        // Check if the selected month and year match the current month and year
        return this.selectedMonth === now.getMonth() && this.selectedYear === now.getFullYear();
      }
    },
    mounted() {
      this.fetchUserData();
      this.fetchSpotDetails();
      this.fetchAvailability();
      this.generateCalendar();
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


      async fetchUserData() {
        const token = localStorage.getItem('authToken');
        if (token) {
          try { // Fetch user info from the backend
            const res = await fetch('http://localhost:3000/users/booking', {
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json(); // Parse the JSON response
            this.userInfo = data; // save user info to 'userInfo'
          } catch (err) {
            console.error('Error fetching user info:', err);
          }
        }
      },


      async fetchSpotDetails() {
        const spotId = this.$route.params.id; // Get the spot ID from the route parameters
        try {
          const res = await fetch(`http://localhost:3000/spots/${spotId}`);
          const data = await res.json(); // Parse the JSON response
          this.spot = data; // Store the spot details in the component's data
          this.loading = false; // Set loading to false after data is fetched
        }catch (err) {
          console.error('Error fetching spot details:', err);
          this.loading = false;
        }
      },
      async fetchAvailability() {
        const spotId = this.$route.params.id; // Get the spot ID from the route parameters
        const res = await fetch(`http://localhost:3000/availability/${spotId}`);
        const data = await res.json(); // Parse the JSON response

        this.availability = data.map(a => ({
          Date: a.Date.split('T')[0], //split to get only the date part
          isAvailable: a.IsAvailable
      }));

      // Create the map to check availability by date
      this.availabilityMap = new Map(
        this.availability.map(a => [a.Date, { isAvailable: a.isAvailable }])
      );
    },

      generateCalendar() {
        const days = []; // Array to hold the calendar days
        const year = this.selectedYear; // Get the selected year
        const month = this.selectedMonth; // Get the selected month 
  
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay();
  
        //fill days before the first day of the month with null
        for (let i = 0; i < startDay; i++) {
          days.push(null);
        }
  
        for (let day = 1; day <= lastDay.getDate(); day++) {
          const paddedMonth = (month + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1
          const paddedDay = day.toString().padStart(2, '0'); 
          const isoDate = `${year}-${paddedMonth}-${paddedDay}`;
          days.push(isoDate);
        }
  
        this.calendarDays = days;
      },


      getDateClass(date) {
        if (!date || isNaN(new Date(date))) return 'empty';

        const entry = this.availabilityMap.get(date);
        let cls;

        if (!entry) {
          cls = 'unset';
        } else if (!entry.isAvailable) {
          cls = 'unavailable';
        } else {
          cls = 'available';
        }

        // Highlight currently selected cells
        if (this.selectedDates.has(date)) {
          cls += ' selected';
        }

      return cls;
    },


    toggleAvailability(date) {
      if (!date) return;

      if (this.selectedDates.has(date)) {
        this.selectedDates.delete(date);
      } else {
        this.selectedDates.add(date);
      }
    },


    async applyAvailability(isAvailable) {
      if (this.selectedDates.size === 0) return;

      const spotId = this.$route.params.id; // Get the spot ID from the route parameters
      const token = localStorage.getItem('authToken');

      // Convert selected dates into an array
      const updates = Array.from(this.selectedDates).map(date => ({
        Date: date,
        IsAvailable: isAvailable
      }));

      try {
        const res = await fetch(`http://localhost:3000/availability/${spotId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json' ,
            'Authorization': `Bearer ${token}` 
        },
          body: JSON.stringify({ updates }) // Send the updates as JSON
        });

        if (!res.ok) {
          const result = await res.json(); // Parse the JSON response
          this.error = result.error || 'Failed to update availability.';
        } else {
          this.success = `Marked ${updates.length} date(s) as ${isAvailable ? 'available' : 'unavailable'}.`;
          this.error = '';
          this.selectedDates.clear();  // Clear selection
          await this.fetchAvailability(); // Refresh data
        }
      } catch (err) {
        this.error = 'Server error while updating availability.';
        console.error(err);
      }}}
    };
  </script>
  
  

  
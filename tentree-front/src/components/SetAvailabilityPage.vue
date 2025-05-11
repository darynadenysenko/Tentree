<template>
    <div class="booking-page">
      <div v-if="loading" class="flex justify-center items-center h-screen">
        <p class="text-2xl font-semibold">Loading...</p>
      </div>
  
      <div v-else>
        <h1>{{ spot.Name }}</h1>
        <h2>{{ spot.city.country.Name }}, {{ spot.city.Name }}, {{ spot.Street }}</h2>
        <h3>Price per night: ${{ spot.Price }}</h3>
  
        <!-- Calendar Navigation -->
        <div class="flex justify-between items-center mb-4">
          <button @click="changeMonth(-1)" :disabled="isCurrentMonth" :class="{ disabled: isCurrentMonth }">←</button>
          <h2>{{ months[selectedMonth] }} {{ selectedYear }}</h2>
          <button @click="changeMonth(1)">→</button>
        </div>
  
        <!-- Calendar Grid -->
        <div class="calendar">
          <div class="day-name" v-for="d in daysOfWeek" :key="d">{{ d }}</div>
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="calendar-cell"
            :class="getDateClass(day)"
            @click="toggleAvailability(day)"
          >
          <span v-if="day && !isNaN(new Date(day))">{{ new Date(day).getDate() }}</span>

          </div>
        </div>
  
        <!-- Legend -->
        <div class="legend">
  <div><span class="legend-box available"></span> Available</div>
  <div><span class="legend-box unavailable"></span> Unavailable</div>
  <div><span class="legend-box unset"></span> Unset (Not in DB)</div>
  <div><span class="legend-box selected"></span> Modified</div>
</div>

  
    <div class="flex gap-4 mb-4">
    <button @click="applyAvailability(true)">Set Available</button>
    <button @click="applyAvailability(false)">Set Unavailable</button>
    </div>

  
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>
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
        years: [2024, 2025, 2026],
        daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        error: '',
        success: '',
        modifiedAvailability: new Set(),
      };
    },
    computed: {
      isCurrentMonth() {
        const now = new Date();
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
          try {
            const res = await fetch('http://localhost:3000/users/booking', {
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            this.userInfo = data;
          } catch (err) {
            console.error('Error fetching user info:', err);
          }
        }
      },
      async fetchSpotDetails() {
        const spotId = this.$route.params.id;
        try {
          const res = await fetch(`http://localhost:3000/spots/${spotId}`);
          const data = await res.json();
          this.spot = data;
          this.loading = false;
  
          
          
        } catch (err) {
          console.error('Error fetching spot details:', err);
          this.loading = false;
        }
      },
      async fetchAvailability() {
  const spotId = this.$route.params.id;
  const res = await fetch(`http://localhost:3000/availability/${spotId}`);
  const data = await res.json();

  this.availability = data.map(a => ({
    Date: a.Date.split('T')[0],
    isAvailable: a.IsAvailable
  }));

  // ✅ Create the map from availability
  this.availabilityMap = new Map(
    this.availability.map(a => [a.Date, { isAvailable: a.isAvailable }])
  );
},

      generateCalendar() {
        const days = [];
        const year = this.selectedYear;
        const month = this.selectedMonth;
  
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay();
  
        for (let i = 0; i < startDay; i++) {
          days.push(null);
        }
  
        for (let day = 1; day <= lastDay.getDate(); day++) {
          const paddedMonth = (month + 1).toString().padStart(2, '0');
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

  // ✅ Highlight currently selected cells
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

  const spotId = this.$route.params.id;
  const token = localStorage.getItem('authToken');

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
      body: JSON.stringify({ updates })
    });

    if (!res.ok) {
      const result = await res.json();
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
  
  <style scoped>
  .booking-page {
    padding: 2rem;
    max-width: 700px;
    margin: 0 auto;
    background-color: #f4f9f4;
    border-radius: 12px;
  }
  .unset {
  background-color: #ffcc00;
  color: black;
  cursor: pointer;
}

.unset.legend-box {
  background-color: #ffcc00;
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
    background-color: #a3d977;
    color: white;
  }
  
  .booked {
    background-color: #f84e4e;
    color: white;
    cursor: pointer;
  }
  
  .selected {
    outline: 2px solid #000;
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
    background-color: #2f5e1a;
  }
  
  .booked.legend-box {
    background-color: #f84e4e;
  }
  
  .selected.legend-box {
    background-color: #000;
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
  
  button.disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .error {
    color: red;
  }
  
  .success {
    color: green;
  }
  </style>
  
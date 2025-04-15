<template>
    <div  class="min-h-screen bg-[#F8F1E5]">
        <div class="flex justify-between items-center py-4 px-4">
            <!-- Greeting -->
            <h1 class="text-poppins font-bold text-3xl">Hi {{ userInfo.firstName }}!</h1>
            
            <!-- Profile icon -->
            <div class="flex justify-center items-center w-16 h-16 rounded-full border-2 border-black text-black cursor-pointer hover:bg-gray-200" @click="goToProfile">
                <i class="fas fa-user text-3xl"></i>
            </div>
        </div>
    </div>

    
</template>
  
<script>
  export default {
    data() {
      return {
        userInfo: {},  // Define userInfo here
      };
    },
    mounted() {
      const token = localStorage.getItem('authToken');  // Get token from localStorage
      
      if (token) {
        fetch('http://localhost:3000/users/home', {  // The /home endpoint
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
        goToProfile() {
            this.$router.push('/profile');  
        }
    }
  };
</script>
  
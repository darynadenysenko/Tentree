<template>
    <!-- Background -->
    <div class="min-h-screen bg-cover bg-center flex justify-center items-center" :style="{ backgroundImage: 'url(' + require('@/assets/Registration.png') + ')' }">
        <!--Login form container-->
        <div class="bg-[#FBF5E9] p-8 rounded-lg max-w-md w-full">
            <!-- Title -->
            <h2 class="text-poppins text-4xl font-medium  text-[#2C3B22]">Sign Up</h2>
            <p class="text-poppins text-black mt-2">Start your adventure.</p>

            <!-- Registration Form -->
        <form class="mt-8 space-y-4">
                <!-- First Name -->
                <div>
                    <input type="text" id="firstName" name="firstName" required placeholder="First Name" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500">
                </div>

                <!-- Last Name -->
                <div>
                    <input type="text" id="lastName" name="lastName" required placeholder="Last Name" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500">
                </div>
                <!-- Email Address -->
                <div>
                    <input type="email" id="email" name="email" required placeholder="Email" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md  focus:ring-green-500 focus:border-green-500">
                </div>

                <!-- Password -->
                <div>
                    <input type="password" id="password" name="password" required placeholder="Password" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500">
                </div>
                
                <div>
                    <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="Confirm Password" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500">
                </div>

                <!-- Sign Up Button -->
                <div>
                    <button @click="goToHomePage" type="submit" class="w-full py-2 px-4 bg-[#16461A] text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                        Log In
                    </button>
                </div>

                <!-- Sign Up Link -->
                <div class="mt-4 text-center">
                    <p class="text-sm text-black">
                        Already have have an account? 
                        <a @click="goToLogin" href="#" class="text-black hover:text-green-700"> 
                            <u>
                                Log in
                            </u>
                        </a>
                    </p>
                </div>
            </form>
        </div>        
    </div>
</template>
<script>
export default {
    name: 'RegistrationPage',
    methods: {      
      goToHomePage() {
        this.$router.push('/home');  
      },
      goToLogin() {
        this.$router.push('/login');  
      },
    }
  };
</script>
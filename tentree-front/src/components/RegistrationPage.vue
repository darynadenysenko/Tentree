<template>
    <!-- Background -->
    <div class="min-h-screen bg-cover bg-center flex justify-center items-center" :style="{ backgroundImage: 'url(' + require('@/assets/Registration.png') + ')' }">
        <!--Login form container-->
        <div class="bg-[#FBF5E9] p-8 rounded-lg max-w-md w-full">
            <!-- Title -->
            <h2 class="text-poppins text-4xl font-medium  text-[#2C3B22]">Sign Up</h2>
            <p class="text-poppins text-black mt-2">Start your adventure.</p>

            <!-- Registration Form -->
        <form @submit.prevent="submitForm" class="mt-8 space-y-4">
                <div v-if="errorMessage" class="text-red-600 text-sm mt-2">
                    {{ errorMessage }}
                </div>
                <!-- First Name -->
                <div>
                    <input type="text" v-model="firstName" name="FirstName" required placeholder="First Name" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md">
                </div>

                <!-- Last Name -->
                <div>
                    <input type="text" v-model="lastName" name="LastName" required placeholder="Last Name" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md">
                </div>
                <!-- Email Address -->
                <div>
                    <input type="email" v-model="email" name="Email" required placeholder="Email" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md ">
                </div>

                <!-- Password -->
                <div>
                    <input type="password" v-model="password" name="Password" required placeholder="Password" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md">
                </div>
                
                <div>
                    <input type="password" v-model="confirmPassword" name="confirmPassword" required placeholder="Confirm Password" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md">
                </div>

                <!-- Sign Up Button -->
                <div>
                    <button type="submit" :disabled="isSubmitting" class="w-full py-2 px-4 bg-[#16461A] text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                        Sign Up
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
    data() {
        return {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        errorMessage: '',
        isSubmitting: false,  // For disabling the button after submission
        };
    },
    methods: {     
        submitForm() {
            console.log("Submit button clicked");
        // Clear any previous error message
        this.errorMessage = '';

        // Check if all fields are filled
        if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
            this.errorMessage = 'All fields are required!';
            return;
        }

        // Check if the email is valid
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(this.email)) {
            this.errorMessage = 'Please enter a valid email address!';
            return;
        }

        // Validate Password
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordPattern.test(this.password)) {
            this.errorMessage = 'Password must be at least 8 characters long, contain numbers, at least 1 uppercase and lowercase letter.';
            return;
        }

        // Check if the passwords match
        if (this.password !== this.confirmPassword) {
            this.errorMessage = 'Passwords do not match!';
            return;
        }

        this.isSubmitting = true;

          // Use fetch to send the data to the backend
        fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                FirstName: this.firstName,
                LastName: this.lastName,
                Email: this.email,
                Password: this.password,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    this.errorMessage = data.message || 'An error occurred. Please try again!';
                } else {
                    this.goToHomePage();  // Redirect to home page on success
                }

            })

        }, 
        goToHomePage() {
            this.$router.push('/home');  
        },
        goToLogin() {
            this.$router.push('/login');  
        },
    }
  };
</script>
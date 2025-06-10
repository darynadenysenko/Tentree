<template>
    <div class="min-h-screen flex items-center justify-center bg-[#F8F1E5]">
      <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4">Reset Your Password</h2>
  
        <div v-if="message" class="text-green-600 mb-4">{{ message }}</div>
        <div v-if="error" class="text-red-600 mb-4">{{ error }}</div>
  
        <form @submit.prevent="submitNewPassword">
          <input
            v-model="newPassword"
            type="password"
            placeholder="New Password"
            required
            class="w-full p-2 border border-gray-300 rounded mb-4"
          />
  
          <button
            type="submit"
            class="bg-[#2C3B22] text-white py-2 px-4 w-full rounded hover:bg-green-800"
          >
            Set New Password
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        newPassword: '',
        message: '',
        error: '',
      };
    },
    methods: {
      submitNewPassword() {
        const token = this.$route.query.token;

        fetch('http://localhost:3000/auth/resetpassword', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ // Send the token and new password to the backend
            token: token,
            newPassword: this.newPassword,
          }),
        })
          .then((res) => res.json()) // Parse the JSON response
          .then((data) => {
            if (data.error) {
              this.error = data.error;
              this.message = '';
            } else {
              // success message before redirect
              this.message = 'Password reset successfully! Redirecting to login...';
              this.error = '';

              // Wait 2 seconds, then redirect to login
              setTimeout(() => {
                this.$router.push('/login');
              }, 2000);
            }
          })
          .catch(() => {
            this.error = 'Something went wrong.';
          });
      },
    },
  };
  </script>
  
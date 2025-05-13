<template>
    <div class="min-h-screen flex items-center justify-center bg-[#F8F1E5]">
      <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4">Forgot Password</h2>
        <p class="text-gray-600 mb-4">Enter your email to receive a reset link.</p>
  
        <div v-if="message" class="text-green-600 mb-4">{{ message }}</div>
        <div v-if="error" class="text-red-600 mb-4">{{ error }}</div>
  
        <form @submit.prevent="submitEmail">
          <input
            v-model="email"
            type="email"
            required
            placeholder="Email"
            class="w-full p-2 border border-gray-300 rounded mb-4"
          />
  
          <button
            type="submit"
            class="bg-[#2C3B22] text-white py-2 px-4 w-full rounded hover:bg-green-800"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        message: '',
        error: ''
      };
    },
    methods: {
      submitEmail() {
        fetch('http://localhost:3000/auth/forgotpassword', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email })
        })
          .then(res => res.json())
          .then(data => {
            if (data.error) {
              this.error = data.error;
              this.message = '';
            } else {
              this.message = 'If the email exists, a reset link has been sent.';
              this.error = '';
            }
          })
          .catch(() => {
            this.error = 'Something went wrong.';
          });
      }
    }
  };
  </script>
  
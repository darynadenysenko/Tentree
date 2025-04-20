<template>
        <div class="min-h-screen bg-[#F8F1E5]">
            <div class="flex justify-between items-center py-4 px-4">
                <!-- My Profile -->
                <h1 class="text-poppins font-bold text-3xl text-[#2C3B22]">Edit Profile</h1>
                
                <!-- Logo -->
                <div class="flex items-center">
                    <img src="../assets/logo.png" alt="Logo" class="w-[80px] h-[80px] object-contain"/> 
                </div>
            </div>   
            
            <!-- Profile Icon & Name -->
            <div class="h-[100px] mr-5 ml-5 rounded-lg flex items-center bg-[#FCF6ED]">
                <div class=" ml-4 mr-4 w-16 h-16 rounded-full border-2 border-black flex justify-center items-center">
                    <i class="fas fa-user text-2xl text-black"></i>
                </div>
                <div class="ml-4">
                    <h2 class="text-2xl font-bold">{{ userInfo.firstName }} {{ userInfo.lastName }}</h2>
                    <p class="text-gray-600">{{ userInfo.email }}</p>
                </div>
            </div>

            <!-- Profile Edit Form -->
            <div class="flex gap-3 p-6">

                <!-- Personal Information Form -->
                <div class="flex-1 bg-[#FCF6ED] p-6 rounded-lg">
                <h3 class="text-xl font-semibold">Personal Information</h3>
                <form @submit.prevent="saveChanges">
                    <div class="mt-4">
                        <label for="firstName" class="block text-lg font-medium">First Name</label>
                        <input v-model="firstName" type="text" id="firstName" class="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div class="mt-4">
                        <label for="lastName" class="block text-lg font-medium">Last Name</label>
                        <input v-model="lastName" type="text" id="lastName" class="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div class="mt-4">
                        <label for="email" class="block text-lg font-medium">Email Address</label>
                        <input v-model="email" type="email" id="email" class="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    <button type="submit" class="bg-[#2C3B22] text-white px-4 py-2 rounded-md mt-6 hover:bg-green-800">
                        Save Changes
                    </button>
                </form>
                </div>

                <!-- Password Update Form -->
                <div class="flex-1 bg-[#FCF6ED] p-6 rounded-lg">
                <h3 class="text-xl font-semibold">Password</h3>
                <form @submit.prevent="updatePassword">
                    <div class="mt-4">
                        <label for="currentPassword" class="block text-lg font-medium">Current Password</label>
                        <input v-model="currentPassword" type="password" id="currentPassword" class="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div class="mt-4">
                        <label for="newPassword" class="block text-lg font-medium">New Password</label>
                        <input v-model="newPassword" type="password" id="newPassword" class="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div class="mt-4">
                        <label for="confirmPassword" class="block text-lg font-medium">Confirm Password</label>
                        <input v-model="confirmPassword" type="password" id="confirmPassword" class="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    <button type="submit" class="bg-[#2C3B22] text-white px-4 py-2 rounded-md mt-6 hover:bg-green-800">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    </div>

</template>
<script>
    export default
    {
        name: 'EditProfilePage',
        data() {
            return {
                userInfo: {},
                firstName: '',
                lastName: '',
                email: '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',  
            };
        },
        mounted(){
            this.fetchUserInfo();

            
        },
        methods: {
            updatePassword() {
            // Check if all fields are filled
            if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
                alert('Please fill out all fields.');
                return;  // Exit if any field is empty
            }


            // Check if new password is the same as the current password
            if (this.currentPassword === this.newPassword) {
                alert('New password cannot be the same as the current password.');
                return;  // Exit if new password is the same as the current password
            }

            // Check if new password and confirm password match
            if (this.newPassword !== this.confirmPassword) {
                alert('New password and confirm password do not match.');
                return;  // Exit if new password and confirm password don't match
            }

              // Password validation: Minimum 8 characters, must contain both uppercase, lowercase, and numbers
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

            if (!passwordPattern.test(this.newPassword)) {
            alert('Password must be at least 8 characters long and contain both uppercase and lowercase letters, as well as numbers.');
            return;  // Exit if password does not meet the required format
            }

            // Send request to backend to update the password
            fetch('http://localhost:3000/users/update-password', {
                method: 'PATCH',
                headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                currentPassword: this.currentPassword,
                newPassword: this.newPassword,
                }),
            })
                .then(response => response.json())
                .then(data => {
                if (data.error) {
                    console.error(data.error);
                    alert(data.error);    
                } else {
                    alert('Password updated successfully!');
                    this.currentPassword = '';
                    this.newPassword = '';
                    this.confirmPassword = '';
                }
                })
                .catch(error => {
                console.error('Error updating password:', error);
                });
            },
            saveChanges() {
                const updatedData = {};  // Object to hold the updated fields

                // Check if fields are not empty and include them in the updatedData
                if (this.firstName && this.firstName !== this.userInfo.firstName) {
                    updatedData.firstName = this.firstName;
                }
                if (this.lastName && this.lastName !== this.userInfo.lastName) {
                    updatedData.lastName = this.lastName;
                }
                if (this.email && this.email !== this.userInfo.email) {
                    updatedData.email = this.email;
                }

                // Ensure there's at least one field to update
                if (Object.keys(updatedData).length === 0) {
                    alert('No changes made.');
                    return;  // Don't send the request if nothing changed
                }

                // Send the request to update the profile
                fetch('http://localhost:3000/users/profile', {
                    method: 'PATCH',  // Using PATCH for partial updates
                    headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData),  // Only send the changed fields
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                    console.error(data.error);
                    } else {
                    this.userInfo = data;  // Update user info after saving
                    alert('Profile updated successfully!');
                    this.firstName = '';
                    this.lastName = '';
                    this.email = '';
                    }
                })
                .catch(error => {
                    console.error('Error saving profile:', error);
                });
            },


            fetchUserInfo (){
                const token = localStorage.getItem('authToken');  // Get token from localStorage
      
                if (token) {
                fetch('http://localhost:3000/users/profile', {  
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

            }
            
        }       
    

    }



</script>

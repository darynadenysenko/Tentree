<template>
    <div  class="min-h-screen bg-[#F8F1E5]">
        <h1 class="px-2 pt-3 text-3xl font-bold mb-4">Manage Photos</h1>
    
        <!-- Display existing photos -->
        <div class="ml-3 flex flex-wrap gap-4">
            <div v-for="photo in photos" :key="photo.ID" class="flex items-center space-x-4">
                <img :src="photo.URL" alt="Spot Photo" class="w-48 h-48 object-contain rounded-md" />
                <!-- Delete Button -->
                <button @click="deletePhoto(photo.ID)" class="bg-red-500 text-white rounded-full p-1">
                <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>

        <!-- Add Photo Form -->
        <div class="mt-6">
            <h2 class="text-xl font-semibold mb-4">Add New Photo</h2>
            <input type="file" @change="handleFileChange"  ref="fileInput"  class="block mb-4" />
            <button @click="uploadPhoto" class="bg-[#2C3B22] text-white px-4 py-2 rounded-md hover:bg-green-800">
                Upload Photo
            </button>
        </div>

    </div>

</template>
<script>
export default({
    name: 'PhotosPage',
    data() {
        return {
            spotId: this.$route.params.id, // Get the 'id' from the route parameters
            spotName: '', // store the name of the spot
            photos: [], // store the photos for the selected spot
            loading: true, // indicate if the data is still being fetched
            selectedFile: null,  //hold the selected file for upload
        }        
    },
    mounted() {
       
        this.fetchPhotos();
    },
    methods: {
        fetchPhotos() {
            fetch(`http://localhost:3000/spotphotos/${this.spotId}`) // Fetch photos for the specific spot
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
                this.photos = data; // Store the fetched photos in the component's data
                this.loading = false; // Set loading to false after data is fetched
            })
            .catch(error => {
                console.error('Error fetching photos:', error);
                this.loading = false; // Set loading to false even if there's an error
            });
        },
         // Handle file input change (photo upload)
        handleFileChange(event) {
            this.selectedFile = event.target.files[0];  // Store the selected file
        },
    
        // Upload the selected photo
        uploadPhoto() {
            if (!this.selectedFile) {
                alert('Please select a photo to upload.');
                return;
            }
            
            const formData = new FormData(); //to handle file uploads
            formData.append('photo', this.selectedFile);  // Add the photo to the form data
            
            fetch(`http://localhost:3000/spotphotos/upload/${this.spotId}`, {
                method: 'POST',
                headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Add the auth token 
                },
                body: formData,  // Send the file as form data
            })
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
                this.photos.push(data);  // Add the new photo to the photos array
                this.selectedFile = null;  // Clear the selected file input
                this.$refs.fileInput.value = null; // Reset the file input field to null

            })
            .catch(error => {
                console.error('Error uploading photo:', error);
            });
        },
    
        // Delete a photo
        deletePhoto(photoId) {
            fetch(`http://localhost:3000/spotphotos/${photoId}`, {
                method: 'DELETE',
                headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            })
            .then(() => {
                // Remove the photo from the array after successful deletion
                this.photos = this.photos.filter(photo => photo.ID !== photoId);
            })
            .catch(error => {
                console.error('Error deleting photo:', error);
            });
        },

    },
});
</script>

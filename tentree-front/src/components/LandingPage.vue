<template>
    <div  class="min-h-screen bg-[#F8F1E5]"> 

        <!--Top line with logo and buttons-->
        <div class="flex items-center justify-between border-t-2 border-[#D1C7B7] py-1 px-3">

            <!-- Logo Section (Left side) -->
            <div class="flex items-center">
                <img src="../assets/logo.png" alt="Logo" class="w-[80px] h-[80px] object-contain"/> 
            </div>

            <!-- Buttons Section (Right side) -->
            <div class="flex space-x-[10px]">
                <button class="font-poppins font-semibold px-4 py-1 border border-black text-black bg-transparent hover:bg-[#7D6E47] rounded-[4px]">
                Find a Spot
                </button>
                <button class="font-poppins font-semibold px-4 py-1 bg-[#2C3B22] text-white hover:bg-[#7D6E47] rounded-[4px] h-[40px]">
                List Your Spot
                </button>
            </div>
        </div>

        <!--Image section-->
        <img
            src="../assets/LandingPage.png"  
            alt="Hero Image"
            class="w-full h-auto object-contain" 
        />

        <!-- Text Section -->
        <div class="absolute top-[155px] left-10 text-left">
            <h1 class="text-6xl font-poppins font-bold text-white leading-tight">
                Epic Spots.<br />
                Zero Hassle.
            </h1>
        </div>
    </div>
</template>

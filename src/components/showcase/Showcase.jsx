import React from 'react'
import bowGif from '../../assets/gif-one.gif'

const Showcase = () => {
  return (
    <>
    <section class="bg-[#F0EBE3] py-12 px-6">
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
    
    {/* <!-- Left: Product Image --> */}
    <div class="flex justify-center">
      <div class="border-4 border-[#12492f] rounded-full p-0">
        <img src={bowGif} alt="ARPA Scrunchie" class="w-64 h-64 object-contain rounded-full" />
      </div>
    </div>

    {/* <!-- Right: Text & Suggestion Form --> */}
    <div class="text-center md:text-left">
      <h2 class="text-2xl md:text-3xl font-bold text-[#000000] mb-4">
        "Transform Your Hair with ARPA's Gorgeous Scrunchies!"
      </h2>
      <p class=" mb-2 text-[#000000]">
        Join 1000+ Happy Customers! We've sold over 1000 scrunchies in just the last month.
      </p>
      <p class="font-semibold text-[#000000] mb-2">
        "Thank you for your Trust and Support!"
      </p>
      <p class="mb-2 text-[#000000] ">
        "Have an Idea? We Love to Listen!"
      </p>
      <p class="font-bold text-[#000000] mb-6">
        Drop Your Suggestion and Help Us Grow!
      </p>

      {/* <!-- Suggestion Input --> */}
      <form class="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
        <input 
          type="text" 
          placeholder="Drop your suggestion here!" 
          class="w-full sm:w-auto flex-1 px-4 py-3 rounded-lg border border-[#F3D0D7] focus:outline-none focus:ring-2 focus:ring-[#F3D0D7]"
        />
        <button 
          type="submit" 
          class="flex items-center gap-2 bg-[#F3D0D7] text-black px-5 py-3 rounded-lg hover:bg-[#ffb8c6] transition cursor-pointer"
        >
          Send 
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21l20.99-9L2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </form>
    </div>
  </div>
</section>

    </>
  )
}

export default Showcase

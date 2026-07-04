import logo from '../../assets/logo.png';

const About = () => {
  return (
    <>
    <section class="bg-[#F0EBE3] py-16 px-6">
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    
    {/* <!-- Left Side: Text --> */}
    <div class="text-center md:text-left">
      <h2 class="text-4xl font-bold text-[#00000] mb-6">About Us</h2>
      <p class="text-gray-800 mb-4">
        At <span class="font-bold text-[#00000]">ARPA Scrunchies</span>, 
        we believe in creating products that make you feel good and look even better.
      </p>
      <p class="text-gray-800 mb-4">
        With over <span class="font-semibold">1000 scrunchies sold last month</span>, our customers are at the heart of everything we do.
      </p>
      <p class="font-semibold text-[#00000] text-lg">
        "Your feedback and ideas help us grow and create the best for you!"
      </p>
    </div>

    {/* <!-- Right Side: Logo/Image --> */}
    <div class="flex justify-center">
      <div class="border-4 border-[#00000] rounded-full p-4 bg-[#F6F5F2] shadow-lg">
        <img src={logo} alt="ARPA Logo" class="w-64 h-64 object-contain rounded-full" />
      </div>
    </div>

  </div>
</section>

    </>
  )
}

export default About

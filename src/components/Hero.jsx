import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

const Hero = ({ onSearch }) => {
  const jokes = [
    { question: "Why don’t eggs tell jokes?", answer: "Because they’d crack each other up." },
    { question: "What did the lettuce say to the celery?", answer: '"Quit stalking me!"' },
    { question: "Why did the tomato blush?", answer: "Because it saw the salad dressing." },
    { question: "How do you fix a broken pizza?", answer: "With tomato paste." },
    { question: "What kind of nuts always seems to have a cold?", answer: "Cashews." },
    { question: "Why don’t chefs ever play cards?", answer: "Because they always cut the deck." },
    { question: "I told my wife she was drawing her eyebrows too high.", answer: "She looked surprised." },
    { question: "What’s a foodie’s favorite musical instrument?", answer: "The dinner bell." },
    { question: "Why did the grape stop in the middle of the road?", answer: "It ran out of juice." },
    { question: "What’s a skeleton’s least favorite room in the house?", answer: "The kitchen — no guts to enjoy the food!" }
  ];

  const [currentJoke, setCurrentJoke] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Cycle jokes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentJoke((prev) => (prev + 1) % jokes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [jokes.length]);

  // Handle search on typing with debounce
  const handleTyping = (value) => {
    setSearchTerm(value);
    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      if (value.trim()) onSearch(value);
    }, 500);
    setTypingTimeout(timeout);
  };

  // Handle search on Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      onSearch(searchTerm);
      if (typingTimeout) clearTimeout(typingTimeout);
    }
  };

  return (
    <section
      className="relative h-[50vh] w-full flex items-center justify-center text-center"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#FFF8F4] drop-shadow-lg">
          What&apos;s Cook&apos;in?
        </h1>

        {/* Joke Section */}
        <div className="mt-4 text-[#FFF8F4]">
          <h2 className="text-2xl md:text-3xl font-semibold">{jokes[currentJoke].question}</h2>
          <p className="mt-2 text-lg md:text-xl italic">{jokes[currentJoke].answer}</p>
        </div>

        {/* Search Bar */}
        <div className="mt-8 flex items-center justify-center">
          <div className="relative w-full max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
  value={searchTerm}
  onChange={(e) => handleTyping(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      onSearch(searchTerm);
      if (typingTimeout) clearTimeout(typingTimeout);
    }
  }}
  type="text"
  placeholder="Search recipes by name, ingredient, or cuisine..."
  className="w-full pl-10 pr-4 py-3 rounded-full bg-white/90 focus:outline-none 
             focus:ring-0 focus:shadow-[0_0_10px_4px_rgba(237,138,66,0.7)]
             focus:animate-pulse 
             transition-all duration-300
             shadow-lg"
/>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

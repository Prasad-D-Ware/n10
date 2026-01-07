
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import openaiIcon from "../assets/openai.svg";
import resendIcon from "../assets/resend.svg";
import solanaIcon from "../assets/solana.png";
import telegramIcon from "../assets/telegram.svg";
import whatsappIcon from "../assets/whatsapp.svg";
import { useIsMobile } from "@/hooks/use-mobile";

const Landing = () => {
  const isMobile = useIsMobile();
  const orbitRadius = isMobile ? 70 : 120;
  
  const supportedApps = [
    { name: "OpenAI", icon: openaiIcon, color: "bg-green-500" },
    { name: "Resend", icon: resendIcon, color: "bg-blue-500" },
    { name: "Solana", icon: solanaIcon, color: "bg-purple-500" },
    { name: "Telegram", icon: telegramIcon, color: "bg-cyan-500" },
    { name: "WhatsApp", icon: whatsappIcon, color: "bg-green-600" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, filter : "blur(10px)" },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6},
      filter: "blur(0px)"
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <div className="min-h-screen dark:from-gray-900 dark:via-orange-900 dark:to-orange-800 w-screen overflow-x-hidden">
      <motion.header 
        className="flex items-center justify-between p-4 sm:p-6 max-w-7xl mx-auto"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400 font-kode">N10</span>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-kode text-sm sm:text-base px-2 sm:px-4">
              Log In
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-kode text-sm sm:text-base px-3 sm:px-4">
              Join Now
            </Button>
          </Link>
        </div>
      </motion.header>

      <motion.main 
        className="flex flex-col md:flex-row items-center justify-center md:justify-between px-4 sm:px-6 py-8 sm:py-12 max-w-7xl mx-auto min-h-[70vh] md:h-[80vh] gap-6 md:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex-1 max-w-2xl w-full"
          variants={itemVariants}
        >
          <motion.h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold font-kode text-gray-900 dark:text-white leading-tight mb-6"
            variants={itemVariants}
          >
            {/* Top line: Unlock Powerful Automation */}
            {["Unlock", "Powerful", "Automation"].map((word, idx) => (
              <motion.span
                key={word}
                className="inline-block mr-2"
                initial={{ y: 20, opacity: 0 ,filter : "blur(10px)"}}
                animate={{ y: 0, opacity: 1 ,filter : "blur(0px)"}}
                transition={{ delay: 0.2 * idx, duration: 0.6 }}
              >
                {word}
              </motion.span>
            ))}
            {/* Middle line: You Thought Was Out of Reach, split into words and block */}
            <div className="block text-orange-500">
              {["Which","You", "Thought", "Was", "Out", "of", "Reach"].map((word, idx) => (
                <motion.span
                  key={word}
                  className="inline-block mr-2"
                  initial={{ y: 20, opacity: 0 ,filter : "blur(10px)"}}
                  animate={{ y: 0, opacity: 1 ,filter : "blur(0px)"}}
                  transition={{ delay: 0.7 + 0.1 * idx, duration: 0.6 }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
            {/* Last line: Now Just One Click Away! - split into words and block with own styles */}
            <div className="block text-lg sm:text-2xl md:text-3xl font-normal text-gray-600 dark:text-gray-300 mt-4">
              {["Now", "Just", "One", "Click", "Away!"].map((word, idx) => (
                <motion.span
                  key={word}
                  className="inline-block mr-2"
                  initial={{ y: 20, opacity: 0 ,filter : "blur(10px)"}}
                  animate={{ y: 0, opacity: 1 ,filter : "blur(0px)"}}
                  transition={{ delay: 1.4 + 0.1 * idx, duration: 0.6 }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </motion.h1>
          
          <motion.div 
            className="flex gap-4 mb-8"
            variants={itemVariants}
          >
            <Link to="/signup">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white font-kode">
                Start Project →
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero animation - visible on all screens */}
        <motion.div 
          className="flex-1 max-w-md md:max-w-2xl relative w-full"
          variants={itemVariants}
        >
          <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 flex items-center justify-center">
            {/* Central N10 ball - always visible */}
            <motion.div 
              className="absolute z-10 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-orange-500 rounded-full flex items-center justify-center shadow-2xl"
              variants={pulseVariants}
              animate="animate"
            >
              <span className="text-white font-bold text-lg sm:text-xl md:text-2xl font-kode">N10</span>
            </motion.div>

            {/* Orbiting circles - visible on all screens, scaled for mobile */}
            <motion.div 
              className="absolute w-28 sm:w-40 md:w-64 h-28 sm:h-40 md:h-64 border border-orange-300 dark:border-orange-600 rounded-full opacity-30"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute w-36 sm:w-52 md:w-80 h-36 sm:h-52 md:h-80 border border-orange-200 dark:border-orange-700 rounded-full opacity-20"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute w-44 sm:w-64 md:w-96 h-44 sm:h-64 md:h-96 border border-orange-100 dark:border-orange-800 rounded-full opacity-10"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />

            {/* App icons - visible on all screens, scaled for mobile */}
            {supportedApps.map((app, index) => {
              const angle = (index * 72) * (Math.PI / 180); // 72 degrees apart
              const x = Math.cos(angle) * orbitRadius;
              const y = Math.sin(angle) * orbitRadius;
              const offset = isMobile ? 18 : 28;
              
              return (
                <motion.div
                  key={app.name}
                  className="absolute w-9 h-9 sm:w-11 sm:h-11 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg flex items-center justify-center p-1 sm:p-1.5 md:p-2"
                  style={{
                    left: `calc(50% + ${x}px - ${offset}px)`,
                    top: `calc(50% + ${y}px - ${offset}px)`,
                  }}
                  variants={floatingVariants}
                  animate="animate"
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img 
                    src={app.icon} 
                    alt={app.name} 
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 object-contain"
                  />
                </motion.div>
              );
            })}

            <motion.div 
              className="absolute w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-orange-400 rounded-full opacity-60"
              style={{ left: '15%', top: '25%' }}
              animate={{ 
                y: [-10, 10, -10],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-orange-300 rounded-full opacity-50"
              style={{ right: '20%', top: '15%' }}
              animate={{ 
                y: [10, -10, 10],
                opacity: [0.2, 0.7, 0.2]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      </motion.main>

      {/* Footer with Partner Logos */}
      <motion.footer 
        className="relative sm:absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 w-full px-4 sm:px-0 sm:w-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 sm:space-x-8 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <span>Trusted by</span>
          <div className="flex items-center space-x-4 sm:space-x-6">
            {supportedApps.slice(0, 3).map((app) => (
              <motion.div 
                key={app.name}
                className="flex items-center space-x-1 sm:space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <img src={app.icon} alt={app.name} className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{app.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Landing;

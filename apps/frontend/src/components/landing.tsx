
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import openaiIcon from "../assets/openai.svg";
import resendIcon from "../assets/resend.svg";
import solanaIcon from "../assets/solana.png";
import telegramIcon from "../assets/telegram.svg";
import whatsappIcon from "../assets/whatsapp.svg";

const Landing = () => {
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
    <div className="min-h-screen  dark:from-gray-900 dark:via-orange-900 dark:to-orange-800 w-screen">
      <motion.header 
        className="flex items-center justify-between p-6 max-w-7xl mx-auto "
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-bold text-orange-600 dark:text-orange-400 font-kode">N10</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-kode">
              Log In
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-kode">
              Join Now
            </Button>
          </Link>
        </div>
      </motion.header>

      <motion.main 
        className="flex items-center justify-between px-6 py-12 max-w-7xl mx-auto h-[80vh]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex-1 max-w-2xl"
          variants={itemVariants}
        >
          <motion.h1 
            className="text-5xl font-bold font-kode text-gray-900 dark:text-white leading-tight mb-6"
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
            <div className="block text-2xl md:text-3xl font-normal text-gray-600 dark:text-gray-300 mt-4">
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
            className="flex flex-col sm:flex-row gap-4 mb-8"
            variants={itemVariants}
          >
            <Link to="/signup">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white font-kode w-full sm:w-auto">
                Start Project →
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className="flex-1 max-w-2xl relative"
          variants={itemVariants}
        >
          <div className="relative w-full h-96 flex items-center justify-center">
            <motion.div 
              className="absolute z-10 w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center shadow-2xl"
              variants={pulseVariants}
              animate="animate"
            >
              <span className="text-white font-bold text-2xl font-kode">N10</span>
            </motion.div>

            <motion.div 
              className="absolute w-64 h-64 border border-orange-300 dark:border-orange-600 rounded-full opacity-30"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute w-80 h-80 border border-orange-200 dark:border-orange-700 rounded-full opacity-20"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute w-96 h-96 border border-orange-100 dark:border-orange-800 rounded-full opacity-10"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />

            {supportedApps.map((app, index) => {
              const angle = (index * 72) * (Math.PI / 180); // 72 degrees apart
              const radius = 120;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <motion.div
                  key={app.name}
                  className="absolute w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center p-2"
                  style={{
                    left: `calc(50% + ${x}px - 32px)`,
                    top: `calc(50% + ${y}px - 32px)`,
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
                    className="w-8 h-8 object-contain"
                  />
                </motion.div>
              );
            })}

            <motion.div 
              className="absolute w-4 h-4 bg-orange-400 rounded-full opacity-60"
              style={{ left: '20%', top: '30%' }}
              animate={{ 
                y: [-20, 20, -20],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute w-3 h-3 bg-orange-300 rounded-full opacity-50"
              style={{ right: '25%', top: '20%' }}
              animate={{ 
                y: [20, -20, 20],
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
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <div className="flex items-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
          <span>Trusted by</span>
          <div className="flex items-center space-x-6">
            {supportedApps.slice(0, 3).map((app) => (
              <motion.div 
                key={app.name}
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <img src={app.icon} alt={app.name} className="w-5 h-5" />
                <span>{app.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Landing;

import { Terminal, Github, Linkedin, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "../ui/Button"

export const Header = () => (
  <motion.header
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10"
  >
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <Terminal className="w-6 h-6" />
        </motion.div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Philani Mhlongo
          </h1>
          <p className="text-sm text-slate-400">DevOps Engineer</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm">
          <a href="https://github.com/PhilaniMhlongo" target="_blank" rel="noopener noreferrer">
            <Github className="w-4 h-4" />
          </a>
        </Button>
        <Button variant="ghost" size="sm">
          <a href="https://linkedin.com/in/philani-mhlongo-720382131/" target="_blank" rel="noopener noreferrer">
            <Linkedin className="w-4 h-4" />
          </a>
        </Button>
        <Button variant="ghost" size="sm">
          <a href="mailto:mhlongophilani04@gmail.com">
            <Mail className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </div>
  </motion.header>
)

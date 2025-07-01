import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Checkbox = ({
  checked = false,
  onChange,
  disabled = false,
  size = 'medium',
  className = ''
}) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  }

  return (
    <motion.button
      type="button"
      onClick={() => !disabled && onChange?.(!checked)}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      className={`
        ${sizes[size]}
        rounded-md border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
        ${checked
          ? 'bg-gradient-to-br from-primary to-secondary border-primary text-white shadow-lg'
          : 'border-gray-300 hover:border-primary bg-white'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <ApperIcon 
            name="Check" 
            size={size === 'small' ? 12 : size === 'medium' ? 14 : 16}
            className="text-white"
          />
        </motion.div>
      )}
    </motion.button>
  )
}

export default Checkbox
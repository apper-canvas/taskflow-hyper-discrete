import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const CategoryItem = ({
  category,
  isActive = false,
  taskCount = 0,
  onClick,
  className = ''
}) => {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(category)}
      className={`
        w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 group
        ${isActive 
          ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20' 
          : 'hover:bg-gray-50 text-gray-700'
        }
        ${className}
      `}
    >
      <div className="flex items-center space-x-3">
        <div 
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: category.color }}
        />
        <div className="flex items-center space-x-2">
          <ApperIcon 
            name={category.icon} 
            size={16} 
            className={isActive ? 'text-primary' : 'text-gray-500 group-hover:text-primary'}
          />
          <span className="font-medium truncate">{category.name}</span>
        </div>
      </div>
      
      {taskCount > 0 && (
        <span className={`
          px-2 py-1 text-xs font-medium rounded-full
          ${isActive 
            ? 'bg-primary text-white' 
            : 'bg-gray-200 text-gray-600 group-hover:bg-primary group-hover:text-white'
          }
        `}>
          {taskCount}
        </span>
      )}
    </motion.button>
  )
}

export default CategoryItem
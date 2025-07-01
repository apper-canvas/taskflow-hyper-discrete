import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Empty = ({ 
  title = 'No items found',
  description = 'Get started by adding your first item',
  icon = 'CheckSquare',
  actionText = 'Add Item',
  onAction,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`card p-12 text-center ${className}`}
    >
      <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name={icon} className="h-12 w-12 text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {description}
      </p>
      
      {onAction && (
        <Button onClick={onAction} className="inline-flex items-center">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {actionText}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty
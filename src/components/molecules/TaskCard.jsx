import { motion } from 'framer-motion'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Checkbox from '@/components/atoms/Checkbox'
import Badge from '@/components/atoms/Badge'

const TaskCard = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  className = ''
}) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-accent'
      case 'medium': return 'border-warning'
      case 'low': return 'border-success'
      default: return 'border-gray-200'
    }
  }

  const formatDueDate = (date) => {
    if (!date) return null
    
    const taskDate = new Date(date)
    if (isToday(taskDate)) return 'Today'
    if (isTomorrow(taskDate)) return 'Tomorrow'
    if (isPast(taskDate)) return `Overdue - ${format(taskDate, 'MMM d')}`
    return format(taskDate, 'MMM d')
  }

  const isDueToday = task.dueDate && isToday(new Date(task.dueDate))
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !task.completed

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`
        card p-4 cursor-pointer border-l-4 ${getPriorityColor(task.priority)}
        ${task.completed ? 'opacity-75' : ''}
        ${isOverdue ? 'bg-red-50 border-l-accent' : ''}
        ${className}
      `}
      onClick={() => onEdit?.(task)}
    >
      <div className="flex items-start space-x-3">
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={task.completed}
            onChange={() => onToggleComplete?.(task)}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-medium text-gray-900 truncate ${task.completed ? 'line-through' : ''}`}>
              {task.title}
            </h3>
            <div className="flex items-center space-x-2">
              {task.priority && (
                <Badge variant={task.priority} size="small">
                  {task.priority}
                </Badge>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete?.(task)
                }}
                className="text-gray-400 hover:text-error transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
              >
                <ApperIcon name="Trash2" size={16} />
              </button>
            </div>
          </div>

          {task.description && (
            <p className={`text-sm text-gray-600 mb-2 line-clamp-2 ${task.completed ? 'line-through' : ''}`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {task.dueDate && (
                <div className={`flex items-center space-x-1 text-sm ${
                  isOverdue ? 'text-error' : isDueToday ? 'text-warning' : 'text-gray-500'
                }`}>
                  <ApperIcon name="Calendar" size={14} />
                  <span>{formatDueDate(task.dueDate)}</span>
                </div>
              )}
              {task.category && (
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: task.category.color }}
                  />
                  <span>{task.category.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskCard
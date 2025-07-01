import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const QuickAddTask = ({ onAddTask, categories = [], className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('medium')
  const [categoryId, setCategoryId] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null,
      priority,
      categoryId: categoryId || null,
      completed: false
    }

    onAddTask?.(newTask)
    
    // Reset form
    setTitle('')
    setDescription('')
    setDueDate('')
    setPriority('medium')
    setCategoryId('')
    setIsExpanded(false)
  }

  const handleCancel = () => {
    setTitle('')
    setDescription('')
    setDueDate('')
    setPriority('medium')
    setCategoryId('')
    setIsExpanded(false)
  }

  return (
    <div className={`card p-4 ${className}`}>
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center space-x-3 text-left text-gray-500 hover:text-primary transition-colors duration-200"
        >
          <ApperIcon name="Plus" className="h-5 w-5 flex-shrink-0" />
          <span>Add a new task...</span>
        </button>
      ) : (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            autoFocus
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="input-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <Input
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {categories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="input-field"
              >
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.Id} value={category.Id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Input
            label="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details..."
          />

          <div className="flex space-x-3">
            <Button type="submit" className="flex-1">
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add Task
            </Button>
            <Button type="button" variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </motion.form>
      )}
    </div>
  )
}

export default QuickAddTask
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import SearchBar from '@/components/molecules/SearchBar'
import ProgressRing from '@/components/molecules/ProgressRing'
import Button from '@/components/atoms/Button'
import { taskService } from '@/services/api/taskService'

const Header = ({ 
  onSearch, 
  onAddTask,
  className = '' 
}) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const loadTasks = async () => {
    try {
      setLoading(true)
      const data = await taskService.getAll()
      setTasks(data)
    } catch (err) {
      console.error('Error loading tasks for header:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const getProgress = () => {
    if (tasks.length === 0) return 0
    const completedTasks = tasks.filter(task => task.completed).length
    return (completedTasks / tasks.length) * 100
  }

  const getTaskCounts = () => {
    const total = tasks.length
    const completed = tasks.filter(task => task.completed).length
    const pending = total - completed
    
    return { total, completed, pending }
  }

  const taskCounts = getTaskCounts()
  const progress = getProgress()

return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`bg-white border-b border-gray-200 ${className}`}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Search and stats */}
          <div className="flex items-center space-x-6 flex-1">
            <div className="max-w-md flex-1">
              <SearchBar
                onSearch={onSearch}
                placeholder="Search tasks..."
              />
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {taskCounts.total}
                </div>
                <div className="text-sm text-gray-500">Total Tasks</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {taskCounts.completed}
                </div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">
                  {taskCounts.pending}
                </div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
            </div>
          </div>

          {/* Right side - Progress and add button */}
          <div className="flex items-center space-x-4">
            {!loading && (
              <div className="hidden md:flex items-center space-x-3">
                <ProgressRing progress={progress} size={50} />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Daily Progress
                  </div>
                  <div className="text-xs text-gray-500">
                    {taskCounts.completed} of {taskCounts.total} tasks
                  </div>
                </div>
              </div>
            )}
            
            <Button onClick={onAddTask} className="flex items-center space-x-2">
              <ApperIcon name="Plus" size={16} />
              <span className="hidden sm:inline">Add Task</span>
            </Button>
          </div>
        </div>

        {/* Mobile stats */}
        <div className="md:hidden mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {taskCounts.total}
              </div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-primary">
                {taskCounts.completed}
              </div>
              <div className="text-xs text-gray-500">Done</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-warning">
                {taskCounts.pending}
              </div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
          </div>
          
          {!loading && (
            <ProgressRing progress={progress} size={40} />
          )}
        </div>
      </div>
    </motion.header>
  )
}

export default Header
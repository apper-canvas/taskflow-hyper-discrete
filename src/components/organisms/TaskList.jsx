import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import TaskCard from '@/components/molecules/TaskCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import TaskModal from '@/components/organisms/TaskModal'
import { taskService } from '@/services/api/taskService'

const TaskList = ({ 
  searchQuery = '', 
  selectedCategory = null, 
  filter = 'all',
  className = '' 
}) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedTask, setSelectedTask] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadTasks = async () => {
    try {
      setError('')
      setLoading(true)
      const data = await taskService.getAll()
      setTasks(data)
    } catch (err) {
      setError('Failed to load tasks. Please try again.')
      console.error('Error loading tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed }
      await taskService.update(task.Id, updatedTask)
      
      setTasks(prev => prev.map(t => t.Id === task.Id ? updatedTask : t))
      
      if (updatedTask.completed) {
        toast.success('🎉 Task completed! Great job!')
      } else {
        toast.info('Task marked as incomplete')
      }
    } catch (err) {
      toast.error('Failed to update task')
      console.error('Error updating task:', err)
    }
  }

  const handleEditTask = (task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleDeleteTask = async (task) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return

    try {
      await taskService.delete(task.Id)
      setTasks(prev => prev.filter(t => t.Id !== task.Id))
      toast.success('Task deleted successfully')
    } catch (err) {
      toast.error('Failed to delete task')
      console.error('Error deleting task:', err)
    }
  }

  const handleSaveTask = async (taskData) => {
    try {
      if (selectedTask) {
        // Update existing task
        const updatedTask = await taskService.update(selectedTask.Id, taskData)
        setTasks(prev => prev.map(t => t.Id === selectedTask.Id ? updatedTask : t))
        toast.success('Task updated successfully')
      } else {
        // Create new task
        const newTask = await taskService.create(taskData)
        setTasks(prev => [newTask, ...prev])
        toast.success('Task created successfully')
      }
      setIsModalOpen(false)
      setSelectedTask(null)
    } catch (err) {
      toast.error(selectedTask ? 'Failed to update task' : 'Failed to create task')
      console.error('Error saving task:', err)
    }
  }

  // Filter tasks based on search, category, and filter
  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Category filter
    if (selectedCategory && task.categoryId !== selectedCategory.Id) {
      return false
    }

    // Status filter
    switch (filter) {
      case 'completed':
        return task.completed
      case 'pending':
        return !task.completed
      case 'today': {
        if (!task.dueDate) return false
        const today = new Date().toDateString()
        const taskDate = new Date(task.dueDate).toDateString()
        return taskDate === today
      }
      case 'overdue': {
        if (!task.dueDate || task.completed) return false
        return new Date(task.dueDate) < new Date()
      }
      default:
        return true
    }
  })

  // Sort tasks: incomplete first, then by priority and due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }

    // Sort by priority
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
    if (priorityDiff !== 0) return priorityDiff

    // Sort by due date
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate)
    }
    if (a.dueDate) return -1
    if (b.dueDate) return 1

    return 0
  })

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadTasks} />
  if (sortedTasks.length === 0) {
    return (
      <Empty 
        title="No tasks found"
        description={searchQuery ? "Try adjusting your search criteria" : "Ready to add your first task?"}
        actionText="Add Task"
        onAction={() => setIsModalOpen(true)}
      />
    )
  }

  return (
    <div className={className}>
      <AnimatePresence mode="popLayout">
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.Id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      </AnimatePresence>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedTask(null)
        }}
        onSave={handleSaveTask}
        task={selectedTask}
      />
    </div>
  )
}

export default TaskList
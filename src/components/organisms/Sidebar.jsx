import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import CategoryItem from '@/components/molecules/CategoryItem'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import { categoryService } from '@/services/api/categoryService'
import { taskService } from '@/services/api/taskService'

const Sidebar = ({ 
  selectedCategory, 
  onCategorySelect, 
  selectedFilter,
  onFilterSelect,
  className = '' 
}) => {
  const [categories, setCategories] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true)
      const [categoriesData, tasksData] = await Promise.all([
        categoryService.getAll(),
        taskService.getAll()
      ])
      setCategories(categoriesData)
      setTasks(tasksData)
    } catch (err) {
      console.error('Error loading sidebar data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const getTaskCountForCategory = (categoryId) => {
    return tasks.filter(task => task.categoryId === categoryId && !task.completed).length
  }

  const getFilterCounts = () => {
    const today = new Date().toDateString()
    const overdue = tasks.filter(task => 
      !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
    ).length
    
    const todayTasks = tasks.filter(task => {
      if (!task.dueDate) return false
      return new Date(task.dueDate).toDateString() === today
    }).length

    return {
      all: tasks.length,
      pending: tasks.filter(task => !task.completed).length,
      completed: tasks.filter(task => task.completed).length,
      today: todayTasks,
      overdue
    }
  }

  const filterCounts = getFilterCounts()

  const filters = [
    { key: 'all', label: 'All Tasks', icon: 'List', count: filterCounts.all },
    { key: 'pending', label: 'Pending', icon: 'Circle', count: filterCounts.pending },
    { key: 'completed', label: 'Completed', icon: 'CheckCircle', count: filterCounts.completed },
    { key: 'today', label: 'Due Today', icon: 'Calendar', count: filterCounts.today },
    { key: 'overdue', label: 'Overdue', icon: 'AlertCircle', count: filterCounts.overdue }
  ]

  if (loading) {
    return (
      <div className={`bg-white shadow-xl border-r border-gray-200 ${className}`}>
        <div className="p-6">
          <Loading />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className={`bg-white shadow-xl border-r border-gray-200 ${className}`}
    >
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <ApperIcon name="CheckSquare" className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
            <p className="text-sm text-gray-500">Stay organized</p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
            Filters
          </h3>
          <div className="space-y-1">
            {filters.map((filter) => (
              <motion.button
                key={filter.key}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onFilterSelect?.(filter.key)}
                className={`
                  w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 group
                  ${selectedFilter === filter.key
                    ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20'
                    : 'hover:bg-gray-50 text-gray-700'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <ApperIcon 
                    name={filter.icon} 
                    size={16} 
                    className={selectedFilter === filter.key ? 'text-primary' : 'text-gray-500 group-hover:text-primary'}
                  />
                  <span className="font-medium">{filter.label}</span>
                </div>
                
                {filter.count > 0 && (
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-full
                    ${selectedFilter === filter.key
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600 group-hover:bg-primary group-hover:text-white'
                    }
                  `}>
                    {filter.count}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Categories
            </h3>
            <Button
              variant="ghost"
              size="small"
              className="text-primary hover:bg-primary/10"
            >
              <ApperIcon name="Plus" size={16} />
            </Button>
          </div>
          <div className="space-y-1">
            {categories.map((category) => (
              <CategoryItem
                key={category.Id}
                category={category}
                isActive={selectedCategory?.Id === category.Id}
                taskCount={getTaskCountForCategory(category.Id)}
                onClick={onCategorySelect}
              />
            ))}
          </div>
        </div>

        {/* Clear Filter Button */}
        {(selectedCategory || selectedFilter !== 'all') && (
          <Button
            variant="ghost"
            size="small"
            onClick={() => {
              onCategorySelect?.(null)
              onFilterSelect?.('all')
            }}
            className="w-full text-gray-600 hover:text-primary"
          >
            <ApperIcon name="X" size={16} className="mr-2" />
            Clear Filters
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export default Sidebar
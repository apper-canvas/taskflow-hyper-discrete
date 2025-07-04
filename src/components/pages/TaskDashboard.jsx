import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import TaskList from "@/components/organisms/TaskList";
import TaskModal from "@/components/organisms/TaskModal";
import QuickAddTask from "@/components/molecules/QuickAddTask";
import categoriesData from "@/services/mockData/categories.json";
import tasksData from "@/services/mockData/tasks.json";
import { categoryService } from "@/services/api/categoryService";
import { taskService } from "@/services/api/taskService";

const TaskDashboard = () => {
  const {
    searchQuery,
    selectedCategory,
    selectedFilter
  } = useOutletContext()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    loadCategories()
    
    // Listen for add task events from header
    const handleOpenModal = () => setIsModalOpen(true)
    window.addEventListener('openTaskModal', handleOpenModal)
    
    return () => {
      window.removeEventListener('openTaskModal', handleOpenModal)
    }
  }, [])

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (err) {
      console.error('Error loading categories:', err)
    }
  }

  const handleAddTask = async (taskData) => {
    try {
      await taskService.create(taskData)
      toast.success('Task created successfully!')
      // TaskList will reload automatically
    } catch (err) {
      toast.error('Failed to create task')
      console.error('Error creating task:', err)
    }
  }

  const handleSaveTask = async (taskData) => {
    try {
      await taskService.create(taskData)
      toast.success('Task created successfully!')
      setIsModalOpen(false)
      // TaskList will reload automatically via its own state management
    } catch (err) {
      toast.error('Failed to create task')
      console.error('Error creating task:', err)
    }
  }

  const getFilterTitle = () => {
    if (selectedCategory) {
      return `${selectedCategory.name} Tasks`
    }
    
    switch (selectedFilter) {
      case 'pending': return 'Pending Tasks'
      case 'completed': return 'Completed Tasks'
      case 'today': return "Today's Tasks"
      case 'overdue': return 'Overdue Tasks'
      default: return 'All Tasks'
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="space-y-6"
      >
{/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getFilterTitle()}
            </h1>
            <p className="text-gray-600">
              {searchQuery ? `Searching for "${searchQuery}"` : 'Organize your thoughts and tasks'}
            </p>
            {selectedCategory && (
              <div className="flex items-center space-x-2 mt-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedCategory.color }}
                />
                <span className="text-sm text-gray-500">
                  Filtered by {selectedCategory.name}
                </span>
              </div>
            )}
          </div>
        </div>
{/* Quick Add Task */}
        <QuickAddTask
          onAddTask={handleAddTask}
          categories={categories}
        />
        <Button onClick={() => {
          let abcd = {};
          console.log(abcd.length());
        }}>Cick me</Button>

        {/* Task List */}
        <TaskList
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          filter={selectedFilter}
        />

        {/* Task Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
          categories={categories}
        />
      </motion.div>
    </div>
  )
}

export default TaskDashboard

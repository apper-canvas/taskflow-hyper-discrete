import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('all')

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

const handleAddTask = () => {
    // This will be handled by the child components
    window.dispatchEvent(new window.CustomEvent('openTaskModal'))
  }
return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <Sidebar
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          selectedFilter={selectedFilter}
          onFilterSelect={setSelectedFilter}
          className="h-screen sticky top-0"
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={toggleMobileMenu}
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="relative w-80 h-full"
          >
            <Sidebar
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              selectedFilter={selectedFilter}
              onFilterSelect={setSelectedFilter}
              className="h-full"
            />
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Menu Button */}
        <div className="lg:hidden p-4 bg-white border-b border-gray-200">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors duration-200"
          >
            <ApperIcon name="Menu" size={24} />
          </button>
        </div>

        {/* Header */}
        <Header
          onSearch={setSearchQuery}
          onAddTask={handleAddTask}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <Outlet context={{
            searchQuery,
            selectedCategory,
            selectedFilter,
            setSearchQuery,
            setSelectedCategory,
            setSelectedFilter
          }} />
        </main>
      </div>
    </div>
  )
}

export default Layout
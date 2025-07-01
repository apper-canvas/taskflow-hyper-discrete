import mockCategories from '@/services/mockData/categories.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class CategoryService {
  constructor() {
    this.categories = [...mockCategories]
  }

  async getAll() {
    await delay(250)
    return [...this.categories]
  }

  async getById(id) {
    await delay(200)
    const category = this.categories.find(c => c.Id === parseInt(id))
    if (!category) {
      throw new Error('Category not found')
    }
    return { ...category }
  }

  async create(categoryData) {
    await delay(300)
    
    const newCategory = {
      Id: Math.max(...this.categories.map(c => c.Id), 0) + 1,
      ...categoryData,
      taskCount: 0
    }
    
    this.categories.push(newCategory)
    return { ...newCategory }
  }

  async update(id, categoryData) {
    await delay(250)
    
    const index = this.categories.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Category not found')
    }
    
    const updatedCategory = {
      ...this.categories[index],
      ...categoryData
    }
    
    this.categories[index] = updatedCategory
    return { ...updatedCategory }
  }

  async delete(id) {
    await delay(200)
    
    const index = this.categories.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Category not found')
    }
    
    this.categories.splice(index, 1)
    return true
  }
}

export const categoryService = new CategoryService()
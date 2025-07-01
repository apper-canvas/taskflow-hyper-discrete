import mockTasks from '@/services/mockData/tasks.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class TaskService {
  constructor() {
    this.tasks = [...mockTasks]
  }

  async getAll() {
    await delay(300)
    return [...this.tasks]
  }

  async getById(id) {
    await delay(200)
    const task = this.tasks.find(t => t.Id === parseInt(id))
    if (!task) {
      throw new Error('Task not found')
    }
    return { ...task }
  }

  async create(taskData) {
    await delay(400)
    
    const newTask = {
      Id: Math.max(...this.tasks.map(t => t.Id), 0) + 1,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    }
    
    this.tasks.unshift(newTask)
    return { ...newTask }
  }

  async update(id, taskData) {
    await delay(300)
    
    const index = this.tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    const updatedTask = {
      ...this.tasks[index],
      ...taskData,
      completedAt: taskData.completed && !this.tasks[index].completed 
        ? new Date().toISOString() 
        : (!taskData.completed ? null : this.tasks[index].completedAt)
    }
    
    this.tasks[index] = updatedTask
    return { ...updatedTask }
  }

  async delete(id) {
    await delay(250)
    
    const index = this.tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    this.tasks.splice(index, 1)
    return true
  }
}

export const taskService = new TaskService()
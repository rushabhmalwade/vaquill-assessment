export const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount)
}

export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}
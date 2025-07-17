import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload,
  Sparkles,
  Utensils,
  DollarSign
} from 'lucide-react'
import { toast } from 'sonner'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  available: boolean
}

interface MenuCategory {
  id: string
  name: string
  description?: string
  order: number
}

interface MenuManagerProps {
  restaurantId: string
}

export default function MenuManager({ restaurantId }: MenuManagerProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  
  // Form states
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true
  })
  
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  })

  // Load menu data from localStorage (demo)
  useEffect(() => {
    const savedMenu = localStorage.getItem(`menu-${restaurantId}`)
    const savedCategories = localStorage.getItem(`categories-${restaurantId}`)
    
    if (savedMenu) {
      setMenuItems(JSON.parse(savedMenu))
    } else {
      // Default demo menu
      const defaultMenu: MenuItem[] = [
        {
          id: '1',
          name: 'Margherita Pizza',
          description: 'Fresh tomatoes, mozzarella, basil, olive oil',
          price: 18.99,
          category: 'Pizza',
          available: true
        },
        {
          id: '2',
          name: 'Caesar Salad',
          description: 'Romaine lettuce, parmesan, croutons, caesar dressing',
          price: 14.99,
          category: 'Salads',
          available: true
        }
      ]
      setMenuItems(defaultMenu)
      localStorage.setItem(`menu-${restaurantId}`, JSON.stringify(defaultMenu))
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    } else {
      // Default categories
      const defaultCategories: MenuCategory[] = [
        { id: '1', name: 'Pizza', description: 'Wood-fired pizzas', order: 1 },
        { id: '2', name: 'Salads', description: 'Fresh salads', order: 2 },
        { id: '3', name: 'Pasta', description: 'Italian pasta dishes', order: 3 },
        { id: '4', name: 'Desserts', description: 'Sweet treats', order: 4 }
      ]
      setCategories(defaultCategories)
      localStorage.setItem(`categories-${restaurantId}`, JSON.stringify(defaultCategories))
    }
  }, [restaurantId])

  const saveMenuItems = (items: MenuItem[]) => {
    setMenuItems(items)
    localStorage.setItem(`menu-${restaurantId}`, JSON.stringify(items))
  }

  const saveCategories = (cats: MenuCategory[]) => {
    setCategories(cats)
    localStorage.setItem(`categories-${restaurantId}`, JSON.stringify(cats))
  }

  const handleAddItem = () => {
    if (!itemForm.name || !itemForm.price || !itemForm.category) {
      toast.error('Please fill in all required fields')
      return
    }

    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: itemForm.name,
      description: itemForm.description,
      price: parseFloat(itemForm.price),
      category: itemForm.category,
      available: itemForm.available
    }

    saveMenuItems([...menuItems, newItem])
    setItemForm({ name: '', description: '', price: '', category: '', available: true })
    setIsAddItemOpen(false)
    toast.success('Menu item added successfully!')
  }

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item)
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      available: item.available
    })
    setIsAddItemOpen(true)
  }

  const handleUpdateItem = () => {
    if (!editingItem) return

    const updatedItems = menuItems.map(item =>
      item.id === editingItem.id
        ? {
            ...item,
            name: itemForm.name,
            description: itemForm.description,
            price: parseFloat(itemForm.price),
            category: itemForm.category,
            available: itemForm.available
          }
        : item
    )

    saveMenuItems(updatedItems)
    setEditingItem(null)
    setItemForm({ name: '', description: '', price: '', category: '', available: true })
    setIsAddItemOpen(false)
    toast.success('Menu item updated successfully!')
  }

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = menuItems.filter(item => item.id !== itemId)
    saveMenuItems(updatedItems)
    toast.success('Menu item deleted successfully!')
  }

  const handleAddCategory = () => {
    if (!categoryForm.name) {
      toast.error('Category name is required')
      return
    }

    const newCategory: MenuCategory = {
      id: Date.now().toString(),
      name: categoryForm.name,
      description: categoryForm.description,
      order: categories.length + 1
    }

    saveCategories([...categories, newCategory])
    setCategoryForm({ name: '', description: '' })
    setIsAddCategoryOpen(false)
    toast.success('Category added successfully!')
  }

  const toggleItemAvailability = (itemId: string) => {
    const updatedItems = menuItems.map(item =>
      item.id === itemId ? { ...item, available: !item.available } : item
    )
    saveMenuItems(updatedItems)
  }

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Menu Items</h3>
        <div className="flex space-x-2">
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
                <DialogDescription>Create a new menu category</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category-name">Category Name *</Label>
                  <Input
                    id="category-name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Appetizers"
                  />
                </div>
                <div>
                  <Label htmlFor="category-description">Description</Label>
                  <Input
                    id="category-description"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description"
                  />
                </div>
                <Button onClick={handleAddCategory} className="w-full">
                  Add Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
                <DialogDescription>
                  {editingItem ? 'Update menu item details' : 'Add a new item to your menu'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="item-name">Item Name *</Label>
                  <Input
                    id="item-name"
                    value={itemForm.name}
                    onChange={(e) => setItemForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Margherita Pizza"
                  />
                </div>
                <div>
                  <Label htmlFor="item-description">Description</Label>
                  <Textarea
                    id="item-description"
                    value={itemForm.description}
                    onChange={(e) => setItemForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the item"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="item-price">Price *</Label>
                    <Input
                      id="item-price"
                      type="number"
                      step="0.01"
                      value={itemForm.price}
                      onChange={(e) => setItemForm(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="item-category">Category *</Label>
                    <select
                      id="item-category"
                      value={itemForm.category}
                      onChange={(e) => setItemForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="item-available"
                    checked={itemForm.available}
                    onChange={(e) => setItemForm(prev => ({ ...prev, available: e.target.checked }))}
                  />
                  <Label htmlFor="item-available">Available for ordering</Label>
                </div>
                <Button 
                  onClick={editingItem ? handleUpdateItem : handleAddItem} 
                  className="w-full"
                >
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Menu Items by Category */}
      <div className="space-y-6">
        {categories.map(category => {
          const categoryItems = groupedItems[category.name] || []
          
          return (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    {category.description && (
                      <CardDescription>{category.description}</CardDescription>
                    )}
                  </div>
                  <Badge variant="secondary">
                    {categoryItems.length} items
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {categoryItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No items in this category yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {categoryItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <Badge variant={item.available ? 'default' : 'secondary'}>
                              {item.available ? 'Available' : 'Unavailable'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-primary">{item.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleItemAvailability(item.id)}
                          >
                            {item.available ? 'Disable' : 'Enable'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* AI Menu Parser */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>AI Menu Parser</span>
          </CardTitle>
          <CardDescription>
            Upload your menu PDF or image to automatically extract items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Drag and drop your menu file here, or click to browse
            </p>
            <Button variant="outline">
              Choose File
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
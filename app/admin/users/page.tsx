"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Mail,
  User,
  Calendar,
  Shield
} from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  email: string
  username: string
  first_name: string
  last_name?: string
  discord_username?: string
  main_shard?: string
  character_names?: string[]
  status: string
  email_verified: boolean
  is_admin: boolean
  created_at: string
  updated_at: string
  last_login_at?: string
  referral_cash?: number
  total_points_earned?: number
  current_points?: number
  lifetime_points?: number
  points_spent?: number
  review_count?: number
  rating_count?: number
  referral_code?: string
  referral_count?: number
  referred_by_count?: number
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Fetch data on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (userData: Partial<User>) => {
    try {
      const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users'
      const method = editingUser ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (response.ok) {
        fetchUsers()
        setEditingUser(null)
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        console.log('Deleting user:', userId)
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
        })

        console.log('Delete response status:', response.status)
        
        if (response.ok) {
          const result = await response.json()
          console.log('Delete result:', result)
          fetchUsers()
        } else {
          const error = await response.json()
          console.error('Delete failed:', error)
          alert('Failed to delete user: ' + (error.error || 'Unknown error'))
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Error deleting user: ' + error)
      }
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.discord_username && user.discord_username.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.main_shard && user.main_shard.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.character_names && user.character_names.some(name => name.toLowerCase().includes(searchTerm.toLowerCase())))
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const UserForm = ({ user, onSave, onCancel }: { 
    user?: User | null, 
    onSave: (data: Partial<User>) => void, 
    onCancel: () => void 
  }) => {
    const [formData, setFormData] = useState({
      email: user?.email || '',
      username: user?.username || '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      discord_username: user?.discord_username || '',
      main_shard: user?.main_shard || '',
      character_names: user?.character_names || [],
      status: user?.status || 'active',
      email_verified: user?.email_verified || false,
      is_admin: user?.is_admin || false,
      referral_cash: user?.referral_cash || 0,
      total_points_earned: user?.total_points_earned || 0,
      current_points: user?.current_points || 0,
      lifetime_points: user?.lifetime_points || 0,
      points_spent: user?.points_spent || 0,
      review_count: user?.review_count || 0,
      rating_count: user?.rating_count || 0
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSave(formData)
    }

    const handleCharacterNamesChange = (value: string) => {
      const names = value.split(',').map(name => name.trim()).filter(name => name.length > 0)
      setFormData({...formData, character_names: names})
    }

    return (
      <Card className="mb-6 border border-gray-200 bg-gray-100">
        <CardHeader>
          <CardTitle className="text-black">{user ? 'Edit User' : 'Add New User'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="border-gray-300 bg-white text-black placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="username" className="text-gray-700">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                    className="border-gray-300 bg-white text-black placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="first_name" className="text-gray-700">First Name</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    required
                    className="border-gray-300 bg-white text-black placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="last_name" className="text-gray-700">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    className="border-gray-300 bg-white text-black placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Gaming Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">Gaming Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="discord_username" className="text-gray-700">Discord Username</Label>
                  <Input
                    id="discord_username"
                    value={formData.discord_username}
                    onChange={(e) => setFormData({...formData, discord_username: e.target.value})}
                    placeholder="username#1234"
                    className="border-gray-300 bg-white text-black placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="main_shard" className="text-gray-700">Main Shard</Label>
                  <Input
                    id="main_shard"
                    value={formData.main_shard}
                    onChange={(e) => setFormData({...formData, main_shard: e.target.value})}
                    placeholder="e.g., Atlantic, Arirang"
                    className="border-gray-300 bg-white text-black placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="character_names" className="text-gray-700">Character Names</Label>
                  <Textarea
                    id="character_names"
                    value={formData.character_names.join(', ')}
                    onChange={(e) => handleCharacterNamesChange(e.target.value)}
                    placeholder="Enter character names separated by commas"
                    className="border-gray-300 bg-white text-black placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                  />
                  <p className="text-sm text-gray-500 mt-1">Separate multiple character names with commas</p>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">Account Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="status" className="text-gray-700">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger className="border-gray-300 bg-white text-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="email_verified"
                      checked={formData.email_verified}
                      onCheckedChange={(checked) => setFormData({...formData, email_verified: checked})}
                      className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-200"
                    />
                    <Label htmlFor="email_verified" className="text-gray-700">Email Verified</Label>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_admin"
                      checked={formData.is_admin}
                      onCheckedChange={(checked) => setFormData({...formData, is_admin: checked})}
                      className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200"
                    />
                    <Label htmlFor="is_admin" className="text-gray-700">Admin Access</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Cashback Management */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">Cashback Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="referral_cash" className="text-gray-700">Cashback Balance ($)</Label>
                  <Input
                    id="referral_cash"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.referral_cash}
                    onChange={(e) => setFormData({...formData, referral_cash: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                    className="border-gray-300 bg-white text-black placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Current cashback balance for this user</p>
                </div>
              </div>
            </div>

            {/* Points Management */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">Points Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="total_points_earned" className="text-gray-700">Total Points Earned</Label>
                  <Input
                    id="total_points_earned"
                    type="number"
                    min="0"
                    value={formData.total_points_earned}
                    onChange={(e) => setFormData({...formData, total_points_earned: parseInt(e.target.value) || 0})}
                    placeholder="0"
                    className="border-gray-300 bg-white text-black placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Total points earned by this user</p>
                </div>
                
                <div>
                  <Label htmlFor="current_points" className="text-gray-700">Current Points</Label>
                  <Input
                    id="current_points"
                    type="number"
                    min="0"
                    value={formData.current_points}
                    onChange={(e) => setFormData({...formData, current_points: parseInt(e.target.value) || 0})}
                    placeholder="0"
                    className="border-gray-300 bg-white text-black placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Current available points</p>
                </div>
                
                <div>
                  <Label htmlFor="lifetime_points" className="text-gray-700">Lifetime Points</Label>
                  <Input
                    id="lifetime_points"
                    type="number"
                    min="0"
                    value={formData.lifetime_points}
                    onChange={(e) => setFormData({...formData, lifetime_points: parseInt(e.target.value) || 0})}
                    placeholder="0"
                    className="border-gray-300 bg-white text-black placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Total points earned over time</p>
                </div>
                
                <div>
                  <Label htmlFor="points_spent" className="text-gray-700">Points Spent</Label>
                  <Input
                    id="points_spent"
                    type="number"
                    min="0"
                    value={formData.points_spent}
                    onChange={(e) => setFormData({...formData, points_spent: parseInt(e.target.value) || 0})}
                    placeholder="0"
                    className="border-gray-300 bg-white text-black placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Total points spent by this user</p>
                </div>
                
                <div>
                  <Label htmlFor="review_count" className="text-gray-700">Review Count</Label>
                  <Input
                    id="review_count"
                    type="number"
                    min="0"
                    value={formData.review_count}
                    onChange={(e) => setFormData({...formData, review_count: parseInt(e.target.value) || 0})}
                    placeholder="0"
                    className="border-gray-300 bg-white text-black placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Number of reviews written</p>
                </div>
                
                <div>
                  <Label htmlFor="rating_count" className="text-gray-700">Rating Count</Label>
                  <Input
                    id="rating_count"
                    type="number"
                    min="0"
                    value={formData.rating_count}
                    onChange={(e) => setFormData({...formData, rating_count: parseInt(e.target.value) || 0})}
                    placeholder="0"
                    className="border-gray-300 bg-white text-black placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Number of ratings given</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={onCancel} className="border-gray-300 text-gray-700">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                {user ? 'Update User' : 'Create User'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <AdminHeader />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">Users Management</h1>
              <p className="text-gray-700">Manage user accounts, profiles, and permissions</p>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6 border border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="search" className="text-black font-semibold">Search Users</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="search"
                      placeholder="Search by email, username, name, discord, shard, or characters..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300 bg-white text-black"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="status-filter" className="text-black font-semibold">Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="border-gray-300 bg-white text-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button variant="outline" className="w-full border-gray-300 text-gray-700">
                    <Filter className="h-4 w-4 mr-2" />
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Form */}
          {showForm && (
            <UserForm
              user={editingUser}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false)
                setEditingUser(null)
              }}
            />
          )}

          {/* Users Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          ) : (
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-black">Users ({filteredUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-black font-semibold">User</TableHead>
                      <TableHead className="text-black font-semibold">Contact</TableHead>
                      <TableHead className="text-black font-semibold">Gaming Info</TableHead>
                      <TableHead className="text-black font-semibold">Status</TableHead>
                      <TableHead className="text-black font-semibold">Points</TableHead>
                      <TableHead className="text-black font-semibold">Cashback</TableHead>
                      <TableHead className="text-black font-semibold">Referrals</TableHead>
                      <TableHead className="text-black font-semibold">Account</TableHead>
                      <TableHead className="text-black font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-black">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="text-sm text-gray-700">@{user.username}</div>
                              {user.is_admin && (
                                <Badge className="bg-purple-100 text-purple-800 text-xs mt-1">Admin</Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-700">
                              <Mail className="h-4 w-4 mr-2" />
                              <span className="truncate max-w-xs">{user.email}</span>
                            </div>
                            {user.discord_username && (
                              <div className="text-xs text-gray-500">
                                Discord: {user.discord_username}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {user.main_shard && (
                              <div className="text-sm text-gray-700">
                                Shard: {user.main_shard}
                              </div>
                            )}
                            {user.character_names && user.character_names.length > 0 && (
                              <div className="text-xs text-gray-500">
                                Characters: {user.character_names.slice(0, 2).join(', ')}
                                {user.character_names.length > 2 && ` +${user.character_names.length - 2} more`}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge 
                              className={`${
                                user.status === 'active' ? 'bg-green-100 text-green-800' : 
                                user.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                                user.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {user.status}
                            </Badge>
                            {user.email_verified && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">Verified</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-700">
                              <span className="font-semibold text-amber-600">
                                {user.current_points || 0} pts
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.review_count || 0} reviews, {user.rating_count || 0} ratings
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-700">
                              <span className="font-semibold text-green-600">
                                ${(typeof user.referral_cash === 'string' ? parseFloat(user.referral_cash) : user.referral_cash || 0).toFixed(2)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Cashback Balance
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {user.referral_code ? (
                              <div className="flex items-center text-sm text-gray-700">
                                <span className="font-semibold text-purple-600">
                                  {user.referral_code}
                                </span>
                              </div>
                            ) : (
                              <div className="text-xs text-gray-500">
                                No code
                              </div>
                            )}
                            <div className="text-xs text-gray-500">
                              {user.referral_count || 0} referred, {user.referred_by_count || 0} referred by
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-700">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>{new Date(user.created_at).toLocaleDateString()}</span>
                            </div>
                            {user.last_login_at && (
                              <div className="text-xs text-gray-500">
                                Last login: {new Date(user.last_login_at).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingUser(user)
                                setShowForm(true)
                              }}
                              className="border-gray-300 text-gray-700"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(user.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {!loading && filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-black mb-2">No users found</h3>
              <p className="text-gray-700 mb-6">Try adjusting your search or filters</p>
              <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First User
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 
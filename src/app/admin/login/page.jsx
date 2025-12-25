'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Lock, Mail, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password')
      setLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, { 
        email, 
        password 
      })
      
      // Store auth data
      localStorage.setItem('adminToken', response.data.token)
      localStorage.setItem('admin', JSON.stringify(response.data.admin))
      
      // If remember me is checked, store in localStorage for longer persistence
      if (rememberMe) {
        localStorage.setItem('rememberAdmin', 'true')
      }
      
      // Show success message
      setError('') // Clear any previous errors
      
      // Redirect to dashboard
      router.push('/admin/dashboard')
      
    } catch (err) {
      // Handle different error types
      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Invalid email or password')
            break
          case 404:
            setError('Admin account not found')
            break
          case 500:
            setError('Server error. Please try again later')
            break
          default:
            setError('Login failed. Please try again')
        }
      } else if (err.request) {
        setError('Network error. Please check your connection')
      } else {
        setError('An unexpected error occurred')
      }
      
      // Clear password on error
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setEmail('admin@example.com')
    setPassword('admin123')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <span className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg">
          Admin Panel
        </span>
      </div>

      <div className="w-full max-w-md">
        {/* Logo/Brand Area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">Admin Login</h1>
          <p className="text-gray-600">Access your admin dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-400"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-gray-600 hover:text-black"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  disabled={loading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-pink-600 hover:text-pink-700">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </>
              )}
            </button>

            {/* Demo Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-sm text-gray-600 hover:text-black"
                disabled={loading}
              >
                Use demo credentials
              </button>
            </div>
          </form>

          {/* Security Tips */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Security Tips</h3>
            <ul className="text-xs text-gray-600 space-y-2">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1 mr-2" />
                Never share your login credentials
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1 mr-2" />
                Always log out from public computers
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1 mr-2" />
                Use a strong, unique password
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Travel Website Admin. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Need help? <a href="mailto:support@example.com" className="text-pink-600 hover:text-pink-700">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  )
}
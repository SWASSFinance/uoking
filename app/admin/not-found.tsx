import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Settings } from 'lucide-react';

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-bold text-gray-300 mb-4">
            404
          </div>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <Card className="bg-white border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Admin Page Not Found
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              The admin page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-500">
              This admin section doesn't exist. Please check the URL or navigate to a valid admin page.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/admin" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
              </Button>
            </div>

            {/* Quick Admin Links */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-gray-500 text-sm mb-4">Popular admin sections:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link 
                  href="/admin/orders" 
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                >
                  Orders
                </Link>
                <Link 
                  href="/admin/products" 
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                >
                  Products
                </Link>
                <Link 
                  href="/admin/users" 
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                >
                  Users
                </Link>
                <Link 
                  href="/admin/skills" 
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                >
                  Skills
                </Link>
                <Link 
                  href="/admin/settings" 
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                >
                  Settings
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


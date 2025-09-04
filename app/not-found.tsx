import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Animation/Icon */}
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
            404
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold text-white mb-2">
              Page Not Found
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-400">
              Don't worry, even the greatest adventurers sometimes take a wrong turn in Britannia. 
              Let's get you back on the right path!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700">
                <Link href="/skills" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Browse Skills
                </Link>
              </Button>
            </div>

            {/* Quick Links */}
            <div className="pt-6 border-t border-slate-700">
              <p className="text-gray-400 text-sm mb-4">Popular destinations:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link 
                  href="/skills" 
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-full text-sm transition-colors"
                >
                  Skills Guide
                </Link>
                <Link 
                  href="/store" 
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-full text-sm transition-colors"
                >
                  Store
                </Link>
                <Link 
                  href="/maps" 
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-full text-sm transition-colors"
                >
                  Maps
                </Link>
                <Link 
                  href="/trading" 
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-full text-sm transition-colors"
                >
                  Trading Board
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fun UO Reference */}
        <div className="mt-8 text-gray-500 text-sm">
          <p>
            "The path of the righteous is beset on all sides by the inequities of the selfish 
            and the tyranny of evil men. Blessed is he who, in the name of charity and good will, 
            shepherds the weak through the valley of darkness." - The Book of Virtues
          </p>
        </div>
      </div>
    </div>
  );
}

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Home, 
  Clock, 
  AlertTriangle, 
  Info, 
  Shield, 
  Users, 
  MapPin, 
  Calendar,
  Zap,
  Eye,
  Timer
} from "lucide-react"

export default function IDOCPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb 
              items={[
                { label: "Tools", href: "/tools" },
                { label: "IDOC", current: true }
              ]} 
            />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Home className="h-16 w-16 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              IDOC - In Danger of Collapse
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Understanding Ultima Online house decay and collapse mechanics. 
              Learn how to protect your house and find opportunities when others collapse.
            </p>
          </div>

          {/* What is IDOC Section */}
          <div className="mb-12">
            <Card className="border-amber-200 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                  What is IDOC?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>IDOC</strong> stands for <strong>"In Danger of Collapse"</strong>. This is a critical status that occurs when a house owner fails to maintain their property in Ultima Online. When a house goes IDOC, it becomes vulnerable to collapse, potentially creating opportunities for other players to claim the location.
                </p>
                
                <Alert className="border-amber-200 bg-amber-50">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> IDOC houses are highly sought after because they can provide access to prime real estate locations that might otherwise be unavailable.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* House Decay Process */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              House Decay Process
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-green-800 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Stage 1: Secure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700 text-sm">
                    House is properly maintained with active owner and secure status. 
                    No decay occurring.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-yellow-800 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Stage 2: Decay
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-700 text-sm">
                    Owner inactive or house not properly secured. 
                    Decay timer begins counting down.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-red-800 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Stage 3: IDOC
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-700 text-sm">
                    House is "In Danger of Collapse". 
                    Final countdown begins - house will collapse soon.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Decay Timers */}
          <div className="mb-12">
            <Card className="border-amber-200 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Timer className="h-6 w-6 text-amber-600" />
                  Decay Timers & Mechanics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Initial Decay Period</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>House enters decay after owner becomes inactive</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>Initial decay period: <strong>7 days</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>House becomes vulnerable to IDOC status</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>Timer resets if owner logs in during this period</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">IDOC Period</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">•</span>
                        <span>IDOC status lasts: <strong>3 days</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">•</span>
                        <span>House becomes claimable by other players</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">•</span>
                        <span>Final countdown to collapse begins</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">•</span>
                        <span>Cannot be stopped once IDOC status is reached</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Important Notes:</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Decay timers can be reset if the owner logs in and secures the house before it goes IDOC</li>
                    <li>• Once IDOC status is reached, the countdown cannot be stopped</li>
                    <li>• House collapse occurs at server maintenance time</li>
                    <li>• Different house types may have slightly different decay timers</li>
                    <li>• Houses with co-owners may have extended protection periods</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* House Types and Decay Variations */}
          <div className="mb-12">
            <Card className="border-purple-200 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Home className="h-6 w-6 text-purple-600" />
                  House Types & Decay Variations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Different house types and ownership arrangements can affect decay timers:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Standard Houses</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 font-bold">•</span>
                        <span>7 days initial decay period</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 font-bold">•</span>
                        <span>3 days IDOC period</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 font-bold">•</span>
                        <span>Total: 10 days from inactivity to collapse</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Special Cases</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 font-bold">•</span>
                        <span>Co-owned houses may have extended protection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 font-bold">•</span>
                        <span>Some premium houses have longer decay periods</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 font-bold">•</span>
                        <span>Houses in certain areas may have different rules</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How to Protect Your House */}
          <div className="mb-12">
            <Card className="border-green-200 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-green-600" />
                  How to Protect Your House
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Regular Maintenance</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Log in at least once every 7 days</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Ensure house is properly secured</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Check house status regularly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Keep house deed in secure location</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Security Measures</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Set proper access permissions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Use house security features</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Keep backup of important items</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Consider house sharing with trusted friends</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Finding IDOC Houses */}
          <div className="mb-12">
            <Card className="border-purple-200 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Eye className="h-6 w-6 text-purple-600" />
                  Finding IDOC Houses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Finding IDOC houses can be a lucrative opportunity for players looking to acquire prime real estate. Here are some methods and tools used by the community:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Manual Methods</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 font-bold">•</span>
                        <span>Regular patrols of popular areas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 font-bold">•</span>
                        <span>Checking house signs for decay status</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 font-bold">•</span>
                        <span>Monitoring housing areas frequently</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 font-bold">•</span>
                        <span>Networking with other players</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Tools & Resources</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 font-bold">•</span>
                        <span>IDOC tracking websites and tools</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 font-bold">•</span>
                        <span>Community forums and Discord servers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 font-bold">•</span>
                        <span>Automated monitoring systems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600 font-bold">•</span>
                        <span>Real-time IDOC alerts</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Alert className="border-purple-200 bg-purple-50">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Community Tip:</strong> Many players use specialized tools and community networks to track IDOC houses. Joining Ultima Online community groups can provide valuable information about upcoming IDOC opportunities.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Claiming IDOC Houses */}
          <div className="mb-12">
            <Card className="border-orange-200 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Zap className="h-6 w-6 text-orange-600" />
                  Claiming IDOC Houses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  When an IDOC house collapses, there's a brief window of opportunity to claim the location. Here's what you need to know:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Preparation</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold">•</span>
                        <span>Have house deed ready</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold">•</span>
                        <span>Know the exact collapse time</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold">•</span>
                        <span>Be at the location before collapse</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold">•</span>
                        <span>Have sufficient gold for placement</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Claiming Process</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold">•</span>
                        <span>Wait for house to fully collapse</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold">•</span>
                        <span>Quickly place your house deed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold">•</span>
                        <span>Be prepared for competition</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold">•</span>
                        <span>Have backup plans ready</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Warning:</strong> IDOC claiming can be highly competitive. Multiple players may attempt to claim the same location, so timing and preparation are crucial.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Tips & Strategies */}
          <div className="mb-12">
            <Card className="border-blue-200 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  Tips & Strategies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">For House Owners</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">💡</span>
                        <span>Set calendar reminders for house maintenance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">💡</span>
                        <span>Use multiple characters for house access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">💡</span>
                        <span>Keep house deed in bank for safety</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">💡</span>
                        <span>Consider house sharing with trusted friends</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">For IDOC Hunters</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">💡</span>
                        <span>Join community IDOC tracking groups</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">💡</span>
                        <span>Use multiple accounts for better chances</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">💡</span>
                        <span>Practice house placement timing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">💡</span>
                        <span>Network with other IDOC hunters</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Need Help with House Management?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Whether you're protecting your house or looking for IDOC opportunities, 
              our community is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-amber-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Contact Support
              </a>
              <a 
                href="/tools" 
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-amber-600 transition-colors"
              >
                View All Tools
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Star, ArrowRight, CheckCircle, AlertTriangle, Crown, MapPin } from "lucide-react"
import { Metadata } from 'next'
import Link from "next/link"

export const metadata: Metadata = {
  title: "Character Creation Guide - UO King | How to Create Your UO Character",
  description: "Complete guide to character creation in Ultima Online. Learn how to design your character, choose skills, select starting city, and create the perfect UO character.",
  keywords: "UO character creation, Ultima Online character guide, UO character design, character skills, starting city, UO character tutorial",
  openGraph: {
    title: "Character Creation Guide - UO King | How to Create Your UO Character",
    description: "Complete guide to character creation in Ultima Online. Learn how to design your character, choose skills, select starting city, and create the perfect UO character.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/guides/character-creation`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Character Creation Guide - UO King | How to Create Your UO Character",
    description: "Complete guide to character creation in Ultima Online. Learn how to design your character, choose skills, select starting city, and create the perfect UO character.",
  },
}

export default function CharacterCreationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Character Creation Guide</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create the perfect character for your Ultima Online adventure. Learn about skills, starting cities, and character design.
            </p>
          </div>

          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Character Creation:</strong> Your character choices will affect your gameplay experience. Take time to plan your character before creating.
            </AlertDescription>
          </Alert>

          {/* Character Creation Steps */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Star className="h-6 w-6" />
                <span>Character Creation Process</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Choose Your Name</h3>
                    <p className="text-gray-600 text-sm">
                      Select a unique character name. Choose something memorable and appropriate for the medieval fantasy setting.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Design Your Appearance</h3>
                    <p className="text-gray-600 text-sm">
                      Customize your character's appearance including gender, hair style, hair color, facial hair, and skin tone.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Select Starting Skills</h3>
                    <p className="text-gray-600 text-sm">
                      Choose your initial skills. You start with 50 points in each selected skill, up to 7 skills total.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Choose Starting City</h3>
                    <p className="text-gray-600 text-sm">
                      Select where your character will begin their adventure. Each city has different advantages and communities.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Starting Skills */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Crown className="h-6 w-6" />
                <span>Starting Skills Guide</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Combat Skills</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Swordsmanship - Melee combat with swords</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Archery - Ranged combat with bows</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Magery - Casting spells and magic</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Tactics - Increases combat damage</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Support Skills</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Healing - Use bandages to heal</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Anatomy - Increases healing effectiveness</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Resist Spells - Magic resistance</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Meditation - Restore mana faster</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Starting Cities */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <MapPin className="h-6 w-6" />
                <span>Starting Cities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <span className="text-2xl mr-2">🏰</span>
                      Britain
                    </h4>
                    <p className="text-sm text-gray-600">The capital city with the largest population and most activity.</p>
                    <Badge className="bg-blue-100 text-blue-800">Most Popular</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <span className="text-2xl mr-2">🌙</span>
                      Moonglow
                    </h4>
                    <p className="text-sm text-gray-600">A magical city perfect for mages and scholars.</p>
                    <Badge className="bg-purple-100 text-purple-800">Mage Friendly</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <span className="text-2xl mr-2">🔨</span>
                      Minoc
                    </h4>
                    <p className="text-sm text-gray-600">Industrial city great for crafters and miners.</p>
                    <Badge className="bg-amber-100 text-amber-800">Crafter Friendly</Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <span className="text-2xl mr-2">⚓</span>
                      Vesper
                    </h4>
                    <p className="text-sm text-gray-600">Trading hub with active merchant community.</p>
                    <Badge className="bg-green-100 text-green-800">Trading Hub</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <span className="text-2xl mr-2">🌊</span>
                      Trinsic
                    </h4>
                    <p className="text-sm text-gray-600">Coastal city with strong warrior traditions.</p>
                    <Badge className="bg-red-100 text-red-800">Warrior Friendly</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <span className="text-2xl mr-2">🌲</span>
                      Yew
                    </h4>
                    <p className="text-sm text-gray-600">Forest city known for its peaceful atmosphere.</p>
                    <Badge className="bg-green-100 text-green-800">Peaceful</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Character Builds */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="text-amber-600">Recommended Character Builds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">⚔️</span>
                    Warrior
                  </h4>
                  <p className="text-sm text-gray-600">Simple melee combat build perfect for beginners.</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Swordsmanship: 50</li>
                    <li>• Tactics: 50</li>
                    <li>• Healing: 50</li>
                    <li>• Anatomy: 50</li>
                    <li>• Parrying: 50</li>
                    <li>• Resist Spells: 50</li>
                    <li>• Chivalry: 50</li>
                  </ul>
                  <Badge className="bg-red-100 text-red-800">Beginner Friendly</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🧙‍♂️</span>
                    Mage
                  </h4>
                  <p className="text-sm text-gray-600">Magic-focused build with powerful spells.</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Magery: 50</li>
                    <li>• Eval Int: 50</li>
                    <li>• Meditation: 50</li>
                    <li>• Resist Spells: 50</li>
                    <li>• Wrestling: 50</li>
                    <li>• Inscription: 50</li>
                    <li>• Mysticism: 50</li>
                  </ul>
                  <Badge className="bg-purple-100 text-purple-800">Magic Focused</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🔨</span>
                    Crafter
                  </h4>
                  <p className="text-sm text-gray-600">Build focused on creating items and making money.</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Blacksmithy: 50</li>
                    <li>• Mining: 50</li>
                    <li>• Magery: 50</li>
                    <li>• Eval Int: 50</li>
                    <li>• Meditation: 50</li>
                    <li>• Resist Spells: 50</li>
                    <li>• Tinkering: 50</li>
                  </ul>
                  <Badge className="bg-amber-100 text-amber-800">Profitable</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Character Tips */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="text-amber-600">Character Creation Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Planning Your Character</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Think about your playstyle preferences</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Consider what you want to do in UO</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Research different skill combinations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>You can change skills later if needed</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Name and Appearance</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Choose a name that fits the medieval theme</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Make your character unique and memorable</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Consider how you'll look in armor</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>You can change appearance later with barbers</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Ready to Create Your Character?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-6">
                Now that you understand character creation, learn more about gameplay and find the equipment you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-white text-green-600 hover:bg-green-50">
                  <Link href="/guides/beginners-guide">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Beginner's Guide
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <Link href="/guides/skill-system">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Learn About Skills
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <Link href="/store">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Browse Equipment
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

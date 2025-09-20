'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Minus, User, Sword, Shield, Home, BookOpen, Zap } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/hooks/use-toast';

// UO Skills data
const UO_SKILLS = [
  // Combat Skills
  { name: 'Anatomy', category: 'Combat', maxPoints: 100 },
  { name: 'Archery', category: 'Combat', maxPoints: 100 },
  { name: 'Fencing', category: 'Combat', maxPoints: 100 },
  { name: 'Healing', category: 'Combat', maxPoints: 100 },
  { name: 'Mace Fighting', category: 'Combat', maxPoints: 100 },
  { name: 'Parrying', category: 'Combat', maxPoints: 100 },
  { name: 'Swordsmanship', category: 'Combat', maxPoints: 100 },
  { name: 'Tactics', category: 'Combat', maxPoints: 100 },
  { name: 'Wrestling', category: 'Combat', maxPoints: 100 },
  
  // Magic Skills
  { name: 'Evaluate Intelligence', category: 'Magic', maxPoints: 100 },
  { name: 'Magery', category: 'Magic', maxPoints: 100 },
  { name: 'Meditation', category: 'Magic', maxPoints: 100 },
  { name: 'Resist Spells', category: 'Magic', maxPoints: 100 },
  { name: 'Necromancy', category: 'Magic', maxPoints: 100 },
  { name: 'Spirit Speak', category: 'Magic', maxPoints: 100 },
  { name: 'Mysticism', category: 'Magic', maxPoints: 100 },
  { name: 'Focus', category: 'Magic', maxPoints: 100 },
  
  // Crafting Skills
  { name: 'Alchemy', category: 'Crafting', maxPoints: 100 },
  { name: 'Blacksmithy', category: 'Crafting', maxPoints: 100 },
  { name: 'Bowcraft/Fletching', category: 'Crafting', maxPoints: 100 },
  { name: 'Carpentry', category: 'Crafting', maxPoints: 100 },
  { name: 'Cartography', category: 'Crafting', maxPoints: 100 },
  { name: 'Cooking', category: 'Crafting', maxPoints: 100 },
  { name: 'Inscribe', category: 'Crafting', maxPoints: 100 },
  { name: 'Tailoring', category: 'Crafting', maxPoints: 100 },
  { name: 'Tinkering', category: 'Crafting', maxPoints: 100 },
  
  // Gathering Skills
  { name: 'Fishing', category: 'Gathering', maxPoints: 100 },
  { name: 'Lumberjacking', category: 'Gathering', maxPoints: 100 },
  { name: 'Mining', category: 'Gathering', maxPoints: 100 },
  
  // Taming Skills
  { name: 'Animal Lore', category: 'Taming', maxPoints: 100 },
  { name: 'Animal Taming', category: 'Taming', maxPoints: 100 },
  { name: 'Herding', category: 'Taming', maxPoints: 100 },
  { name: 'Veterinary', category: 'Taming', maxPoints: 100 },
  
  // Stealth Skills
  { name: 'Detecting Hidden', category: 'Stealth', maxPoints: 100 },
  { name: 'Hiding', category: 'Stealth', maxPoints: 100 },
  { name: 'Lockpicking', category: 'Stealth', maxPoints: 100 },
  { name: 'Poisoning', category: 'Stealth', maxPoints: 100 },
  { name: 'Remove Trap', category: 'Stealth', maxPoints: 100 },
  { name: 'Snooping', category: 'Stealth', maxPoints: 100 },
  { name: 'Stealing', category: 'Stealth', maxPoints: 100 },
  { name: 'Stealth', category: 'Stealth', maxPoints: 100 },
  
  // Bard Skills
  { name: 'Discordance', category: 'Bard', maxPoints: 100 },
  { name: 'Musicianship', category: 'Bard', maxPoints: 100 },
  { name: 'Peacemaking', category: 'Bard', maxPoints: 100 },
  { name: 'Provocation', category: 'Bard', maxPoints: 100 },
  
  // Paladin Skills
  { name: 'Chivalry', category: 'Paladin', maxPoints: 100 },
  
  // Samurai/Ninja Skills
  { name: 'Bushido', category: 'Samurai', maxPoints: 100 },
  { name: 'Ninjitsu', category: 'Ninja', maxPoints: 100 },
  
  // Other Skills
  { name: 'Arms Lore', category: 'Other', maxPoints: 100 },
  { name: 'Begging', category: 'Other', maxPoints: 100 },
  { name: 'Camping', category: 'Other', maxPoints: 100 },
  { name: 'Forensic Evaluation', category: 'Other', maxPoints: 100 },
  { name: 'Item Identification', category: 'Other', maxPoints: 100 },
  { name: 'Taste Identification', category: 'Other', maxPoints: 100 },
  { name: 'Tracking', category: 'Other', maxPoints: 100 },
];

const SHARDS = [
  'Atlantic', 'Catskills', 'Chesapeake', 'Europa', 'Great Lakes', 
  'Lake Austin', 'Lake Superior', 'Legends', 'Napa Valley', 'Oceania',
  'Pacific', 'Sonoma', 'Yamato', 'Asuka', 'Wakoku', 'Izumo', 'Mugen',
  'Sakura', 'Formosa', 'Baja'
];

interface Character {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  skills: { [skillName: string]: number };
  totalSkillPoints: number;
}

interface AccountBuilderProps {
  onAddToCart: (accountConfig: any) => void;
}

export default function AccountBuilder({ onAddToCart }: AccountBuilderProps) {
  const [numCharacters, setNumCharacters] = useState(1);
  const [characters, setCharacters] = useState<Character[]>([
    { id: '1', name: '', gender: 'Male', skills: {}, totalSkillPoints: 0 }
  ]);
  const [selectedShard, setSelectedShard] = useState('');
  const [activeCharacter, setActiveCharacter] = useState('1');
  
  // Pricing options
  const [suitTier, setSuitTier] = useState<'none' | 'basic' | 'premium' | 'legendary'>('none');
  const [addMount, setAddMount] = useState(false);
  const [addBooks, setAddBooks] = useState(false);
  const [addHouse, setAddHouse] = useState(false);
  
  const { addItem } = useCart();
  const { toast } = useToast();

  // Update characters array when numCharacters changes
  useEffect(() => {
    const newCharacters = [...characters];
    
    if (numCharacters > characters.length) {
      // Add new characters
      for (let i = characters.length; i < numCharacters; i++) {
        newCharacters.push({
          id: String(i + 1),
          name: '',
          gender: 'Male',
          skills: {},
          totalSkillPoints: 0
        });
      }
    } else if (numCharacters < characters.length) {
      // Remove excess characters
      newCharacters.splice(numCharacters);
    }
    
    setCharacters(newCharacters);
    
    // Update active character if it's been removed
    if (parseInt(activeCharacter) > numCharacters) {
      setActiveCharacter('1');
    }
  }, [numCharacters]);

  const updateCharacterSkill = (characterId: string, skillName: string, points: number) => {
    setCharacters(prev => prev.map(char => {
      if (char.id === characterId) {
        const newSkills = { ...char.skills };
        
        if (points === 0) {
          delete newSkills[skillName];
        } else {
          newSkills[skillName] = Math.min(points, 100);
        }
        
        const totalSkillPoints = Object.values(newSkills).reduce((sum, val) => sum + val, 0);
        
        return {
          ...char,
          skills: newSkills,
          totalSkillPoints
        };
      }
      return char;
    }));
  };

  const updateCharacterName = (characterId: string, name: string) => {
    setCharacters(prev => prev.map(char => 
      char.id === characterId ? { ...char, name } : char
    ));
  };

  const updateCharacterGender = (characterId: string, gender: 'Male' | 'Female') => {
    setCharacters(prev => prev.map(char => 
      char.id === characterId ? { ...char, gender } : char
    ));
  };

  const calculateTotalPrice = () => {
    let basePrice = numCharacters * 50; // Base price per character
    
    // Suit pricing
    const suitPrices = {
      none: 0,
      basic: 25,
      premium: 50,
      legendary: 100
    };
    basePrice += suitPrices[suitTier] * numCharacters;
    
    // Mount pricing
    if (addMount) {
      basePrice += 5 * numCharacters;
    }
    
    // Books pricing
    if (addBooks) {
      basePrice += 3 * numCharacters;
    }
    
    // House pricing
    if (addHouse) {
      basePrice += 50;
    }
    
    return basePrice;
  };

  const getTotalSkillPoints = () => {
    return characters.reduce((total, char) => total + char.totalSkillPoints, 0);
  };

  const getMaxSkillPoints = () => {
    return numCharacters * 720;
  };

  const handleAddToCart = () => {
    // Validation
    if (!selectedShard) {
      toast({
        title: "Missing Information",
        description: "Please select a shard for your account.",
        variant: "destructive",
      });
      return;
    }

    const unnamedCharacters = characters.filter(char => !char.name.trim());
    if (unnamedCharacters.length > 0) {
      toast({
        title: "Missing Character Names",
        description: "Please provide names for all characters.",
        variant: "destructive",
      });
      return;
    }

    const accountConfig = {
      id: `custom-account-${Date.now()}`,
      name: `Custom UO Account - ${numCharacters} Characters (${selectedShard})`,
      price: calculateTotalPrice(),
      image_url: '/placeholder.png',
      category: 'Accounts',
      details: {
        shard: selectedShard,
        numCharacters,
        characters: characters.map(char => ({
          name: char.name,
          gender: char.gender,
          skills: char.skills,
          totalSkillPoints: char.totalSkillPoints
        })),
        options: {
          suitTier,
          addMount,
          addBooks,
          addHouse
        },
        totalSkillPoints: getTotalSkillPoints(),
        maxSkillPoints: getMaxSkillPoints()
      }
    };

    addItem(accountConfig);
    
    toast({
      title: "Account Added to Cart",
      description: `Custom UO Account with ${numCharacters} characters has been added to your cart.`,
      variant: "default",
    });
  };

  const activeChar = characters.find(char => char.id === activeCharacter);
  const skillCategories = [...new Set(UO_SKILLS.map(skill => skill.category))];

  // Quick template functions
  const applyWarriorTemplate = (characterId: string) => {
    const warriorSkills = {
      'Swordsmanship': 100,
      'Tactics': 100,
      'Anatomy': 100,
      'Healing': 100,
      'Parrying': 100,
      'Resist Spells': 100,
      'Magery': 20
    };
    
    setCharacters(prev => prev.map(char => {
      if (char.id === characterId) {
        const totalSkillPoints = Object.values(warriorSkills).reduce((sum, val) => sum + val, 0);
        return {
          ...char,
          skills: warriorSkills,
          totalSkillPoints
        };
      }
      return char;
    }));
  };

  const applyMageTemplate = (characterId: string) => {
    const mageSkills = {
      'Magery': 100,
      'Evaluate Intelligence': 100,
      'Meditation': 100,
      'Resist Spells': 100,
      'Inscribe': 100,
      'Wrestling': 100,
      'Anatomy': 20
    };
    
    setCharacters(prev => prev.map(char => {
      if (char.id === characterId) {
        const totalSkillPoints = Object.values(mageSkills).reduce((sum, val) => sum + val, 0);
        return {
          ...char,
          skills: mageSkills,
          totalSkillPoints
        };
      }
      return char;
    }));
  };

  const applyCrafterTemplate = (characterId: string) => {
    const crafterSkills = {
      'Blacksmithy': 100,
      'Mining': 100,
      'Tinkering': 100,
      'Tailoring': 100,
      'Carpentry': 100,
      'Lumberjacking': 100,
      'Magery': 20
    };
    
    setCharacters(prev => prev.map(char => {
      if (char.id === characterId) {
        const totalSkillPoints = Object.values(crafterSkills).reduce((sum, val) => sum + val, 0);
        return {
          ...char,
          skills: crafterSkills,
          totalSkillPoints
        };
      }
      return char;
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <User className="h-5 w-5" />
            Custom Account Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="numCharacters">Number of Characters</Label>
              <Select value={numCharacters.toString()} onValueChange={(value) => setNumCharacters(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Character{num > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="shard">Shard</Label>
              <Select value={selectedShard} onValueChange={setSelectedShard}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a shard" />
                </SelectTrigger>
                <SelectContent>
                  {SHARDS.map(shard => (
                    <SelectItem key={shard} value={shard}>
                      {shard}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Skill Points Summary */}
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Skill Points Used:</span>
              <Badge variant={getTotalSkillPoints() > getMaxSkillPoints() ? "destructive" : "default"}>
                {getTotalSkillPoints()} / {getMaxSkillPoints()}
              </Badge>
            </div>
            {getTotalSkillPoints() > getMaxSkillPoints() && (
              <p className="text-sm text-red-600 mt-2">
                You have exceeded the maximum skill points. Please reduce skills to continue.
              </p>
            )}
          </div>

          {/* Character Configuration */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Character Configuration</h3>
            
            {/* Character Tabs */}
            <Tabs value={activeCharacter} onValueChange={setActiveCharacter}>
              <TabsList className="grid w-full grid-cols-7 mb-4" style={{ gridTemplateColumns: `repeat(${Math.min(numCharacters, 7)}, 1fr)` }}>
                {characters.map(char => (
                  <TabsTrigger key={char.id} value={char.id}>
                    Char {char.id}
                  </TabsTrigger>
                ))}
              </TabsList>

              {characters.map(char => (
                <TabsContent key={char.id} value={char.id} className="space-y-4">
                  {/* Character Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`name-${char.id}`}>Character Name</Label>
                      <Input
                        id={`name-${char.id}`}
                        value={char.name}
                        onChange={(e) => updateCharacterName(char.id, e.target.value)}
                        placeholder="Enter character name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`gender-${char.id}`}>Gender</Label>
                      <Select value={char.gender} onValueChange={(value: 'Male' | 'Female') => updateCharacterGender(char.id, value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Skills Configuration */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Skills Configuration</h4>
                      <Badge variant={char.totalSkillPoints > 720 ? "destructive" : "default"}>
                        {char.totalSkillPoints} / 720 points
                      </Badge>
                    </div>
                    
                    {/* Quick Templates */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applyWarriorTemplate(char.id)}
                        className="text-xs"
                      >
                        Warrior Template
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applyMageTemplate(char.id)}
                        className="text-xs"
                      >
                        Mage Template
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applyCrafterTemplate(char.id)}
                        className="text-xs"
                      >
                        Crafter Template
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, skills: {}, totalSkillPoints: 0 } : c))}
                        className="text-xs text-red-600"
                      >
                        Clear All
                      </Button>
                    </div>
                    
                    {/* Skills by Category */}
                    <Tabs defaultValue={skillCategories[0]} className="w-full">
                      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                        {skillCategories.map(category => (
                          <TabsTrigger key={category} value={category} className="text-xs">
                            {category}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      
                      {skillCategories.map(category => (
                        <TabsContent key={category} value={category} className="space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                            {UO_SKILLS.filter(skill => skill.category === category).map(skill => (
                              <div key={skill.name} className="flex items-center justify-between p-2 border rounded">
                                <span className="text-sm font-medium">{skill.name}</span>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateCharacterSkill(char.id, skill.name, Math.max(0, (char.skills[skill.name] || 0) - 10))}
                                    disabled={!char.skills[skill.name]}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={char.skills[skill.name] || 0}
                                    onChange={(e) => updateCharacterSkill(char.id, skill.name, parseInt(e.target.value) || 0)}
                                    className="w-16 text-center"
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateCharacterSkill(char.id, skill.name, Math.min(100, (char.skills[skill.name] || 0) + 10))}
                                    disabled={char.totalSkillPoints >= 720 && !char.skills[skill.name]}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <Separator />

          {/* Pricing Options */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Additional Options</h3>
            
            <div className="space-y-4">
              {/* Suit Options */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4" />
                  Suit Tier (per character)
                </Label>
                <Select value={suitTier} onValueChange={(value: any) => setSuitTier(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Suit - $0</SelectItem>
                    <SelectItem value="basic">Basic Suit - $25</SelectItem>
                    <SelectItem value="premium">Premium Suit - $50</SelectItem>
                    <SelectItem value="legendary">Legendary Suit - $100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mount Option */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mount"
                  checked={addMount}
                  onCheckedChange={(checked) => setAddMount(checked === true)}
                />
                <Label htmlFor="mount" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Add Mount (+$5 per character)
                </Label>
              </div>

              {/* Books Option */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="books"
                  checked={addBooks}
                  onCheckedChange={(checked) => setAddBooks(checked === true)}
                />
                <Label htmlFor="books" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Add Spell Books & Rune Books (+$3 per character)
                </Label>
              </div>

              {/* House Option */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="house"
                  checked={addHouse}
                  onCheckedChange={(checked) => setAddHouse(checked === true)}
                />
                <Label htmlFor="house" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Include House (+$50)
                </Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Price Summary & Add to Cart */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-amber-800">Total Price</h3>
              <div className="text-2xl font-bold text-amber-800">
                ${calculateTotalPrice()}
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Base ({numCharacters} characters):</span>
                <span>${numCharacters * 50}</span>
              </div>
              {suitTier !== 'none' && (
                <div className="flex justify-between">
                  <span>Suits ({suitTier}):</span>
                  <span>${({ basic: 25, premium: 50, legendary: 100 }[suitTier] || 0) * numCharacters}</span>
                </div>
              )}
              {addMount && (
                <div className="flex justify-between">
                  <span>Mounts:</span>
                  <span>${5 * numCharacters}</span>
                </div>
              )}
              {addBooks && (
                <div className="flex justify-between">
                  <span>Books:</span>
                  <span>${3 * numCharacters}</span>
                </div>
              )}
              {addHouse && (
                <div className="flex justify-between">
                  <span>House:</span>
                  <span>$50</span>
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-amber-600 hover:bg-amber-700"
              disabled={getTotalSkillPoints() > getMaxSkillPoints() || !selectedShard}
            >
              Add Custom Account to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

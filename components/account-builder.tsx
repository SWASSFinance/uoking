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
  { name: 'Anatomy', category: 'Combat', maxPoints: 120 },
  { name: 'Archery', category: 'Combat', maxPoints: 120 },
  { name: 'Fencing', category: 'Combat', maxPoints: 120 },
  { name: 'Healing', category: 'Combat', maxPoints: 120 },
  { name: 'Mace Fighting', category: 'Combat', maxPoints: 120 },
  { name: 'Parrying', category: 'Combat', maxPoints: 120 },
  { name: 'Swordsmanship', category: 'Combat', maxPoints: 120 },
  { name: 'Tactics', category: 'Combat', maxPoints: 120 },
  { name: 'Wrestling', category: 'Combat', maxPoints: 120 },
  
  // Magic Skills
  { name: 'Chivalry', category: 'Magic', maxPoints: 120 },
  { name: 'Evaluate Intelligence', category: 'Magic', maxPoints: 120 },
  { name: 'Magery', category: 'Magic', maxPoints: 120 },
  { name: 'Meditation', category: 'Magic', maxPoints: 120 },
  { name: 'Resist Spells', category: 'Magic', maxPoints: 120 },
  { name: 'Necromancy', category: 'Magic', maxPoints: 120 },
  { name: 'Spirit Speak', category: 'Magic', maxPoints: 120 },
  { name: 'Mysticism', category: 'Magic', maxPoints: 120 },
  { name: 'Focus', category: 'Magic', maxPoints: 120 },
  { name: 'Imbuing', category: 'Magic', maxPoints: 120 },
  { name: 'Bushido', category: 'Magic', maxPoints: 120 },
  { name: 'Ninjitsu', category: 'Magic', maxPoints: 120 },
  
  // Crafting Skills
  { name: 'Alchemy', category: 'Crafting', maxPoints: 100 },
  { name: 'Blacksmithy', category: 'Crafting', maxPoints: 120 },
  { name: 'Bowcraft/Fletching', category: 'Crafting', maxPoints: 100 },
  { name: 'Carpentry', category: 'Crafting', maxPoints: 100 },
  { name: 'Cartography', category: 'Crafting', maxPoints: 100 },
  { name: 'Cooking', category: 'Crafting', maxPoints: 100 },
  { name: 'Inscribe', category: 'Crafting', maxPoints: 100 },
  { name: 'Tailoring', category: 'Crafting', maxPoints: 120 },
  { name: 'Tinkering', category: 'Crafting', maxPoints: 100 },
  { name: 'Fishing', category: 'Crafting', maxPoints: 120 },
  { name: 'Lumberjacking', category: 'Crafting', maxPoints: 100 },
  { name: 'Mining', category: 'Crafting', maxPoints: 100 },
  
  // Gathering Skills
 
  // Taming Skills
  { name: 'Animal Lore', category: 'Taming', maxPoints: 120 },
  { name: 'Animal Taming', category: 'Taming', maxPoints: 120 },
  { name: 'Herding', category: 'Taming', maxPoints: 100 },
  { name: 'Veterinary', category: 'Taming', maxPoints: 120 },
  
  // Stealth Skills
  { name: 'Detecting Hidden', category: 'Stealth', maxPoints: 100 },
  { name: 'Hiding', category: 'Stealth', maxPoints: 100 },
  { name: 'Lockpicking', category: 'Stealth', maxPoints: 100 },
  { name: 'Poisoning', category: 'Stealth', maxPoints: 100 },
  { name: 'Remove Trap', category: 'Stealth', maxPoints: 100 },
  { name: 'Snooping', category: 'Stealth', maxPoints: 100 },
  { name: 'Stealing', category: 'Stealth', maxPoints: 120 },
  { name: 'Stealth', category: 'Stealth', maxPoints: 120 },
  
  // Bard Skills
  { name: 'Discordance', category: 'Bard', maxPoints: 120 },
  { name: 'Musicianship', category: 'Bard', maxPoints: 120 },
  { name: 'Peacemaking', category: 'Bard', maxPoints: 120 },
  { name: 'Provocation', category: 'Bard', maxPoints: 120 },
  
 
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
  race: 'Human' | 'Elf' | 'Gargoyle';
  skills: { [skillName: string]: number };
  totalSkillPoints: number;
}

interface AccountBuilderProps {
  onAddToCart: (accountConfig: any) => void;
}

export default function AccountBuilder({ onAddToCart }: AccountBuilderProps) {
  const [numCharacters, setNumCharacters] = useState(1);
  const [characters, setCharacters] = useState<Character[]>([
    { id: '1', name: '', gender: 'Male', race: 'Human', skills: {}, totalSkillPoints: 0 }
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
          race: 'Human',
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
        const skill = UO_SKILLS.find(s => s.name === skillName);
        const maxPoints = skill?.maxPoints || 100;
        
        if (points === 0) {
          delete newSkills[skillName];
        } else {
          newSkills[skillName] = Math.min(points, maxPoints);
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

  const updateCharacterRace = (characterId: string, race: 'Human' | 'Elf' | 'Gargoyle') => {
    setCharacters(prev => prev.map(char => 
      char.id === characterId ? { ...char, race } : char
    ));
  };

  const calculateTotalPrice = () => {
    // Base pricing matches your existing products: $109.99, $169.99, $249.99, $299.99, $349.99
    const basePrices = {
      1: 109.99,
      2: 169.99,
      3: 249.99,
      4: 299.99,
      5: 349.99,
      6: 399.99,
      7: 449.99
    };
    
    let basePrice = basePrices[numCharacters as keyof typeof basePrices] || (numCharacters * 60);
    
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
    
    return Math.round(basePrice * 100) / 100; // Round to 2 decimal places
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
          race: char.race,
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
  const applyDragoonTemplate = (characterId: string) => {
    const DragoonSkills = {
      'Swordsmanship': 120,
      'Tactics': 100,
      'Anatomy': 100,
      'Healing': 100,
      'Parrying': 100,
      'Resist Spells': 110,
      'Bushido': 90
    };
    
    setCharacters(prev => prev.map(char => {
      if (char.id === characterId) {
        const totalSkillPoints = Object.values(DragoonSkills).reduce((sum, val) => sum + val, 0);
        return {
          ...char,
          skills: DragoonSkills,
          totalSkillPoints
        };
      }
      return char;
    }));
  };
  // Quick template functions
  const applyWarriorTemplate = (characterId: string) => {
    const warriorSkills = {
      'Swordsmanship': 120,
      'Tactics': 110,
      'Anatomy': 110,
      'Necromancy': 100,
      'Parrying': 120,
      'Resist Spells': 100,
      'Chivalry': 60
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
  const applyMysticMageTemplate = (characterId: string) => {
    const MysticmageSkills = {
      'Magery': 120,
      'Evaluate Intelligence': 120,
      'Meditation': 120,
      'Mysticism': 120,
      'Focus': 120,
      'Resisting Spells': 120,
    };
    
    setCharacters(prev => prev.map(char => {
      if (char.id === characterId) {
        const totalSkillPoints = Object.values(MysticmageSkills).reduce((sum, val) => sum + val, 0);
        return {
          ...char,
          skills: MysticmageSkills,
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
      <Card className="border-amber-200 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-400">
            <User className="h-5 w-5" />
            Custom Account Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="numCharacters" className="text-sm">Characters</Label>
              <Select value={numCharacters.toString()} onValueChange={(value) => setNumCharacters(parseInt(value))}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Char{num > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="shard" className="text-sm">Shard</Label>
              <Select value={selectedShard} onValueChange={setSelectedShard}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select shard" />
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
            
            <div>
              <Label className="text-sm">Total Price</Label>
              <div className="h-9 flex items-center px-3 border rounded-md bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-600">
                <span className="font-bold text-amber-800 dark:text-amber-400">${calculateTotalPrice()}</span>
              </div>
            </div>
          </div>

          {/* Skill Points Summary */}
          <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-600">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Skill Points:</span>
              <Badge variant={getTotalSkillPoints() > getMaxSkillPoints() ? "destructive" : "default"} className="text-xs">
                {getTotalSkillPoints()} / {getMaxSkillPoints()}
              </Badge>
            </div>
            {getTotalSkillPoints() > getMaxSkillPoints() && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Exceeded maximum. Please reduce skills to continue.
              </p>
            )}
          </div>

          {/* Character Configuration */}
          <div>
            <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">Character Configuration</h3>
            
            {/* Character Tabs */}
            <Tabs value={activeCharacter} onValueChange={setActiveCharacter}>
              <TabsList className="grid w-full mb-3 h-8" style={{ gridTemplateColumns: `repeat(${Math.min(numCharacters, 7)}, 1fr)` }}>
                {characters.map(char => (
                  <TabsTrigger key={char.id} value={char.id} className="text-xs h-7">
                    #{char.id}
                  </TabsTrigger>
                ))}
              </TabsList>

              {characters.map(char => (
                <TabsContent key={char.id} value={char.id} className="space-y-3">
                  {/* Character Basic Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <Label htmlFor={`name-${char.id}`} className="text-sm">Name</Label>
                      <Input
                        id={`name-${char.id}`}
                        value={char.name}
                        onChange={(e) => updateCharacterName(char.id, e.target.value)}
                        placeholder="Character name"
                        className="h-8"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`gender-${char.id}`} className="text-sm">Gender</Label>
                      <Select value={char.gender} onValueChange={(value: 'Male' | 'Female') => updateCharacterGender(char.id, value)}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`race-${char.id}`} className="text-sm">Race</Label>
                      <Select value={char.race} onValueChange={(value: 'Human' | 'Elf' | 'Gargoyle') => updateCharacterRace(char.id, value)}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Human">Human</SelectItem>
                          <SelectItem value="Elf">Elf</SelectItem>
                          <SelectItem value="Gargoyle">Gargoyle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-sm">Skills Used</Label>
                      <div className="h-8 flex items-center px-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                        <Badge variant={char.totalSkillPoints > 720 ? "destructive" : "default"} className="text-xs">
                          {char.totalSkillPoints}/720
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Skills Configuration */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">Skills</h4>
                    </div>
                    
                    {/* Quick Templates */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applyWarriorTemplate(char.id)}
                        className="text-xs h-7 px-2"
                      >
                        Samp Swords
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applyWarriorTemplate(char.id)}
                        className="text-xs h-7 px-2"
                      >
                        Dragoon Healer Swords
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applyMysticMageTemplate(char.id)}
                        className="text-xs h-7 px-2"
                      >
                       Mystic Mage
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applyDragoonTemplate(char.id)}
                        className="text-xs h-7 px-2"
                      >
                        Mage
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applyCrafterTemplate(char.id)}
                        className="text-xs h-7 px-2"
                      >
                        Crafter
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, skills: {}, totalSkillPoints: 0 } : c))}
                        className="text-xs h-7 px-2 text-red-600"
                      >
                        Clear
                      </Button>
                    </div>
                    
                    {/* Skills by Category */}
                    <Tabs defaultValue={skillCategories[0]} className="w-full">
                      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-8">
                        {skillCategories.map(category => (
                          <TabsTrigger key={category} value={category} className="text-xs h-7">
                            {category.slice(0, 6)}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      
                      {skillCategories.map(category => (
                        <TabsContent key={category} value={category} className="space-y-1">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                            {UO_SKILLS.filter(skill => skill.category === category).map(skill => (
                              <div key={skill.name} className="flex items-center justify-between p-1.5 border border-gray-200 dark:border-gray-600 rounded text-xs bg-white dark:bg-gray-800">
                                <span className="font-medium truncate flex-1 mr-2 text-gray-800 dark:text-gray-200">{skill.name}</span>
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateCharacterSkill(char.id, skill.name, Math.max(0, (char.skills[skill.name] || 0) - 10))}
                                    disabled={!char.skills[skill.name]}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Minus className="h-2 w-2" />
                                  </Button>
                                  <Input
                                    type="number"
                                    min="0"
                                    max={skill.maxPoints}
                                    value={char.skills[skill.name] || 0}
                                    onChange={(e) => updateCharacterSkill(char.id, skill.name, parseInt(e.target.value) || 0)}
                                    className="w-16 h-6 text-center text-xs"
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateCharacterSkill(char.id, skill.name, Math.min(skill.maxPoints, (char.skills[skill.name] || 0) + 10))}
                                    disabled={char.totalSkillPoints >= 720 && !char.skills[skill.name]}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Plus className="h-2 w-2" />
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
            <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">Additional Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Suit Options */}
              <div>
                <Label className="flex items-center gap-2 mb-2 text-sm">
                  <Shield className="h-3 w-3" />
                  Suit Tier (per char)
                </Label>
                <Select value={suitTier} onValueChange={(value: any) => setSuitTier(value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None - $0</SelectItem>
                    <SelectItem value="basic">Basic - $25</SelectItem>
                    <SelectItem value="premium">Premium - $50</SelectItem>
                    <SelectItem value="legendary">Legendary - $100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mount"
                    checked={addMount}
                    onCheckedChange={(checked) => setAddMount(checked === true)}
                  />
                  <Label htmlFor="mount" className="flex items-center gap-1 text-sm">
                    <Zap className="h-3 w-3" />
                    Mount (+$5/char)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="books"
                    checked={addBooks}
                    onCheckedChange={(checked) => setAddBooks(checked === true)}
                  />
                  <Label htmlFor="books" className="flex items-center gap-1 text-sm">
                    <BookOpen className="h-3 w-3" />
                    Books (+$3/char)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="house"
                    checked={addHouse}
                    onCheckedChange={(checked) => setAddHouse(checked === true)}
                  />
                  <Label htmlFor="house" className="flex items-center gap-1 text-sm">
                    <Home className="h-3 w-3" />
                    House (+$50)
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Price Summary & Add to Cart */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-600">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-amber-800 dark:text-amber-400">Total</h3>
              <div className="text-xl font-bold text-amber-800 dark:text-amber-400">
                ${calculateTotalPrice()}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-300 mb-3">
              <div className="flex justify-between">
                <span>Base ({numCharacters} chars):</span>
                <span>${(() => {
                  const basePrices = { 1: 109.99, 2: 169.99, 3: 249.99, 4: 299.99, 5: 349.99, 6: 399.99, 7: 449.99 };
                  return (basePrices as any)[numCharacters] || (numCharacters * 60);
                })()}</span>
              </div>
              {suitTier !== 'none' && (
                <div className="flex justify-between">
                  <span>Suits ({suitTier}):</span>
                  <span>+${({ basic: 25, premium: 50, legendary: 100 }[suitTier] || 0) * numCharacters}</span>
                </div>
              )}
              {addMount && (
                <div className="flex justify-between">
                  <span>Mounts:</span>
                  <span>+${5 * numCharacters}</span>
                </div>
              )}
              {addBooks && (
                <div className="flex justify-between">
                  <span>Books:</span>
                  <span>+${3 * numCharacters}</span>
                </div>
              )}
              {addHouse && (
                <div className="flex justify-between">
                  <span>House:</span>
                  <span>+$50</span>
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-amber-600 hover:bg-amber-700 h-9"
              disabled={getTotalSkillPoints() > getMaxSkillPoints() || !selectedShard}
            >
              Add to Cart - ${calculateTotalPrice()}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

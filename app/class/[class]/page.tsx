import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Star, Shield, Zap, Target, Users, Sword, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default async function ClassPage({ params }: { params: Promise<{ class: string }> }) {
  const { class: classParam } = await params
  // Function to convert item name to URL-friendly slug
  const createProductSlug = (itemName: string) => {
    return itemName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim()
  }

  const classData = {
    mage: {
      name: "Mage",
      description: "In the mystical realms of Ultima Online, Mage Items are the lifeblood of any aspiring spellcaster, infusing your character with the arcane power needed to dominate both the battlefield and the enchanting wilderness. These items, ranging from enchanted staves to mystical robes, are meticulously designed to amplify your magical abilities, ensuring that each spell cast is more potent, precise, and impactful.",
      icon: Zap,
      color: "from-purple-500 to-purple-600",
      itemCount: 150,
      popular: true,
      features: [
        "Spell Damage Increase (SDI)",
        "Faster Cast Recovery (FCR)",
        "Mana Regeneration",
        "Lower Mana Cost",
        "Spell Channeling",
        "Hit Point Regeneration"
      ],
      items: [
        { name: "Hawkwinds Robe", price: 3.99 },
        { name: "SDI Spellbook 40 Plus", price: 6.49 },
        { name: "SDI Spellbook 45 Plus", price: 14.99 },
        { name: "SDI Spellbook 50 Max", price: 59.99 },
        { name: "Yukio's Glass Earrings", price: 17.99 },
        { name: "Spell Woven Britches", price: 1.99 },
        { name: "Robe of the Dark Monk", price: 79.99 },
        { name: "Artio's Vine Wrap", price: 5.99 },
        { name: "Fallen Mystic's Spellbook", price: 6.99 },
        { name: "Totem of the Void", price: 1.99 },
        { name: "Anon's Spellbook", price: 5.49 },
        { name: "Scrapper's Compendium", price: 2.49 },
        { name: "Alchemist's Abomination", price: 14.99 },
        { name: "Ring of the Soulbinder", price: 9.99 },
        { name: "Drogeni's Spellbook", price: 79.99 },
        { name: "Mantle Of The Archlich", price: 59.99 },
        { name: "Tabard Of The Fallen Paladin", price: 11.99 },
        { name: "Cowl Of The Archlich", price: 14.99 },
        { name: "Collar Of The Archlich", price: 9.99 },
        { name: "Virtue Shield", price: 8.99 },
        { name: "Mythical Detective of the Royal Guard [REPLICA]", price: 2.99 },
        { name: "Cuffs Of The Archmage", price: 8.99 },
        { name: "Tangle", price: 4.99 },
        { name: "Hooded Robe Bearing the Crest", price: 5.99 },
        { name: "Conjurers Garb", price: 5.99 },
        { name: "Slither", price: 32.99 },
        { name: "Leurocians Mempo of Fortune", price: 28.99 },
        { name: "The Scholar's Halo", price: 5.99 },
        { name: "Jumu's Sacred Hide", price: 2.99 },
        { name: "Ranger's Cloak of Augmentation", price: 6.99 },
        { name: "Royal Guard LT Sash", price: 6.99 },
        { name: "Conjurers Garb Luck", price: 14.99 },
        { name: "Gloves Of The Archlich", price: 59.99 },
        { name: "Wizard's Curio", price: 3.99 },
        { name: "Mana Phasing Orb", price: 4.49 },
        { name: "Glacial Spellbook", price: 49.99 },
        { name: "Juo'nar's Grimoire", price: 3.99 },
        { name: "Mage's Hood of Scholarly Insight", price: 19.99 },
        { name: "Elegant Collar Of Fortune", price: 24.99 },
        { name: "Scroll of Valiant Commendation", price: 3.49 },
        { name: "Crown of Arcane Temperament", price: 2.99 },
        { name: "Mage Suit Defensive PVM 77 SDI", price: 44.99 },
        { name: "Hephaestus", price: 4.99 },
        { name: "Light's Rampart [Replica]", price: 4.49 },
        { name: "Arcane Shield", price: 5.99 },
        { name: "Armor of Fortune", price: 17.99 },
        { name: "Mage Suit PVM 104 SDI", price: 89.99 },
        { name: "Minax Sandals", price: 7.99 },
        { name: "(New) Luck Suit 2645 Yukio All 70", price: 119.99 },
        { name: "120 Evaluate Intelligence", price: 1.49 },
        { name: "Sorcerer's Suit", price: 6.49 },
        { name: "Hat of the Magi", price: 1.99 },
        { name: "120 Magery", price: 4.99 },
        { name: "120 Meditation", price: 3.99 },
        { name: "Inquisitor's Resolution", price: 2.99 },
        { name: "120 Mysticism", price: 0.99 },
        { name: "5.0 Evaluate Intel", price: 2.49 },
        { name: "120 Necromancy", price: 0.99 },
        { name: "120 Parrying", price: 8.99 },
        { name: "Protector of the Battle Mage", price: 5.99 },
        { name: "Ornament of the Magician", price: 1.99 },
        { name: "120 Resisting Spells", price: 9.99 },
        { name: "Staff of the Magi", price: 0.99 },
        { name: "Kotl Black Rod", price: 7.49 },
        { name: "Balakai's Shaman Staff", price: 1.99 },
        { name: "Swords Of Prosperity", price: 1.29 },
        { name: "Staff of Pyros", price: 1.99 },
        { name: "Balakai's Shaman Staff Wand", price: 24.99 },
        { name: "120 Wrestling", price: 2.99 },
        { name: "5.0 Mysticism", price: 2.99 },
        { name: "5.0 Resisting Spells", price: 2.29 },
        { name: "5.0 Spellweaving", price: 3.49 },
        { name: "5.0 Spirit Speak", price: 1.49 },
        { name: "5.0 Wrestling", price: 2.49 },
        { name: "Big Majik Flippers", price: 4.99 },
        { name: "Sandals Double Blessed", price: 4.99 }
      ],
      veteranDescription: "Imagine you are a seasoned mage, well-versed in the arcane arts and ever in search of relics that can enhance your spellcasting prowess. Your journey has led you to a treasure trove of Mage Items, each one humming with latent power. The Elder's Spellbook, its pages crackling with energy, boosts your spell damage and casting speed, transforming simple incantations into devastating forces of nature. Meanwhile, the Archmage's Robe, woven with threads of pure mana, envelops you in an aura of protection and regeneration, allowing you to stand firm amidst the chaos of battle. As you peruse these artifacts, you come across the Sorcerer's Amulet, a delicate yet powerful piece that augments your mana pool and enhances your spell accuracy, making every fireball and lightning strike land with lethal precision. These items are not merely tools; they are extensions of your will, channeling the raw forces of magic into disciplined, destructive spells. Each Mage Item has its own story, often obtained through braving ancient dungeons, completing perilous quests, or mastering the art of crafting using rare and mystical components. As you gather these powerful relics, your capabilities as a mage expand, allowing you to summon storms, heal allies, and vanquish foes with unparalleled efficiency. For mages who seek to transcend the ordinary and become legends of magic, the quest for the ultimate Mage Items is a journey worth undertaking. Embrace these enchanted artifacts, and let your arcane legacy shine brilliantly in the world of Ultima Online."
    },
         tamer: {
       name: "Tamer",
       description: "Every seasoned adventurer in Ultima Online knows that the true strength of a Tamer lies not only in their mastery over beasts but also in the powerful artifacts they wield to enhance their connection with their companions. Tamer Items are designed to fortify this bond, providing essential boosts that transform a simple pet into a legendary ally, capable of turning the tide of any encounter.",
       icon: Users,
       color: "from-green-500 to-green-600",
       itemCount: 120,
       popular: false,
       features: [
         "Taming Bonus",
         "Lore Bonus",
         "Mana Regeneration",
         "Lower Mana Cost",
         "Faster Cast Recovery",
         "Hit Point Regeneration"
       ],
       items: [
         { name: "Void Mare 3 Slot Untrained", price: 4.99 },
         { name: "White Wyrm Frost", price: 24.99 },
         { name: "Void Mare 2 Slot Untrained", price: 19.99 },
         { name: "White Cu Untrained", price: 12.99 },
         { name: "Ice Cu Untrained", price: 9.99 },
         { name: "Dread Mare (old)", price: 199.99 },
         { name: "Yukio's Glass Earrings", price: 17.99 },
         { name: "Wildfire Ostard", price: 99.98 },
         { name: "Fire Steed Untrained", price: 6.99 },
         { name: "White Wyrm (Untrained)", price: 6.99 },
         { name: "Frost Dragon", price: 13.99 },
         { name: "Cold Drake", price: 12.99 },
         { name: "Stat Scroll Plus 25", price: 2.99 },
         { name: "Triton Untrained", price: 2.49 },
         { name: "Pet Bonding Potion", price: 6.99 },
         { name: "Najasaurus Untrained", price: 8.99 },
         { name: "Serpent Skin Quiver", price: 59.99 },
         { name: "Ring of the Soulbinder", price: 9.99 },
         { name: "Mantle Of The Archlich", price: 59.99 },
         { name: "Tabard Of The Fallen Paladin", price: 11.99 },
         { name: "Cowl Of The Archlich", price: 14.99 },
         { name: "Collar Of The Archlich", price: 9.99 },
         { name: "Red Mare 2 Slot Untrained", price: 44.99 },
         { name: "Red Mare 3 Slot Untrained", price: 11.99 },
         { name: "Dull Copper Mare 2 Slot Untrained", price: 29.99 },
         { name: "Dull Copper Mare 3 Slot Untrained", price: 8.99 },
         { name: "Green Mare 2 Slot Untrained", price: 69.99 },
         { name: "Green Mare 3 Slot Untrained", price: 19.99 },
         { name: "Purple Mare 2 Slot Untrained", price: 289.99 },
         { name: "Purple Mare 3 Slot Untrained", price: 89.00 },
         { name: "Balron Red Mare 2 Slot Untrained", price: 179.00 },
         { name: "Balron Red Mare 3 Slot Untrained", price: 49.00 },
         { name: "Bane Dragon", price: 199.99 },
         { name: "Serpent Skin Quiver Counterfeit", price: 12.99 },
         { name: "Totem of Chromatic Fortune", price: 3.99 },
         { name: "Virtue Shield", price: 8.99 },
         { name: "Mark of Wildfire", price: 119.99 },
         { name: "120 Animal Taming", price: 1.49 },
         { name: "120 Animal Lore", price: 1.49 },
         { name: "Tangle", price: 4.99 },
         { name: "Hooded Robe Bearing the Crest", price: 5.99 },
         { name: "Conjurers Garb", price: 5.99 },
         { name: "Leurocians Mempo of Fortune", price: 28.99 },
         { name: "Lucky Charm", price: 3.49 },
         { name: "Jumu's Sacred Hide", price: 2.99 },
         { name: "Ranger's Cloak of Augmentation", price: 6.99 },
         { name: "Royal Guard LT Sash", price: 6.99 },
         { name: "Etoile And Nova Bleue", price: 6.99 },
         { name: "Epaulette Bearing The Crest Of Blackthorn", price: 8.99 },
         { name: "Conjurers Garb Luck", price: 14.99 },
         { name: "Gloves Of The Archlich", price: 59.99 },
         { name: "Elegant Collar Of Fortune", price: 24.99 },
         { name: "Scroll of Valiant Commendation", price: 3.49 },
         { name: "Animal Lore Alacrity", price: 2.49 },
         { name: "Armor of Fortune", price: 17.99 },
         { name: "Minax Sandals", price: 7.99 },
         { name: "5.0 Animal Lore", price: 1.99 },
         { name: "Animal Taming Alacrity", price: 2.49 },
         { name: "Caster's Luck Suit 2595", price: 129.99 },
         { name: "5.0 Animal Taming", price: 8.49 },
         { name: "(New) Luck Suit 2645 Yukio All 70", price: 119.99 },
         { name: "120 Evaluate Intelligence", price: 1.49 },
         { name: "Taming Jewelry Set", price: 4.49 },
         { name: "120 Magery", price: 4.99 },
         { name: "120 Meditation", price: 3.99 },
         { name: "120 Resisting Spells", price: 9.99 },
         { name: "Staff of the Magi", price: 0.99 },
         { name: "Kotl Black Rod", price: 7.49 },
         { name: "Balakai's Shaman Staff", price: 1.99 },
         { name: "Swords Of Prosperity", price: 1.29 },
         { name: "Staff of Pyros", price: 1.99 },
         { name: "120 Veterinary", price: 0.99 },
         { name: "5.0 Veterinary", price: 2.49 },
         { name: "Soles Of Providence", price: 2.49 },
         { name: "Big Majik Flippers", price: 4.99 },
         { name: "Sandals Double Blessed", price: 4.99 }
       ],
       veteranDescription: "Walking through the dense forests and vast deserts of Britannia, you recall the myriad creatures you've tamed and the invaluable items that have made your bond with them unbreakable. You think back to the moment you first held the Ring of the Vile, its dark magic coursing through you, amplifying your control and endurance as you commanded your ferocious dragon in battle. This ring, with its potent boosts to strength and dexterity, has been your ally in countless skirmishes, making your bond with your pets stronger and more resilient. Your eyes scan the Tamer's Satchel, a mystical bag imbued with properties that enhance your pet's abilities and grant you the power to summon creatures from distant lands. This satchel has been a key to your success, allowing you to call upon the most elusive and powerful beasts with ease. Then there's the Cloak of Silence, an essential piece of gear for any master tamer. This cloak grants you and your pets the stealth and agility to move undetected, striking with the element of surprise and retreating into the shadows when necessary. Each of these items is a testament to your journey as a tamer, earned through perilous quests, traded in bustling marketplaces, or crafted with rare and exotic materials. These artifacts do more than just enhance your abilities they represent the countless adventures and battles you've faced together with your loyal companions. For those who seek to harness the full potential of their bond with their pets, delving into the world of Tamer Items is a crucial step. These items are not merely tools but extensions of your very essence as a tamer, allowing you to explore the farthest corners of Britannia with unparalleled prowess and companionship. Embrace these powerful relics and watch as your bond with your beasts grows stronger, becoming a force to be reckoned with in the legendary world of Ultima Online."
     },
         melee: {
       name: "Melee",
       description: "For the warriors and knights who charge into the heat of battle in Ultima Online, Melee Items are the keystones of their strength and valor. These weapons and armor pieces are meticulously crafted to enhance the physical prowess and combat capabilities of those who engage in close-quarters combat. From the crushing power of a mighty war hammer to the sharp edge of a finely forged sword, melee items are indispensable tools for those who fight on the front lines of Britannia's many conflicts. Making a melee warrior for pvp or pve but need the items? For sampires and all warriors we have gathered a list of essential items for you to use. Maybe you are building a deathstriking bokuto warrior or blending together multiple skills with the use of jewelry. The items here are the foundation of things you will need when building up your fighter. All warriors in UO should try to aquire 45 hit chance increase in their builds.",
       icon: Sword,
       color: "from-red-500 to-red-600",
       itemCount: 200,
       popular: true,
       features: [
         "Damage Increase",
         "Defense Chance Increase",
         "Swing Speed Increase",
         "Stamina Regeneration",
         "Hit Chance Increase",
         "Hit Point Regeneration"
       ],
       items: [
         { name: "Anons Boots", price: 2.25 },
         { name: "Enchantress' Cameo - Reptile Slayer", price: 44.99 },
         { name: "Balron Bone Armor", price: 12.99 },
         { name: "Mark of the Destroyer", price: 6.49 },
         { name: "Despicable Quiver (Non-Fire)", price: 8.99 },
         { name: "Despicable Quiver (Fire)", price: 19.99 },
         { name: "Stat Scroll Plus 25", price: 2.99 },
         { name: "Solaria's Secret Poisons", price: 54.99 },
         { name: "Serpent Skin Quiver", price: 59.99 },
         { name: "Mushroom Cultivator's Apron", price: 19.85 },
         { name: "In Corp Mani Xen", price: 54.85 },
         { name: "Carved Bone Relic from Holmes", price: 99.99 },
         { name: "Sterling Silver Ring", price: 49.99 },
         { name: "Crimson Mace Belt", price: 35.99 },
         { name: "Crimson Sword Belt", price: 14.99 },
         { name: "Crimson Dagger Belt", price: 35.99 },
         { name: "Obi Bearing The Crest of Blackthorn (CC)", price: 8.99 },
         { name: "Tabard Of The Fallen Paladin", price: 11.99 },
         { name: "Cowl Of The Archlich", price: 14.99 },
         { name: "Collar Of The Archlich", price: 9.99 },
         { name: "Serpent Skin Quiver Counterfeit", price: 12.99 },
         { name: "Virtue Shield", price: 8.99 },
         { name: "Boots of Escaping", price: 24.99 },
         { name: "Hailstorm", price: 1.99 },
         { name: "Mythical Detective of the Royal Guard [REPLICA]", price: 2.99 },
         { name: "Crimson Cincture", price: 5.99 },
         { name: "Animated Legs Of The Insane Tinker", price: 22.99 },
         { name: "Feudal Grips", price: 8.99 },
         { name: "Conjurers Trinket", price: 29.99 },
         { name: "Slither", price: 32.99 },
         { name: "Mace and Shield Reading Glasses", price: 4.99 },
         { name: "Jumu's Sacred Hide", price: 2.99 },
         { name: "Ranger's Cloak of Augmentation", price: 6.99 },
         { name: "Enchantress Cameo - Elemental Slayer", price: 36.99 },
         { name: "Corrupted Paladin Vambraces", price: 8.99 },
         { name: "Duelist's Edge", price: 3.99 },
         { name: "Mana Phasing Orb", price: 4.49 },
         { name: "First Aid Belt", price: 29.99 },
         { name: "Helm of Vengeance", price: 8.99 },
         { name: "Cowl of the Mace and Shield", price: 7.99 },
         { name: "Captain John's Hat", price: 5.99 },
         { name: "Scroll of Valiant Commendation", price: 3.49 },
         { name: "Sampire Suit", price: 44.99 },
         { name: "5.0 Anatomy", price: 2.29 },
         { name: "Sampire Feudal Lord", price: 114.99 },
         { name: "120 Anatomy", price: 6.99 },
         { name: "Britches of Warding", price: 5.99 },
         { name: "Shanty's Waders", price: 1.49 },
         { name: "Ozymandias Obi", price: 3.99 },
         { name: "Totem of the Tribe", price: 1.99 },
         { name: "120 Bushido", price: 1.49 },
         { name: "120 Chivalry", price: 1.99 },
         { name: "Swordsman Spawn Set", price: 39.99 },
         { name: "Swordsman Abyss Set", price: 24.99 },
         { name: "120 Fencing", price: 0.99 },
         { name: "5.0 Bushido", price: 4.49 },
         { name: "Scout's Armor Set", price: 6.99 },
         { name: "120 Focus", price: 2.49 },
         { name: "120 Healing", price: 4.49 },
         { name: "120 Mace Fighting", price: 1.99 },
         { name: "5.0 Chivalry", price: 3.49 },
         { name: "Plate Helm of Blackthorn", price: 2.49 },
         { name: "Stormgrip", price: 1.99 },
         { name: "5.0 Fencing", price: 0.99 },
         { name: "120 Ninjitsu", price: 1.49 },
         { name: "120 Parrying", price: 8.99 },
         { name: "5.0 Healing", price: 2.49 },
         { name: "Spirit of the Totem", price: 5.49 },
         { name: "120 Swordsmanship", price: 1.99 },
         { name: "120 Tactics", price: 11.99 },
         { name: "Orc Chieftain Helm [Replica]", price: 39.99 },
         { name: "Moctapotl's Obsidian Sword", price: 2.49 },
         { name: "120 Throwing", price: 1.49 },
         { name: "120 Wrestling", price: 2.99 },
         { name: "5.0 Resisting Spells", price: 2.29 },
         { name: "5.0 Swordsmanship", price: 2.19 },
         { name: "5.0 Tactics", price: 4.29 },
         { name: "Basilisk Hide Breastplate", price: 4.99 },
         { name: "Big Majik Flippers", price: 4.99 },
         { name: "Sandals Double Blessed", price: 4.99 }
       ],
       veteranDescription: "Every scar and dent on your armor tells a story of the battles you've fought and the foes you've vanquished. As you examine your collection of melee items, you recall the visceral thrill of wielding the Mangler, a brutal weapon known for its ability to deliver devastating blows that can shatter an enemy's defenses. Its weight feels like an extension of your own strength, each swing a testament to your warrior's spirit. Your gaze shifts to the Ornate Axe, a masterpiece of craftsmanship that combines deadly precision with overwhelming force. This weapon has cleaved through countless adversaries, its balance and sharpness unmatched. Every time you heft this axe, you are reminded of the meticulous forging process and the raw power it grants you in the midst of combat. Beside your weapons lies the Plate of Honor, a set of armor that has protected you through the fiercest battles. Its gleaming surface is a testament to its durability and your dedication to maintaining it. This armor doesn't just shield you from harm; it embodies your commitment to standing resolute against any threat, providing formidable defense without compromising your agility. Then there's the Rune Blade, an enchanted sword that pulses with arcane energy. Each strike with this blade is enhanced by its magical properties, allowing you to cut through enemies with ease and channel mystical forces into your attacks. It is not just a weapon but a conduit for your inner power, turning every swing into a symphony of steel and magic. Every melee item in your arsenal has been acquired through trials of skill and courage. Whether looted from the bodies of formidable foes, earned as rewards for completing arduous quests, or forged with rare materials and unparalleled skill, these items are more than just tools they are symbols of your journey and your prowess in battle. For those who live by the sword and thrive in the clash of steel, the quest for the finest melee items is a never-ending pursuit. Explore the vast array of melee gear in Ultima Online and discover the perfect weapon or armor piece that resonates with your warrior's heart. Equip yourself with these powerful relics and continue carving your legend into the annals of Britannia."
     },
         ranged: {
       name: "Ranged",
       description: "In the expansive world of Ultima Online, Ranged Items are the backbone of those who excel at attacking from a distance, striking with precision and agility. These items include bows, crossbows, throwing weapons, and specialized ammunition, all designed to enhance your ability to deal damage from afar while keeping yourself out of harm's way. For archers, marksmen, and stealthy assassins, the right ranged weapon is crucial to mastering their craft and dominating the battlefield. Are you looking to buy some ranged gear for your uo character? We have sorted some items here for archers and throwers. Throwers are one of the best ranged characters because you never need ammo, but they are only used on gargoyles though. I bet you a stealth warrior looking for the perfect items so take a look and see if we have anything you like.",
       icon: Target,
       color: "from-blue-500 to-blue-600",
       itemCount: 180,
       popular: false,
       features: [
         "Hit Chance Increase",
         "Damage Increase",
         "Faster Cast Recovery",
         "Stamina Regeneration",
         "Defense Chance Increase",
         "Swing Speed Increase"
       ],
       items: [
         { name: "Anons Boots", price: 2.25 },
         { name: "Enchantress' Cameo - Reptile Slayer", price: 44.99 },
         { name: "Bow Of The Infinite Swarm", price: 8.99 },
         { name: "Mark of the Destroyer", price: 6.49 },
         { name: "Arrows 60K", price: 1.59 },
         { name: "Stat Scroll Plus 25", price: 2.99 },
         { name: "Halawa's Hunting Bow", price: 1.99 },
         { name: "Solaria's Secret Poisons", price: 54.99 },
         { name: "Serpent Skin Quiver", price: 59.99 },
         { name: "Carved Bone Relic from Holmes", price: 99.99 },
         { name: "Sterling Silver Ring", price: 49.99 },
         { name: "Obi Bearing The Crest of Blackthorn (CC)", price: 8.99 },
         { name: "Tabard Of The Fallen Paladin", price: 11.99 },
         { name: "Cowl Of The Archlich", price: 14.99 },
         { name: "Collar Of The Archlich", price: 9.99 },
         { name: "Serpent Skin Quiver Counterfeit", price: 12.99 },
         { name: "Sentinal's Mempo Atlantic Only", price: 21.99 },
         { name: "Shadow's Fury", price: 8.99 },
         { name: "Boots of Escaping", price: 24.99 },
         { name: "Mythical Detective of the Royal Guard [REPLICA]", price: 2.99 },
         { name: "Crimson Cincture", price: 5.99 },
         { name: "Animated Legs Of The Insane Tinker", price: 22.99 },
         { name: "Feudal Grips", price: 8.99 },
         { name: "Slither", price: 32.99 },
         { name: "Mace and Shield Reading Glasses", price: 4.99 },
         { name: "Jumu's Sacred Hide", price: 2.99 },
         { name: "Ranger's Cloak of Augmentation", price: 6.99 },
         { name: "Enchantress Cameo - Elemental Slayer", price: 36.99 },
         { name: "Corrupted Paladin Vambraces", price: 8.99 },
         { name: "Duelist's Edge", price: 3.99 },
         { name: "Mana Phasing Orb", price: 4.49 },
         { name: "First Aid Belt", price: 29.99 },
         { name: "Helm of Vengeance", price: 8.99 },
         { name: "Cowl of the Mace and Shield", price: 7.99 },
         { name: "Captain John's Hat", price: 5.99 },
         { name: "Scroll of Valiant Commendation", price: 3.49 },
         { name: "Sampire Suit", price: 44.99 },
         { name: "5.0 Anatomy", price: 2.29 },
         { name: "Archer Suit", price: 54.99 },
         { name: "Sampire Feudal Lord", price: 114.99 },
         { name: "120 Anatomy", price: 6.99 },
         { name: "Britches of Warding", price: 5.99 },
         { name: "Shanty's Waders", price: 1.49 },
         { name: "120 Archery", price: 3.49 },
         { name: "Totem of the Tribe", price: 1.99 },
         { name: "Archer PvM Stamina Suit", price: 139.99 },
         { name: "120 Bushido", price: 1.49 },
         { name: "120 Chivalry", price: 1.99 },
         { name: "Bow Slayer Set No Dmg", price: 42.99 },
         { name: "Archer Spawn Set", price: 34.99 },
         { name: "5.0 Bushido", price: 4.49 },
         { name: "Scout's Armor Set", price: 6.99 },
         { name: "120 Focus", price: 2.49 },
         { name: "120 Healing", price: 4.49 },
         { name: "Plate Helm of Blackthorn", price: 2.49 },
         { name: "Hunters Headdress", price: 7.99 },
         { name: "Stormgrip", price: 1.99 },
         { name: "120 Ninjitsu", price: 1.49 },
         { name: "5.0 Healing", price: 2.49 },
         { name: "Spirit of the Totem", price: 5.49 },
         { name: "Orc Chieftain Helm [Replica]", price: 39.99 },
         { name: "Ironwood Composite Bow", price: 2.49 },
         { name: "Storm Caller", price: 3.29 },
         { name: "5.0 Resisting Spells", price: 2.29 },
         { name: "5.0 Tactics", price: 4.29 },
         { name: "Basilisk Hide Breastplate", price: 4.99 },
         { name: "5.0 Throwing", price: 0.99 },
         { name: "Big Majik Flippers", price: 4.99 },
         { name: "Sandals Double Blessed", price: 4.99 }
       ],
       veteranDescription: "As you draw back your bowstring and gaze across the horizon, memories of countless battles flash through your mind. Each notch on your Repeating Crossbow tells a tale of distant foes brought down by your unerring aim. This powerful weapon, with its rapid firing capability and enhanced accuracy, has been your trusted companion, allowing you to rain down a barrage of bolts on your enemies before they even realize where the attack is coming from. Your eyes then fall on the Elven Composite Longbow, a weapon known for its incredible range and devastating power. Crafted by the finest Elven artisans, this bow's sleek design and superior draw strength have enabled you to strike targets from great distances, piercing through even the toughest armor. The intricate carvings on its limbs and grip are a testament to its exquisite craftsmanship and the lethal precision it offers in battle. Hanging by your side is the Boomerang of Blight, a versatile throwing weapon that returns to your hand after each throw. Its unique properties allow you to strike multiple targets in quick succession, making it an invaluable tool when faced with numerous foes. This weapon's deadly accuracy and ability to hit from unexpected angles have turned many a battle in your favor. You also treasure the Quiver of Infinity, which not only carries a seemingly endless supply of arrows but also boosts your firing speed and damage. This magical quiver has seen you through the most prolonged skirmishes, ensuring that you never run out of ammunition at critical moments. Acquiring these ranged items often involves embarking on epic quests, battling powerful adversaries, or crafting them with rare and precious materials. Each piece in your collection represents a milestone in your journey as an archer, earned through skill, determination, and a keen eye for opportunity. For those who thrive on striking from the shadows and delivering death from a distance, exploring the vast array of ranged items in Ultima Online is essential. These weapons and accessories are more than just tools; they are extensions of your will, enabling you to master the art of ranged combat and leave your mark on the world of Britannia. Equip yourself with the finest ranged items and continue your quest to become the deadliest sharpshooter in the land."
     },
         thief: {
       name: "Thief",
       description: "For those who walk the shadowy path in Ultima Online, Thief Items are the lifeblood of their clandestine craft. These artifacts and equipment pieces are meticulously designed to enhance the skills and stealth capabilities of any rogue, allowing you to slip unseen past guards, pilfer valuable treasures, and evade capture with ease. Whether you're lurking in the darkness of a bustling city or navigating the dangers of a forgotten tomb, the right thief items can make all the difference in your adventures. These items were sorted to help those playing thieves find the items they need. All of these UO stealing items are listed here to help those in the thieving class get the items they need. All the thieving scrolls and bonus skill items are listed here for your benefit.",
       icon: Shield,
       color: "from-gray-500 to-gray-600",
       itemCount: 90,
       popular: false,
       features: [
         "Lockpicking Bonus",
         "Stealth Bonus",
         "Stamina Regeneration",
         "Faster Cast Recovery",
         "Defense Chance Increase",
         "Hit Point Regeneration"
       ],
       items: [
         { name: "Stat Scroll Plus 25", price: 2.99 },
         { name: "Royal Guard Investigator Cloak", price: 26.99 },
         { name: "5.0 Detect Hidden", price: 1.49 },
         { name: "Crown of Tal'keesh", price: 2.39 },
         { name: "Cloak of Silence", price: 6.99 },
         { name: "120 Ninjitsu", price: 1.49 },
         { name: "5.0 Hiding", price: 2.49 },
         { name: "Hiding Alacrity", price: 0.99 },
         { name: "120 Stealing", price: 0.99 },
         { name: "120 Stealth", price: 0.99 },
         { name: "5.0 Lockpicking", price: 2.49 },
         { name: "120 Wrestling", price: 2.99 },
         { name: "Ninjitsu Alacrity", price: 1.99 },
         { name: "5.0 Ninjitsu", price: 2.49 },
         { name: "5.0 Remove Trap", price: 1.49 },
         { name: "5.0 Snooping", price: 0.75 }
       ],
       veteranDescription: "As you navigate the dimly lit alleys and hidden passages of Britannia, you remember the thrill of your first successful heist, aided by the Shadow Cloak of Rejuvenation. This enchanted cloak, shimmering with faint traces of moonlight, grants you unparalleled stealth and faster recovery from your escapades, making it a staple in your collection. Its ability to blend you into the shadows has been your silent partner in countless escapades, allowing you to evade even the most vigilant guards. Your fingers instinctively brush against the Burglar's Band, a ring that enhances your dexterity and boosts your chances of successfully picking locks and pockets. With this ring, every chest and unsuspecting victim becomes an opportunity, turning the mundane into potential gold mines. Its power has turned you from a common pickpocket into a master of the craft, feared and revered in equal measure. Then there's the Boots of the Scout, light as a whisper and swift as the wind. These boots are your trusted companions, enabling you to move silently and with great speed. Whether you're making a quick getaway or closing in on your mark, their agility has never failed you. Each of these items is not just a tool but a testament to your evolution as a thief. They've been acquired through daring raids, clever trades, or painstaking craftsmanship, each piece adding a new layer to your abilities and persona. With every heist and escape, they grow more attuned to your skills, becoming extensions of your very self. For thieves who seek to master their art and outwit their foes, exploring the realm of Thief Items is essential. These items are more than mere gear; they are the keys to unlocking your full potential and embracing the life of a shadowy virtuoso in Ultima Online. Equip yourself with these clandestine treasures and watch as the world of Britannia unfolds at your fingertips, ripe for the taking."
     },
    crafter: {
      name: "Crafter",
      description: "In the world of Ultima Online, Crafter Items are the lifeblood of artisans and tradespeople who dedicate their skills to shaping the very fabric of Britannia. These tools and accessories are essential for those who transform raw materials into valuable goods, be it forging weapons, crafting armor, brewing potions, or tailoring exquisite garments. For blacksmiths, alchemists, tailors, and all other crafters, the right items can significantly enhance their productivity and the quality of their creations. All of these UO crafting items will help you with skills, resources and specialty items specifically for ultima online crafters. We are expanding our resource page to include all of the inbuing reagents. We have materials used for any crafter's needs. If you don't see something you want just ask about it on live chat and we can find it for you. These items will help you in ultima online if you have a crafter using any of these skills: Alchemy, Blacksmithing, Carpentry, Cooking, Tailoring, Tinkering, Imbuing, and Inscription.",
      icon: Crown,
      color: "from-yellow-500 to-yellow-600",
      itemCount: 100,
      popular: true,
      features: [
        "Exceptional Crafting Chance",
        "Resource Saving",
        "Durability Bonus",
        "Imbuing Skill Bonus",
        "Faster Production",
        "Bulk Order Deed Bonuses"
      ],
      items: [
        { name: "Recipe Crimson Sword Belt", price: 199.99 }, { name: "Oak Runic Fletcher's Tool x10", price: 7.49 }, { name: "Captured Essence x10", price: 2.99 }, { name: "Taint x100", price: 9.99 }, { name: "Lard of Paroxysmus x100", price: 2.99 }, { name: "Ash Boards 20K", price: 1.49 }, { name: "Yew Boards 10K", price: 1.49 }, { name: "Undying Flesh x300", price: 1.99 }, { name: "Luminescent Fungi x200", price: 1.59 }, { name: "Faery Dust x100", price: 1.59 }, { name: "Shimmering Crystals", price: 3.99 }, { name: "Blue Diamond x300", price: 1.59 }, { name: "Brilliant Amber x100", price: 1.59 }, { name: "Fire Ruby x200", price: 1.59 }, { name: "Perfect Emerald x400", price: 1.59 }, { name: "Scourge x100", price: 1.59 }, { name: "Chaga Mushroom x400", price: 1.59 }, { name: "Woodworker's Bench", price: 6.99 }, { name: "Bronze Runic Hammer x5", price: 2.99 }, { name: "Tiger Pelt x100", price: 1.99 }, { name: "Bark Fragment x10000", price: 1.59 }, { name: "Heartwood Runic Dovetail Saw", price: 2.99 }, { name: "Agapite Runic Hammer", price: 6.99 }, { name: "Verite Runic Hammer", price: 7.39 }, { name: "Golden Runic Hammer", price: 2.49 }, { name: "Ash Runic Fletcher's Tools x10", price: 5.99 }, { name: "Yew Runic Dovetail Saw x5", price: 2.99 }, { name: "Oak Runic Dovetail Saw x5", price: 1.99 }, { name: "Copper Runic Hammer x5", price: 2.99 }, { name: "Ringmail Blacksmith Gloves Of Mining", price: 0.99 }, { name: "5.0 Alchemy", price: 3.49 }, { name: "Whetstone of Enervation", price: 2.79 }, { name: "Powder of Fortification x10", price: 2.24 }, { name: "120 Blacksmith", price: 3.99 }, { name: "Ancient Hammer Plus 60", price: 1.69 }, { name: "5.0 Arms Lore", price: 0.99 }, { name: "Essence Set x100", price: 19.99 }, { name: "Gem Set x100", price: 8.99 }, { name: "Disenchant Set", price: 3.99 }, { name: "10k Colored Ingots", price: 19.99 }, { name: "5.0 Blacksmith", price: 1.99 }, { name: "5.0 Carpentry", price: 1.99 }, { name: "Spined Runic Sewing Kit x10", price: 2.99 }, { name: "120 Imbuing", price: 2.49 }, { name: "Horned Runic Sewing Kit x10", price: 3.99 }, { name: "5.0 Cartography", price: 1.49 }, { name: "Barbed Runic Sewing Kit x10", price: 3.99 }, { name: "Leather 60K", price: 1.49 }, { name: "5.0 Cooking", price: 1.99 }, { name: "Valorite Runic Hammer x5", price: 17.99 }, { name: "Spined Leather 10K", price: 1.99 }, { name: "Shadow Runic Hammer x5", price: 2.49 }, { name: "Horned Leather 10K", price: 1.99 }, { name: "Barbed Leather 10K", price: 1.99 }, { name: "Boards 60K", price: 1.49 }, { name: "5.0 Fishing", price: 2.39 }, { name: "5.0 Fletching", price: 1.49 }, { name: "Bloodwood Boards 10K", price: 1.49 }, { name: "Oak Boards 10K", price: 1.29 }, { name: "Black Moonstone", price: 5.99 }, { name: "Heartwood Boards 10K", price: 1.99 }, { name: "Frostwood Boards 10K", price: 2.49 }, { name: "5.0 Imbuing", price: 2.29 }, { name: "5.0 Inscription", price: 2.49 }, { name: "Iron Ingots 60K", price: 1.49 }, { name: "120 Tailoring", price: 1.49 }, { name: "Heartwood Runic Fletcher's Tool x5", price: 12.99 }, { name: "5.0 Mining", price: 0.99 }, { name: "5.0 Tailoring", price: 2.49 }, { name: "Raptor Teeth x100", price: 1.59 }, { name: "Void Orb x100", price: 2.19 }, { name: "Crystal Shards x100", price: 4.99 }, { name: "Daemon Claw x100", price: 3.39 }, { name: "Fey Wings x100", price: 1.99 }, { name: "Goblin Blood x200", price: 1.99 }, { name: "Crystalline Blackrock x100", price: 5.49 }, { name: "Boura Pelt x300", price: 1.99 }, { name: "Parasitic Plant x300", price: 1.59 }, { name: "5.0 Tinkering", price: 2.49 }, { name: "Cut Cloth 60K", price: 2.99 }
      ],
      veteranDescription: "In your workshop, surrounded by the hum of your forge and the scent of freshly tanned leather, you look upon your array of Crafter Items with a deep sense of pride and purpose. Each tool and accessory is a testament to your journey and the countless hours spent honing your craft. Your Ancient Hammer, worn smooth from use, is not just a tool but an extension of your will. It grants you exceptional crafting bonuses, allowing you to forge weapons and armor with unmatched durability and power. Every swing of this hammer is a blend of precision and force, turning raw metal into legendary artifacts sought after by warriors across the land. Next, you see the Alchemist's Apron, a garment that not only protects you from the splashes and fumes of potent elixirs but also enhances your alchemical prowess. With this apron, your potions brew with greater potency, and your experiments yield more successful results, making you a revered figure in the world of potion-making. Hanging on the wall is your Sewing Kit of Eminence, a masterwork tool that enables you to create clothing and armor with superior stats. Each stitch made with this kit imbues your creations with exceptional qualities, whether it's a robe that increases magical resistance or a suit of leather armor that provides enhanced agility and protection. In a corner of your workshop, the Carpenter's Toolbox sits ready for use, filled with tools that are essential for woodworking. This toolbox allows you to craft furniture, decorations, and even complex mechanical devices with ease and precision. The items you produce with these tools are not just functional but also works of art, gracing the homes and halls of Britannia's finest. Acquiring these crafter items often involves delving into dangerous dungeons to gather rare materials, trading with other skilled artisans, or completing challenging quests that test your crafting abilities to the limit. Each tool you possess is a marker of your skill and dedication, earned through perseverance and a relentless pursuit of excellence. For crafters who seek to perfect their trade and produce the highest quality goods, exploring the diverse array of crafter items in Ultima Online is crucial. These tools and accessories are more than just equipment; they are the keys to unlocking your full potential as a master artisan. Equip yourself with the finest crafter items and continue to shape the world of Britannia with your unparalleled craftsmanship."
    }
  }

  const currentClass = classData[classParam as keyof typeof classData]
  const IconComponent = currentClass?.icon || Crown

  if (!currentClass) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Class Not Found</h1>
            <p className="text-gray-600">The requested class could not be found.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className={`p-4 rounded-lg bg-gradient-to-r ${currentClass.color}`}>
                <IconComponent className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">UO {currentClass.name} Items</h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mt-4 leading-relaxed">
              {currentClass.description}
            </p>
            {currentClass.popular && (
              <Badge className="mt-4 bg-amber-500 text-white">Popular Class</Badge>
            )}
          </div>

                     {/* Class Items Grid - Show for Mage, Tamer, Melee, Ranged, Thief, and Crafter classes */}
           {(classParam === 'mage' || classParam === 'tamer' || classParam === 'melee' || classParam === 'ranged' || classParam === 'thief' || classParam === 'crafter') && 'items' in currentClass && Array.isArray(currentClass.items) && (
             <div className="mb-12">
               <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{currentClass.name} Items</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {currentClass.items.map((item: { name: string; price: number }, index: number) => (
                   <Link key={index} href={`/product/${createProductSlug(item.name)}`} className="block">
                     <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 hover:shadow-lg transition-shadow cursor-pointer">
                       <CardContent className="p-4">
                         <div className="flex justify-between items-start mb-3">
                           <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1 mr-2">{item.name}</h3>
                           <Badge className="bg-amber-600 text-white text-xs">${item.price}</Badge>
                         </div>
                         <Button className="w-full bg-amber-600 hover:bg-amber-700 text-sm">
                           <ShoppingCart className="h-4 w-4 mr-2" />
                           Add to Cart
                         </Button>
                       </CardContent>
                     </Card>
                   </Link>
                 ))}
               </div>
             </div>
           )}

          {/* Class Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {currentClass.features.map((feature, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border border-amber-200">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <Star className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{feature}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

                     {/* Veteran Class Description - Show for Mage, Tamer, Melee, Ranged, Thief, and Crafter classes */}
           {(classParam === 'mage' || classParam === 'tamer' || classParam === 'melee' || classParam === 'ranged' || classParam === 'thief' || classParam === 'crafter') && 'veteranDescription' in currentClass && currentClass.veteranDescription && (
             <div className="mb-12">
                                    <Card className={`bg-gradient-to-r ${
                       classParam === 'mage' ? 'from-purple-50 to-purple-100 border-purple-200' :
                       classParam === 'tamer' ? 'from-green-50 to-green-100 border-green-200' :
                       classParam === 'melee' ? 'from-red-50 to-red-100 border-red-200' :
                       classParam === 'ranged' ? 'from-blue-50 to-blue-100 border-blue-200' :
                       classParam === 'thief' ? 'from-gray-50 to-gray-100 border-gray-200' :
                       'from-yellow-50 to-yellow-100 border-yellow-200'
                     } border`}>
                 <CardContent className="p-8">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                           {classParam === 'mage' ? 'A Veteran Mage' :
                            classParam === 'tamer' ? 'A Master Tamer Reflecting on Their Journey' :
                            classParam === 'melee' ? 'A Battle-Hardened Warrior Reflecting on Their Arsenal' :
                            classParam === 'ranged' ? 'A Master Archer Reflecting on Their Arsenal' :
                            classParam === 'thief' ? 'A Cunning Thief Recounting Their Exploits' :
                            'A Legendary Crafter Reflecting on Their Tools'}
                         </h3>
                   <p className="text-gray-700 leading-relaxed text-lg">
                     {currentClass.veteranDescription}
                   </p>
                 </CardContent>
               </Card>
             </div>
           )}

          {/* Item Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-bold text-gray-900">Weapons</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4">Specialized weapons for {currentClass.name.toLowerCase()} characters</p>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">Browse Weapons</Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-bold text-gray-900">Armor</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4">Protective gear optimized for {currentClass.name.toLowerCase()} gameplay</p>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">Browse Armor</Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-bold text-gray-900">Accessories</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4">Jewelry and talismans for {currentClass.name.toLowerCase()} characters</p>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">Browse Accessories</Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-bold text-gray-900">Complete Suits</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4">Pre-configured {currentClass.name.toLowerCase()} suits</p>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">Browse Suits</Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg p-8 text-white text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">{currentClass.name} Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold">{currentClass.itemCount || (Array.isArray(currentClass.items) ? currentClass.items.length : 0)}</div>
                <div className="text-amber-200">Total Items</div>
              </div>
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-amber-200">Support Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{"<5min"}</div>
                <div className="text-amber-200">Average Delivery</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 px-8 py-3 text-lg">
              Browse All {currentClass.name} Items
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 
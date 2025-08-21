-- Add news table
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    posted_by VARCHAR(100) NOT NULL DEFAULT 'admin',
    date_posted DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for date ordering
CREATE INDEX idx_news_date_posted ON news(date_posted DESC);
CREATE INDEX idx_news_is_active ON news(is_active);

-- Insert existing news data from CSV
INSERT INTO news (id, title, message, posted_by, date_posted) VALUES
('11111111-1111-1111-1111-111111111111', 'The launch!', 'It is a proud day for us at UO King.  We are now live and accepting orders!', 'admin', '2018-02-25'),
('22222222-2222-2222-2222-222222222222', 'Guild Sponsoring & The No Dupe Alliance', 'Today marks another tremendous day for uo king and the ultima community.  I am thrilled to announce that we will begin sponsoring guilds every month based on a few factors like activeness, stability, and good attitute! Every month we will be giving away free gold and items to all sponsored guilds. 

-----------------------------
THE NO DUPE ALLIANCE

We here at UO King has begun the initiative to start the no dupe alliance, urging sellers of gold and items to state their stance on such practices.  We feel it is important that customers know they are dealing with gold and items that were gathered by 100% natural hard work and not through exploit, dupe or hack. ', 'admin', '2018-02-26'),
('33333333-3333-3333-3333-333333333333', '100 MIL GIVEAWAY', '<img src="/images/contest.png" alt="UO Contest"><BR>
<b>RULES:</b><BR>
Only 1 entry per person, per household. 
Registration information must be valid. <HR>
<b>Other great reasons to sign up:</b>
Exclusive discounts and cashback to members only. 
Advanced UI for catching IDOC''s. 
5 facet zoom-able customizable mapping system. 
First access to upcoming UO tools. ', 'admin', '2018-03-14'),
('44444444-4444-4444-4444-444444444444', 'UO Publish 99, Stygian Abyss - New players', 'Updated April 1st:
The winner of the 100 mil has been contacted to collect.  If for any reason they do not contact me back after 6 days I will draw a new winner.
----------------------------------------
A big move by UO today on March 29th! All accounts are now EJ and stygian abyss enabled! Wow so many players have been waiting for this moment for so long.  

Free 2 play is right around the corner now which could create a massive boom in new players. ', 'admin', '2018-03-29'),
('55555555-5555-5555-5555-555555555555', 'New Idoc System', 'Due to unreliability of the previous idoc finder I have developed a new one which is much more accurate and has 24/7 uptime.  I still have not released the zoom-able mapping yet but it will be shorty!

If you have not registered to uoking now is the time! The perks of being a uoking member continue to grow.', 'admin', '2018-04-03'),
('66666666-6666-6666-6666-666666666666', 'Recent Changes', 'We are happy to announce new changes here at UO King.  For starters, we will be giving away UO gold every weekend with trivia games in the discord! You can connect to the discord Saturday and Sunday nights at 8pm here: https://discord.gg/hG68sF We have also added new items to the store including imbuing ingredients and crafting resources.  The IDOC scanner is expanding to cover 5 more shards! We will continue to grow and provide useful tools to the UO community!', 'admin', '2018-08-07'),
('77777777-7777-7777-7777-777777777777', 'Thank you loyal customers!', 'We want to take some time to thank our customers and also keep you up to date on what''s going on.  Stay tuned for the back friday special sales. ', 'admin', '2018-11-10'),
('88888888-8888-8888-8888-888888888888', 'Price Checker Added, IDOC Updated, More coming!', 'Have you ever been frustrated trying to price check your items on very slow in-game vendor search or not even able to find the item for sale to get the price? I introduce to you the <a href=/PriceCheck/ style="color: blue;">Item Price Checker</a>! Do a search for the name of your items or use some of our pre-built item tabs for things like power scrolls, materials, primers, and more!', 'admin', '2019-03-09'),
('99999999-9999-9999-9999-999999999999', 'New content, items, gold prices and more!', 'Check out our store we have added a new pet the Triton.  This pet has healing and is extremely powerful.  It is part of the High Seas update for completing pirate quests.  We have add new items as well and updated gold prices to reflect demand.  Currently gold is very undervalued and there isn''t enough to go around.  It is starting to rise in cost to keep up with demand. This will eventually make the gold price of items less as each million UO gold is worth more money.', 'admin', '2019-05-08'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'We Now Accept Bitcoin / Crypto!', 'Anyone who wishes to place orders using bitcoin or other forms of digital currencies can speak with us directly on live chat to process their order. We will figure out your order total and convert it into the going rate of whatever crypto you wish to pay with and the wallet address to send it to.  Simple! ', 'admin', '2019-07-03'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Christmas is coming and so are UO gold sales!', 'Hello and happy holidays to all the UO players out there.  We are in the giving spirit this year and are working hard to roll out tons of new items, services, and vital tools to help you guys.  It is our goal to make UOKing the #1 place for everything related to Ultima Online. Have a problem with a missing item from the store or pricing? Just talk to us on live chat before making your order so we can ensure you get the best deal possible!', 'admin', '2019-11-09'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Happy New Years From UO King!', 'We are pleased to announce that all orders throughout January 2020 will include random rare items as a gift!  Loyal customers will reap the rewards that we deliver for the next 30 days! Expect to see over 200 more UO items added to the store in the coming days.', 'admin', '2019-12-30'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Stay safe during the Coronavirus! Play UO!', 'Hello again to everyone, we hope you are enjoying this extended time at home to catch up on your Ultima Online adventures.  It is now mid-march and the Tokuno arty runs are dying off to make way for the invasion! While plays are gearing up to try to grab some 50 SDI spellbooks we would like you to know we are here to help! We would like to thank all of our loyal and new customers for choosing up as the store to fill up on items and gold.  Please be safe out there and we will continue to help Ultima Online players get where they need to be.  Safe Travels, UOKing', 'admin', '2020-05-14'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Christmas is almost here for Ultima Online gold & items!', 'Yes it is that time of year again. The Krampus event is live and so is a new ice dungeon drops with turn in.  Another event with rare statues also going on in compassion.  Things really have been heating up in Ultima Online as we draw in on the end of the year.  I am happy to announce our gold is now a flat rate fee across the board at an even better deal than before.  We continue to add new items and grow our inventory.  A new layout is coming soon as well as some amazing new tools and features. ', 'admin', '2020-12-15'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'New Prices and Siege Added!', 'In 2021, UO King has been focus on delivering competitive gold prices and even the addition of Siege gold and items.  Every day we work hard in Ultima Online to give you the best service when ordering UO items.  We are taking the month of February to work on upcoming discount offers and special promotions.  We want our customers to feel like they get a 5-star experience when picking up their favorite items.  We have recently added new items and categories like reagents, potions, statues and more.', 'admin', '2021-02-18'),
('11111111-2222-3333-4444-555555555555', 'SUMMER SALE!', 'Come check out the hot sales on Transcendence Scrolls, Power Scrolls, and more!', 'admin', '2021-05-31'),
('22222222-3333-4444-5555-666666666666', 'Happy Holidays From UOKing!', 'Get ready for our winter sale coming up and kicking the new year off right!', 'admin', '2021-11-29'),
('33333333-4444-5555-6666-777777777777', 'Store hours on christmas', 'On Christmas eve and Christmas day store will be unavilable for delivery, orders will begin being processed Christmas night and delivered the next day. Thank you for your patience and happy holidays.', 'admin', '2021-12-24'),
('44444444-5555-6666-7777-888888888888', 'Luck Is In The Air', 'Check out the new and improved Max Luck Suit available now!', 'admin', '2022-01-13'),
('55555555-6666-7777-8888-999999999999', 'To The Winners!', 'Congrats to everyone who won, all have been contacted and or delivered to:
Tommy ~ 250 million gold - LA
Neil ~ Any 1 - 3 Year vet reward - ATL
David ~ 50 million gold - ATL
Rebecca ~ 50 million gold - ATL

In the event anyone does not respond within the 5 day period we will pick another winner.  Thank you everyone for your support, we will be doing more promotions and giveaways soon. ', 'admin', '2022-03-28'),
('66666666-7777-8888-9999-aaaaaaaaaaaa', 'Help us help you!', 'We are working hard to bring you competitive prices that match or beat the competition. We ask that if you see we are missing a item you want or that the price is much higher than others to reach out to us on live chat so we can correct it! UO King has served the UO community for over 20 years and will continue to do so! Thank you to all loyal customers.', 'admin', '2022-06-14'),
('77777777-8888-9999-aaaa-bbbbbbbbbbbb', 'New payments coming!', 'Since we are no longer using Paypal the last 2 weeks have been spent finding the right solution for our payment processing. We hope to back up and ready to process services in the next few days. ', 'admin', '2022-11-17'),
('88888888-9999-aaaa-bbbb-cccccccccccc', 'Payments Are Up And Working Again!', 'You can now checkout on uoking.com which sends the data to a secure 3rd party payment provider. We never know what was on the form and our website is encrypted as well for an added layer of privacy.  Thank you to all of the customers who stuck with us during the wait for approval. We are proud to be serving players once again.  ', 'admin', '2022-12-08'),
('99999999-aaaa-bbbb-cccc-dddddddddddd', 'What''s going on in May?', 'Hello everyone, hope you are all doing well and enjoying the nice weather lately. I want to start out by mentioning that gold prices are lower! We have come down 0.01 per mil to compete with the market. Prices on scrolls continue to be lowered, making now one of the best times in five years to grab the scrolls you might need.

<strong> EM EVENT LIST </strong>
Don''t forget to click on Tools and visit the EM event list. This list will automatically update to your time zone to get you to those events all month long.

<strong>Archer Suit</strong>
Luck suits and an archer suit were added to the shop so be sure to check those out. Also, we are still working to provide you with all of the shard bound items that entered the game recently. ', 'admin', '2023-05-11'),
('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'Summer is here!', 'Getting back into UO this summer? We got you covered from suits, full characters, mounts, houses, gear, weapons, resources. You name, we have it and at competitive cheap UO gold prices. Live chat us with any questions and if you do not see a live chat at the bottom of page you may need to allow popups from uoking.com.', 'admin', '2023-07-10'),
('bbbbbbbb-cccc-dddd-eeee-ffffffffffff', '2024 New items, deals, and more.', 'UO King will be as active, as ever in 2024.  We are planning a huge roll out of new features and development  Just want to thank all the loyal customers over the years who stuck with us!  THANK YOU! HAPPY NEW YEAR!.  ', 'admin', '2024-01-14'),
('cccccccc-dddd-eeee-ffff-111111111111', 'UO King is back and open for business!', 'Newly staffed and ready to fulfill all customer needs in 2024!', 'admin', '2024-05-02'),
('dddddddd-eeee-ffff-1111-222222222222', 'Join the Hunt for Ellendur''s Lost Loot - Tomorrow at 8 PM EST!', 'Greetings Adventurers of Britannia,

Prepare yourselves for an epic quest like no other! This Friday, August 2nd, 2024, at 8 PM EST, the Atlantic Shard will be alive with excitement and mystery as we gather at Luna Bank for the grand scavenger hunt: The Lost Loot of Ellendur.

Legend speaks of Ellendur, a mighty traveler whose treasures, collected over countless adventures, fell loose and scattered around Luna. Now, it''s up to you, brave warriors, cunning thieves, and wise mages, to recover these lost relics. But beware, for not all that glitters is gold. Some treasures may be too great to bear, while others may hold cryptic clues written on ancient parchment.

Event Details:

Date: Friday, August 2nd, 2024
Time: 8 PM EST
Location: Luna Bank, Atlantic Shard
What to Expect:

Scavenger Hunt: Explore Luna and unearth hidden treasures left behind by the great Ellendur.

Surprises Galore: Discover rewards that range from valuable artifacts to mysterious letters and numbers.

Challenges: Face the unknown, as some finds might carry more weight than you can imagine.

This is an event you won''t want to miss. Rally your friends and prepare your backs for the weight of untold riches. Save your strength, for the journey may test your endurance and resolve.', 'admin', '2024-08-01'),
('eeeeeeee-ffff-1111-2222-333333333333', 'Merry Christmas From UO King!', 'Happy holidays, please enjoy our current coupon coded: fiveoff 
Using this code will let you get 5% off your UO gold orders and items. And don''t forget to hop in the discord and enjoy our giveaways.', 'admin', '2024-12-23'),
('ffffffff-1111-2222-3333-444444444444', 'Still here, still delivering!', 'Ring our live chat for fast service.', 'admin', '2025-08-11');

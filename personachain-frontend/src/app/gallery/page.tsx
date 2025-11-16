'use client';

import { useState } from 'react';

interface PersonalityType {
  code: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  compatible: string[];
  career: string[];
  color: { main: string; light: string; dark: string };
  characterImage: string;
}

const PERSONALITY_DATABASE: { [key: string]: PersonalityType } = {
  'INTJ': {
    code: 'INTJ',
    description: 'The Mastermind - Strategic, logical, and independent. Prefers planning and systems.',
    strengths: ['Strategic thinking', 'Independent', 'Confident', 'Determined', 'Logical'],
    weaknesses: ['Can be arrogant', 'Difficulty with emotions', 'Impatient', 'Overly critical'],
    compatible: ['ENTJ', 'INTP', 'ENTP', 'INFJ', 'INFP'],
    career: ['Software Engineer', 'Lawyer', 'Scientist', 'CEO', 'Architect'],
    color: { main: '#a855f7', light: '#c084fc', dark: '#7e22ce' },
    characterImage: '/images/characters/intj.png',
  },
  'INTP': {
    code: 'INTP',
    description: 'The Logician - Analytical, thoughtful, and innovative. Enjoys intellectual exploration.',
    strengths: ['Creative', 'Analytical', 'Objective', 'Independent', 'Open-minded'],
    weaknesses: ['Socially awkward', 'Absent-minded', 'Insensitive', 'Condescending'],
    compatible: ['ENTJ', 'INTJ', 'ENTP', 'INFP', 'ENFP'],
    career: ['Mathematician', 'Programmer', 'Physicist', 'Researcher', 'Professor'],
    color: { main: '#a855f7', light: '#c084fc', dark: '#7e22ce' },
    characterImage: '/images/characters/intp.png',
  },
  'ENTJ': {
    code: 'ENTJ',
    description: 'The Commander - Bold, decisive, and strategic leader. Natural organizer.',
    strengths: ['Leadership', 'Strategic', 'Confident', 'Organized', 'Ambitious'],
    weaknesses: ['Can be domineering', 'Insensitive', 'Impatient', 'Stubborn'],
    compatible: ['INTJ', 'INTP', 'ENFP', 'INFJ', 'ENFJ'],
    career: ['CEO', 'Manager', 'Lawyer', 'Judge', 'Military Officer'],
    color: { main: '#a855f7', light: '#c084fc', dark: '#7e22ce' },
    characterImage: '/images/characters/entj.png',
  },
  'ENTP': {
    code: 'ENTP',
    description: 'The Debater - Inventive, analytical, and debater. Loves exploring ideas.',
    strengths: ['Innovative', 'Flexible', 'Energetic', 'Curious', 'Fun'],
    weaknesses: ['Unfocused', 'Argumentative', 'Irresponsible', 'Can be insensitive'],
    compatible: ['INTJ', 'INTP', 'INFJ', 'ENFP', 'ENFJ'],
    career: ['Entrepreneur', 'Consultant', 'Journalist', 'Entertainer', 'Inventor'],
    color: { main: '#a855f7', light: '#c084fc', dark: '#7e22ce' },
    characterImage: '/images/characters/entp.png',
  },
  'INFJ': {
    code: 'INFJ',
    description: 'The Advocate - Compassionate, intuitive, and principled. Seeks meaning and connection.',
    strengths: ['Insightful', 'Principled', 'Passionate', 'Altruistic', 'Creative'],
    weaknesses: ['Sensitive', 'Stubborn', 'Perfectionistic', 'Overly idealistic'],
    compatible: ['ENFP', 'INFP', 'ENTP', 'INTJ', 'ENFJ'],
    career: ['Counselor', 'Teacher', 'Writer', 'Activist', 'Social Worker'],
    color: { main: '#22c55e', light: '#4ade80', dark: '#15803d' },
    characterImage: '/images/characters/infj.png',
  },
  'INFP': {
    code: 'INFP',
    description: 'The Mediator - Idealistic, empathetic, and value-driven.',
    strengths: ['Empathetic', 'Idealistic', 'Creative', 'Authentic', 'Passionate'],
    weaknesses: ['Overly sensitive', 'Avoids conflict', 'Impractical', 'Self-critical'],
    compatible: ['ENFJ', 'ENFP', 'INFJ', 'INTP', 'ENTP'],
    career: ['Artist', 'Counselor', 'Writer', 'Psychologist', 'Teacher'],
    color: { main: '#22c55e', light: '#4ade80', dark: '#15803d' },
    characterImage: '/images/characters/infp.png',
  },
  'ENFJ': {
    code: 'ENFJ',
    description: 'The Protagonist - Charismatic, inspirational leader who brings out potential in others.',
    strengths: ['Charismatic', 'Inspiring', 'Warm', 'Supportive', 'Organized'],
    weaknesses: ['Overly sensitive', 'People-pleaser', 'Controlling', 'Excessive'],
    compatible: ['INFP', 'INFJ', 'ENFP', 'ENTJ', 'INTJ'],
    career: ['Teacher', 'Counselor', 'Manager', 'Politician', 'Coach'],
    color: { main: '#22c55e', light: '#4ade80', dark: '#15803d' },
    characterImage: '/images/characters/enfj.png',
  },
  'ENFP': {
    code: 'ENFP',
    description: 'The Campaigner - Enthusiastic, creative, and spontaneous. Loves new experiences.',
    strengths: ['Enthusiastic', 'Creative', 'Spontaneous', 'Charismatic', 'Energetic'],
    weaknesses: ['Unfocused', 'Sensitive', 'Impulsive', 'Poor planning'],
    compatible: ['INFJ', 'ENFJ', 'INFP', 'INTJ', 'INTP'],
    career: ['Entertainer', 'Event Planner', 'Marketing', 'Entrepreneur', 'Journalist'],
    color: { main: '#22c55e', light: '#4ade80', dark: '#15803d' },
    characterImage: '/images/characters/enfp.png',
  },
  'ISTJ': {
    code: 'ISTJ',
    description: 'The Logistician - Responsible, reliable, and methodical. Values duty and tradition.',
    strengths: ['Responsible', 'Reliable', 'Practical', 'Organized', 'Dedicated'],
    weaknesses: ['Inflexible', 'Stubborn', 'Insensitive', 'Boring'],
    compatible: ['ISFP', 'ESFP', 'ESTJ', 'ISFJ', 'ESFJ'],
    career: ['Accountant', 'Auditor', 'Manager', 'Lawyer', 'Police Officer'],
    color: { main: '#3b82f6', light: '#60a5fa', dark: '#1e40af' },
    characterImage: '/images/characters/istj.png',
  },
  'ISFJ': {
    code: 'ISFJ',
    description: 'The Defender - Protective, caring, and conscientious. Dedicated helper.',
    strengths: ['Loyal', 'Caring', 'Thorough', 'Reliable', 'Observant'],
    weaknesses: ['Overly sensitive', 'Pushover', 'Insecure', 'Self-sacrificing'],
    compatible: ['ISTJ', 'ESTJ', 'ESFJ', 'ISFP', 'ESFP'],
    career: ['Nurse', 'Teacher', 'Social Worker', 'Therapist', 'Secretary'],
    color: { main: '#3b82f6', light: '#60a5fa', dark: '#1e40af' },
    characterImage: '/images/characters/isfj.png',
  },
  'ESTJ': {
    code: 'ESTJ',
    description: 'The Executive - Practical, organized leader. Efficient and results-oriented.',
    strengths: ['Leadership', 'Practical', 'Organized', 'Honest', 'Efficient'],
    weaknesses: ['Inflexible', 'Insensitive', 'Overly critical', 'Workaholic'],
    compatible: ['ISFP', 'ISFJ', 'ISTJ', 'ESFJ', 'ESFP'],
    career: ['Manager', 'Executive', 'Administrator', 'Military Officer', 'Supervisor'],
    color: { main: '#3b82f6', light: '#60a5fa', dark: '#1e40af' },
    characterImage: '/images/characters/estj.png',
  },
  'ESFJ': {
    code: 'ESFJ',
    description: 'The Consul - Loyal, supportive, and sociable. Natural team player.',
    strengths: ['Loyal', 'Supportive', 'Organized', 'Enthusiastic', 'Generous'],
    weaknesses: ['Overly sensitive', 'People-pleaser', 'Can be judgmental', 'Needy'],
    compatible: ['ISFJ', 'ISFP', 'ESTJ', 'ESFP', 'ISTJ'],
    career: ['Teacher', 'Nurse', 'Counselor', 'Event Planner', 'Human Resources'],
    color: { main: '#3b82f6', light: '#60a5fa', dark: '#1e40af' },
    characterImage: '/images/characters/esfj.png',
  },
  'ISTP': {
    code: 'ISTP',
    description: 'The Virtuoso - Logical, practical, and independent problem-solver.',
    strengths: ['Practical', 'Logical', 'Calm', 'Independent', 'Observant'],
    weaknesses: ['Insensitive', 'Private', 'Risky behavior', 'Can be blunt'],
    compatible: ['ISFP', 'ESTP', 'ESFP', 'ISFJ', 'ESFJ'],
    career: ['Mechanic', 'Engineer', 'Pilot', 'Detective', 'Military Personnel'],
    color: { main: '#eab308', light: '#facc15', dark: '#a16207' },
    characterImage: '/images/characters/istp.png',
  },
  'ISFP': {
    code: 'ISFP',
    description: 'The Adventurer - Sensitive, artistic, and compassionate. Values authenticity.',
    strengths: ['Artistic', 'Sensitive', 'Practical', 'Adventurous', 'Kind'],
    weaknesses: ['Sensitive', 'Conflict-averse', 'Impulsive', 'Self-sacrificing'],
    compatible: ['ISTP', 'ISFJ', 'ISTJ', 'ESTP', 'ESFP'],
    career: ['Artist', 'Designer', 'Chef', 'Musician', 'Therapist'],
    color: { main: '#eab308', light: '#facc15', dark: '#a16207' },
    characterImage: '/images/characters/isfp.png',
  },
  'ESTP': {
    code: 'ESTP',
    description: 'The Entrepreneur - Bold, energetic, and resourceful. Enjoys action and excitement.',
    strengths: ['Energetic', 'Bold', 'Pragmatic', 'Spontaneous', 'Ambitious'],
    weaknesses: ['Reckless', 'Impatient', 'Insensitive', 'Arrogant'],
    compatible: ['ISFP', 'ISTP', 'ESFP', 'ESFJ', 'ISFJ'],
    career: ['Sales', 'Entrepreneur', 'Police Officer', 'Athlete', 'Promoter'],
    color: { main: '#eab308', light: '#facc15', dark: '#a16207' },
    characterImage: '/images/characters/estp.png',
  },
  'ESFP': {
    code: 'ESFP',
    description: 'The Entertainer - Outgoing, spontaneous, entertaining. Loves being center of attention.',
    strengths: ['Outgoing', 'Spontaneous', 'Entertaining', 'Energetic', 'Charming'],
    weaknesses: ['Impulsive', 'Insensitive', 'Impatient', 'Unfocused'],
    compatible: ['ISFP', 'ISTP', 'ESTP', 'ESFJ', 'ISFJ'],
    career: ['Entertainer', 'Event Planner', 'Sales', 'Hospitality', 'Performer'],
    color: { main: '#eab308', light: '#facc15', dark: '#a16207' },
    characterImage: '/images/characters/esfp.png',
  },
};

const CELEBRITY_DATABASE: { [key: string]: { name: string; role: string; image: string }[] } = {
  'INTJ': [
    { name: 'Elon Musk', role: 'Entrepreneur, CEO', image: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Elon_Musk_Royal_Society.jpg' },
    { name: 'Nikola Tesla', role: 'Inventor, Engineer', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Tesla_Sarony.jpg/500px-Tesla_Sarony.jpg' },
    { name: 'Isaac Newton', role: 'Scientist, Physicist', image: 'https://upload.wikimedia.org/wikipedia/commons/3/39/GodfreyKneller-IsaacNewton-1689.jpg' },
  ],
  'INTP': [
    { name: 'Albert Einstein', role: 'Physicist, Scientist', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Albert_Einstein_Head.jpg' },
    { name: 'Bill Gates', role: 'Tech Entrepreneur', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Bill_Gates_July_2014.jpg/500px-Bill_Gates_July_2014.jpg' },
    { name: 'Mark Zuckerberg', role: 'CEO, Facebook', image: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/F20250904AH-2824_%2854778373111%29_%28cropped%29.jpg' },
  ],
  'ENTJ': [
    { name: 'Steve Jobs', role: 'Apple Founder', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg/250px-Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg' },
    { name: 'Margaret Thatcher', role: 'Political Leader', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Margaret_Thatcher_stock_portrait_%28cropped%29.jpg/250px-Margaret_Thatcher_stock_portrait_%28cropped%29.jpg' },
    { name: 'Donald Trump', role: 'Businessman, Politician', image: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg' },
  ],
  'ENTP': [
    { name: 'Steve Wozniak', role: 'Apple Co-founder', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Steve_Wozniak_by_Gage_Skidmore_3_%28cropped%29.jpg/250px-Steve_Wozniak_by_Gage_Skidmore_3_%28cropped%29.jpg' },
    { name: 'Barack Obama', role: 'Former US President', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/1024px-President_Barack_Obama.jpg' },
    { name: 'Benjamin Franklin', role: 'Polymath', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Joseph_Siffrein_Duplessis_-_Benjamin_Franklin_-_Google_Art_Project.jpg/250px-Joseph_Siffrein_Duplessis_-_Benjamin_Franklin_-_Google_Art_Project.jpg' },
  ],
  'INFJ': [
    { name: 'Oprah Winfrey', role: 'Media Mogul', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Oprah_Winfrey_2016.jpg/250px-Oprah_Winfrey_2016.jpg' },
    { name: 'J.K. Rowling', role: 'Writer, Author', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/J._K._Rowling_2010.jpg/1024px-J._K._Rowling_2010.jpg' },
    { name: 'Carl Jung', role: 'Psychologist', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif/lossy-page1-250px-ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif.jpg' },
  ],
  'INFP': [
    { name: 'J.R.R. Tolkien', role: 'Author', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/J._R._R._Tolkien%2C_ca._1925.jpg/250px-J._R._R._Tolkien%2C_ca._1925.jpg' },
    { name: 'Johnny Depp', role: 'Actor', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Johnny_Depp_2020.jpg/250px-Johnny_Depp_2020.jpg' },
    { name: 'Kurt Cobain', role: 'Musician', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Nirvana_around_1992_%28cropped%29.jpg/250px-Nirvana_around_1992_%28cropped%29.jpg' },
  ],
  'ENFJ': [
    { name: 'Harry Styles', role: 'Pop & Contemporary Musicians', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/HarryStylesWembley170623_%2865_of_93%29_%2852982678051%29_%28cropped_2%29.jpg/250px-HarryStylesWembley170623_%2865_of_93%29_%2852982678051%29_%28cropped_2%29.jpg' },
    { name: 'Tony Robbins', role: 'Life Coach', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Tony_Robbins.jpg/250px-Tony_Robbins.jpg' },
    { name: 'Martin Luther King Jr', role: 'Civil Rights Leader', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Martin_Luther_King%2C_Jr..jpg/250px-Martin_Luther_King%2C_Jr..jpg' },
  ],
  'ENFP': [
    { name: 'Robin Williams', role: 'Actor, Comedian', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Robin_Williams_2011a_%282%29.jpg/250px-Robin_Williams_2011a_%282%29.jpg' },
    { name: 'Marilyn Monroe', role: 'Actress', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Monroecirca1953.jpg/250px-Monroecirca1953.jpg' },
    { name: 'Will Smith', role: 'Actor, Rapper', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/TechCrunch_Disrupt_San_Francisco_2019_-_Day_1_%2848834070763%29_%28cropped%29.jpg/250px-TechCrunch_Disrupt_San_Francisco_2019_-_Day_1_%2848834070763%29_%28cropped%29.jpg' },
  ],
  'ISTJ': [
    { name: 'George Washington', role: 'US President', image: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg' },
    { name: 'Harry Truman', role: 'US President', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/TRUMAN_58-766-06_%28cropped%29.jpg/250px-TRUMAN_58-766-06_%28cropped%29.jpg' },
    { name: 'Queen Elizabeth II', role: 'Monarch', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Queen_Elizabeth_II_official_portrait_for_1959_tour_%28retouched%29_%28cropped%29_%283-to-4_aspect_ratio%29.jpg/250px-Queen_Elizabeth_II_official_portrait_for_1959_tour_%28retouched%29_%28cropped%29_%283-to-4_aspect_ratio%29.jpg' },
  ],
  'ISFJ': [
    { name: 'Mother Teresa', role: 'Humanitarian', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Mother_Teresa_1.jpg/250px-Mother_Teresa_1.jpg' },
    { name: 'Princess Diana', role: 'Royal', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Diana%2C_Princess_of_Wales_1997_%282%29.jpg/250px-Diana%2C_Princess_of_Wales_1997_%282%29.jpg' },
    { name: 'Beyoncé', role: 'Artist', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Beyonc%C3%A9_-_Tottenham_Hotspur_Stadium_-_1st_June_2023_%2810_of_118%29_%2852946364598%29_%28best_crop%29.jpg/250px-Beyonc%C3%A9_-_Tottenham_Hotspur_Stadium_-_1st_June_2023_%2810_of_118%29_%2852946364598%29_%28best_crop%29.jpg' },
  ],
  'ESTJ': [
    { name: 'Bill Clinton', role: 'US President', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Bill_Clinton.jpg' },
    { name: 'Franklin D. Roosevelt', role: 'US President', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/FDR-1944-Campaign-Portrait_%283x4_retouched%2C_cropped%29.jpg/250px-FDR-1944-Campaign-Portrait_%283x4_retouched%2C_cropped%29.jpg' },
    { name: 'Judge Judy', role: 'TV Judge', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Judge_Judy_Sheindlin_VF_2012_Shankbone.JPG/250px-Judge_Judy_Sheindlin_VF_2012_Shankbone.JPG' },
  ],
  'ESFJ': [
    { name: 'Taylor Swift', role: 'Singer, Songwriter', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png/250px-Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png' },
    { name: 'Jennifer Aniston', role: 'Actress', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/JenniferAnistonHWoFFeb2012.jpg/250px-JenniferAnistonHWoFFeb2012.jpg' },
    { name: 'Ellen DeGeneres', role: 'TV Host', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Ellen_DeGeneres_2011.jpg/250px-Ellen_DeGeneres_2011.jpg' },
  ],
  'ISTP': [
    { name: 'Clint Eastwood', role: 'Actor, Director', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Clint_Eastwood_visits_MCB_Camp_Pendleton_%281%29_%28cropped%29.jpg/250px-Clint_Eastwood_visits_MCB_Camp_Pendleton_%281%29_%28cropped%29.jpg' },
    { name: 'Tom Cruise', role: 'Actor', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Tom_Cruise-2428.jpg/250px-Tom_Cruise-2428.jpg' },
    { name: 'Michael Jordan', role: 'Athlete', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/250px-Michael_Jordan_in_2014.jpg' },
  ],
  'ISFP': [
    { name: 'Prince', role: 'Musician', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Prince_1981_%28crop%29.jpg/250px-Prince_1981_%28crop%29.jpg' },
    { name: 'Lady Gaga', role: 'Singer, Artist', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Lady_Gaga_at_Joe_Biden%27s_inauguration_%28cropped_5%29.jpg/250px-Lady_Gaga_at_Joe_Biden%27s_inauguration_%28cropped_5%29.jpg' },
    { name: 'Audrey Hepburn', role: 'Actress', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/AudreyKHepburn.jpg/250px-AudreyKHepburn.jpg' },
  ],
  'ESTP': [
    { name: 'James Dean', role: 'Actor', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/James_Dean_in_Rebel_Without_a_Cause.jpg/250px-James_Dean_in_Rebel_Without_a_Cause.jpg' },
    { name: 'Christopher Reeve', role: 'Actor', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/C_Reeve_in_Marriage_of_Figaro_Opening_night_1985.jpg/250px-C_Reeve_in_Marriage_of_Figaro_Opening_night_1985.jpg' },
    { name: 'Madonna', role: 'Singer', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/MadonnaO2171023_%2897_of_133%29_%2853269593787%29_%28cropped%29.jpg/250px-MadonnaO2171023_%2897_of_133%29_%2853269593787%29_%28cropped%29.jpg' },
  ],
  'ESFP': [
    { name: 'Miley Cyrus', role: 'Singer, Actress', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Miley_Cyrus_Primavera19_-226_%2848986293772%29_%28cropped%29.jpg/250px-Miley_Cyrus_Primavera19_-226_%2848986293772%29_%28cropped%29.jpg' },
    { name: 'Mariah Carey', role: 'Singer', image: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Mariah_Carey_Library_of_Congress_2023_1_Cropped_3.png' },
    { name: 'Bruno Mars', role: 'Singer, Dancer', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/BrunoMars24KMagicWorldTourLive_%28cropped%29.jpg/250px-BrunoMars24KMagicWorldTourLive_%28cropped%29.jpg' },
  ],
};

const MBTI_STATS: { [key: string]: { population: string; rarity: string } } = {
  'INTJ': { population: '2-3%', rarity: 'Very Rare' },
  'INTP': { population: '3-5%', rarity: 'Rare' },
  'ENTJ': { population: '1-2%', rarity: 'Very Rare' },
  'ENTP': { population: '3-4%', rarity: 'Rare' },
  'INFJ': { population: '1-2%', rarity: 'Very Rare' },
  'INFP': { population: '4-5%', rarity: 'Rare' },
  'ENFJ': { population: '2-3%', rarity: 'Rare' },
  'ENFP': { population: '6-8%', rarity: 'Common' },
  'ISTJ': { population: '10-12%', rarity: 'Common' },
  'ISFJ': { population: '9-11%', rarity: 'Common' },
  'ESTJ': { population: '8-10%', rarity: 'Common' },
  'ESFJ': { population: '10-12%', rarity: 'Common' },
  'ISTP': { population: '5-6%', rarity: 'Rare' },
  'ISFP': { population: '8-9%', rarity: 'Common' },
  'ESTP': { population: '4-5%', rarity: 'Rare' },
  'ESFP': { population: '8-9%', rarity: 'Common' },
};

const ALL_TYPES = Object.keys(PERSONALITY_DATABASE);

export default function GalleryPage() {
  const [selectedType, setSelectedType] = useState<string>('INTJ');
  const [searchInput, setSearchInput] = useState('');

  const personality = PERSONALITY_DATABASE[selectedType];
  const stats = MBTI_STATS[selectedType];
  const filteredTypes = ALL_TYPES.filter(type =>
    type.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0e17',
      color: '#cbd5e1',
      padding: '2rem 1rem',
      paddingTop: '6rem',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem',
          }}>
             Discover Your Personality Type
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: '#94a3b8',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Explore all 16 MBTI personality types and understand what makes you unique!
          </p>
        </div>

        {/* MAIN GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '350px 1fr',
          gap: '2rem',
          alignItems: 'start',
        }}>
          {/* LEFT COLUMN */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}>
            {/* Sidebar - Type Selection */}
            <div style={{
              background: 'rgba(31, 41, 55, 0.5)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              borderRadius: '12px',
              padding: '1.5rem',
              backdropFilter: 'blur(10px)',
              height: 'fit-content',
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#fff',
              }}>
                Personality Types
              </h2>

              {/* Search */}
              <input
                type="text"
                placeholder="Search personality..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#1f2937',
                  border: '1px solid rgba(168, 85, 247, 0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                  marginBottom: '1rem',
                  fontSize: '0.875rem',
                }}
              />

              {/* Type Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
              }}>
                {filteredTypes.map((type) => {
                  const typeData = PERSONALITY_DATABASE[type];
                  const isSelected = type === selectedType;
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      style={{
                        padding: '0.75rem',
                        background: isSelected
                          ? `linear-gradient(135deg, ${typeData.color.main}, ${typeData.color.dark})`
                          : '#374151',
                        border: isSelected
                          ? `2px solid ${typeData.color.main}`
                          : '1px solid rgba(148, 163, 184, 0.2)',
                        borderRadius: '8px',
                        color: isSelected ? '#fff' : '#cbd5e1',
                        fontWeight: isSelected ? '700' : '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontSize: '0.875rem',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = '#475569';
                          e.currentTarget.style.borderColor = typeData.color.main;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = '#374151';
                          e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                        }
                      }}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CELEBRITIES SECTION */}
            <div style={{
              padding: '2rem',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#60a5fa',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                🌟 Famous {selectedType}s
              </h3>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}>
                {CELEBRITY_DATABASE[selectedType]?.map((celebrity, idx) => (
                  <div key={idx} style={{
                    background: '#1f2937',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'default',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#60a5fa';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(96, 165, 250, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <img
                      src={celebrity.image}
                      alt={celebrity.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        background: '#111827',
                        flexShrink: 0,
                      }}
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23333" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23666" font-size="40"%3E?%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <div style={{ padding: '0.5rem', flex: 1, minWidth: 0 }}>
                      <h4 style={{ 
                        color: '#fff', 
                        fontWeight: '600', 
                        marginBottom: '0.2rem', 
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {celebrity.name}
                      </h4>
                      <p style={{ 
                        color: '#94a3b8', 
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {celebrity.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}>
            {/* Type Header with Character Image */}
            <div style={{
              background: `linear-gradient(135deg, ${personality.color.main}20, ${personality.color.dark}20)`,
              border: `2px solid ${personality.color.main}40`,
              borderRadius: '12px',
              padding: '2rem',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              gap: '2rem',
              alignItems: 'flex-start',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '3.5rem',
                  fontWeight: 'bold',
                  color: personality.color.main,
                  marginBottom: '1rem',
                  textShadow: `0 0 30px ${personality.color.main}40`,
                }}>
                  {selectedType}
                </div>

                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#fff',
                  marginBottom: '1rem',
                }}>
                  {personality.code === 'INTJ' && '🧠 The Mastermind'}
                  {personality.code === 'INTP' && '💭 The Logician'}
                  {personality.code === 'ENTJ' && '👑 The Commander'}
                  {personality.code === 'ENTP' && '⚡ The Debater'}
                  {personality.code === 'INFJ' && '💫 The Advocate'}
                  {personality.code === 'INFP' && '🎨 The Mediator'}
                  {personality.code === 'ENFJ' && '🌟 The Protagonist'}
                  {personality.code === 'ENFP' && '🎭 The Campaigner'}
                  {personality.code === 'ISTJ' && '📋 The Logistician'}
                  {personality.code === 'ISFJ' && '💖 The Defender'}
                  {personality.code === 'ESTJ' && '📊 The Executive'}
                  {personality.code === 'ESFJ' && '👥 The Consul'}
                  {personality.code === 'ISTP' && '🔧 The Virtuoso'}
                  {personality.code === 'ISFP' && '🎵 The Adventurer'}
                  {personality.code === 'ESTP' && '🚀 The Entrepreneur'}
                  {personality.code === 'ESFP' && '🎪 The Entertainer'}
                </h2>

                <p style={{
                  fontSize: '1rem',
                  color: '#cbd5e1',
                  lineHeight: '1.6',
                }}>
                  {personality.description}
                </p>
              </div>

              {/* Character Image */}
              <img
                src={personality.characterImage}
                alt={selectedType}
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '0px',
                  background: 'transparent',
                  flexShrink: 0,
                  border: 'none',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            {/* Sections Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
            }}>
              {/* Strengths */}
              <div style={{
                background: 'rgba(31, 41, 55, 0.5)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                borderRadius: '12px',
                padding: '1.5rem',
                backdropFilter: 'blur(10px)',
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#22c55e',
                  marginBottom: '1rem',
                }}>
                  ✨ Strengths
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {personality.strengths.map((strength, idx) => (
                    <li key={idx} style={{
                      padding: '0.5rem 0',
                      color: '#cbd5e1',
                      fontSize: '0.95rem',
                      borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                    }}>
                      • {strength}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div style={{
                background: 'rgba(31, 41, 55, 0.5)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                borderRadius: '12px',
                padding: '1.5rem',
                backdropFilter: 'blur(10px)',
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#ef4444',
                  marginBottom: '1rem',
                }}>
                  ⚠️ Weaknesses
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {personality.weaknesses.map((weakness, idx) => (
                    <li key={idx} style={{
                      padding: '0.5rem 0',
                      color: '#cbd5e1',
                      fontSize: '0.95rem',
                      borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                    }}>
                      • {weakness}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Compatible Types */}
              <div style={{
                background: 'rgba(31, 41, 55, 0.5)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                borderRadius: '12px',
                padding: '1.5rem',
                backdropFilter: 'blur(10px)',
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: personality.color.main,
                  marginBottom: '1rem',
                }}>
                  💑 Compatible With
                </h3>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                }}>
                  {personality?.compatible && personality.compatible.length > 0 ? (
                    personality.compatible.map((type) => {
                      const compatType = PERSONALITY_DATABASE[type];
                      return (
                        <button
                          key={type}
                          onClick={() => setSelectedType(type)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: `${compatType.color.main}20`,
                            border: `1px solid ${compatType.color.main}60`,
                            borderRadius: '6px',
                            color: compatType.color.main,
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = `${compatType.color.main}40`;
                            e.currentTarget.style.boxShadow = `0 0 15px ${compatType.color.main}40`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = `${compatType.color.main}20`;
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          {type}
                        </button>
                      );
                    })
                  ) : (
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No compatible types</p>
                  )}
                </div>
              </div>

              {/* Career Paths */}
              <div style={{
                background: 'rgba(31, 41, 55, 0.5)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                borderRadius: '12px',
                padding: '1.5rem',
                backdropFilter: 'blur(10px)',
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#60a5fa',
                  marginBottom: '1rem',
                }}>
                  💼 Career Paths
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {personality.career.map((job, idx) => (
                    <li key={idx} style={{
                      padding: '0.5rem 0',
                      color: '#cbd5e1',
                      fontSize: '0.95rem',
                      borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                    }}>
                      • {job}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* STATISTICS SECTION */}
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              background: `linear-gradient(135deg, ${personality.color.main}10, ${personality.color.dark}10)`,
              borderRadius: '12px',
              border: `2px solid ${personality.color.main}30`,
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                marginBottom: '1rem',
              }}>
                <div style={{
                  background: `${personality.color.main}20`,
                  padding: '1rem',
                  borderRadius: '8px',
                  border: `1px solid ${personality.color.main}40`,
                }}>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, fontWeight: '600' }}>Population</p>
                  <p style={{ fontSize: '1.4rem', color: personality.color.main, fontWeight: '700', margin: '0.5rem 0 0 0' }}>
                    {stats.population}
                  </p>
                </div>

                <div style={{
                  background: `${personality.color.main}20`,
                  padding: '1rem',
                  borderRadius: '8px',
                  border: `1px solid ${personality.color.main}40`,
                }}>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, fontWeight: '600' }}>Rarity</p>
                  <p style={{ fontSize: '1.4rem', color: personality.color.main, fontWeight: '700', margin: '0.5rem 0 0 0' }}>
                    {stats.rarity}
                  </p>
                </div>
              </div>

              <p style={{
                fontSize: '0.9rem',
                color: '#cbd5e1',
                fontStyle: 'italic',
                margin: 0,
                lineHeight: '1.5',
              }}>
                💡 {selectedType}s make up {stats.population} of the global population and are considered {stats.rarity.toLowerCase()}.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
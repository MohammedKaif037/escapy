import { Item, Room } from '../types';

export const items: Item[] = [
  {
    id: 'key',
    name: 'Rusty Key',
    description: 'An old rusty key that might unlock something.',
    image: 'https://images.unsplash.com/photo-1582879304171-8041c73224b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    canBeUsed: true,
    usedOn: 'locked-drawer'
  },
  {
    id: 'note',
    name: 'Cryptic Note',
    description: 'A note with strange symbols.',
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    canBeUsed: true,
    usedOn: 'symbol-puzzle'
  },
  {
    id: 'flashlight',
    name: 'Flashlight',
    description: 'A working flashlight that can illuminate dark areas.',
    image: 'https://images.unsplash.com/photo-1590534247854-e97ab10c2b6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    canBeUsed: true,
    usedOn: 'dark-corner'
  },
  {
    id: 'battery',
    name: 'Battery',
    description: 'A fresh battery that could power something.',
    image: 'https://images.unsplash.com/photo-1619641464028-c531e1a4f850?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    canBeUsed: true,
    usedOn: 'radio-puzzle'
  },
  {
    id: 'code-paper',
    name: 'Code Sequence',
    description: 'A paper with a sequence of numbers.',
    image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    canBeUsed: true,
    usedOn: 'keypad-puzzle'
  }
];

export const initialRooms: Record<string, Room> = {
  'mystery-room': {
    id: 'mystery-room',
    name: 'The Detective\'s Study',
    theme: 'mystery',
    description: 'A dimly lit room filled with old books, a detective\'s desk, and mysterious artifacts. Something feels off about this place.',
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    puzzles: [
      {
        id: 'locked-drawer',
        type: 'item',
        solved: false,
        description: 'A locked drawer in the desk. It seems important.',
        solution: 'key',
        hint: 'Look around the room for something that might open this drawer.'
      },
      {
        id: 'riddle-book',
        type: 'riddle',
        solved: false,
        description: 'A strange book with a riddle: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?"',
        solution: 'echo',
        hint: 'Think about sounds that travel through the air.'
      }
    ],
    nextRoomId: 'sci-fi-room',
    isLocked: false
  },
  'sci-fi-room': {
    id: 'sci-fi-room',
    name: 'Abandoned Space Station',
    theme: 'sci-fi',
    description: 'A futuristic room with blinking consoles and strange technology. The air feels charged with electricity.',
    image: 'https://images.unsplash.com/photo-1581822261290-991b38693d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    puzzles: [
      {
        id: 'keypad-puzzle',
        type: 'combination',
        solved: false,
        description: 'A keypad requires a 4-digit code to unlock the next door.',
        solution: '1234',
        hint: 'Look for a paper with a sequence of numbers in your inventory.'
      },
      {
        id: 'radio-puzzle',
        type: 'item',
        solved: false,
        description: 'A radio that seems to be missing a power source.',
        solution: 'battery',
        hint: 'You need something to power this device.'
      }
    ],
    nextRoomId: 'horror-room',
    isLocked: true
  },
  'horror-room': {
    id: 'horror-room',
    name: 'Abandoned Mansion',
    theme: 'horror',
    description: 'A decrepit room with torn wallpaper, creaking floorboards, and an unsettling atmosphere. Shadows seem to move on their own.',
    image: 'https://images.unsplash.com/photo-1505409859467-3a796fd5798e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    puzzles: [
      {
        id: 'dark-corner',
        type: 'item',
        solved: false,
        description: 'A pitch-black corner of the room hides something important.',
        solution: 'flashlight',
        hint: 'You need something to see in the dark.'
      },
      {
        id: 'symbol-puzzle',
        type: 'pattern',
        solved: false,
        description: 'Strange symbols on the wall seem to form a pattern. You need to decipher their meaning.',
        solution: 'note',
        hint: 'The cryptic note in your inventory might help decode these symbols.'
      }
    ],
    nextRoomId: undefined, // This is the final room
    isLocked: true
  }
};

export const initialGameState = {
  currentRoomId: 'mystery-room',
  inventory: [],
  rooms: initialRooms,
  timeRemaining: 30 * 60, // 30 minutes in seconds
  hintsUsed: 0,
  maxHints: 5,
  gameStarted: false,
  gameOver: false,
  gameWon: false
};
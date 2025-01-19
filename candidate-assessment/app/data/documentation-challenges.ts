import { Challenge } from './challenges'

export const mathChallenge: Challenge = {
  id: 'documentation-challenge-math',
  title: 'Document Math Utilities',
  difficulty: 'Medium' as const,
  description: 'Add comprehensive documentation in the README.md file. Remove the comments and fill in each section with proper documentation.',
  files: {
    'src/calculator.js': `
class Calculator {
  constructor() {
    this.history = [];
  }

  add(a, b) {
    const result = a + b;
    this.history.push({ operation: 'add', a, b, result });
    return result;
  }

  subtract(a, b) {
    const result = a - b;
    this.history.push({ operation: 'subtract', a, b, result });
    return result;
  }

  multiply(a, b) {
    const result = a * b;
    this.history.push({ operation: 'multiply', a, b, result });
    return result;
  }

  divide(a, b) {
    if (b === 0) throw new Error('Division by zero');
    const result = a / b;
    this.history.push({ operation: 'divide', a, b, result });
    return result;
  }

  getHistory() {
    return this.history;
  }

  clearHistory() {
    this.history = [];
  }
}`,
    'src/mathUtils.js': `
function factorial(n) {
  if (n < 0) throw new Error('Factorial not defined for negative numbers');
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

function fibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];
  if (n === 2) return [0, 1];
  
  const sequence = [0, 1];
  for (let i = 2; i < n; i++) {
    sequence.push(sequence[i-1] + sequence[i-2]);
  }
  return sequence;
}

function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}`,
    'README.md': `# Math Utilities Documentation

## Overview

## Calculator Class

### Methods

## Math Utilities

### factorial(n)

### fibonacci(n)

### isPrime(num)

## Usage Examples

## Error Handling

## Notes`
  }
}

export const animalChallenge: Challenge = {
  id: 'documentation-challenge-animals',
  title: 'Document Animal Management System',
  difficulty: 'Medium' as const,
  description: 'Add comprehensive documentation in the README.md file. Remove the comments and fill in each section with proper documentation.',
  files: {
    'src/Animal.js': `
class Animal {
  constructor(name, species, age) {
    this.name = name;
    this.species = species;
    this.age = age;
    this.health = 100;
    this.happiness = 100;
  }

  feed(food) {
    if (food.isHealthy) {
      this.health = Math.min(100, this.health + 10);
      this.happiness += 5;
    } else {
      this.happiness += 15;
      this.health -= 5;
    }
  }

  play(activity) {
    this.happiness = Math.min(100, this.happiness + activity.funFactor);
    this.health = Math.max(0, this.health - activity.energyCost);
  }

  rest(hours) {
    this.health = Math.min(100, this.health + hours * 5);
    this.happiness = Math.max(0, this.happiness - hours * 2);
  }

  getStatus() {
    return {
      name: this.name,
      species: this.species,
      age: this.age,
      health: this.health,
      happiness: this.happiness
    };
  }
}`,
    'src/Zoo.js': `
class Zoo {
  constructor(name) {
    this.name = name;
    this.animals = new Map();
    this.activities = new Set(['swim', 'run', 'play ball']);
    this.foodInventory = [];
  }

  addAnimal(animal) {
    this.animals.set(animal.name, animal);
  }

  removeAnimal(animalName) {
    this.animals.delete(animalName);
  }

  feedAnimal(animalName, foodType) {
    const animal = this.animals.get(animalName);
    const food = this.foodInventory.find(f => f.type === foodType);
    
    if (animal && food) {
      animal.feed(food);
      this.foodInventory = this.foodInventory.filter(f => f !== food);
    }
  }

  scheduleActivity(animalName, activityType) {
    const animal = this.animals.get(animalName);
    if (animal && this.activities.has(activityType)) {
      const activity = {
        funFactor: Math.floor(Math.random() * 20) + 10,
        energyCost: Math.floor(Math.random() * 15) + 5
      };
      animal.play(activity);
    }
  }

  getZooStatus() {
    return {
      name: this.name,
      animalCount: this.animals.size,
      foodCount: this.foodInventory.length,
      activities: Array.from(this.activities)
    };
  }
}`,
    'README.md': `# Animal Management System Documentation

## Overview

## Animal Class

### Methods

## Zoo Class

### Methods

## Usage Examples

## Error Handling

## Notes`
  }
}

export const getNextDocumentationChallenge = (currentId?: string): Challenge => {
  if (currentId === 'documentation-challenge-math') {
    return animalChallenge
  }
  if (currentId === 'documentation-challenge-animals') {
    return mathChallenge
  }
  // Default to math if no current challenge
  return mathChallenge
} 
export interface Challenge {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
  files: { [key: string]: string }
}

export interface UMLChallenge {
    id: string
    files: { [key: string]: string }
    diagram: string
    description: string
}

export const UmlChallenges: { [key: string]: UMLChallenge } = {
    "/1.jpg":{
        id: 'uml-challenge',
        files: {},
        diagram: '/1.jpg',
        description: 'A UML diagram representing a bank account system with chequing accounts, savings accounts and users.'
    }, 
    "/2.jpg":{
        id: 'uml-challenge',
        files: {},
        diagram: '/2.jpg',
        description: 'A UML diagram for a system storing information about different animals.'
    }, 
    "/3.jpg":{
        id: 'uml-challenge',
        files: {},
        diagram: '/3.jpg',
        description: 'A UML diagram for an academic records system for a university, storing information about students and professors.'
    }
}

export const challenges: Challenge[] = [
  {
    id: 'bank-account-system',
    title: 'Bank Account Manager',
    difficulty: 'Easy',
    description: "The BankAccount class has a bug in its transaction history tracking. When transferring money between accounts, the transaction history isn't being properly updated. Fix the transfer method in 'BankAccount.js'.",
    files: {
      'BankAccount.js': `
class BankAccount {
  constructor(accountNumber, initialBalance = 0) {
    this.accountNumber = accountNumber;
    this.balance = initialBalance;
    this.transactions = [];
  }

  // Bug: Incomplete transaction history
  transfer(targetAccount, amount) {
    if (this.balance >= amount) {
      this.balance -= amount;
      targetAccount.balance += amount;
      
      // Bug: Only recording transaction for source account
      this.transactions.push({
        type: 'transfer_out',
        amount: amount,
        targetAccount: targetAccount.accountNumber
      });
      
      // Missing: Recording transaction for target account
    }
  }

  getTransactionHistory() {
    return this.transactions;
  }
}

module.exports = { BankAccount };`.trim(),

      'test.js': `
const { BankAccount } = require('./BankAccount');

// Test cases
const account1 = new BankAccount('ACC001', 1000);
const account2 = new BankAccount('ACC002', 500);

// Perform transfers
account1.transfer(account2, 300);
account2.transfer(account1, 100);

console.log('Account 1 History:', account1.getTransactionHistory());
console.log('Account 2 History:', account2.getTransactionHistory());

/* Expected output:
Account 1 History: [
  { type: 'transfer_out', amount: 300, targetAccount: 'ACC002' },
  { type: 'transfer_in', amount: 100, sourceAccount: 'ACC002' }
]
Account 2 History: [
  { type: 'transfer_in', amount: 300, sourceAccount: 'ACC001' },
  { type: 'transfer_out', amount: 100, targetAccount: 'ACC001' }
]
*/`.trim()
    }
  },
  {
    id: 'shopping-cart-oop',
    title: 'Shopping Cart System',
    difficulty: 'Medium',
    description: "Our e-commerce shopping cart system has a bug in its discount calculation. The Cart class isn't properly calculating discounts when items have both individual and cart-wide discounts. The system should apply item-specific discounts first, then category discounts, and finally cart-wide discounts.",
    files: {
      'models/Cart.js': `
class Cart {
  constructor() {
    this.items = [];
    this.cartDiscount = 0;
    this.discountStrategy = new DefaultDiscountStrategy();
  }

  addItem(item) {
    this.items.push(new CartItem(item, 1));
  }

  updateQuantity(itemId, quantity) {
    const cartItem = this.items.find(item => item.item.id === itemId);
    if (cartItem) {
      cartItem.quantity = quantity;
    }
  }

  setCartDiscount(percentage) {
    this.cartDiscount = percentage;
  }

  setDiscountStrategy(strategy) {
    this.discountStrategy = strategy;
  }

  // Bug: Incorrect discount calculation order
  calculateTotal() {
    return this.discountStrategy.calculateTotal(this);
  }

  getItems() {
    return this.items;
  }

  getCartDiscount() {
    return this.cartDiscount;
  }
}

module.exports = { Cart };`.trim(),

      'models/Item.js': `
class Item {
  constructor(id, name, price, category) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
    this.itemDiscount = 0;
  }

  setDiscount(percentage) {
    this.itemDiscount = percentage;
  }

  getPrice() {
    return this.price;
  }

  getCategory() {
    return this.category;
  }

  getItemDiscount() {
    return this.itemDiscount;
  }
}

module.exports = { Item };`.trim(),

      'models/CartItem.js': `
class CartItem {
  constructor(item, quantity) {
    this.item = item;
    this.quantity = quantity;
  }

  getSubtotal() {
    return this.item.getPrice() * this.quantity;
  }
}

module.exports = { CartItem };`.trim(),

      'services/DiscountStrategy.js': `
class DiscountStrategy {
  calculateTotal(cart) {
    throw new Error('calculateTotal must be implemented');
  }
}

class DefaultDiscountStrategy extends DiscountStrategy {
  calculateTotal(cart) {
    let total = 0;
    
    for (const cartItem of cart.getItems()) {
      const subtotal = cartItem.getSubtotal();
      const item = cartItem.item;
      

      const afterCartDiscount = subtotal * (1 - cart.getCartDiscount());
      const afterItemDiscount = afterCartDiscount * (1 - item.getItemDiscount());
      
      total += afterItemDiscount;
    }
    
    return total;
  }
}

module.exports = { DiscountStrategy, DefaultDiscountStrategy };`.trim(),

      'services/CategoryDiscountService.js': `
class CategoryDiscountService {
  constructor() {
    this.categoryDiscounts = new Map();
  }

  setCategoryDiscount(category, percentage) {
    this.categoryDiscounts.set(category, percentage);
  }

  getDiscount(category) {
    return this.categoryDiscounts.get(category) || 0;
  }
}

module.exports = { CategoryDiscountService };`.trim(),

      'test.js': `
const { Cart } = require('./models/Cart');
const { Item } = require('./models/Item');
const { CategoryDiscountService } = require('./services/CategoryDiscountService');

// Test case
const cart = new Cart();
const categoryService = new CategoryDiscountService();

// Set up category discounts
categoryService.setCategoryDiscount('electronics', 0.05); // 5% off electronics

// Create items with individual discounts
const laptop = new Item('1', 'Laptop', 1000, 'electronics');
laptop.setDiscount(0.1); // 10% individual discount

const mouse = new Item('2', 'Mouse', 50, 'electronics');
mouse.setDiscount(0.2); // 20% individual discount

// Add items to cart
cart.addItem(laptop);
cart.updateQuantity('1', 1);
cart.addItem(mouse);
cart.updateQuantity('2', 2);

// Apply cart-wide discount
cart.setCartDiscount(0.15); // 15% cart discount

/* Expected calculation order:
1. First apply individual item discounts
2. Then apply category discounts
3. Finally apply cart-wide discount

Laptop ($1000):
- Item discount (10%): $1000 * 0.9 = $900
- Category discount (5%): $900 * 0.95 = $855
- Cart discount (15%): $855 * 0.85 = $726.75

Mouse ($50 * 2 = $100):
- Item discount (20%): $100 * 0.8 = $80
- Category discount (5%): $80 * 0.95 = $76
- Cart discount (15%): $76 * 0.85 = $64.60

Total Expected: $791.35
Current Output: Different due to incorrect discount order
*/

console.log('Cart Total:', cart.calculateTotal());`.trim()
    }
  },
  {
    id: 'library-management',
    title: 'Library Management System',
    difficulty: 'Hard',
    description: "The Library Management System has a bug in its book reservation system. The LibrarySystem class isn't properly handling concurrent reservations and waitlists. Fix the reserveBook method in 'LibrarySystem.js'.",
    files: {
      'LibrarySystem.js': `
class LibrarySystem {
  constructor() {
    this.books = new Map();
    this.reservations = new Map();
    this.waitlists = new Map();
  }

  addBook(book) {
    this.books.set(book.id, book);
    this.reservations.set(book.id, null);
    this.waitlists.set(book.id, []);
  }


  reserveBook(bookId, userId) {
    const book = this.books.get(bookId);
    if (!book) return false;

    const currentReservation = this.reservations.get(bookId);
    const waitlist = this.waitlists.get(bookId);


    if (!currentReservation) {
      this.reservations.set(bookId, userId);
      return true;
    } else {
      waitlist.push(userId);
      return false;
    }
  }

  returnBook(bookId) {
    const waitlist = this.waitlists.get(bookId);
    this.reservations.set(bookId, null);
  }
}

module.exports = { LibrarySystem };`.trim(),

      'Book.js': `
class Book {
  constructor(id, title, author) {
    this.id = id;
    this.title = title;
    this.author = author;
  }
}

module.exports = { Book };`.trim(),

      'test.js': `
const { LibrarySystem } = require('./LibrarySystem');
const { Book } = require('./Book');

// Test case
const library = new LibrarySystem();
const book = new Book('B001', 'Clean Code', 'Robert Martin');
library.addBook(book);

// Test reservations
console.log('User1 reserves:', library.reserveBook('B001', 'USER1')); // Should be true
console.log('User2 reserves:', library.reserveBook('B001', 'USER2')); // Should be false (added to waitlist)
console.log('User3 reserves:', library.reserveBook('B001', 'USER3')); // Should be false (added to waitlist)

library.returnBook('B001');
// Should automatically reserve for User2 (next in waitlist)

/* Expected behavior:
1. First user successfully reserves
2. Second user goes to waitlist
3. Third user goes to waitlist
4. When book is returned, it's automatically reserved for the next person in waitlist
*/`.trim()
    }
  }
] 
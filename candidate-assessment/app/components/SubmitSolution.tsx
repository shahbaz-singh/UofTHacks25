import { Button } from "./ui/button"
import { Send } from 'lucide-react'
import { useState } from 'react'
import { Challenge } from '../data/challenges'

declare global {
  var CartItem: any;
  var DefaultDiscountStrategy: any;
}

interface SubmitSolutionProps {
  currentChallenge: Challenge
  files: { [key: string]: string }
  setFeedback: (feedback: string) => void
}

export default function SubmitSolution({ currentChallenge, files, setFeedback }: SubmitSolutionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createClass = (code: string) => {
    // Remove module.exports
    const cleanCode = code.replace(/module\.exports\s*=\s*{[^}]+}/, '')
    // Extract all class definitions
    const classes: { [key: string]: any } = {}
    const classRegex = /class\s+(\w+)/g
    let match
    
    while ((match = classRegex.exec(cleanCode)) !== null) {
      const className = match[1]
      const fullCode = `return ${cleanCode}`
      const ClassConstructor = new Function(fullCode)()
      classes[className] = ClassConstructor
    }
    
    return classes
  }

  // Solution: The bank account transfer method should also record the transaction in the target account:
  // targetAccount.transactions.push({
  //   type: 'transfer_in',
  //   amount: amount,
  //   sourceAccount: this.accountNumber
  // });
  const testBankAccount = (files: { [key: string]: string }) => {
    try {
      const { BankAccount } = createClass(files['BankAccount.js'])
      
      // Test cases
      const account1 = new BankAccount('ACC001', 1000)
      const account2 = new BankAccount('ACC002', 500)
      
      account1.transfer(account2, 300)
      account2.transfer(account1, 100)
      
      const history1 = account1.getTransactionHistory()
      const history2 = account2.getTransactionHistory()
      
      // Check transaction history length
      if (history1.length !== 2 || history2.length !== 2) {
        return 'Test failed: Transaction history is incomplete. Make sure both accounts record their transactions.'
      }

      // Check transaction details
      if (history1[0].type !== 'transfer_out' || history1[1].type !== 'transfer_in' ||
          history2[0].type !== 'transfer_in' || history2[1].type !== 'transfer_out') {
        return 'Test failed: Transaction types are incorrect.'
      }

      return 'Success! The bank account transaction history is now complete.'
    } catch (error) {
      return `Error executing code: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  // Solution for Shopping Cart Bug:
  // In DefaultDiscountStrategy class, the discount order is wrong.
  // Current (buggy) code:
  //   const afterCartDiscount = subtotal * (1 - cart.getCartDiscount());
  //   const afterItemDiscount = afterCartDiscount * (1 - item.getItemDiscount());
  //
  // Correct implementation should be:
  //   const afterItemDiscount = subtotal * (1 - item.getItemDiscount());
  //   const afterCategoryDiscount = afterItemDiscount * (1 - categoryService.getDiscount(item.getCategory()));
  //   const afterCartDiscount = afterCategoryDiscount * (1 - cart.getCartDiscount());
  const testShoppingCart = (files: { [key: string]: string }) => {
    try {
      // First, evaluate all the code in the correct order
      const evalCode = (code: string, dependencies = {}) => {
        const cleanCode = code.replace(/module\.exports\s*=\s*{[^}]+}/, '')
        return new Function(...Object.keys(dependencies), `
          ${cleanCode}
          return { ${cleanCode.match(/class\s+(\w+)/g)?.map(m => m.split(' ')[1]).join(', ')} }
        `)(...Object.values(dependencies))
      }

      // Evaluate all classes in dependency order
      const strategyClasses = evalCode(files['services/DiscountStrategy.js'])
      const itemClasses = evalCode(files['models/Item.js'])
      const cartItemClasses = evalCode(files['models/CartItem.js'])
      
      // Get the required classes
      const { CartItem } = cartItemClasses
      const { DefaultDiscountStrategy } = strategyClasses
      const { Item } = itemClasses
      
      // Now evaluate Cart with its dependencies
      const cartClasses = evalCode(files['models/Cart.js'], {
        CartItem,
        DefaultDiscountStrategy
      })
      const { Cart } = cartClasses

      if (!DefaultDiscountStrategy) {
        return 'Test failed: DefaultDiscountStrategy class not found. Make sure you have defined the class correctly.'
      }

      // Test the discount calculation
      const cart = new Cart()
      const strategy = new DefaultDiscountStrategy()
      cart.setDiscountStrategy(strategy)
      
      const laptop = new Item('1', 'Laptop', 1000, 'electronics')
      laptop.setDiscount(0.1)
      
      cart.addItem(laptop)
      cart.setCartDiscount(0.15)
      
      const total = cart.calculateTotal()
      const correctTotal = 765 // $1000 * (1 - 0.1) * (1 - 0.15) = correct order
      const expectedBuggyTotal = 765 // This should match what the buggy code produces

      // The test should fail because the current implementation is wrong
      if (Math.abs(total - correctTotal) < 0.01) {
        return `Test failed: Your implementation appears to be already fixed. The original code has a bug where cart discount is applied before item discount. Current output: $${total.toFixed(2)}`
      }

      return `Test failed: The discount calculation order is incorrect. The cart discount is being applied before the item discount. To fix this, modify the DefaultDiscountStrategy to apply item discounts first, then cart-wide discounts.`
    } catch (error) {
      console.error('Shopping cart test error:', error)
      return `Error executing code: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  // Solution: The library system should:
  // 1. Check waitlist when returning a book
  // 2. Automatically assign the book to the next person in waitlist
  // 3. Remove that person from the waitlist
  // In returnBook method:
  // const nextUser = waitlist.shift();
  // if (nextUser) {
  //   this.reservations.set(bookId, nextUser);
  // } else {
  //   this.reservations.set(bookId, null);
  // }
  const testLibrarySystem = (files: { [key: string]: string }) => {
    try {
      const { LibrarySystem } = createClass(files['LibrarySystem.js'])
      const { Book } = createClass(files['Book.js'])
      
      const library = new LibrarySystem()
      const book = new Book('B001', 'Test Book', 'Test Author')
      library.addBook(book)
      
      // Test reservation sequence
      const result1 = library.reserveBook('B001', 'USER1')
      const result2 = library.reserveBook('B001', 'USER2')
      
      // Get waitlist before return
      const waitlist = library.waitlists.get('B001')
      const hasUser2InWaitlist = waitlist && waitlist.includes('USER2')
      
      library.returnBook('B001')
      const currentReservation = library.reservations.get('B001')
      
      if (!result1) {
        return 'Test failed: First reservation should succeed'
      }
      
      if (result2) {
        return 'Test failed: Second reservation should be added to waitlist'
      }
      
      if (!hasUser2InWaitlist) {
        return 'Test failed: USER2 should be in the waitlist'
      }
      
      if (currentReservation !== 'USER2') {
        return 'Test failed: After return, book should be automatically reserved for USER2'
      }

      return 'Success! The library reservation system is working correctly.'
    } catch (error) {
      return `Error executing code: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    try {
      let result
      switch (currentChallenge.id) {
        case 'shopping-cart-oop':
          result = testShoppingCart(files)
          break
        case 'bank-account-system':
          result = testBankAccount(files)
          break
        case 'library-management':
          result = testLibrarySystem(files)
          break
        default:
          result = 'Unknown challenge type'
      }
      setFeedback(result)
    } catch (error) {
      setFeedback('An error occurred while testing your solution.')
      console.error('Testing error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Submit Your Solution</h2>
      <p className="mb-4">When you're ready, click the button below to submit your solution.</p>
      <Button 
        onClick={handleSubmit} 
        className="w-full"
        disabled={isSubmitting}
      >
        <Send className="mr-2" size={16} />
        {isSubmitting ? 'Testing...' : 'Submit Solution'}
      </Button>
    </div>
  )
}


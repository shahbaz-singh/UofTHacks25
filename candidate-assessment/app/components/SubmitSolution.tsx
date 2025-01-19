import { Button } from "./ui/button"
import { Send } from 'lucide-react'
import { useState } from 'react'
import { Challenge } from '../data/challenges'
import { SolutionQueryGPT } from "../api/gpt-api/grade-solution"
import { QueryGPT } from "../api/gpt-api/query-gpt"
import LoadingIndicator from './LoadingIndicator'
import { runTests } from '../utils/testRunner'


declare global {
  var CartItem: any;
  var DefaultDiscountStrategy: any;
}

interface SubmitSolutionProps {
  currentChallenge: Challenge
  files: { [key: string]: string }
  setFeedback: (feedback: string) => void
  expectedFunctionality: string
}

export default function SubmitSolution({ currentChallenge, files, setFeedback, expectedFunctionality}: SubmitSolutionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

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

  

  const testShoppingCart = (files: { [key: string]: string }) => {
    try {
      const evalCode = (code: string, dependencies = {}) => {
        const cleanCode = code.replace(/module\.exports\s*=\s*{[^}]+}/, '')
        return new Function(...Object.keys(dependencies), `
          ${cleanCode}
          return { ${cleanCode.match(/class\s+(\w+)/g)?.map(m => m.split(' ')[1]).join(', ')} }
        `)(...Object.values(dependencies))
      }

      // Evaluate all classes in dependency order
      const strategyClasses = evalCode(files['services/DiscountStrategy.js'])
      const categoryClasses = evalCode(files['services/CategoryDiscountService.js'])
      const itemClasses = evalCode(files['models/Item.js'])
      const cartItemClasses = evalCode(files['models/CartItem.js'])
      
      // Get the required classes
      const { CartItem } = cartItemClasses
      const { DefaultDiscountStrategy } = strategyClasses
      const { CategoryDiscountService } = categoryClasses
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

      // Initialize services
      const categoryService = new CategoryDiscountService()
      categoryService.setCategoryDiscount('electronics', 0.05) // 5% category discount

      // Make services available to strategy
      DefaultDiscountStrategy.prototype.categoryService = categoryService

      // Test the discount calculation
      const cart = new Cart()
      const strategy = new DefaultDiscountStrategy()
      cart.setDiscountStrategy(strategy)
      
      const laptop = new Item('1', 'Laptop', 1000, 'electronics')
      laptop.setDiscount(0.1) // 10% item discount
      
      cart.addItem(laptop)
      cart.setCartDiscount(0.15) // 15% cart discount
      
      const total = cart.calculateTotal()
      
      // Correct calculation (what it should be after fixing):
      // $1000 base price
      // * 0.9 (after 10% item discount) = $900
      // * 0.95 (after 5% category discount) = $855
      // * 0.85 (after 15% cart discount) = $726.75
      const correctTotal = 726.75

      // Buggy calculation (what we expect from the broken code):
      // $1000 base price
      // * 0.85 (cart discount 15% first) = $850
      // * 0.9 (item discount 10% second) = $765
      const buggyTotal = 765

      // Check if the implementation is correct
      if (Math.abs(total - correctTotal) < 0.01) {
        return {
          success: true,
          message: 'Success! The discount calculation has been fixed. Discounts are now being applied in the correct order.'
        }
      }

      // Check if we still have the bug
      if (Math.abs(total - buggyTotal) < 0.01) {
        return {
          success: false,
          message: 'Test failed: The discount calculation has a bug! The cart discount is being applied before the item discount, which is incorrect. Fix the order of discount application in DefaultDiscountStrategy.'
        }
      }

      return {
        success: false,
        message: `Test failed: Your implementation produced $${total.toFixed(2)}. Expected either $${buggyTotal} (buggy) or $${correctTotal} (fixed).`
      }
    } catch (error) {
      console.error('Shopping cart test error:', error)
      return {
        success: false,
        message: `Error executing code: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
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

  const testAIChallengeSolution = async (files: { [key: string]: string }, expectedFunctionality: string) => {
    const feedback: string = await SolutionQueryGPT(files, expectedFunctionality)
    if (feedback.length === 0) {
        return 'ERROR GRADING SOLUTION!';
    }
    return feedback;
  }

  const parseGPTAnalysis = (response: string) => {
    try {
      const lines = response.trim().split('\n').filter(line => line.trim() !== '')
      
      const getCoverage = () => {
        const coverageLine = lines.find(l => l.includes('COVERAGE:'))
        return coverageLine ? parseInt(coverageLine.split('COVERAGE:')[1]) || 0 : 0
      }

      const getCreativity = () => {
        const creativityLine = lines.find(l => l.includes('CREATIVITY:'))
        return creativityLine ? parseInt(creativityLine.split('CREATIVITY:')[1]) || 0 : 0
      }

      const getFeedback = () => {
        const feedbackLine = lines.find(l => l.includes('FEEDBACK:'))
        return feedbackLine ? feedbackLine.split('FEEDBACK:')[1].trim() : 'No feedback provided'
      }

      return {
        coverage: getCoverage(),
        creativity: getCreativity(),
        feedback: getFeedback(),
        failedTests: [],
        passedTests: 0,
        totalTests: 0
      }
    } catch (error) {
      console.error('Error parsing GPT analysis:', error)
      return {
        coverage: 0,
        creativity: 0,
        feedback: 'Error parsing analysis',
        failedTests: [],
        passedTests: 0,
        totalTests: 0
      }
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      let result
      switch (currentChallenge.id) {
        case 'documentation-challenge-math':
        case 'documentation-challenge-animals': {
          const prompt = `
            First count the words in this documentation.
            Then evaluate the content quality, but word count determines pass/fail status.
            
            Word count rules (these override quality assessment):
            - Under 100 words: Automatic FAIL, max 30% on metrics
            - 100-200 words: Automatic FAIL, max 40% on metrics
            - Over 200 words: Can PASS if quality is good
            - Over 300 words: High chance to PASS with higher metrics
            
            Documentation:
            ${files['README.md']}
            
            Format response exactly as:
            STATUS: PASS/FAIL
            Completeness: X%
            Clarity: X%
            Technical Accuracy: X%
            Code Coverage: X%
            Feedback: One sentence summary of the main improvement needed.
          `
          result = await Promise.all([
            QueryGPT(prompt),
            new Promise(resolve => setTimeout(resolve, 3000))
          ])
          setFeedback(result[0])
          break
        }
        case 'shopping-cart-oop':
          result = testShoppingCart(files)
          setFeedback(typeof result === 'string' ? result : result.message)
          break
        case 'bank-account-system':
          result = testBankAccount(files)
          setFeedback(result)
          break
        case 'library-management':
          result = testLibrarySystem(files)
          setFeedback(result)
          break
        case 'ai-challenge':
            result = await testAIChallengeSolution(files, expectedFunctionality)
            setFeedback(result)
            break
        case 'social-media-tests': {
          // First run tests locally
          const testResults = runTests(files);
          
          // Then get GPT analysis of test quality
          const prompt = `
            Analyze these unit tests for code coverage and creativity.
            Do not evaluate test passes/failures, only analyze:
            1. Code coverage (% of methods and edge cases tested)
            2. Test creativity (variety of scenarios, edge cases, error conditions)
            
            Unit Tests:
            ${files['tests/socialMedia.test.js']}
            
            Format response exactly as:
            COVERAGE: Z%
            CREATIVITY: W%
            FEEDBACK: Brief analysis of test quality and suggestions
          `;

          const [gptAnalysis] = await Promise.all([
            QueryGPT(prompt),
            new Promise(resolve => setTimeout(resolve, 3000))
          ]);

          // Combine local test results with GPT analysis
          const combinedResult = {
            ...testResults,
            ...parseGPTAnalysis(gptAnalysis)
          };

          setFeedback(JSON.stringify(combinedResult));
          break;
        }
        default:
          setFeedback('Unknown challenge type')
      }
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
      <div className="space-y-4">
        <Button 
          onClick={handleSubmit} 
          className="w-full"
          disabled={isSubmitting}
        >
          <Send className="mr-2" size={16} />
          {isSubmitting ? 'Testing...' : 'Submit Solution'}
        </Button>
        {currentChallenge.id !== 'ai-challenge' && (
          <Button
            onClick={() => setShowSolution(!showSolution)}
            className="w-full bg-transparent border hover:bg-gray-700"
          >
            {showSolution ? 'Hide Solution' : 'Show Solution Hint'}
          </Button>)}

        {showSolution && currentChallenge.id !== 'ai-challenge' && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Solution Hint:</h3>
            <p className="text-sm">
              {currentChallenge.id === 'shopping-cart-oop' && (
                <>
                  The discount calculation should follow this order:
                  1. Apply item-specific discount first 
                  2. Then apply category discount
                  3. Finally apply cart-wide discount
                  
                  Check the order of calculations in DefaultDiscountStrategy.calculateTotal()
                </>
              )}
              {currentChallenge.id === 'bank-account-system' && (
                <>
                  Remember to record the transaction in both accounts:
                  - Source account should record transfer_out
                  - Target account should record transfer_in
                  
                  Check the transfer() method implementation
                </>
              )}
              {currentChallenge.id === 'library-management' && (
                <>
                  Key points to implement:
                  - Book checkout should update availability status
                  - Return dates should be calculated correctly
                  - Late returns should incur fines
                  
                  Focus on the checkout() and return() methods
                </>
              )}
            </p>
          </div>
        )}
      </div>
      {isSubmitting && <LoadingIndicator />}
    </div>
  )
}


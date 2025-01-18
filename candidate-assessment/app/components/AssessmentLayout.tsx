'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import BugDescription from './BugDescription'
import SubmitSolution from './SubmitSolution'
import FileExplorer from './FileExplorer'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const mockBugData = {
  description: "Users are reporting that our shopping cart calculator is giving incorrect totals. The bug appears to be in the price calculation logic. Review the code and fix the issue in the 'cartCalculator.js' file.",
  files: {
    'cartCalculator.js': `
// Handles shopping cart price calculations
function calculateItemTotal(quantity, price, discount = 0) {
  // Bug: Incorrect discount application
  const subtotal = quantity * price;
  const discountAmount = subtotal - discount;  // Bug: Should be subtotal * discount
  return discountAmount;
}

module.exports = { calculateItemTotal };
    `.trim(),
    
    'shoppingCart.js': `
const { calculateItemTotal } = require('./cartCalculator');
const { formatCurrency } = require('./utils');

class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(product, quantity) {
    this.items.push({
      product,
      quantity,
      total: calculateItemTotal(
        quantity, 
        product.price, 
        product.discount
      )
    });
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.total, 0);
  }

  displayCart() {
    return this.items.map(item => ({
      name: item.product.name,
      quantity: item.quantity,
      total: formatCurrency(item.total)
    }));
  }
}

module.exports = { ShoppingCart };
    `.trim(),

    'utils.js': `
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

module.exports = { formatCurrency };
    `.trim(),

    'test.js': `
const { ShoppingCart } = require('./shoppingCart');

// Test case
const cart = new ShoppingCart();

// Add items with different discounts
cart.addItem(
  { name: "T-Shirt", price: 20.00, discount: 0.2 }, // 20% discount
  2
);
cart.addItem(
  { name: "Jeans", price: 50.00, discount: 0.1 }, // 10% discount
  1
);

console.log('Cart Items:', cart.displayCart());
console.log('Total:', formatCurrency(cart.getTotal()));

/* Expected output:
Cart Items: [
  { name: "T-Shirt", quantity: 2, total: "$32.00" },  // (20 * 2) * 0.8 = $32
  { name: "Jeans", quantity: 1, total: "$45.00" }     // 50 * 0.9 = $45
]
Total: $77.00

Actual output:
Cart Items: [
  { name: "T-Shirt", quantity: 2, total: "$28.00" },  // Incorrect discount
  { name: "Jeans", quantity: 1, total: "$40.00" }     // Incorrect discount
]
Total: $68.00
*/
    `.trim()
  }
}

export default function AssessmentLayout() {
  const [currentFile, setCurrentFile] = useState('cartCalculator.js')
  const [files, setFiles] = useState(mockBugData.files)
  const [feedback, setFeedback] = useState('')

  const handleCodeChange = (value: string | undefined) => {
    setFiles(prev => ({
      ...prev,
      [currentFile]: value || ''
    }))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Software Engineer Assessment</h1>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <FileExplorer files={Object.keys(files)} currentFile={currentFile} setCurrentFile={setCurrentFile} />
          <BugDescription description={mockBugData.description} />
        </div>
        <div className="col-span-6">
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gray-700 px-4 py-2 text-sm font-medium">{currentFile}</div>
            <MonacoEditor
              height="500px"
              language="javascript"
              theme="vs-dark"
              value={files[currentFile as keyof typeof files]}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                readOnly: false,
                cursorStyle: 'line',
              }}
            />
          </div>
        </div>
        <div className="col-span-3">
          <SubmitSolution files={files} setFeedback={setFeedback} />
          {feedback && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Feedback</h2>
              <p>{feedback}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


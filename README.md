# Bill Splitter

A modern web application built with Next.js that helps groups split bills fairly, taking into account VAT, service fees, and shared items.

## Features

- Add individual or multiple items to the bill
- **Scan receipts with AI** to automatically extract items
- Assign items to specific people or mark them as shared
- Automatically calculate VAT and service fees
- Customize VAT percentage and service fee rates
- Add and manage multiple people
- Real-time calculation of individual shares
- Responsive design that works on both desktop and mobile
- Automatic split of shared items among all participants
- Proportional distribution of service charges and VAT based on individual spend

## Tech Stack

- [Next.js 15.1](https://nextjs.org/) - React framework
- [React 19](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- [Radix UI](https://www.radix-ui.com/) - Accessible UI components
- [AI Integration](https://ai.vercel.ai/) - For receipt scanning capabilities
- [Zod](https://zod.dev/) - TypeScript-first schema validation

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/mohamedar97/bill-splitter
cd bill-splitter
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Click the settings icon to:

   - Add people to the bill
   - Adjust VAT percentage
   - Set service fee percentage

2. Use the "Add Item" button to:

   - Enter item prices and names
   - Assign items to specific people
   - Mark items as shared between all participants

3. Use the "Scan Receipt" feature to:

   - Upload a photo of your receipt
   - Automatically extract items with AI
   - Review and assign items to people

4. View the bill summary to see:
   - Subtotal
   - VAT amount
   - Service fee amount
   - Individual shares for each person
   - Detailed breakdown per person
   - Final total

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

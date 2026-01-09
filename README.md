# SpendSmart - Expense Tracker Frontend

A modern, responsive expense tracking application built with React and Vite. This frontend application allows users to track expenses, split costs among multiple people, and view detailed analytics.

## 🚀 Features

- **🔐 Secure Authentication**
  - Login with static credentials
  - Session management with 24-hour timeout
  - Protected routes - no direct access without authentication

- **💰 Expense Management**
  - Add, view, and delete expenses
  - Track expenses in Indian Rupees (₹)
  - Detailed expense information (title, amount, description)

- **👥 Multi-Person Expense Splitting**
  - Automatically splits expenses equally among 7 people
  - Shows per-person breakdown for each expense
  - Per Person Summary with individual amounts

- **📊 Dashboard Analytics**
  - Total expenses overview
  - Average spend per transaction
  - Transaction count
  - Spending trend chart (visual representation)
  - Recent transactions table

- **🎨 Modern UI/UX**
  - Clean, responsive design
  - Tailwind CSS styling
  - Interactive charts with Recharts
  - Mobile-friendly interface

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3
- **Charts:** Recharts 2
- **Icons:** Lucide React
- **HTTP Client:** Axios

## 📋 Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- Backend API server running (see main README)

## 🚀 Getting Started

### Installation

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

Create a production build:
```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## 🔐 Login Credentials

- **Username:** `adminfonua`
- **Password:** `adminfonua`

## 📁 Project Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── Dashboard.jsx
│   │   ├── Header.jsx
│   │   ├── Login.jsx
│   │   ├── AddExpenseModal.jsx
│   │   ├── PerPersonSummary.jsx
│   │   └── SpendingTrend.jsx
│   ├── constants/         # Constants and configuration
│   │   └── people.js      # People list (7 people)
│   ├── services/          # API services
│   │   └── api.js         # API client
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```

## 🔌 API Integration

The frontend communicates with the backend API. Make sure the backend server is running on `http://localhost:3001` (or update the API URL in `src/services/api.js`).

### API Endpoints Used

- `GET /api/expenses` - Fetch all expenses
- `POST /api/expenses` - Create a new expense
- `DELETE /api/expenses/:id` - Delete an expense

### Environment Variables

Create a `.env` file in the client directory to customize the API URL:

```env
VITE_API_URL=http://localhost:3001/api
```

## 🎨 Customization

### Changing Number of People

Edit `src/constants/people.js` to modify the list of people:

```javascript
export const PEOPLE = [
  'Person 1',
  'Person 2',
  // ... add or remove people
];
```

### Changing Currency

To change currency, update the currency symbol (₹) in:
- `src/components/Dashboard.jsx`
- `src/components/PerPersonSummary.jsx`
- `src/components/AddExpenseModal.jsx`
- `src/components/SpendingTrend.jsx`

## 🔒 Security Features

- **Authentication Required:** All dashboard routes are protected
- **Session Management:** 24-hour session timeout
- **Direct Access Prevention:** Cannot access dashboard without login
- **Auto Logout:** Session expires and logs out automatically

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically use the next available port.

### API Connection Issues

- Ensure the backend server is running
- Check the API URL in `src/services/api.js`
- Verify CORS settings on the backend

### Build Errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📄 License

MIT

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions, please open an issue in the repository.

---

**Built with ❤️ using React and Vite**

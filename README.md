# CollabFlow - Remote Team Collaboration Board

A full-featured Kanban-style project management board for remote teams with real-time collaboration capabilities.

![CollabFlow](https://img.shields.io/badge/React-18+-blue)
![Firebase](https://img.shields.io/badge/Firebase-Latest-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3+-cyan)

## 🚀 Features

### ✅ Implemented (Phase 1 & 2)

- **Authentication System**

  - Email/password authentication
  - Google OAuth integration
  - Protected routes
  - User profile management

- **Kanban Board**

  - Drag & drop tasks between columns
  - Real-time synchronization with Firestore
  - Column management (create, edit, delete)
  - Task management (CRUD operations)
  - Visual priority indicators
  - Due date tracking with status badges

- **Task Management**

  - Rich task details modal
  - Priority levels (Low, Medium, High)
  - Tags/labels
  - Checklist/subtasks
  - Task assignments
  - Due dates

- **Real-time Collaboration**
  - Live updates across all users
  - Firestore listeners for instant sync
  - Optimistic UI updates

### 🚧 Coming Soon (Phase 3 & 4)

- Team chat system
- @mentions and notifications
- User presence indicators
- Analytics dashboard
- File attachments
- Comment system
- Search and filtering
- Offline support
- Mobile responsive enhancements

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Drag & Drop**: @dnd-kit
- **Backend**: Firebase
  - Firestore (Database)
  - Authentication
  - Realtime Database
  - Cloud Storage
- **State Management**: React Context API
- **Routing**: React Router v6
- **Date Handling**: date-fns
- **Notifications**: react-hot-toast
- **Icons**: lucide-react

## 📁 Project Structure

```
CollabFlow/
├── src/
│   ├── components/
│   │   ├── Auth/           # Authentication components
│   │   ├── Board/          # Kanban board components
│   │   ├── Chat/           # Chat components (coming soon)
│   │   ├── Analytics/      # Analytics components (coming soon)
│   │   ├── Layout/         # Layout components
│   │   └── Common/         # Shared components
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Firebase configuration
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── pages/              # Page components
│   ├── App.tsx             # Main App component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── firestore.rules         # Firestore security rules
├── storage.rules           # Storage security rules
├── .env.example            # Environment variables template
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd CollabFlow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Firebase**

   a. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)

   b. Enable the following services:

   - Authentication (Email/Password and Google providers)
   - Firestore Database
   - Realtime Database
   - Cloud Storage

   c. Get your Firebase config from Project Settings

4. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Firebase credentials:

   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
   ```

5. **Deploy Firestore rules**

   ```bash
   firebase init firestore
   firebase deploy --only firestore:rules
   firebase deploy --only storage:rules
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔐 Firebase Setup

### Firestore Database Structure

Create the following indexes in Firestore:

1. **Tasks Collection**

   - Fields: `boardId` (Ascending), `order` (Ascending)
   - Fields: `boardId` (Ascending), `columnId` (Ascending)

2. **Columns Collection**

   - Fields: `boardId` (Ascending), `order` (Ascending)

3. **Boards Collection**
   - Fields: `workspaceId` (Ascending), `createdAt` (Descending)

### Authentication Providers

Enable in Firebase Console > Authentication > Sign-in method:

- Email/Password
- Google

## 📝 Usage

### Creating Your First Board

1. Sign up or log in
2. Click "Add Board" in the sidebar
3. Enter a board name
4. Create columns (To Do, In Progress, Done, etc.)
5. Start adding tasks!

### Managing Tasks

- **Create**: Click "Add Task" in any column
- **Edit**: Click on a task card to open details
- **Move**: Drag and drop tasks between columns
- **Delete**: Open task details and click "Delete Task"

### Working with Checklists

- Open any task
- Add checklist items in the "Checklist" section
- Check off items as you complete them
- Track progress with the visual progress bar

## 🎨 Customization

### Adding Custom Colors

Edit `tailwind.config.js` to add your brand colors:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your colors */ },
      secondary: { /* your colors */ },
    }
  }
}
```

### Custom Board Columns

Column colors can be customized when creating columns. Preset colors are defined in `AddColumnModal.tsx`.

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Deployment

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Vercel

```bash
npm install -g vercel
vercel
```

## 📚 Development Roadmap

- [x] Phase 1: Foundation (Weeks 1-2)

  - [x] Firebase setup
  - [x] Authentication system
  - [x] Basic layout and routing
  - [x] Database structure

- [x] Phase 2: Core Features (Weeks 3-4)

  - [x] Kanban board with drag-and-drop
  - [x] Task CRUD operations
  - [x] Real-time synchronization
  - [x] Task details modal

- [ ] Phase 3: Collaboration (Weeks 5-6)

  - [ ] Chat system
  - [ ] Notifications
  - [ ] Presence indicators
  - [ ] Team management

- [ ] Phase 4: Analytics & Polish (Weeks 7-8)
  - [ ] Analytics dashboard
  - [ ] Search and filtering
  - [ ] Offline support
  - [ ] Performance optimization

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for the amazing framework
- Firebase for the backend infrastructure
- @dnd-kit for the drag-and-drop library
- Tailwind CSS for the styling system

## 📞 Support

For support, email support@collabflow.dev or open an issue in the repository.

---

**Built with ❤️ using React, TypeScript, and Firebase**

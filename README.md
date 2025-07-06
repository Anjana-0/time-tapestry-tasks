
# Time Tapestry Tasks

A beautiful, time-based task management application that helps you organize your day into meaningful periods like Morning, Afternoon, Evening, and Night. Built with React, TypeScript, and modern UI components.

**This project is a part of a hackathon run by https://www.katomaran.com**

[Click here to watch the demo video of app](https://github.com/Anjana-0/time-tapestry-tasks/blob/main/Screen%20Recording%202025-07-06%20140753%20(1).mp4)

## Features

### 🌅 Time-Based Organization
- Pre-defined periods: Morning, Afternoon, Evening, Night
- Add custom periods to match your unique schedule
- Visual period cards with emojis and color coding

### 📝 Complete Task Management  
- Create, read, update, and delete tasks
- Rich task details: title, description, due dates, emojis
- Mark tasks as complete/incomplete
- Drag and drop tasks between periods

### 🎨 Enhanced User Experience
- Emoji picker for personalizing tasks
- Smooth animations for all interactions
- Responsive design for all devices
- Clean, modern interface with gradients and glassmorphism

### 📊 Analytics & Insights
- Daily activity tracking
- Period-based productivity metrics
- Most used emojis statistics
- Completion rate tracking
- Visual progress indicators

### 📅 Calendar Integration
- Interactive calendar view
- Daily activity visualization
- Historical task data
- Date-based task filtering

### 💾 Data Persistence
- Local storage for offline functionality
- Session-based task management
- Automatic data synchronization

## Architecture Overview

```
┌─────────────────────────────────────────┐
│                Frontend                 │
│              (React + TS)               │
├─────────────────────────────────────────┤
│  Components Layer                       │
│  ├── TaskCard                          │
│  ├── PeriodColumn                      │
│  ├── CalendarView                      │
│  ├── Analytics                         │
│  └── EmojiPicker                       │
├─────────────────────────────────────────┤
│  State Management                       │
│  ├── Local Storage Hook                │
│  ├── Period Management                  │
│  └── Task CRUD Operations               │
├─────────────────────────────────────────┤
│  UI Framework                           │
│  ├── Shadcn/ui Components              │
│  ├── Tailwind CSS                      │
│  └── Lucide Icons                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│              Data Flow                  │
├─────────────────────────────────────────┤
│  User Interaction                       │
│         ↓                               │
│  Component Event Handler                │
│         ↓                               │
│  State Update (useState)                │
│         ↓                               │
│  Local Storage Sync                     │
│         ↓                               │
│  UI Re-render                           │
└─────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible UI components

### State Management
- **React Hooks** - useState, useEffect for local state
- **Custom Hooks** - useLocalStorage for data persistence
- **Local Storage** - Browser-based data persistence

### UI/UX Libraries
- **Lucide React** - Beautiful, consistent icons
- **date-fns** - Modern date utility library
- **React Hook Form** - Form handling and validation
- **Sonner** - Toast notifications

## Key Assumptions

Based on the requirements, I've made the following assumptions:

1. **Local Storage Approach**: Since the scope mentions session-based storage, I implemented local storage for data persistence instead of requiring a backend database.

2. **Social Login Simplification**: While Google authentication was mentioned, I focused on the core task management features first. Authentication can be added as an enhancement.

3. **Period Flexibility**: Beyond the four main periods, users can add custom periods to accommodate different schedules (work shifts, study sessions, etc.).

4. **Task Categories**: Tasks are organized by time periods rather than traditional categories, promoting time-aware productivity.

5. **Analytics Scope**: Built comprehensive analytics including daily summaries, period activity, and usage patterns to provide meaningful insights.

6. **Mobile-First Design**: Implemented responsive design assuming users will access the app across different devices.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd time-tapestry-tasks
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage Guide

### Creating Tasks
1. Click the "Add Task" button in any period column
2. Fill in task details (title, description, emoji, due date)
3. Save the task

### Managing Tasks
- **Complete**: Click the checkbox next to any task
- **Move**: Drag and drop tasks between different periods  
- **Delete**: Click the trash icon on any task
- **Edit**: (Feature ready for implementation)

### Viewing Analytics
1. Switch to the "Analytics" tab
2. View overall statistics and period performance
3. Check most used emojis and completion rates

### Calendar View
1. Switch to the "Calendar" tab
2. Click on any date to see daily activity
3. Dates with tasks are highlighted

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── TaskCard.tsx    # Individual task display
│   ├── PeriodColumn.tsx # Period container with tasks
│   ├── TaskDialog.tsx  # Task creation/editing modal
│   ├── CalendarView.tsx # Calendar interface
│   ├── Analytics.tsx   # Statistics and insights
│   └── EmojiPicker.tsx # Emoji selection component
├── hooks/              # Custom React hooks
│   └── useLocalStorage.ts # Local storage management
├── types/              # TypeScript type definitions
│   └── index.ts       # Core application types
├── pages/              # Main application pages
│   └── Index.tsx      # Primary application interface
└── lib/                # Utility functions
    └── utils.ts       # Common helper functions
```

## Future Enhancements

- Google OAuth integration
- Backend API with Flask/Python
- Real-time collaboration
- Task templates and recurring tasks
- Advanced filtering and search
- Export/import functionality
- Dark mode theme
- Mobile app version
- Team/shared workspaces

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**This project is a part of a hackathon run by https://www.katomaran.com**

Built with ❤️ for the Katomaran Hackathon

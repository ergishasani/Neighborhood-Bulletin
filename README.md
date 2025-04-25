# 🏘️ Neighborhood Bulletin Board

A free and open-source web application designed to connect communities by providing a platform for sharing local information. Built with modern web technologies and leveraging free cloud services, this project empowers neighbors to post events, find lost pets, organize garage sales, and exchange important local announcements.

## 🌟 Features

- **👥 User Authentication:**
  - Secure email/password registration and login.
  - Robust user session management for a seamless experience.
  - Protected routes to ensure only authorized users can create and manage posts.
- **📣 Post Creation:**
  - Users can create detailed posts with titles, descriptions, categories, neighborhoods, and images.
  - Image uploads to Firebase Storage (free tier supported).
  - Comprehensive form validation to maintain data integrity and consistency.
- **🖼️ Post Display:**
  - Flexible post-display in list or grid format to suit different user preferences.
  - ℹ Clear display of post-title, description, image, category, neighborhood, and user information.
  - Efficient loading of posts using pagination or infinite scrolling for optimal performance.
- **🔍 Post Filtering:**
  - Filter posts by category (e.g., Events, Lost Pets, Garage Sales, Announcements) for targeted searches.
  - Filter posts by neighborhood to focus on relevant local updates.
  - Ability to select multiple categories or neighborhoods for refined search results.
- **🔔 Notifications:**
  - Email notifications to users when new posts are created in their subscribed neighborhoods (using Firebase Cloud Functions and free email services like SendGrid's free tier).
  - Email notifications to administrators when a post is reported for moderation.
- **🧹 Moderation:**
  - Users can easily report inappropriate posts to maintain community standards.
  - Administrators receive notifications of reported posts and have the tools to review and delete them.
- **⏱️ Auto-Expiration:**
  - Posts automatically expire and are deleted after a configurable period (e.g., 30 days) to keep content fresh and relevant (using Firebase Cloud Functions).

## 🛠️ Technologies Used

- **Frontend:**
  - React: A powerful JavaScript library for building user interfaces.
  - Vite: A fast and modern build tool for React development.
  - Tailwind CSS: A utility-first CSS framework for rapid UI development.
  - React Router: A standard library for routing in React applications.
- **Backend:**
  - 🔥 Firebase: A comprehensive platform for building web and mobile applications.
    - Firebase Authentication: For user authentication and management.
    - Firestore: A NoSQL cloud database for storing post data.
    - Firebase Storage: For storing user-uploaded images.
    - Firebase Cloud Functions: For serverless backend logic (notifications, auto-expiration).

## 📂 Project Structure

```
neighborhood-bulletin-board/
│
├── public/
│   └── index.html
│
├── src/
│
│   ├── assets/                    # Static assets like images & logos
│
│   ├── components/                # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── PostCard.jsx
│   │   ├── PostForm.jsx
│   │   ├── CommentSection.jsx
│   │   ├── Loader.jsx
│   │   └── OnboardingSlides.jsx
│
│   ├── context/                   # Context Providers (e.g., AuthContext)
│
│   ├── firebase/                  # Firebase logic
│   │   ├── config.js
│   │   ├── auth.js
│   │   ├── firestore.js
│   │   ├── storage.js
│
│   ├── hooks/                     # Custom hooks (e.g., useAuth)
│
│   ├── layouts/                   # Page wrappers/layouts
│   │   └── MainLayout.jsx
│
│   ├── pages/
│   │
│   │   ├── onboarding/
│   │   │   └── Onboarding.jsx
│   │
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ForgotPassword.jsx
│   │
│   │   ├── home/
│   │   │   └── Home.jsx
│   │
│   │   ├── posts/
│   │   │   ├── CreatePost.jsx
│   │   │   ├── EditPost.jsx
│   │   │   ├── PostDetail.jsx
│   │   │   └── SearchResults.jsx
│   │
│   │   ├── categories/
│   │   │   ├── Events.jsx
│   │   │   ├── LostAndFound.jsx
│   │   │   └── GarageSales.jsx
│   │
│   │   ├── user/
│   │   │   ├── Profile.jsx
│   │   │   ├── EditProfile.jsx
│   │   │   └── MyPosts.jsx
│   │
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ManagePosts.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── UserManagement.jsx
│   │
│   │   ├── misc/
│   │   │   ├── Terms.jsx
│   │   │   └── NotFound.jsx
│
│   ├── routes/                    # React Router setup
│   │   └── AppRoutes.jsx
│
│   ├── styles/                    # SASS styles
│   │   ├── main.scss              # Entry SCSS file
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   ├── _globals.scss
│   │   ├── components/
│   │   │   └── _navbar.scss
│   │   ├── pages/
│   │   │   └── _home.scss
│   │   └── layouts/
│   │       └── _mainLayout.scss
│
│   ├── App.jsx
│   ├── main.jsx
│   └── index.js
│
├── .env                          # Firebase environment keys
├── package.json
└── README.md

```

## 🚀 Setup Instructions

### ⚙️ Prerequisites

- Node.js and npm installed (`node -v` >= 16)
- Firebase account and project created (Firebase free tier is enough)

### 🔥 Firebase Setup

1.  **Create a Firebase project:** Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Enable Authentication:** Enable Email/Password authentication in the Firebase Console.
3.  **Create a Firestore database:** Create a Firestore database in the Firebase Console.
4.  **Enable Firebase Storage:** Enable Firebase Storage in the Firebase Console.
5.  **Get Firebase configuration:**
    - In your Firebase project settings, find the Firebase configuration object.
    - Copy this object and store it securely.

### 💻 Local Development

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/ergishasani/Neighborhood-Bulletin.git
    cd neighborhood-bulletin
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

    ```bash
    npm install firebase react-router-dom sass react-hook-form react-icons @tailwindcss/postcss7-autoprefixer @tailwindcss/forms autoprefixer postcss
    ```

3.  **Configure environment variables:**

    - Create a `.env` file in the root directory of the project.
    - Add your Firebase configuration variables (see [Environment Variables](#environment-variables) section).

4.  **Run the application:**

    ```bash
    npm run dev  # Or npm start, depending on your Vite setup
    ```

    This will start the React development server. Open your browser and navigate to `http://localhost:3000`.

## 🔑 Environment Variables

Create a `.env` file in the root directory of your project and add the following environment variables:

```
VITE_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
VITE_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
VITE_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
```

**Important:** Replace the placeholder values with your actual Firebase configuration values. Note the use of `VITE_` prefix, which is important for Vite.

## ☁️ Cloud Functions Deployment

1.  **Navigate to the `functions` directory:**

    ```bash
    cd functions
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Firebase CLI:**

    ```bash
    firebase login
    firebase use --add YOUR_FIREBASE_PROJECT_ID
    ```

4.  **Deploy Cloud Functions:**

    ```bash
    firebase deploy --only functions
    ```

## 🤝 Contributing

We welcome contributions to this project! Here's how you can help:

1.  **Fork the repository:** Create your own copy of the project.
2.  **Create a new branch:** Make your changes in a dedicated branch.
3.  **Implement your changes:** Add new features, fix bugs, or improve documentation.
4.  **Commit with clear messages:** Write concise and descriptive commit messages.
5.  **Create a pull request:** Submit your changes to the main branch for review.

## 🗺️ Roadmap

### Phase 1: Core Functionality (Sprint 1)

- ✅ Set up a React project with Vite.
- ✅ Initialize Firebase project.
- ✅ Implement Firebase Authentication (Email/Password).
- ✅ Design Firestore data structure for posts.
- ✅ Implement Post Creation Component (with image uploads to Firebase Storage).
- ✅ Implement Post Display Component.

### Phase 2: Enhanced Features (Sprint 2)

- ✅ Filtering posts by category and neighborhood.
- ✅ Implement pagination or infinite scrolling for post-display.
- ✅ Implement user profile management (basic).

### Phase 3: Community Engagement (Sprint 3)

- ✅ Firebase Cloud Function—New Post Notification (using SendGrid free tier or similar).
- ✅ Report Post Functionality.
- ✅ Basic search functionality.

### Phase 4: Refinement and Automation (Sprint 4)

- ✅ Cloud Function—Expire Old Posts.
- ✅ Admin dashboard for user and post-management.
- ✅ Improved UI/UX design.

### Phase 5: Deployment and Optimization (Sprint 5)

- ✅ Deploy the application to Firebase Hosting.
- ✅ Performance optimization.
- ✅ Accessibility improvements.

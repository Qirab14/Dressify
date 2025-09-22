# StyleAI - Virtual Try-On & AI Style Assistant

A mobile-responsive web application that combines virtual try-on technology with AI-powered style recommendations.

## Features

### 🔐 Authentication
- User registration and login
- Profile setup with body measurements and style preferences

### 📸 Virtual Try-On
- Integration with Hugging Face Kolors Virtual Try-On model
- Upload person and garment images
- AI-powered virtual fitting

### 🤖 AI Style Assistant
- Personalized fashion recommendations based on:
  - Body type
  - Height and weight
  - Skin tone
  - Cultural background
  - Style preferences
  - Budget range
- Occasion-based suggestions
- Custom prompt-based advice

### 📱 Mobile-First Design
- Responsive design optimized for mobile devices
- Touch-friendly interface
- Bottom navigation for easy thumb navigation

## Technology Stack

- **Frontend**: React 18, React Router
- **Styling**: CSS3 with mobile-first responsive design
- **AI Integration**: Hugging Face API (Kolors Virtual Try-On)
- **State Management**: React Context API
- **Storage**: Local Storage for user data

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```
   REACT_APP_HF_TOKEN=your_hugging_face_token_here
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## API Integration

### Hugging Face Kolors Virtual Try-On
The app integrates with the Kolors Virtual Try-On model:
- **Model**: `Kwai-Kolors/Kolors-Virtual-Try-On`
- **Space**: https://huggingface.co/spaces/Kwai-Kolors/Kolors-Virtual-Try-On
- **Usage**: Upload person and garment images to get virtual try-on results

### AI Style Recommendations
The AI assistant considers multiple factors:
- **Body Type**: Pear, Apple, Hourglass, Rectangle, Inverted Triangle
- **Physical Attributes**: Height, weight, skin tone
- **Cultural Context**: Western, Asian, African, etc.
- **Style Preferences**: Casual, Formal, Bohemian, etc.
- **Budget Constraints**: Budget, Mid-range, Premium, Luxury

## User Flow

1. **Registration/Login**: Users create an account
2. **Profile Setup**: 3-step onboarding to collect preferences
3. **Home Dashboard**: Overview of features and quick actions
4. **Virtual Try-On**: Upload images and see AI-generated results
5. **AI Style Assistant**: Get personalized recommendations

## Mobile Optimization

- **Responsive Design**: Works on all screen sizes
- **Touch Gestures**: Optimized for mobile interaction
- **Performance**: Lazy loading and optimized images
- **PWA Ready**: Can be installed as a mobile app

## Future Enhancements

- [ ] Real-time camera integration for try-on
- [ ] Social sharing features
- [ ] Shopping integration with e-commerce platforms
- [ ] Advanced AI models for better recommendations
- [ ] User-generated content and reviews
- [ ] Wardrobe management features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
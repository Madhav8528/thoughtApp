# 🌟 DailyThought  

**DailyThought** is a simple learning app that helps users receive and generate meaningful thoughts every day. Whether you're looking for a random dose of wisdom, need a thought based on your mood, or want to get daily morning and evening thoughts via email—this app has got you covered!  

## How is DailyThought Different?  

Unlike most thought apps that:  
- Store thousands of predefined thoughts in a database.  
- Randomly pick a thought from the stored collection.  

**DailyThought is different because:**  
- It generates **new** thoughts dynamically using **Google Gemini AI**.  
- It **saves database storage** by not storing thousands of pre-written thoughts.  
- Povides **unique and fresh** thoughts instead of repeating old ones.  

This smart approach makes **DailyThought** more efficient, creative, and scalable compared to traditional thought apps!  



---


## Features  

- **User Authentication with OTP** – Secure login using email verification.  
- **Random Thought Generator** – Get a new inspiring thought anytime.  
- **Mood-Based Thought Generation** – Enter your mood and receive a personalized thought.  
- **Daily Thought Emails** – Subscribe to get great thoughts delivered to your email every morning and evening.  

### Extra Security Additions  
- **JWT Authentication Middleware** – Ensures safe and secure user authentication.  
- **Refresh & Access Tokens** – Keeps sessions active without needing frequent logins.  


##  How It Works
- **Sign Up & Verify** – Register with your email and verify it using an OTP.
- **Generate Thoughts** – Click to get a random thought or enter your mood to get a personalized one.
- **Subscribe for Emails** – Get thoughtful messages every morning and evening.
- **Secure Sessions** – Your login session is safe with JWT authentication.




## Technologies & Libraries Used  

This app is built using **Node.js** with the following key libraries:  

```json
"dependencies": {
  "@google/generative-ai": "^0.21.0",
  "@types/cookie-parser": "^1.4.8",
  "bcrypt": "^5.1.1",
  "cookie-parser": "^1.4.7",
  "cookieparser": "^0.1.0",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "express": "^4.21.2",
  "jsonwebtoken": "^9.0.2",
  "mongodb": "^6.12.0",
  "node": "^22.13.0",
  "node-cron": "^3.0.3",
  "nodemailer": "^6.10.0",
  "openai": "^4.79.1",
  "otp-generator": "^4.0.1"
},
"devDependencies": {
  "nodemon": "^3.1.9",
  "prettier": "^3.4.2"
}


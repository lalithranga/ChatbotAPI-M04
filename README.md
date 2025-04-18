# Insurance Recommendation Chatbot - README

## Overview
This is an AI-powered chatbot designed to assist users in selecting the best vehicle insurance policy based on their responses. The chatbot dynamically interacts with users, gathers necessary details, and provides personalized insurance recommendations.

## Features
- **Start Consultation:** Initializes a chat session and asks relevant questions.
- **Conversational AI:** Uses Google Generative AI (Gemini) to generate responses.
- **Business Rules Application:** Determines the best insurance policy based on user responses.
- **Dynamic Questioning:** Adjusts the conversation flow based on provided answers.
- **Session Management:** Maintains user responses within a session.
- **Error Handling:** Handles unexpected failures with appropriate messages.

## Technologies Used
- **Backend:** Node.js with Express
- **AI Integration:** Google Generative AI (Gemini)
- **Middleware:** Cors, dotenv
- **API Requests:** Express JSON handling
- **Hosting:** Localhost (port 5000)

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- npm (comes with Node.js)
- A Google Generative AI API key

### Steps
1. **Clone the Repository:**
   ```sh
   git clone https://github.com/your-repo/chatbot-backend.git
   cd chatbot-backend
   ```
2. **Install Dependencies:**
   ```sh
   npm install
   ```
3. **Set Up Environment Variables:**
   Create a `.env` file and add your Gemini API key:
   ```sh
   GEMINI_API_KEY=your_google_ai_api_key
   ```
4. **Run the Server:**
   ```sh
   node server.js
   ```
5. **Backend is Running at:**
   ```
   http://localhost:5000/
   ```

## API Endpoints
- **Start Consultation:** `POST /api/start-consultation`
- **Chat Message Handling:** `POST /api/chat`

## How It Works
1. The user starts a consultation.
2. The chatbot asks relevant questions to determine the best insurance policy.
3. The chatbot applies business rules to recommend a suitable insurance type.
4. The user is given an option to receive further assistance.

## File Structure
```
/chatbot-backend
├── server.js  # Main backend application
├── .env       # Environment variables
├── package.json
├── README.md
```

## Future Improvements
- Improve AI response refinement.
- Enhance session storage with a database.
- Deploy the chatbot to a cloud service.


Contributions and improvements are welcome!


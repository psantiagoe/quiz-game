// Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCBVEwenlUuBPsTNSvw_fnGxr0MSvRz8io",
	authDomain: "db-quiz-game.firebaseapp.com",
	projectId: "db-quiz-game",
	storageBucket: "db-quiz-game.appspot.com",
	messagingSenderId: "459331414578",
	appId: "1:459331414578:web:3c87284bfcd0f405d96a2b",
	measurementId: "G-W8NSY7YPRN",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

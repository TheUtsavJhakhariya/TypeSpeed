const testParagraphElement = document.getElementById('test-paragraph');
const userInputElement = document.getElementById('user-input');
const startButton = document.getElementById('start-btn');
const resultsElement = document.getElementById('results');
const difficultySelect = document.getElementById('difficulty');
const timeLimitInput = document.getElementById('time-limit-input'); 
const progressSection = document.getElementById('progress-section');
const countdownElement = document.createElement('span'); // New element for countdown 

const easyParagraphs = ["The Ultimate Fighting Championship is a mixed martial arts promotion company based in Las Vegas, Nevada. It is the largest MMA promotion in the world and features some of the highest-level fighters in the sport. Founded in 1993, the UFC has grown significantly over the years and has become a global phenomenon. With events held in various countries and millions of fans worldwide, the UFC continues to push the boundaries of combat sports entertainment."]; // Your easy paragraphs here
const mediumParagraphs = ["Mixed martial arts is a dynamic and evolving sport that combines techniques from various martial arts disciplines, including boxing, Brazilian Jiu-Jitsu, Muay Thai, wrestling, and judo. Fighters in MMA must be proficient in both striking and grappling techniques, as well as possess a high level of cardiovascular fitness and mental toughness. Matches are often fast-paced and unpredictable, requiring fighters to adapt quickly to their opponent's tactics while maintaining their own game plan. The sport has gained widespread popularity in recent years, with organizations like the UFC showcasing elite-level talent from around the world."]; // Your medium paragraphs here
const hardParagraphs = ["The intricacies of mixed martial arts entail a labyrinthine journey of training and refinement, where combatants delve into a myriad of techniques and strategies with meticulous precision. Mastery in MMA necessitates an amalgamation of astute cognitive faculties and physical prowess, encompassing a pantheon of disciplines ranging from pugilistic arts to the esoteric realms of grappling and submission wrestling. Fighters must navigate through a labyrinth of complexities, honing their craft in the crucible of relentless practice and relentless competition. With each bout, combatants are subjected to a crucible of pressure, where split-second decisions and nuanced movements can determine the outcome. Only through relentless dedication and unwavering perseverance can one ascend to the upper echelons of MMA excellence."]; // Your hard paragraphs here

let currentParagraph = "";  
let startTime; 
let elapsedTime = 0;
let intervalId;
 
function updateCharacterCount() {
  const typedText = userInputElement.value;
  const characterCount = typedText.length;
  document.getElementById('character-count').textContent = `${characterCount} characters`;
}

userInputElement.addEventListener('keyup', updateCharacterCount);

startButton.addEventListener('click', () => {
  const selectedDifficulty = difficultySelect.value;
  const timeLimit = parseInt(timeLimitInput.value, 10) * 60; // Convert minutes to seconds

  let paragraphs;
  switch (selectedDifficulty) {
    case 'easy':
        paragraphs = easyParagraphs;
        document.body.style.backgroundColor = '#88ff88'; // Light green
        break;
    case 'medium':
        paragraphs = mediumParagraphs;
        document.body.style.backgroundColor = '#ffff8b'; // Pale yellow
        break;
    case 'hard':
        paragraphs = hardParagraphs;
        document.body.style.backgroundColor = '#ffb769'; // Light orange
        break;
}


  currentParagraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
  testParagraphElement.textContent = currentParagraph;
  userInputElement.value = ""; // Clear user input
  startTime = new Date(); // Capture start time
  elapsedTime = 0; // Reset elapsed time

  // Start timer if time limit is set
  if (timeLimit > 0) {
    countdownElement.textContent = `${timeLimit} seconds`; // Initial countdown display
    countdownElement.style.color = 'red'; // Set color to red
    document.body.appendChild(countdownElement); // Add countdown element to DOM

    intervalId = setInterval(() => {
      elapsedTime++;
      const remainingTime = timeLimit - elapsedTime;
      countdownElement.textContent = `${remainingTime} seconds`; // Update countdown
      if (remainingTime <= 0) {
        clearInterval(intervalId);
        checkResults();
      }
    }, 1000);
  }

  startButton.disabled = true; // Disable button to prevent restarts
  userInputElement.focus(); // Set focus to user input area
});

function checkResults() {
  const typedText = userInputElement.value;
  if (typedText === currentParagraph) {
    clearInterval(intervalId); // Stop timer if running
    const wpm = calculateWPM(currentParagraph.split(' ').length, elapsedTime);
    const accuracy = calculateAccuracy(typedText, currentParagraph);
    displayResults(wpm, accuracy);
    storeProgress(wpm, accuracy, selectedDifficulty);
    document.body.style.backgroundColor = 'white'; // Reset background color
    countdownElement.remove(); // Remove countdown element
  }
}

function displayResults(wpm, accuracy) {
  resultsElement.textContent = `WPM: ${wpm.toFixed(2)} | Accuracy: ${accuracy.toFixed(2)}%`;
}
function displayResults(wpm, accuracy) {
    resultsElement.textContent = `WPM: ${wpm.toFixed(2)} | Accuracy: ${accuracy.toFixed(2)}%`;

    // Create a mailto link with pre-filled email body content
    const emailBody = `Hi,\n\nI just completed a typing speed test on your platform.\n\nResults:\n  - Difficulty: ${selectedDifficulty}\n  - WPM: ${wpm.toFixed(2)}\n  - Accuracy: ${accuracy.toFixed(2)}%\n\n`;

    // Optionally, include mistyped words analysis (if implemented)
    if (Object.keys(mistypedWords).length > 0) {
      emailBody += "\nMistyped Words:\n";
      for (const word in mistypedWords) {
        emailBody += `  - ${word} (occurrences: ${mistypedWords[word]})\n`;
      }
    }

    const mailtoLink = `mailto:?subject=Typing Speed Test Results&body=${encodeURIComponent(emailBody)}`;
    const emailLinkElement = document.createElement('a');
    emailLinkElement.href = mailtoLink;
    emailLinkElement.textContent = "Click here to send your results via email";
    resultsElement.appendChild(emailLinkElement);
  }

// ... rest of the code for calculating WPM, accuracy, storing progress, and displaying progress is the same ...

// Call displayProgress on page load to show existing data
displayProgress();

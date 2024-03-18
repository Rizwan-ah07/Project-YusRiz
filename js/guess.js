document.getElementById('submit-guess').addEventListener('click', function() {
    const userInput = document.getElementById('guess-input').value;
    const pokemonImageElement = document.getElementById('pokemon-image');
    const scoreElement = document.getElementById('points');
    let score = parseInt(scoreElement.textContent, 10);
  
    // You would have your logic to check if the guess is correct here.
    // This is just a placeholder example.
    // Suppose the correct name is 'pikachu'
    const correctName = 'pikachu';
  
    if (userInput.toLowerCase() === correctName.toLowerCase()) {
      alert('Correct guess!');
      score += 1;
    } else {
      alert('Wrong guess!');
    }
  
    // Update the score display
    scoreElement.textContent = score;
  
    // Reset input field
    document.getElementById('guess-input').value = '';
  });
  
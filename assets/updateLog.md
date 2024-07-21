# Debugs & Updates
*Here are descriptions about updates/changes made after first deployment.*

## Debug 1
### Date: 7/21/2024
#### Wordle board not display immediately 
Moved the await function `generateRandomWord()` to be called after `displayWordleBoard()` and its functions, to solve the board not appearing right when the game starts or ends because it was waiting on the word before displaying the board.

#### Background color change for box of letters
Recurring bug with tailwind, bg-green class stopped working for the letterBox classes. Fixed by changed the background color to emerald `bg-emerald`.
// Storage controller

// Player controller
const PlayerCtrl = (function(){

  // Player Constructor
  const Player = function(id, name, scores){
    this.id = id;
    this.name = name;
    this.scores = scores;
  }

  // Data Structure
  const data = {
    players: [
      //{id: 0, name: 'Mitch', scores: [3, 2, 3]},
      //{id: 1, name: 'Tom', scores: [3, 3, 4]},
      //{id: 2, name: 'Tyler', scores: [3, 3, 3]}
    ],
    parArr: []
  }

  // Public methods
  return {
    getPlayers: function(){
      return data.players;
    },
    addPlayer: function(name){
      // Create ID
      let ID;
      if(data.players.length > 0) {
        ID = data.players[data.players.length -1].id + 1
      } else {
        ID = 0;
      }
      // Set player scores to empty array
      let scores = [];

      // Create new player and add to data array
      newPlayer = new Player(ID, name, scores);
      data.players.push(newPlayer);

      return newPlayer
    },
    pushNewScores: function(newScoresArr){
      for(i=0; i < data.players.length; i++){
        data.players[i].scores.push(newScoresArr[i])
      }
      return data.players
    }
  }
})();

// UI Controller 
const UICtrl = (function(){

  const UISelectors = {
    playerState: '.player-state',
    courseState: '.course-state',
    gameState: '.game-state',
    addPlayerBtn: '.add-player-btn',
    playerNameInput: '#player-name-input',
    doneBtn: '.done-btn',
    courseInput: '#course-name-input',
    courseBanner: '.course-banner',
    startBtn: '.start-game-btn',
    logScoresBtn: '.log-scores-btn',
    playerList: '#player-list'
  };

  return{
    
    populatePlayerList: function(players){
      let html = '';

      players.forEach(function(player){
        let boxScore = '';
        for(i=0; i<player.scores.length; i++){
          boxScore += ` ${player.scores[i]} |`
        }

        html += ` <li id="player-${player.id}" class='row'>
                  <div class='col s2'>
                  <strong>${player.name}</strong></div>
                  <div class='col s7'>|  ${boxScore}</div>
                  <div class=' pull-right' >
                  <i class="fas fa-angle-left leftBtn"></i>
                  <i class="scoreInput">3</i>
                  <i class="fas fa-angle-right rightBtn"></i></div>
                  </li>`
      })
      // Insert Players into list
      document.querySelector(UISelectors.playerList).innerHTML = html;
    },
    getPlayerNameInput: function(){
      return {
        name:document.querySelector(UISelectors.playerNameInput).value
      }
    },
    addPlayerToList: function(player){
      // Show list
      document.querySelector(UISelectors.playerList).style.display = 'block';
      let boxScore = [];
      const li = document.createElement('li');
      li.id = `player-${player.id}`;
      li.innerHTML = `<strong>${player.name}:    </strong> ${boxScore}
      <i class="fas fa-angle-left leftBtn"></i>
      <i class="scoreInput">3</i>
      <i class="fas fa-angle-right rightBtn"></i>`;

      document.querySelector(UISelectors.playerList).insertAdjacentElement('beforeend', li);
    },
    clearNameInput: function(){
      document.querySelector(UISelectors.playerNameInput).value = '';
    },
    getCourseInput: function(){
      return{
        course: document.querySelector(UISelectors.courseInput).value}
    },
    getNewScoresArr: function(){
      const inputElements = document.getElementsByClassName('scoreInput');
      let newScoresArr = []
      
      for(i=0; i < inputElements.length; i++){
        newScoresArr.push(parseInt(inputElements[i].innerHTML))
      }
      return newScoresArr
    },
    hidePlayerList: function(){
      document.querySelector(UISelectors.playerList).style.display = 'none';
    },
    showPlayerState: function(){
      document.querySelector(UISelectors.playerState).style.display = 'block';
      document.querySelector(UISelectors.courseState).style.display = 'none';
      document.querySelector(UISelectors.gameState).style.display = 'none';
    },
    showCourseState: function(){
      document.querySelector(UISelectors.playerState).style.display = 'none';
      document.querySelector(UISelectors.courseState).style.display = 'block';
      document.querySelector(UISelectors.gameState).style.display = 'none';
    },
    showGameState: function(){
      document.querySelector(UISelectors.playerState).style.display = 'none';
      document.querySelector(UISelectors.courseState).style.display = 'none';
      document.querySelector(UISelectors.gameState).style.display = 'block';
    },
    getSelectors: function(){
      return UISelectors;
    }
  }
})();

// App controller
const App = (function(UICtrl){

  const UISelectors = UICtrl.getSelectors();

  const loadEventListeners = function(){
    // Add player button
    document.querySelector(UISelectors.addPlayerBtn).addEventListener('click', addPlayerBtnSubmit);

    // Done with player entry
    document.querySelector(UISelectors.doneBtn).addEventListener('click', doneBtnClick);

    // Start Game Button
    document.querySelector(UISelectors.startBtn).addEventListener('click', startBtnClick);

    // Left arrow click
    document.querySelector(UISelectors.playerList).addEventListener('click', leftArrowClick);
  
    // Right arrow click
    document.querySelector(UISelectors.playerList).addEventListener('click', rightArrowClick);

    // Log Scores Submit
    document.querySelector(UISelectors.logScoresBtn).addEventListener('click', logScoresSubmit);
  }

  const addPlayerBtnSubmit = function(e){
    const nameInput = UICtrl.getPlayerNameInput();

    if(nameInput.name != ''){
      const newPlayer = PlayerCtrl.addPlayer(nameInput.name)

      UICtrl.addPlayerToList(newPlayer);

      UICtrl.clearNameInput();
    }

    e.preventDefault();
  }

  const doneBtnClick = function(e){
    UICtrl.showCourseState();
    e.preventDefault();
  }

  const startBtnClick = function(e){
    UICtrl.showGameState();
    const courseName = UICtrl.getCourseInput();

    document.querySelector(UISelectors.courseBanner).innerHTML = courseName.course;
    e.preventDefault();
  }

  const leftArrowClick = function(e) {
    if(e.target.classList.contains('leftBtn')){
     var n = e.target, ret = [];
     while (n = n.nextElementSibling){
       ret.push(n)
     }
     ret[0].innerHTML = ret[0].innerHTML - 1;
     
    }
    e.preventDefault();
  }

  const rightArrowClick = function(e) {
    if(e.target.classList.contains('rightBtn')){
     var n = e.target, ret = [];
     while (n = n.previousElementSibling){
       ret.push(n)
     }
     ret[0].innerHTML = parseInt(ret[0].innerHTML) + 1
     
    }
    e.preventDefault();
  }

  const logScoresSubmit = function(e){
    // Get new scores array
    const newScoresArr = UICtrl.getNewScoresArr();
    // Push new scores into data structure
    const players = PlayerCtrl.pushNewScores(newScoresArr);

    UICtrl.populatePlayerList(players);

    e.preventDefault();
  }

  return {
    init: function(){
      UICtrl.showPlayerState();

      //Fetch players from data structure
      const players = PlayerCtrl.getPlayers();

      // Populate list with players
      if(players.length === 0){
        UICtrl.hidePlayerList();
      }else{
      UICtrl.populatePlayerList(players);
      }

      loadEventListeners();
    }
  }
})(UICtrl);

App.init();
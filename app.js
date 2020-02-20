// Storage controller

// Player controller
const PlayerCtrl = (function(){

  // Player Constructor
  const Player = function(id, name, scores, overUnder){
    this.id = id;
    this.name = name;
    this.scores = scores;
    this.overUnder = overUnder;
  }

  // Data Structure
  const data = {
    players: [
      //{id: 0, name: 'Mitch', scores: [3, 2, 3]},
      //{id: 1, name: 'Tom', scores: [3, 3, 4]},
      //{id: 2, name: 'Tyler', scores: [3, 3, 3]}
    ],
    parArr: [],
    holes: []
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
      // Set player over under
      let overUnder = 0;

      // Create new player and add to data array
      newPlayer = new Player(ID, name, scores, overUnder);
      data.players.push(newPlayer);

      return newPlayer
    },
    removePlayer: function(){
      data.players.pop();
    },
    pushNewScores: function(newScoresArr){
      for(i=0; i < data.players.length; i++){
        data.players[i].scores.push(newScoresArr[i])
      }
    },
    getHoles: function(){
      const holes = data.holes;
      holes.push(holes.length + 1)
      return holes
    },
    getHoleArr: function(){
      return data.holes;
    },
    getPars: function(){
      return data.parArr;
    },
    pushNewPar: function(newPar){
      const parArr = data.parArr;
      parArr.push(newPar);
      return parArr;
    },
    calculateOverUnder: function(){
      const pars = data.parArr;
      const players = data.players;
      //get par total
      let parTotal = 0;
      pars.forEach(function(par){
        parTotal += par;
      });
      // set overunder for each player
      players.forEach(function(player){
        let scoreTotal = 0;
        player.scores.forEach(function(score){
          scoreTotal += score;
        })
        player.overUnder = scoreTotal - parTotal;
      })
      
    },
    removeLastHole: function(){
      let holes = data.holes;
      holes.pop();
      let parArr = data.parArr;
      parArr.pop();
      let players = data.players;
      players.forEach(function(player){
        player.scores.pop();
      })
    }
  }
})();

// UI Controller 
const UICtrl = (function(){

  const UISelectors = {
    playerState: '.player-state',
    courseState: '.course-state',
    gameState: '.game-state',
    gameStateData: '.game-state-data',
    addPlayerBtn: '.add-player-btn',
    backPlayerBtn: '.back-player-btn',
    playerNameInput: '#player-name-input',
    doneBtn: '.done-btn',
    courseInput: '#course-name-input',
    backCourseBtn: '.back-course-btn',
    headerTitle: '#header-title',
    courseBanner: '.course-banner',
    startBtn: '.start-game-btn',
    logScoresBtn: '.log-scores-btn',
    playerList: '#player-list',
    rightParBtn: '.right-par-btn',
    leftParBtn: '.left-par-btn',
    parInput: '.par-input-value',
    backGameBtn: '.back-game-btn'
  };

  return{
    
    populatePlayerList: function(players, holesArr, parsArr){
      let html = '';
      let holes = '';
      let pars = '';
      holesArr.forEach(function(hole){
        holes +=  ` ${hole} |`
      });

      parsArr.forEach(function(par){
        pars +=  ` ${par} |`
      });

      players.forEach(function(player){
        let boxScore = '';
        let overUnder = player.overUnder;
        if(overUnder === 0){
          overUnder = 'even';
        }else if(overUnder > 0){
          overUnder = '+' + overUnder;
        }
        for(i=0; i<player.scores.length; i++){
          boxScore += ` ${player.scores[i]} |`
        }

        html += `<div class="card">
      <div id="player-${player.id}" class='card-content'>
      <div class="row">
        
        <div class='card-title'>${player.name} | ${overUnder}<div class='pull-right' >
          <i class="fas fa-angle-left leftBtn scoreInputGroup"></i>
          <i class="scoreInput scoreInputGroup">3</i>
          <i class="fas fa-angle-right rightBtn scoreInputGroup"></i></div></div>
          <div class='col s12'>
        <div class="hole-number-div">| ${holes}</div>
        <div class="par-hole-div">| ${pars}</div>
        <div>| ${boxScore}</div>
        </div>
        </div>
      </div>
    </div>`
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
      // Show the list
      document.querySelector(UISelectors.playerList).style.display = 'block';
      let boxScore = [];
      const newPlayerDiv = document.createElement('div');
      newPlayerDiv.className = 'card';
      newPlayerDiv.innerHTML =  `<div id="player-${player.id}" class='card-content'>
        <div class='col s12'>
        <div class='card-title'>${player.name} <div class=' pull-right'>
          <i class="fas fa-angle-left leftBtn scoreInputGroup"></i>
          <i class="scoreInput scoreInputGroup">3</i>
          <i class="fas fa-angle-right rightBtn scoreInputGroup"></i></div></div>
        <div class="hole-number-div"></div>
        <div class="par-hole-div"></div>
        <div>${boxScore}</div>
        </div>
      </div>`
      document.querySelector(UISelectors.playerList).insertAdjacentElement("beforeend", newPlayerDiv);
    
    },
    clearNameInput: function(){
      document.querySelector(UISelectors.playerNameInput).value = '';
    },
    removePlayer: function(){
      let players = PlayerCtrl.getPlayers();
      if (players.length > 0){
      document.querySelector(UISelectors.playerList).lastElementChild.remove();
      }
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
      document.querySelector(UISelectors.gameStateData).style.display = 'none';
      document.querySelector(UISelectors.headerTitle).style.display = 'block';
      
    },
    showCourseState: function(){
      document.querySelector(UISelectors.playerState).style.display = 'none';
      document.querySelector(UISelectors.courseState).style.display = 'block';
      document.querySelector(UISelectors.gameState).style.display = 'none';
      document.querySelector(UISelectors.gameStateData).style.display = 'none';
      document.querySelector(UISelectors.headerTitle).style.display = 'block';
      
    },
    showGameState: function(){
      document.querySelector(UISelectors.playerState).style.display = 'none';
      document.querySelector(UISelectors.courseState).style.display = 'none';
      document.querySelector(UISelectors.gameState).style.display = 'block';
      document.querySelector(UISelectors.gameStateData).style.display = 'block';
      document.querySelector(UISelectors.headerTitle).style.display = 'none';
      
    },
    getSelectors: function(){
      return UISelectors;
    },
    decreaseParInput: function(){
      document.querySelector(UISelectors.parInput).innerHTML -= 1
    },
    increaseParInput: function(){
      let parValue = parseInt(document.querySelector(UISelectors.parInput).innerHTML);
      parValue += 1
      document.querySelector(UISelectors.parInput).innerHTML = parValue
    },
    getParValue: function(){
      const parValue = parseInt(document.querySelector(UISelectors.parInput).innerHTML);
      return parValue;
    }
  }
})();

// App controller
const App = (function(UICtrl){

  const UISelectors = UICtrl.getSelectors();

  const loadEventListeners = function(){
    // Add player button
    document.querySelector(UISelectors.addPlayerBtn).addEventListener('click', addPlayerBtnSubmit);

    // Back player button
    document.querySelector(UISelectors.backPlayerBtn).addEventListener('click', backPlayerButtonClick);

    // Done with player entry
    document.querySelector(UISelectors.doneBtn).addEventListener('click', doneBtnClick);

    // Start Game Button
    document.querySelector(UISelectors.startBtn).addEventListener('click', startBtnClick);

    // Back button Course Entry
    document.querySelector(UISelectors.backCourseBtn).addEventListener('click', backButtonCourseClick);

    // Left arrow click
    document.querySelector(UISelectors.playerList).addEventListener('click', leftArrowClick);
  
    // Right arrow click
    document.querySelector(UISelectors.playerList).addEventListener('click', rightArrowClick);

    // Log Scores Submit
    document.querySelector(UISelectors.logScoresBtn).addEventListener('click', logScoresSubmit);

    // Change par input value
    document.querySelector(UISelectors.leftParBtn).addEventListener('click', leftParBtnClick);
    document.querySelector(UISelectors.rightParBtn).addEventListener('click', rightParBtnClick);

    // Back button during game
    document.querySelector(UISelectors.backGameBtn).addEventListener('click', backButtonGameClick);
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

  const backPlayerButtonClick = function(e){
    // remove player from ui
    UICtrl.removePlayer();
    // remove player from data
    PlayerCtrl.removePlayer();
    
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

  const backButtonCourseClick = function(e){
    UICtrl.showPlayerState();
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
    PlayerCtrl.pushNewScores(newScoresArr);
    // Get new Hole number
    const holes = PlayerCtrl.getHoles();
    // Get Par
    const par = UICtrl.getParValue();
    // Push par into pars array
    const parsArray = PlayerCtrl.pushNewPar(par);
    // calculate over unders
    PlayerCtrl.calculateOverUnder();
    // Get players
    const players = PlayerCtrl.getPlayers();
    

    UICtrl.populatePlayerList(players, holes, parsArray);

    e.preventDefault();
  }

  const leftParBtnClick = function(e){
    let par = parseInt(document.querySelector(UISelectors.parInput).innerHTML);
    if(par > 1){
    UICtrl.decreaseParInput();
    }

    e.preventDefault();
  }

  const rightParBtnClick = function(e){
    
    UICtrl.increaseParInput();
    

    e.preventDefault();
  }

  const backButtonGameClick = function(e){
    PlayerCtrl.removeLastHole();
    // calculate over unders
    PlayerCtrl.calculateOverUnder();
    // Get players
    const players = PlayerCtrl.getPlayers();
    // Get new Hole array
    const holes = PlayerCtrl.getHoleArr();
    // Get Pars 
    const parsArr = PlayerCtrl.getPars();
    
    UICtrl.populatePlayerList(players, holes, parsArr);
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
/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/
var scores, roundScore,activePlayer,gamePlaying;
init();
/*
write this in init code
scores=[0,0];
roundScore=0;
activePlayer=0;
*/
//random no. gives numbers between 0 and 1 so we multiplied it by 6 then it will no. 0 to 5 so add 1 to give numbers 1 to 6
//dice=Math.floor(Math.random()*6)+1;
//document.querySelector('#current-'+activePlayer).textContent=dice;
/*document.querySelector('.dice').style.display='none';
document.getElementById('score-0').textContent='0';
document.getElementById('score-1').textContent='0';
document.getElementById('current-0').textContent='0';
document.getElementById('current-1').textContent='0';*/
//document.querySelector('#current-'+activePlayer).innerHTML='<em>'+dice+'</em>';

/*function btn()
{

}

document.querySelector(".btn-roll").addEventListener('click',btn);
//it is a callback function which is not called by us but the eventlistener function
*/
//anonymous fuction whuch cannot be used outside this context
document.querySelector(".btn-roll").addEventListener('click',function()
{
    if(gamePlaying)
    {
    //need a random no.
    var dice=Math.floor(Math.random()*6)+1;

    //display the result
    var diceDOM=document.querySelector('.dice');
    diceDOM.style.display='block';
    diceDOM.src="dice-"+dice+'.png';
    

    //update the round score if the rolled no. is not one
    if(dice!==1)
    {
        //add score
        roundScore +=dice;
        document.querySelector('#current-'+activePlayer).textContent=roundScore;
    }
    else{
        //next player
        nextPlayer();
    }
}

});
document.querySelector('.btn-hold').addEventListener('click',function(){
    if(gamePlaying){
    //add current score to global score
    scores[activePlayer]+=roundScore;

    //update the ui
    document.querySelector('#score-'+activePlayer).textContent=scores[activePlayer];
    //check if the [player won the game]
    if(scores[activePlayer]>=100)
    {
        document.querySelector('#name-'+activePlayer).textContent='Winner!';
        document.querySelector('.dice').style.display='none';
        document.querySelector('.player-'+activePlayer+'-panel').classList.add('winner');
        document.querySelector('.player-'+activePlayer+'-panel').classList.remove('active');
        gamePlaying=false;
    }
    //only if no one is winner then change the player 
    else
    {
    nextPlayer();
    }
}
});
function nextPlayer()
{
    activePlayer===0 ? activePlayer=1 : activePlayer=0;
        roundScore=0;
      document.getElementById('current-0').textContent='0'; 
        document.getElementById('current-1').textContent='0';
        document.querySelector('.player-0-panel').classList.toggle('active');
        document.querySelector('.player-1-panel').classList.toggle('active');
        document.querySelector('.dice').style.display='none';

}
document.querySelector('.btn-new').addEventListener('click',init);
//init function 
function init()
{
gamePlaying=true;
scores=[0,0];
roundScore=0;
activePlayer=0;
document.querySelector('.dice').style.display='none';
document.getElementById('score-0').textContent='0';
document.getElementById('score-1').textContent='0';
document.getElementById('current-0').textContent='0';
document.getElementById('current-1').textContent='0';
document.getElementById('name-1').textContent='Player 2';
document.getElementById('name-0').textContent='Player 1';
document.querySelector('.player-0-panel').classList.remove('winner');
document.querySelector('.player-1-panel').classList.remove('winner');
document.querySelector('.player-0-panel').classList.remove('active');
document.querySelector('.player-1-panel').classList.remove('active');
document.querySelector('.player-0-panel').classList.add('active');

}
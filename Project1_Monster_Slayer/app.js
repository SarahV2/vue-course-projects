function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      gameLog: [],
    };
  },
  methods: {
    attackMonster() {
      const damage = getRandomValue(5, 12);
      this.monsterHealth -= damage;
      this.currentRound++;
      this.attackPlayer();
      this.logEvent('Player', 'attack', damage);
    },
    attackPlayer() {
      const damage = getRandomValue(8, 15);
      this.playerHealth -= damage;
      this.logEvent('Monster', 'attack', damage);
    },
    performSpecialAttack() {
      const damage = getRandomValue(10, 25);
      this.monsterHealth -= damage;
      this.currentRound++;
      this.attackPlayer();
      this.logEvent('Player', 'attack', damage);
    },
    heal() {
      this.currentRound++;
      const healthPotion = getRandomValue(8, 20);
      if ((this.playerHealth += healthPotion > 100)) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healthPotion;
      }
      this.logEvent('Player', 'heal', healthPotion);
      this.attackPlayer();
    },
    surrender() {
      this.winner = 'monster';
    },
    resetGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.winner = null;
      this.currentRound = 0;
      this.gameLog = [];
    },
    logEvent(who, what, value) {
      this.gameLog.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
  watch: {
    // has to be the same name as the data properties
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        // draw
        this.winner = 'draw';
      } else if (value <= 0) {
        // monster wins
        this.winner = 'monster';
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = 'draw';
      } else if (value <= 0) {
        // player wins
        this.winner = 'player';
      }
    },
  },
  computed: {
    getMonsterHealth() {
      if (this.monsterHealth < 0) {
        return { width: '0%' };
      }
      return { width: this.monsterHealth + '%' };
    },
    getPlayerHealth() {
      if (this.playerHealth < 0) {
        return { width: '0%' };
      }
      return { width: this.playerHealth + '%' };
    },
    specialAttackAvaliable() {
      return this.currentRound % 3 !== 0;
    },
    gameResult() {
      if (this.winner) {
        if (this.winner === 'draw') {
          return "It's a draw";
        } else if (this.winner === 'monster') {
          return 'You lost!';
        } else {
          return 'You won!';
        }
      }
    },
  },
});

app.mount('#game');

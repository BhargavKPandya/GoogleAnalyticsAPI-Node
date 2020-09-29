class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }
}

class Deck {
    constructor() {
        this.cards = [];    
    }
                       
    createDeck() {
        let suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
        let ranks = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
        for(let i=0; i<suits.length; i++){
            for(let k=0; k<ranks.length; k++){
                this.cards.push( new Card(suits[i], ranks[k]));
            }
        }
        
    }

    shuffleDeck() {
        
    }
}

const d = new Deck();
d.createDeck();
console.log(d.cards);
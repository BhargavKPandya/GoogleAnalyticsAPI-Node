"use strict";

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Card = function Card(suit, rank) {
  _classCallCheck(this, Card);

  this.suit = suit;
  this.rank = rank;
};

var Deck =
/*#__PURE__*/
function () {
  function Deck() {
    _classCallCheck(this, Deck);

    this.cards = [];
  }

  _createClass(Deck, [{
    key: "createDeck",
    value: function createDeck() {
      var suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
      var ranks = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];

      for (var i = 0; i < suits.length; i++) {
        for (var k = 0; k < ranks.length; k++) {
          this.cards.push(new Card(suits[i], ranks[k]));
        }
      }
    }
  }, {
    key: "shuffleDeck",
    value: function shuffleDeck() {}
  }]);

  return Deck;
}();

var d = new Deck();
d.createDeck();
console.log(d.cards);
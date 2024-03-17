import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

const App = () => {
  const [deckId, setDeckId] = useState('');
  const [cards, setCards] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const remainingCardsRef = useRef(null);

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/');
        const data = await response.json();
        setDeckId(data.deck_id);
        remainingCardsRef.current = data.remaining;
      } catch (error) {
        console.error('Error fetching deck:', error);
      }
    };

    fetchDeck();
  }, []);

  const drawCard = async () => {
    if (remainingCardsRef.current === 0) {
      alert('Error: no cards remaining!');
      return;
    }

    try {
      const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/`);
      const data = await response.json();
      if (data.success) {
        setCards(prevCards => [...prevCards, data.cards[0]]);
        remainingCardsRef.current = data.remaining;
      } else {
        alert('Error drawing card!');
      }
    } catch (error) {
      console.error('Error drawing card:', error);
    }
  };

  const shuffleDeck = async () => {
    setIsShuffling(true);
    setCards([]);
    try {
      const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
      const data = await response.json();
      if (data.success) {
        remainingCardsRef.current = data.remaining;
      } else {
        alert('Error shuffling deck!');
      }
    } catch (error) {
      console.error('Error shuffling deck:', error);
    } finally {
      setIsShuffling(false);
    }
  };

  return (
    <div>
      <h1>Deck of Cards</h1>
      <button onClick={drawCard} disabled={isShuffling}>
        Draw Card
      </button>
      <button onClick={shuffleDeck} disabled={isShuffling}>
        Shuffle Deck
      </button>
      <div>
        {cards.map((card, index) => (
          <img key={index} src={card.image} alt={card.code} />
        ))}
      </div>
    </div>
  );
};

export default App;


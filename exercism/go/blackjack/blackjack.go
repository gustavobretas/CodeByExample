package blackjack

import "strings"

// ParseCard returns the integer value of a card following blackjack ruleset.
func ParseCard(card string) int {
	valueCard := map[string]int{
		"ace":   11,
		"two":   2,
		"three": 3,
		"four":  4,
		"five":  5,
		"six":   6,
		"seven": 7,
		"eight": 8,
		"nine":  9,
		"ten":   10,
		"jack":  10,
		"queen": 10,
		"king":  10,
		"other": 0,
	}
	return valueCard[strings.ToLower(card)]
}

// FirstTurn returns the decision for the first turn, given two cards of the
// player and one card of the dealer.
func FirstTurn(card1, card2, dealerCard string) string {
	const (
		stand = "S"
		hit   = "H"
		split = "P"
		win   = "W"
	)

	myHand := ParseCard(card1) + ParseCard(card2)
	switch {
	case (card1 == "ace" && card2 == "ace"):
		return split
	case myHand == 21:
		if ParseCard(dealerCard) < 10 {
			return win
		} else {
			return stand
		}
	case myHand >= 17 && myHand <= 20:
		return stand
	case myHand >= 12 && myHand <= 16:
		if ParseCard(dealerCard) >= 7 {
			return hit
		} else {
			return stand
		}
	case myHand <= 11:
		return hit
	default:
		return stand
	}
}

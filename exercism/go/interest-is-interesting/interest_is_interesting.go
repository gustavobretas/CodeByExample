package interest

// InterestRate returns the interest rate for the provided balance.
func InterestRate(balance float64) (interest float32) {
	if balance < 0 {
		interest = 3.213
	} else if balance >= 0 && balance < 1000 {
		interest = 0.5
	} else if balance >= 1000 && balance < 5000 {
		interest = 1.621
	} else if balance >= 5000 {
		interest = 2.475
	}
	return
}

// Interest calculates the interest for the provided balance.
func Interest(balance float64) float64 {
	return balance * float64(InterestRate(balance)/100)
}

// AnnualBalanceUpdate calculates the annual balance update, taking into account the interest rate.
func AnnualBalanceUpdate(balance float64) float64 {
	return balance * float64(1+(InterestRate(balance)/100))
}

// YearsBeforeDesiredBalance calculates the minimum number of years required to reach the desired balance.
func YearsBeforeDesiredBalance(balance, targetBalance float64) int {
	var years int
	newBalance := balance
	for years = 0; newBalance <= targetBalance; years++ {
		newBalance = AnnualBalanceUpdate(newBalance)
	}
	return years
}

package lasagna

// PreparationTime estimates the preparation time based on the number of layers
func PreparationTime(layers []string, avgPrepTime int) int {
	if avgPrepTime == 0 {
		avgPrepTime = 2
	}
	return len(layers) * avgPrepTime
}

// Quantities calculates the amount of Noodles and Sauce need to prepare the lasagna
func Quantities(layers []string) (noodles int, sauce float64) {
	for _, item := range layers {
		if item == "noodles" {
			noodles += 50
		} else if item == "sauce" {
			sauce += 0.2
		}
	}
	return
}

// AddSecretIngredient get a last ingredient from your friends list to your list
func AddSecretIngredient(friendsList []string, myList []string) {
	myList[len(myList)-1] = friendsList[len(friendsList)-1]
}

// ScaleRecipe scales the portion of ingredients
func ScaleRecipe(sliceAmountOfTwo []float64, scaledQuantities int) (scaled []float64) {
	for _, item := range sliceAmountOfTwo {
		scaled = append(scaled, item*(float64(scaledQuantities)/2))
	}
	return
}

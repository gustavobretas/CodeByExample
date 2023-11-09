package purchase

import (
	"fmt"
	"sort"
	"strings"
)

// NeedsLicense determines whether a license is needed to drive a type of vehicle. Only "car" and "truck" require a license.
func NeedsLicense(kind string) bool {
	requireLicense := map[string]bool{
		"car":   true,
		"truck": true,
	}
	return requireLicense[strings.ToLower(kind)]
}

// ChooseVehicle recommends a vehicle for selection. It always recommends the vehicle that comes first in lexicographical order.
func ChooseVehicle(option1, option2 string) string {
	optionSort := []string{option1, option2}
	sort.Strings(optionSort)
	return fmt.Sprintf("%s is clearly the better choice.", optionSort[0])
}

// CalculateResellPrice calculates how much a vehicle can resell for at a certain age.
func CalculateResellPrice(originalPrice, age float64) float64 {
	var sugestedPrice float64
	if age < 3 {
		sugestedPrice = originalPrice * .8
	} else if age < 10 {
		sugestedPrice = originalPrice * .7
	} else if age >= 10 {
		sugestedPrice = originalPrice * .5
	}
	return sugestedPrice
}

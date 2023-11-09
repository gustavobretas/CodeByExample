// Package weather provides resources to consult the Forecast.
package weather

// CurrentCondition stores de Current Forecast Condition to be used at Forecast Function.
var CurrentCondition string

// CurrentLocation stores de Current Locatrion to be used at Forecast Function.
var CurrentLocation string

// Forecast resolve the Forecast Condition by city.
func Forecast(city, condition string) string {
	CurrentLocation, CurrentCondition = city, condition
	return CurrentLocation + " - current weather condition: " + CurrentCondition
}

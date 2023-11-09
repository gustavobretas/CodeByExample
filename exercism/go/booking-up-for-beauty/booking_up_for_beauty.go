package booking

import (
	"time"
)

// Schedule returns a time.Time from a string containing a date.
func Schedule(date string) time.Time {
	// At the moment I'm doing this exercise, I got to register
	// that I'm have never seen a freaker way to represent the
	// Date Time format to convert String to Date.
	dateParsed, err := time.Parse("1/2/2006 15:04:05", date)
	if err != nil {
		panic(err)
	}
	return dateParsed
}

// HasPassed returns whether a date has passed.
func HasPassed(date string) bool {
	dateParsed, err := time.Parse("January 2, 2006 15:04:05", date)
	if err != nil {
		panic(err)
	}
	return time.Now().After(dateParsed)
}

// IsAfternoonAppointment returns whether a time is in the afternoon.
func IsAfternoonAppointment(date string) bool {
	dateParsed, err := time.Parse("Monday, January 2, 2006 15:04:05", date)
	if err != nil {
		panic(err)
	}
	return dateParsed.Hour() >= 12 && dateParsed.Hour() < 18
}

// Description returns a formatted string of the appointment time.
func Description(date string) string {
	dateParsed, err := time.Parse("1/2/2006 15:04:05", date)
	if err != nil {
		panic(err)
	}
	return dateParsed.Format("You have an appointment on Monday, January 2, 2006, at 15:04.")
}

// AnniversaryDate returns a Time with this year's anniversary.
func AnniversaryDate() time.Time {
	return time.Date(time.Now().Year(), time.September, 15, 0, 0, 0, 0, time.UTC)
}

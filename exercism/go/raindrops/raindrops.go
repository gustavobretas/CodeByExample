package raindrops

import "strconv"

func Convert(number int) (res string) {
	if number%3 == 0 {
		res = res + "Pling"
	}
	if number%5 == 0 {
		res = res + "Plang"
	}
	if number%7 == 0 {
		res = res + "Plong"
	}
	if res == "" {
		res = strconv.FormatInt(int64(number), 10)
	}
	return
}

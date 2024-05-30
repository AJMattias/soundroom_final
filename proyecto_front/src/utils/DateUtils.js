export const getWeekDay = (date) => {
    const week = [
        "Dom",
        "Lun",
        "Mar",
        "Mie",
        "Jue",
        "Vie",
        "Sáb"
    ]
    return week[date.getDay()]
}

export const formatDateNumer = (number) => {
    return number.toLocaleString('en-us', {
        minimumIntegerDigits: 2,
        useGrouping: false
    })
}

export const formatDate = (date) => {
    return date.getFullYear()+"-"+formatDateNumer(date.getMonth()+1)+"-"+formatDateNumer(date.getDate())
}

export const dateFromCalendarDay = (calendarDay) => {
    const day = new Date()
    day.setDate(calendarDay.day)
    day.setMonth(calendarDay.month - 1)
    day.setFullYear(calendarDay.year)
    day.setHours(0, 0, 0)
    return day
}
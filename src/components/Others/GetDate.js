function checkDateFormat(date) {
    if (date < 10)
        return (`0${date}`)
    return date;
}

export function getTDate(date) {
    let newDate = `${checkDateFormat(date.getDate())}-${checkDateFormat(date.getMonth() + 1)}-${date.getFullYear()} ${checkDateFormat(date.getHours())}:${checkDateFormat(date.getMinutes())}`;
    return newDate;
}

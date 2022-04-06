function checkDateFormat(date) {
    if (date < 10)
        return (`0${date}`)
    return date;
}

function getTDate(date) {
    let newDate = `${checkDateFormat(date.getDate())}-${checkDateFormat(date.getMonth() + 1)}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    return newDate;
}

export { getTDate }
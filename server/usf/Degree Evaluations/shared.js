function rmbr(line) {
    return line.replace('<br>', '')
}

function toCourseNames(line, i, lines) {
    const classes = []
    const result = /([\d]+) (?:Class(?:es)?)? in ([A-Z]+) (\d+)(?:\*)?(?: and ([\d]+))*(?: or @ @ (?:ATTRIBUTE = (\w+)))*/.exec(line)
    if (result === null) {
        //"4 Credits in BIOL 300:499 or 598 or 599* or ENVS 410*"
        const [first, ...rest] = line.split(" or ")
        const creditLine = /(?:([\d]+) Credits in )([\w]+) ([\d]+):([\d]+)/g.exec(first)
        if (creditLine === null) {
            classes.push({ CRN: line, name: rmbr(lines[i - 1]) })
        } else {
            let [entire, numberOfCredits, subject_prefix, first_number, second_number] = creditLine
            classes.push({
                CRN: {
                    from: subject_prefix + first_number,
                    to: subject_prefix + second_number,
                    subject: subject_prefix,
                    start: first_number,
                    end: second_number,
                    credits: numberOfCredits
                },
                name: numberOfCredits + ' credits of ' + rmbr(lines[i - 1]),
                credits: numberOfCredits
            })
            rest.forEach(course => {
                const courseLine = /(?:([\w]+) )?([\d]+)/g.exec(course)
                if (courseLine) {
                    const [wholeThing, new_prefix, course_number] = courseLine
                    if (new_prefix) {
                        subject_prefix = new_prefix
                    }
                    classes.push({
                        CRN: subject_prefix + course_number,
                        name: subject_prefix + course_number
                    })
                }
            })
        }
    } else {
        const [whole, numberOfClasses, subject_prefix, first_num, second_num, or_attribute] = result
        if (numberOfClasses === '1') {
            classes.push({
                CRN: subject_prefix + first_num,
                name: rmbr(lines[i - 1])
            })
        } else if (numberOfClasses === '2') {
            classes.push({
                CRN: [subject_prefix + first_num, subject_prefix + second_num],
                name: rmbr(lines[i - 1])
            })
        }
        if (or_attribute) {
            classes.push({
                attribute: true,
                CRN: or_attribute,
                name: `Course with attribute: ${or_attribute}`
            })
        }
    }
    return classes
}

module.exports = {
    toCourseNames,
    rmbr,
}


function getRows(table) {
    let rows = table.querySelectorAll("tbody tr");
    rows = Array.from(rows).map(e => {return new Row(e)});
    return rows;
}

function removeRow(table, row) {
    let tbody = table.querySelector("tbody");
    tbody.removeChild(row);
}
function addRow(table, row) {
    let tbody = table.querySelector("tbody");
    tbody.prepend(row)
}

function getSemester() {
    let d = new Date();

    //determine the year
    let y = d.getFullYear();

    //determine the semester, Spring, Summer or Fall
    let m = d.getMonth();
    let s = "";
    if(m >= 0 && m <= 5) s = "Spring";
    else if(m >= 6 && m <= 7) s = "Summer";
    else if(m >= 8 && m <= 11) s = "Fall";

    return y + " " + s;
}

//is the row the same semester as the current one
function isSameSemester(row, sem) {
    return row.term.toLowerCase() === sem.toLowerCase();
}



class Row {
    constructor(domObj) {
        this.domObj = domObj;
        this.name = this._getName(this.domObj);
        this.hasFav = this._isFavorite(this.domObj);
        //term is year followed by optional Spring, Summer, Fall
        this.term = this._getTerm(this.domObj);
    }
    _getName(row) {
        let name_td = row.querySelector("td.course-list-course-title-column");
        let name_a = name_td.querySelector("a");
        if(name_a) return name_a.innerText;
        else return "";
    }
    //determine if a row is favorite or not
    _isFavorite(row) {
        let star_td = row.querySelector("td.course-list-star-column");
        if(star_td.querySelector(".course-list-favorite-icon.icon-star")) return true;
        else return false;
    }
    
    _getTerm(row) {
        let term_td = row.querySelector("td.course-list-term-column");
        let term_raw = term_td.innerText;

        //get year and first word
        let m = term_raw.match(/(\d+)[\s]+([a-zA-Z0-9\-_]+)/i);
        let term = ""
        if(m) {
            let year = m[1];
            let semester = m[2];
            if(semester.match(/Spring/i)) semester = "Spring";
            else if(semester.match(/Summer/i)) semester = "Summer";
            else if(semester.match(/Fall/i)) semester = "Fall";
            else semester = "";
            term = year + " " + semester;
        }

        return term;
    }
}

function applyFilter() {
    let my_course_table = document.body.querySelector("#my_courses_table");
    let past_enrollments_table = document.body.querySelector("#past_enrollments_table")
    let rows = getRows(my_course_table);

    let curSem = getSemester();

    //we want to keep all favs and all that belong in current semester
    let toBeMovedToPast = rows.filter(row => {
        return ! (row.hasFav || isSameSemester(row, curSem))
    });


    toBeMovedToPast.forEach(row => {
        removeRow(my_course_table, row.domObj);
        addRow(past_enrollments_table, row.domObj)
    });
}

document.addEventListener("DOMContentLoaded", (event) => {
    applyFilter()
});

/* =====================================================
   NTTI CLASSMATE MANAGEMENT
   ATTENDANCE HISTORY SYSTEM
===================================================== */


/* =====================================================
   STORAGE
===================================================== */

let students =
    JSON.parse(
        localStorage.getItem("ntti_students")
    ) || [

        {
            name:"Pich Sothearith",
            id:"NTTI001",
            gender:"Male",
            className:"Web Development 1A",
            major:"Web Development",
            phone:"012 111 111",
            email:"sothearith@gmail.com",
            grade:90,
            status:"Active"
        },

        {
            name:"Sok Dara",
            id:"NTTI002",
            gender:"Male",
            className:"Web Development 1A",
            major:"Web Development",
            phone:"012 222 222",
            email:"dara@gmail.com",
            grade:85,
            status:"Active"
        },

        {
            name:"Chan Vanna",
            id:"NTTI003",
            gender:"Female",
            className:"Web Development 1A",
            major:"Web Development",
            phone:"012 333 333",
            email:"vanna@gmail.com",
            grade:88,
            status:"Active"
        },

        {
            name:"Kim Ratha",
            id:"NTTI004",
            gender:"Male",
            className:"Web Development 1A",
            major:"Web Development",
            phone:"012 444 444",
            email:"ratha@gmail.com",
            grade:79,
            status:"Active"
        },

        {
            name:"Davin Chea",
            id:"NTTI005",
            gender:"Male",
            className:"Web Development 1A",
            major:"Web Development",
            phone:"099 111 222",
            email:"davin@gmail.com",
            grade:79,
            status:"Active"
        }

    ];


/*
    THIS IS THE IMPORTANT PART.

    All attendance records are saved here.

    Example:

    {
        id:"unique-id",
        date:"2026-08-22",
        studentId:"NTTI001",
        studentName:"Pich Sothearith",
        className:"Web Development 1A",
        status:"Present",
        time:"07:55",
        reason:""
    }
*/

let attendance =
    JSON.parse(
        localStorage.getItem("ntti_attendance")
    ) || [];


/* =====================================================
   SAVE FUNCTIONS
===================================================== */

function saveStudents(){

    localStorage.setItem(
        "ntti_students",
        JSON.stringify(students)
    );

}


function saveAttendance(){

    localStorage.setItem(
        "ntti_attendance",
        JSON.stringify(attendance)
    );

}


/* =====================================================
   DATE
===================================================== */

function getToday(){

    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth()+1)
        .padStart(2,"0");

    const day =
        String(date.getDate())
        .padStart(2,"0");

    return `${year}-${month}-${day}`;

}


function formatDate(date){

    if(!date) return "-";

    const d =
        new Date(date + "T00:00:00");

    return d.toLocaleDateString(
        "en-GB",
        {
            day:"2-digit",
            month:"2-digit",
            year:"numeric"
        }
    );

}


/* =====================================================
   INITIALIZATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        const today =
            getToday();

        document
            .getElementById("todayDate")
            .textContent =
            formatDate(today);


        document
            .getElementById("attendanceDate")
            .value = today;


        renderStudents();

        renderAttendance();

        renderHistory();

        renderGrades();

        renderRanking();

        updateDashboard();

        populateHistoryStudents();


        /* Load Dark Mode */

        if(
            localStorage.getItem(
                "ntti_dark_mode"
            ) === "true"
        ){

            document.body
                .classList
                .add("dark");

            document
                .getElementById(
                    "settingsDarkMode"
                )
                .classList
                .add("active");

        }


        document
            .getElementById(
                "attendanceDate"
            )
            .addEventListener(
                "change",
                renderAttendance
            );


        document
            .getElementById(
                "studentForm"
            )
            .addEventListener(
                "submit",
                addStudent
            );


        document
            .getElementById(
                "settingsDarkMode"
            )
            .addEventListener(
                "click",
                toggleDarkMode
            );


        document
            .getElementById(
                "darkModeButton"
            )
            .addEventListener(
                "click",
                toggleDarkMode
            );


        document
            .getElementById(
                "menuToggle"
            )
            .addEventListener(
                "click",
                function(){

                    document
                        .getElementById(
                            "sidebar"
                        )
                        .classList
                        .toggle("open");

                }
            );

    }
);


/* =====================================================
   PAGE NAVIGATION
===================================================== */

const navLinks =
    document.querySelectorAll(
        ".nav-link[data-page]"
    );


navLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            function(e){

                e.preventDefault();

                showPage(
                    link.dataset.page
                );

            }
        );

    }
);


function showPage(pageId){

    document
        .querySelectorAll(".page")
        .forEach(
            page => {

                page.classList
                    .remove("active");

            }
        );


    const page =
        document.getElementById(
            pageId
        );


    if(page){

        page.classList
            .add("active");

    }


    navLinks.forEach(
        link => {

            link.classList
                .remove("active");

            if(
                link.dataset.page ===
                pageId
            ){

                link.classList
                    .add("active");

            }

        }
    );


    const titles = {

        dashboard:"Dashboard",

        students:"Classmates",

        attendance:"Attendance",

        history:"Attendance History",

        grades:"Grades",

        ranking:"Student Ranking",

        reports:"Reports",

        settings:"Settings"

    };


    document
        .getElementById("topTitle")
        .textContent =
        titles[pageId] ||
        "Dashboard";


    document
        .getElementById("sidebar")
        .classList
        .remove("open");


    if(pageId === "attendance"){

        renderAttendance();

    }


    if(pageId === "history"){

        populateHistoryStudents();

        renderHistory();

    }


    if(pageId === "dashboard"){

        updateDashboard();

    }

}


/* =====================================================
   STUDENTS
===================================================== */

function getInitials(name){

    return name
        .split(" ")
        .map(
            word => word[0]
        )
        .join("")
        .substring(0,2)
        .toUpperCase();

}


function renderStudents(){

    const table =
        document.getElementById(
            "studentTable"
        );


    const search =
        (
            document
                .getElementById(
                    "studentSearch"
                )?.value || ""
        )
        .toLowerCase();


    table.innerHTML = "";


    const filtered =
        students.filter(
            student =>

                student.name
                    .toLowerCase()
                    .includes(search)

                ||

                student.id
                    .toLowerCase()
                    .includes(search)

                ||

                student.major
                    .toLowerCase()
                    .includes(search)
        );


    filtered.forEach(
        (student,index) => {

            const grade =
                Number(student.grade);


            const gradeClass =
                grade >= 80
                    ? "badge-success"
                    : grade >= 60
                        ? "badge-warning"
                        : "badge-danger";


            table.innerHTML += `

                <tr>

                    <td>

                        <div class="student-cell">

                            <div class="avatar">
                                ${getInitials(student.name)}
                            </div>

                            <div class="student-name">

                                <strong>
                                    ${student.name}
                                </strong>

                                <span>
                                    ${student.email || "Student"}
                                </span>

                            </div>

                        </div>

                    </td>


                    <td>
                        ${student.id}
                    </td>


                    <td>
                        ${student.gender}
                    </td>


                    <td>
                        ${student.className}
                    </td>


                    <td>
                        ${student.major}
                    </td>


                    <td>

                        <span class="badge ${gradeClass}">
                            ${grade}%
                        </span>

                    </td>


                    <td>

                        <span class="badge badge-success">
                            ${student.status}
                        </span>

                    </td>


                    <td>

                        <button
                            class="table-action"
                            onclick="deleteStudent('${student.id}')">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </td>

                </tr>

            `;

        }
    );

}


function openStudentModal(){

    document
        .getElementById("studentModal")
        .classList
        .add("show");

}


function closeStudentModal(){

    document
        .getElementById("studentModal")
        .classList
        .remove("show");

}


function addStudent(e){

    e.preventDefault();


    const student = {

        name:
            document
                .getElementById(
                    "studentName"
                ).value.trim(),

        id:
            document
                .getElementById(
                    "studentId"
                ).value.trim(),

        gender:
            document
                .getElementById(
                    "studentGender"
                ).value,

        className:
            document
                .getElementById(
                    "studentClass"
                ).value.trim(),

        major:
            document
                .getElementById(
                    "studentMajor"
                ).value.trim(),

        grade:
            Number(
                document
                    .getElementById(
                        "studentGrade"
                    ).value
            ),

        phone:
            document
                .getElementById(
                    "studentPhone"
                ).value.trim(),

        email:
            document
                .getElementById(
                    "studentEmail"
                ).value.trim(),

        status:"Active"

    };


    const exists =
        students.some(
            s =>
                s.id.toLowerCase()
                ===
                student.id.toLowerCase()
        );


    if(exists){

        showToast(
            "Student ID already exists!"
        );

        return;

    }


    students.push(student);

    saveStudents();

    renderStudents();

    updateDashboard();

    closeStudentModal();

    e.target.reset();

    showToast(
        "Student added successfully!"
    );

}


function deleteStudent(id){

    if(
        !confirm(
            "Are you sure you want to delete this student?"
        )
    ){

        return;

    }


    students =
        students.filter(
            student =>
                student.id !== id
        );


    saveStudents();

    renderStudents();

    renderAttendance();

    updateDashboard();

    showToast(
        "Student deleted successfully!"
    );

}


/* =====================================================
   ATTENDANCE
===================================================== */


/*
    Temporary attendance selections
    before saving.
*/

let selectedAttendance = {};


/*
    Render all students for selected date.
*/

function renderAttendance(){

    const table =
        document.getElementById(
            "attendanceTable"
        );


    const date =
        document.getElementById(
            "attendanceDate"
        ).value
        || getToday();


    table.innerHTML = "";


    selectedAttendance = {};


    students.forEach(
        (student,index) => {

            const existing =
                attendance.find(
                    record =>
                        record.date === date
                        &&
                        record.studentId ===
                        student.id
                );


            if(existing){

                selectedAttendance[
                    student.id
                ] = existing;

            }


            const status =
                existing
                    ? existing.status
                    : "";


            const time =
                existing
                    ? existing.time
                    : "";


            table.innerHTML += `

                <tr>

                    <td>

                        <div class="student-cell">

                            <div class="avatar">
                                ${getInitials(student.name)}
                            </div>

                            <div class="student-name">

                                <strong>
                                    ${student.name}
                                </strong>

                                <span>
                                    ${student.email || ""}
                                </span>

                            </div>

                        </div>

                    </td>


                    <td>
                        ${student.id}
                    </td>


                    <td>
                        ${student.className}
                    </td>


                    <td>

                        <div class="attendance-buttons">

                            <button
                                class="attendance-btn present
                                ${status === "Present" ? "selected" : ""}"
                                onclick="openAttendanceModal(
                                    '${student.id}',
                                    'Present'
                                )">

                                Present

                            </button>


                            <button
                                class="attendance-btn absent
                                ${status === "Absent" ? "selected" : ""}"
                                onclick="openAttendanceModal(
                                    '${student.id}',
                                    'Absent'
                                )">

                                Absent

                            </button>


                            <button
                                class="attendance-btn late
                                ${status === "Late" ? "selected" : ""}"
                                onclick="openAttendanceModal(
                                    '${student.id}',
                                    'Late'
                                )">

                                Late

                            </button>


                            <button
                                class="attendance-btn permission
                                ${status === "Permission" ? "selected" : ""}"
                                onclick="openAttendanceModal(
                                    '${student.id}',
                                    'Permission'
                                )">

                                Permission

                            </button>

                        </div>

                    </td>


                    <td>

                        ${
                            time
                                ? `<span>${time}</span>`
                                : `<span style="color:#aaa">—</span>`
                        }

                    </td>


                    <td>

                        ${getStatusBadge(status)}

                    </td>

                </tr>

            `;

        }
    );


    updateTodayAttendanceStats();

}


/* =====================================================
   STATUS BADGE
===================================================== */

function getStatusBadge(status){

    if(status === "Present"){

        return `
            <span class="badge badge-success">
                Present
            </span>
        `;

    }


    if(status === "Absent"){

        return `
            <span class="badge badge-danger">
                Absent
            </span>
        `;

    }


    if(status === "Late"){

        return `
            <span class="badge badge-warning">
                Late
            </span>
        `;

    }


    if(status === "Permission"){

        return `
            <span class="badge badge-blue">
                Permission
            </span>
        `;

    }


    return `
        <span class="badge">
            Not Marked
        </span>
    `;

}


/* =====================================================
   ATTENDANCE MODAL
===================================================== */

let currentStudentId = null;

let currentStatus = null;


function openAttendanceModal(
    studentId,
    status = null
){

    currentStudentId =
        studentId;


    currentStatus =
        status;


    const student =
        students.find(
            s =>
                s.id === studentId
        );


    if(!student) return;


    document
        .getElementById(
            "attendanceModalTitle"
        )
        .textContent =
        "Attendance";


    document
        .getElementById(
            "attendanceModalStudent"
        )
        .textContent =
        `${student.name} • ${student.id}`;


    const date =
        document.getElementById(
            "attendanceDate"
        ).value
        || getToday();


    const old =
        attendance.find(
            r =>
                r.date === date
                &&
                r.studentId ===
                studentId
        );


    document
        .getElementById(
            "attendanceTime"
        ).value =
        old?.time
        ||
        getCurrentTime();


    document
        .getElementById(
            "attendanceReason"
        ).value =
        old?.reason
        || "";


    selectStatus(
        status ||
        old?.status ||
        "Present"
    );


    document
        .getElementById(
            "attendanceModal"
        )
        .classList
        .add("show");

}


function closeAttendanceModal(){

    document
        .getElementById(
            "attendanceModal"
        )
        .classList
        .remove("show");

}


function chooseAttendanceStatus(
    status
){

    currentStatus =
        status;

    selectStatus(status);

}


function selectStatus(status){

    currentStatus =
        status;


    document
        .querySelectorAll(
            ".status-option"
        )
        .forEach(
            button => {

                button.classList
                    .remove("selected");

            }
        );


    const classes = {

        Present:
            ".present-option",

        Absent:
            ".absent-option",

        Late:
            ".late-option",

        Permission:
            ".permission-option"

    };


    const element =
        document.querySelector(
            classes[status]
        );


    if(element){

        element.classList
            .add("selected");

    }


    const timeInput =
        document.getElementById(
            "attendanceTime"
        );


    /*
        Present and Late:
        time is useful.

        Absent and Permission:
        time can still be entered,
        but is optional.
    */

    if(status === "Late"){

        timeInput.required = true;

    }
    else{

        timeInput.required = false;

    }

}


/* =====================================================
   SAVE ONE ATTENDANCE RECORD
===================================================== */

function saveAttendanceRecord(){

    if(!currentStudentId){

        return;

    }


    if(!currentStatus){

        showToast(
            "Please select attendance status!"
        );

        return;

    }


    const student =
        students.find(
            s =>
                s.id ===
                currentStudentId
        );


    const date =
        document.getElementById(
            "attendanceDate"
        ).value
        || getToday();


    const time =
        document.getElementById(
            "attendanceTime"
        ).value;


    const reason =
        document.getElementById(
            "attendanceReason"
        ).value.trim();


    /*
        Remove previous record
        for same student + same date.
    */

    attendance =
        attendance.filter(
            record =>
                !(
                    record.date === date
                    &&
                    record.studentId ===
                    student.id
                )
        );


    const record = {

        id:
            Date.now().toString(),

        date:

            date,

        studentId:

            student.id,

        studentName:

            student.name,

        className:

            student.className,

        status:

            currentStatus,

        time:

            time || "",

        reason:

            reason || ""

    };


    attendance.push(record);


    saveAttendance();


    renderAttendance();

    renderHistory();

    updateDashboard();

    populateHistoryStudents();


    closeAttendanceModal();


    showToast(
        `${student.name}: ${currentStatus} saved!`
    );

}


/* =====================================================
   SAVE ALL
===================================================== */

function saveAllAttendance(){

    const date =
        document.getElementById(
            "attendanceDate"
        ).value;


    if(!date){

        showToast(
            "Please select a date!"
        );

        return;

    }


    saveAttendance();

    renderAttendance();

    renderHistory();

    updateDashboard();

    showToast(
        "Attendance saved successfully!"
    );

}


/* =====================================================
   TIME
===================================================== */

function getCurrentTime(){

    const now =
        new Date();


    const hours =
        String(
            now.getHours()
        ).padStart(2,"0");


    const minutes =
        String(
            now.getMinutes()
        ).padStart(2,"0");


    return `${hours}:${minutes}`;

}


/* =====================================================
   TODAY ATTENDANCE STATISTICS
===================================================== */

function getAttendanceForDate(
    date
){

    return attendance.filter(
        record =>
            record.date === date
    );

}


function countStatus(
    records,
    status
){

    return records.filter(
        record =>
            record.status ===
            status
    ).length;

}


function updateTodayAttendanceStats(){

    const date =
        document.getElementById(
            "attendanceDate"
        ).value
        || getToday();


    const records =
        getAttendanceForDate(date);


    const present =
        countStatus(
            records,
            "Present"
        );


    const absent =
        countStatus(
            records,
            "Absent"
        );


    const late =
        countStatus(
            records,
            "Late"
        );


    const permission =
        countStatus(
            records,
            "Permission"
        );


    document
        .getElementById(
            "todayPresent"
        )
        .textContent =
        present;


    document
        .getElementById(
            "todayAbsent"
        )
        .textContent =
        absent;


    document
        .getElementById(
            "todayLate"
        )
        .textContent =
        late;


    document
        .getElementById(
            "todayPermission"
        )
        .textContent =
        permission;

}


/* =====================================================
   ATTENDANCE HISTORY
===================================================== */

function populateHistoryStudents(){

    const select =
        document.getElementById(
            "historyStudent"
        );


    const current =
        select.value;


    select.innerHTML = `

        <option value="all">
            All Students
        </option>

    `;


    students.forEach(
        student => {

            select.innerHTML += `

                <option value="${student.id}">
                    ${student.name} (${student.id})
                </option>

            `;

        }
    );


    if(
        [...select.options]
        .some(
            option =>
                option.value === current
        )
    ){

        select.value =
            current;

    }

}


/* =====================================================
   RENDER HISTORY
===================================================== */

function renderHistory(){

    const table =
        document.getElementById(
            "historyTable"
        );


    if(!table) return;


    const date =
        document.getElementById(
            "historyDate"
        ).value;


    const student =
        document.getElementById(
            "historyStudent"
        ).value;


    const status =
        document.getElementById(
            "historyStatus"
        ).value;


    let records =
        [...attendance];


    /*
        Filter by date
    */

    if(date){

        records =
            records.filter(
                record =>
                    record.date === date
            );

    }


    /*
        Filter by student
    */

    if(
        student &&
        student !== "all"
    ){

        records =
            records.filter(
                record =>
                    record.studentId ===
                    student
            );

    }


    /*
        Filter by status
    */

    if(
        status &&
        status !== "all"
    ){

        records =
            records.filter(
                record =>
                    record.status ===
                    status
            );

    }


    /*
        Newest first
    */

    records.sort(
        (a,b) => {

            const aValue =
                `${a.date} ${a.time}`;

            const bValue =
                `${b.date} ${b.time}`;

            return bValue
                .localeCompare(aValue);

        }
    );


    table.innerHTML = "";


    if(records.length === 0){

        table.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:40px;
                        color:#999;
                    "
                >

                    <i
                        class="fa-solid fa-calendar-xmark"
                        style="
                            font-size:30px;
                            margin-bottom:10px;
                            display:block;
                        "
                    ></i>

                    No attendance records found.

                </td>

            </tr>

        `;

    }
    else{

        records.forEach(
            record => {

                table.innerHTML += `

                    <tr>

                        <td>
                            <strong>
                                ${formatDate(record.date)}
                            </strong>
                        </td>


                        <td>

                            <div class="student-cell">

                                <div class="avatar">
                                    ${getInitials(
                                        record.studentName
                                    )}
                                </div>

                                <div class="student-name">

                                    <strong>
                                        ${record.studentName}
                                    </strong>

                                    <span>
                                        ${record.studentId}
                                    </span>

                                </div>

                            </div>

                        </td>


                        <td>
                            ${record.studentId}
                        </td>


                        <td>
                            ${record.className}
                        </td>


                        <td>
                            ${getStatusBadge(
                                record.status
                            )}
                        </td>


                        <td>
                            ${
                                record.time
                                || "—"
                            }
                        </td>


                        <td>

                            ${
                                record.reason
                                || "—"
                            }

                        </td>


                        <td>

                            <button
                                class="table-action"
                                onclick="
                                    deleteAttendance(
                                        '${record.id}'
                                    )
                                "
                                title="Delete">

                                <i
                                    class="fa-solid fa-trash"
                                ></i>

                            </button>

                        </td>

                    </tr>

                `;

            }
        );

    }


    updateHistorySummary(records);

}


/* =====================================================
   HISTORY SUMMARY
===================================================== */

function updateHistorySummary(
    records
){

    document
        .getElementById(
            "historyPresent"
        )
        .textContent =
        countStatus(
            records,
            "Present"
        );


    document
        .getElementById(
            "historyAbsent"
        )
        .textContent =
        countStatus(
            records,
            "Absent"
        );


    document
        .getElementById(
            "historyLate"
        )
        .textContent =
        countStatus(
            records,
            "Late"
        );


    document
        .getElementById(
            "historyPermission"
        )
        .textContent =
        countStatus(
            records,
            "Permission"
        );


    document
        .getElementById(
            "historyTotal"
        )
        .textContent =
        records.length;

}


/* =====================================================
   DELETE ATTENDANCE
===================================================== */

function deleteAttendance(id){

    if(
        !confirm(
            "Delete this attendance record?"
        )
    ){

        return;

    }


    attendance =
        attendance.filter(
            record =>
                record.id !== id
        );


    saveAttendance();

    renderHistory();

    renderAttendance();

    updateDashboard();

    showToast(
        "Attendance record deleted!"
    );

}


/* =====================================================
   CLEAR ALL ATTENDANCE
===================================================== */

function clearAllAttendance(){

    if(attendance.length === 0){

        showToast(
            "There are no attendance records."
        );

        return;

    }


    if(
        !confirm(
            "WARNING!\n\nThis will delete ALL attendance history.\n\nAre you sure?"
        )
    ){

        return;

    }


    attendance = [];


    saveAttendance();

    renderAttendance();

    renderHistory();

    updateDashboard();


    showToast(
        "All attendance history cleared!"
    );

}


/* =====================================================
   RESET HISTORY FILTER
===================================================== */

function resetHistoryFilter(){

    document
        .getElementById(
            "historyDate"
        )
        .value = "";


    document
        .getElementById(
            "historyStudent"
        )
        .value = "all";


    document
        .getElementById(
            "historyStatus"
        )
        .value = "all";


    renderHistory();

}


/* =====================================================
   DASHBOARD
===================================================== */

function updateDashboard(){

    const today =
        getToday();


    const records =
        getAttendanceForDate(
            today
        );


    const present =
        countStatus(
            records,
            "Present"
        );


    const absent =
        countStatus(
            records,
            "Absent"
        );


    const late =
        countStatus(
            records,
            "Late"
        );


    const permission =
        countStatus(
            records,
            "Permission"
        );


    document
        .getElementById(
            "totalStudents"
        )
        .textContent =
        students.length;


    document
        .getElementById(
            "presentCount"
        )
        .textContent =
        present;


    document
        .getElementById(
            "absentCount"
        )
        .textContent =
        absent;


    const marked =
        records.length;


    const rate =
        students.length === 0
            ? 0
            : Math.round(
                (present / students.length)
                * 100
            );


    document
        .getElementById(
            "attendanceRate"
        )
        .textContent =
        rate + "%";


    document
        .getElementById(
            "dashPresent"
        )
        .textContent =
        present;


    document
        .getElementById(
            "dashAbsent"
        )
        .textContent =
        absent;


    document
        .getElementById(
            "dashLate"
        )
        .textContent =
        late;


    document
        .getElementById(
            "dashPermission"
        )
        .textContent =
        permission;


    renderRecentStudents();

}


/* =====================================================
   RECENT STUDENTS
===================================================== */

function renderRecentStudents(){

    const container =
        document.getElementById(
            "recentStudents"
        );


    container.innerHTML = "";


    students
        .slice(0,5)
        .forEach(
            student => {

                container.innerHTML += `

                    <div class="recent-item">

                        <div class="recent-avatar">

                            ${getInitials(
                                student.name
                            )}

                        </div>


                        <div class="recent-info">

                            <strong>
                                ${student.name}
                            </strong>

                            <span>
                                ${student.major}
                            </span>

                        </div>

                    </div>

                `;

            }
        );

}


/* =====================================================
   GRADES
===================================================== */

function renderGrades(){

    const table =
        document.getElementById(
            "gradeTable"
        );


    table.innerHTML = "";


    students.forEach(
        (student,index) => {

            const grade =
                Number(
                    student.grade
                );


            const html =
                Math.min(
                    100,
                    grade + 2
                );


            const js =
                Math.max(
                    0,
                    grade - 3
                );


            const db =
                Math.min(
                    100,
                    grade + 1
                );


            const network =
                Math.max(
                    0,
                    grade - 5
                );


            const average =
                Math.round(
                    (
                        html +
                        js +
                        db +
                        network
                    ) / 4
                );


            const result =
                average >= 50

                ?

                `
                    <span class="badge badge-success">
                        Pass
                    </span>
                `

                :

                `
                    <span class="badge badge-danger">
                        Fail
                    </span>
                `;


            table.innerHTML += `

                <tr>

                    <td>

                        <div class="student-cell">

                            <div class="avatar">
                                ${getInitials(
                                    student.name
                                )}
                            </div>

                            <div class="student-name">

                                <strong>
                                    ${student.name}
                                </strong>

                                <span>
                                    ${student.id}
                                </span>

                            </div>

                        </div>

                    </td>


                    <td>
                        ${html}
                    </td>

                    <td>
                        ${js}
                    </td>

                    <td>
                        ${db}
                    </td>

                    <td>
                        ${network}
                    </td>

                    <td>
                        <strong>
                            ${average}%
                        </strong>
                    </td>

                    <td>
                        ${result}
                    </td>

                </tr>

            `;

        }
    );

}


/* =====================================================
   RANKING
===================================================== */

function renderRanking(){

    const container =
        document.getElementById(
            "fullRanking"
        );


    const ranking =
        [...students].sort(
            (a,b) =>
                b.grade - a.grade
        );


    container.innerHTML = "";


    ranking.forEach(
        (student,index) => {

            container.innerHTML += `

                <div class="rank-item">

                    <div class="rank-number">
                        ${index + 1}
                    </div>


                    <div class="avatar">

                        ${getInitials(
                            student.name
                        )}

                    </div>


                    <div class="rank-info">

                        <strong>
                            ${student.name}
                        </strong>

                        <span>
                            ${student.major}
                        </span>

                    </div>


                    <div class="score">

                        ${student.grade}%

                    </div>

                </div>

            `;

        }
    );

}


/* =====================================================
   DARK MODE
===================================================== */

function toggleDarkMode(){

    document.body
        .classList
        .toggle("dark");


    const enabled =
        document.body
            .classList
            .contains("dark");


    localStorage.setItem(
        "ntti_dark_mode",
        enabled
    );


    document
        .getElementById(
            "settingsDarkMode"
        )
        .classList
        .toggle(
            "active",
            enabled
        );

}


/* =====================================================
   EXPORT STUDENTS CSV
===================================================== */

function exportStudentsCSV(){

    let csv =
        "Name,Student ID,Gender,Class,Major,Phone,Email,Grade,Status\n";


    students.forEach(
        student => {

            csv += [

                student.name,
                student.id,
                student.gender,
                student.className,
                student.major,
                student.phone,
                student.email,
                student.grade,
                student.status

            ]
            .map(
                value =>
                    `"${String(
                        value || ""
                    ).replace(
                        /"/g,
                        '""'
                    )}"`
            )
            .join(",")
            + "\n";

        }
    );


    downloadCSV(
        csv,
        "NTTI_Classmates.csv"
    );


    showToast(
        "Student data exported!"
    );

}


/* =====================================================
   EXPORT ATTENDANCE CSV
===================================================== */

function exportAttendanceCSV(){

    if(attendance.length === 0){

        showToast(
            "No attendance records to export!"
        );

        return;

    }


    let csv =
        "Date,Student,Student ID,Class,Status,Time,Reason\n";


    const records =
        [...attendance].sort(
            (a,b) =>
                `${a.date}${a.time}`
                .localeCompare(
                    `${b.date}${b.time}`
                )
        );


    records.forEach(
        record => {

            csv += [

                record.date,
                record.studentName,
                record.studentId,
                record.className,
                record.status,
                record.time,
                record.reason

            ]
            .map(
                value =>
                    `"${String(
                        value || ""
                    ).replace(
                        /"/g,
                        '""'
                    )}"`
            )
            .join(",")
            + "\n";

        }
    );


    downloadCSV(
        csv,
        "NTTI_Attendance_History.csv"
    );


    showToast(
        "Attendance history exported!"
    );

}
function downloadCSV(
    csv,
    filename
){

    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        filename;


    document
        .body
        .appendChild(link);


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}
let toastTimer;


function showToast(
    message
){

    const toast =
        document.getElementById(
            "toast"
        );


    document
        .getElementById(
            "toastMessage"
        )
        .textContent =
        message;


    toast.classList
        .add("show");


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList
                    .remove("show");

            },
            3000
        );

}
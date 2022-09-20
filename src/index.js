const express = require('express');
const studentArray = require('./InitialData');

let ID_COUNTER = Math.max(...studentArray.map((el) => el.id));

//! ------------ SET UP EXPRESS
const app = express();
const bodyParser = require('body-parser');
const port = 8080;
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//! --------------- START OUR CODE

class StudentGroup {
    constructor(studentArray) {
        this.studentArray = studentArray;
    }

    getAllStudents() {
        return this.studentArray;
    }

    addNewStudent(name, currentClass, division) {
        const newId = ++ID_COUNTER;
        this.studentArray.push({
            id: newId,
            name,
            currentClass: Number(currentClass),
            division,
        });
        return { id: newId };
    }

    getStudentByID(id) {
        const actualId = Number(id);
        const student = this.studentArray.find((el) => el.id === actualId);
        if (!student) {
            return null;
        }
        return student;
    }

    updateStudentByID(id, update) {
        const { name, currentClass, division } = update;

        const student = this.getStudentByID(id);
        if (!student) {
            return null;
        }

        if (student) {
            if (name) {
                student.name = name;
            }
            if (currentClass) {
                if (Number.isNaN(Number(currentClass))) {
                    res.status(400).json({ error: 'incomplete details' });
                    return;
                } else {
                    student.currentClass = Number(currentClass);
                }
            }
            if (division) {
                student.division = division;
            }
        }
        return student;
    }

    deleteStudentByID(id) {
        const actualId = Number(id);
        const studentIndex = this.studentArray.findIndex(
            (el) => el.id === actualId
        );
        const deletedStudent = this.studentArray[studentIndex];
        if (studentIndex === -1) {
            return null;
        }
        this.studentArray.splice(studentIndex, 1);
        return deletedStudent;
    }
}

const students = new StudentGroup(studentArray);

app.get('/api/student', (req, res) => {
    res.json(students.getAllStudents());
});

app.post('/api/student', (req, res) => {
    const { name, currentClass, division } = req.body;

    if (!name || !currentClass || !division) {
        res.status(400).json({ error: 'incomplete details' });
        return; //! don't go further
    }

    res.json(students.addNewStudent(name, currentClass, division));
});

app.get('/api/student/:id', (req, res) => {
    //! string
    const { id } = req.params;

    const student = students.getStudentByID(id);

    if (student) {
        res.json(student);
    } else {
        res.status(404).json({ error: 'student id invalid' });
    }
});

app.put('/api/student/:id', (req, res) => {
    const { id } = req.params;
    const { name, currentClass, division } = req.body;

    if (!name && !currentClass && !division) {
        res.status(400).json({ error: 'incomplete details' });
    }

    const updatedStudent = students.updateStudentByID(id, req.body);
    if (updatedStudent) {
        res.json(updatedStudent);
    } else {
        res.status(400).json({ error: 'student id invalid' });
    }
});

app.delete('/api/student/:id', (req, res) => {
    const { id } = req.params;
    const deletedStudent = students.deleteStudentByID(id);
    if (deletedStudent) {
        res.json(deletedStudent);
    } else {
        res.status(404).json({ error: 'student id invalid' });
    }
});

//! ----------------END OUR CODE
app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
const fs = require("fs");
const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(express.json());

app.use(morgan("dev"));

app.use((request, response, next) => {
  request.time = Date.now();
  next();
});

let students = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/student.json`, "utf-8")
);

const UpdateStudentInfo = (req, res) => {
  const newId = +req.params.id;
  const body = req.body;
  let selectObj = students.find((val) => {
    return val.id === newId;
  });
  const index = students.indexOf(selectObj);
  if (selectObj) {
    for (let [key, val] of Object.entries(body)) {
      selectObj[`${key}`] = val;
    }

    students.fill(selectObj, index, index + 1);
  }

  // selectObj.name = fName ? fName : selectObj.name;
  // selectObj.age = age ? age : selectObj.age;

  // console.log(students);
  fs.writeFile(
    `${__dirname}/dev-data/student.json`,
    JSON.stringify(students),
    "utf-8",
    (err) => {
      res.status(selectObj ? 200 : 400).json({
        status: selectObj ? "OK" : "Failed",
        data: selectObj ? selectObj : "No data",
      });
    }
  );
};
const getStudent = (request, response) => {
  response.status(200).json({
    status: "Ok",
    data: { students },
  });
};
const getStudentById = (req, res) => {
  const id = +req.params.id;
  const selectObj = students.find((val) => {
    return val.id === id;
  });
  res.status(selectObj ? 200 : 404).json({
    status: selectObj ? "OK" : "Fail",
    data: selectObj ? selectObj : "No data",
  });
};
const addStudent = (req, res) => {
  const data = req.body;
  // console.log(data);
  const newId = students[students.length - 1].id + 1;
  const completeObj = Object.assign({ id: newId }, data);
  students.push(completeObj);
  fs.writeFile(
    `${__dirname}/dev-data/student.json`,
    JSON.stringify(students),
    "utf-8",
    (err) => {
      res.status(200).json({
        status: "OK",
        data: completeObj,
      });
    }
  );
};
const deleteStudent = (req, res) => {
  const id = +req.params.id;
  const newObj = students.filter((val) => {
    return val.id !== id;
  });
  const deleteObj = students.find((val) => {
    return val.id === id;
  });
  fs.writeFile(
    `${__dirname}/dev-data/student.json`,
    JSON.stringify(newObj),
    "utf-8",
    (err) => {
      res.status(204).json({
        status: deleteObj ? "OK" : "Failed",
        data: deleteObj ? "Deleted information" : "Error",
      });
    }
  );
};
const updateStudent = (req, res) => {
  const newId = +req.params.id;
  const body = req.body;
  let selectObj = students.find((val) => {
    return val.id === newId;
  });
  const index = students.indexOf(selectObj);
  selectObj = Object.assign({ id: newId }, body);
  students.fill(selectObj, index, index + 1);
  // console.log(students);
  fs.writeFile(
    `${__dirname}/dev-data/student.json`,
    JSON.stringify(students),
    "utf-8",
    (err) => {
      res.status(200).json({
        status: "OK",
        data: selectObj,
      });
    }
  );
};

app.route("/api/v1/student").get(getStudent).post(addStudent);
app
  .route("/api/v1/student/:id")
  .get(getStudentById)
  .patch(UpdateStudentInfo)
  .put(updateStudent)
  .delete(deleteStudent);

app.listen(8000, "127.0.0.1");

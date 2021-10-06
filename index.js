const express = require("express");
const cors = require("cors");
const pool = require("./db");
const { Connection } = require("pg");


const app = express();

//Middleware
app.use(express.json());
app.use(cors());

// app.use("/login", async(req, res) =>{
//   try{
//     const librarianKey = await pool.query("SELECT * FROM librarian ORDER BY librarian_id DESC limit 1");
//     res.send(librarianKey.rows);
//   }catch(err){
//     console.log(err.message);
//   }

// });

app.get('/login', function(req, res) {
  console.log('object');
  let {username} = req.body;
  let {library_key} = req.body;
  console.log(username);
  console.log(library_key);
  console.log(req.body);
  let isValid = false;

  const sql = `select * from librarian where username = $1 and library_key = $2`;  
  const {rows} = pool.query(sql,[username,library_key])
  .then(({rows})=>
   {
     console.log(rows);
     res.send(rows)
     res.sendStatus(200);
   }).catch((err)=>{
    res.sendStatus(404);
     console.log(err)
   })
});


//Routes


//create a book

app.post("/addbook", async (req, res) => {
  try {
    const { isbn_no } = req.body;
    const { title } = req.body;
    const { author } = req.body;
    const { category } = req.body;
    const { quantity } = req.body;
    const newBook = await pool.query(
      "INSERT INTO books (isbn_no, title, author, category, quantity) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [isbn_no, title, author, category, quantity]
    );

    res.json(newBook.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get all books

app.get("/books", async (req, res) => {
  try {
    const allBooks = await pool.query("SELECT * FROM books");
    res.json(allBooks.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get specific book

app.get("/title/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const book = await pool.query("SELECT * FROM books WHERE title = $1", [
      title,
    ]);
    res.json(book.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get all books by author

app.get("/author/:author", async (req, res) => {
  try {
    const { author } = req.params;
    const books = await pool.query("SELECT * FROM books WHERE author = $1", [
      author,
    ]);
    res.json(books.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get all books by genre

app.get("/genre/:genre", async (req, res) => {
  try {
    const { genre } = req.params;
    const books = await pool.query("SELECT * FROM books WHERE genre = $1", [
      genre,
    ]);
    res.json(books.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//update book

app.put("/update/:book_id", async (req, res) => {
  try {
    const book_id = parseInt(req.params.book_id)
    const { isbn_no } = req.body;
    const { title } = req.body;
    const { author } = req.body;
    const { category } = req.body;
    const { quantity } = req.body;
    const updateBook = await pool.query("UPDATE books SET isbn_no = $1, title = $2, author = $3, category = $4, quantity = $5 WHERE book_id = $6",
      [isbn_no, title, author, category, quantity, book_id]
    );

    res.json(updateBook.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//delete book

app.delete("/book/:book_id", async (req, res) => {
  try {
    const  book_id  = parseInt(req.params.book_id);
    const deleteBook = await pool.query(
      "DELETE FROM books WHERE book_id = $1",[book_id]
    );
    res.json(deleteBook.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//search books
app.get("/searchbook", async (req, res) => {
  try {
    const { name } = req.query;

    const books = await pool.query(
      "SELECT * FROM books WHERE title || ' ' || author ILIKE $1",
      [`%${name}%`]
    );
    res.json(books.rows);
  } catch (err) {
    console.error(err.message);
  }
});


//Add student
app.post("/addstudent", async (req, res) => {
  try {
    const { school_id } = req.body;
    const { firstname } = req.body;
    const { surname } = req.body;
    const { gender } = req.body;
    const { addres } = req.body;
    const {course} = req.body;
    const newStudent = await pool.query(
      "INSERT INTO student (school_id, firstname, surname, gender, addres, course) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
      [school_id, firstname, surname, gender, addres, course]
    );

    res.json(newStudent.rows);
  } catch (err) {
    console.error(err.message);
  }
});


//get all students
app.get("/students", async(req, res) =>{
  try{
    const allStudents = await pool.query("SELECT * FROM student");
    res.json(allStudents.rows);
  }catch(err){
    console.log(err.message);
  }
});

//get specific student by schoolID
app.get("/students/:school_id", async(req, res) =>{
  try{
    const school_id = parseInt(req.params.school_id);
    
    const students = await pool.query("SELECT * FROM student WHERE school_id = $1",  
    [school_id]);
    res.json(students.rows);
  }catch(err){
    console.log(err.message);
  }

});

//Update student info
app.post("/update/:student_id", async (req, res) => {
  try {
    const student_id = parseInt(req.params.student_id);
    const { firstname } = req.body;
    const { surname } = req.body;
    const { gender } = req.body;
    const { addres } = req.body;
    const {course} = req.body;
    const updateStudent = await pool.query(
      "UPDATE student SET firstname = $1, surname = $2, gender = $3, addres = $4, course = $5 WHERE student_id = $6",
      [firstname, surname, gender, addres, course,student_id]
    );
    res.json(updateStudent.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//search students
app.get("/student", async (req, res) => {
  try {
    const { name } = req.query;
    const students = await pool.query(
      "SELECT * FROM student WHERE firstname || school_id || ' ' || surname ILIKE $1",
      [`%${name}%`]
    );
    res.json(students.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Register Admin
app.post("/registeradmin", async (req, res) => {
  try {
    const { first_name } = req.body;
    const { last_name } = req.body;
    const { password } = req.body;
    const newAdmin = await pool.query(
      "INSERT INTO superadmin (first_name, last_name, password) VALUES($1, $2, $3) RETURNING *",
      [first_name, last_name, password]
    );

    res.json(newAdmin.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Add Librarian
app.post("/addlibrarian", async (req, res) => {
  try {
    const { username } = req.body;
    const { pasword } = req.body;
    const newLibrarian = await pool.query(
      "INSERT INTO librarian (username, pasword) VALUES($1, $2) RETURNING *",
      [username, pasword]
    );

    res.json(newLibrarian.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get specific key by librarian_id
app.get("/librarian", async(req, res) =>{
  try{
    const librarianKey = await pool.query("SELECT * FROM librarian ORDER BY librarian_id DESC limit 1");
    res.json(librarianKey.rows);
  }catch(err){
    console.log(err.message);
  }

});





app.listen(5000, () => {
  console.log("server has started on port 5000");
});

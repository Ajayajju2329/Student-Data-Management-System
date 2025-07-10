let studentsData = []; // To store all student data

function addStudent(event) {
    event.preventDefault();

    const ID = document.getElementById("studentId").value;
    const Name = document.getElementById("studentName").value;
    const Age = document.getElementById("studentAge").value;
    const Department = document.getElementById("studentDept").value;
    const GPA = document.getElementById("studentGPA").value;
    const Contact = document.getElementById("studentContact").value;
    const Photo = document.getElementById("studentPhoto");
    const PhotoFile = Photo.files.length>0 ? Photo.files[0]:null;
  //  const Photo = document.getElementById("studentPhoto");
    if (!ID || !Name || !Age || !Department || !GPA || !Contact) {
        alert("Please fill in all fields.");
        return;
    }
    if(GPA<0||GPA>10){
        alert("Please enter a valid GPA between 0.0 and 10.0");
        return;
    }

    
    
    if(PhotoFile){
        const reader = new FileReader();
        reader.onload = function(event){
            const Photo=event.target.result;
             saveStudent (ID,Name,Age,Department,GPA,Contact,Photo);
        };
        reader.readAsDataURL(PhotoFile);
    }
    else{
        saveStudent(ID,Name,Age,Department,GPA,Contact,""); //no photo
    }
  
}
function saveStudent(ID,Name,Age,Department,GPA,Contact,Photo){
    



    let studentsData = JSON.parse(localStorage.getItem("studentsData")) || [];
    const newStudent ={ID,Name,Age,Department,GPA,Contact,Photo};
    studentsData.push(newStudent);

    localStorage.setItem("studentsData", JSON.stringify(studentsData));
    alert("Student added successfully!");

    saveAsExcel(studentsData);  // Trigger Excel file download

    document.getElementById("addStudentForm").reset();
}



// Function to save data as an Excel file
function saveAsExcel(data) {
    if (!data || data.length === 0) {
        console.error("No data to save.");
        return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "students");

    // Save the Excel file
    XLSX.writeFile(wb, "studentdb.xlsx");
}


// Function to save Excel file
function saveAsExcel(data) {
    if (!data || data.length === 0) {
        console.error("No data to save.");
        return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "students");

    try {
        XLSX.writeFile(wb, "studentdb.xlsx");
        console.log("File saved successfully.");
    } catch (error) {
        console.error("Error saving file:", error);
    }
}
function loadStudents() {
    const studentsData = JSON.parse(localStorage.getItem("studentsData")) || [];  // Fetching from localStorage

    if (!studentsData||studentsData.length === 0) {
        alert("No student data available.");
        return;
    }
    let tableBody=document.getElementById("studentsTableBody");
    if(!tableBody){console.error("error:element'studentsTableBody'not found");
        return;

    }
    tableBody.innerHTML="";
  /*  console.log("loaded students",studentsData);
    const studentTable = document.getElementById("studentTableBody");
    
    studentTable.innerHTML = "";  // Clear any previous data*/

    studentsData.forEach(student => {
       if(!student || !student.ID){
        console.warn("skipping invalid student record",student);
        return;
       }
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.ID}</td>
            <td>${student.Name}</td>
            <td>${student.Age}</td>
            <td>${student.Department}</td>
            <td>${student.GPA}</td>
            <td>${student.Contact}</td>
            <td>${student.Photo ? `<img src="${student.Photo}" width="50" height="50">`:"No Photo"}</td>
        `;
       // studentTable.appendChild(row);
       tableBody.appendChild(row);
    });
console.log("Students loaded successfully",studentsData);
}
// Function to search for a student by ID
function searchStudent() {
    const ID = document.getElementById("ID").value.trim();
    const studentsData = JSON.parse(localStorage.getItem("studentsData")) || [];

    console.log("Searching for ID:", ID);
    console.log("View Students:", studentsData);

    const student = studentsData.find(stu => stu && stu.ID && stu.ID.toString() === ID.toString());

    if (student) {
        document.getElementById("updateForm").style.display = "block";
        document.getElementById("updateID").value = student.ID || '';
        document.getElementById("updateName").value = student.Name || '';
        document.getElementById("updateAge").value = student.Age || '';
        document.getElementById("updateDepartment").value = student.Department || '';
        document.getElementById("updateGPA").value = student.GPA || '';
        document.getElementById("updateContact").value = student.Contact || '';

        const PhotoPreview =document.getElementById("updatePhotoPreview");
        if(student.Photo){
            PhotoPreview.src=student.Photo;
            PhotoPreview.style.display="block";

        }
        else{
            PhotoPreview.src="";
            PhotoPreview.style.display="none";
        }
    } else {
        alert("Student not found.");
        document.getElementById("updateForm").style.display = "none";
    }
}

// Function to update student details
function updateStudent() {
    const updateID = document.getElementById("updateID").value.trim();
    const studentsData = JSON.parse(localStorage.getItem("studentsData")) || [];

    const index = studentsData.findIndex(stu => stu.ID.toString() === updateID);

    if (index !== -1) {
         // Only update fields that are not empty
         const updatedName = document.getElementById("updateName").value.trim();
         const updatedAge = document.getElementById("updateAge").value.trim();
         const updatedDepartment = document.getElementById("updateDepartment").value.trim();
         const updatedGPA = document.getElementById("updateGPA").value.trim();
         const updatedContact = document.getElementById("updateContact").value.trim();
         const updatedPhotoInput = document.getElementById("updatePhoto");
         const reader = new FileReader();
         if (updatedName) studentsData[index].Name = updatedName;
         if (updatedAge) studentsData[index].Age = updatedAge;
         if (updatedDepartment) studentsData[index].Department = updatedDepartment;
         if (updatedGPA) studentsData[index].GPA = updatedGPA;
         if (updatedContact) studentsData[index].Contact = updatedContact;
 
      /*  const updatedPhotoInput = document.getElementById("updatePhoto");
        const reader = new FileReader();*/

        // If a new photo is uploaded, update it
        if (updatedPhotoInput.files.length > 0) {
            reader.onload = function (event) {
                studentsData[index].Photo = event.target.result;
                saveUpdatedData(studentsData);
            };
            reader.readAsDataURL(updatedPhotoInput.files[0]);
        } else {
            // Keep the old photo if no new photo is selected
            saveUpdatedData(studentsData);
        }

          /*  //updating student details
        studentsData[index] ={
            ID: updateID,
            Name: document.getElementById("updateName").value,
            Age: document.getElementById("updateAge").value,
            Department: document.getElementById("updateDepartment").value,
            GPA: document.getElementById("updateGPA").value,
            Contact: document.getElementById("updateContact").value,
            Photo:studentsData[index].Photo//retain exisiting photo
    };*/

        
    } else {
        alert("Student not found.");
    }
}
function saveUpdatedData(studentsData) {
    localStorage.setItem("studentsData", JSON.stringify(studentsData));
    alert("Student details updated successfully!");
    document.getElementById("updateForm").reset();
    document.getElementById("updateForm").style.display = "none";
}

// Function to delete a student
function deleteStudent() {
    const deleteID = document.getElementById("updateID").value.trim();
    let studentsData = JSON.parse(localStorage.getItem("studentsData")) || [];

    const newStudentsData = studentsData.filter(stu => stu.ID.toString() !== deleteID);

    if (studentsData.length !== newStudentsData.length) {
        localStorage.setItem("studentsData", JSON.stringify(newStudentsData));
        alert("Student deleted successfully!");
        document.getElementById("updateForm").reset();
        document.getElementById("updateForm").style.display = "none";
    } else {
        alert("Student not found.");
    }
}















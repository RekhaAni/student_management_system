class StudentApp {
    constructor() {
        this.apiUrl = "http://127.0.0.1:8000/api/students/";
        this.fetchStudents();
    }

    async fetchStudents() {
        const res = await fetch(this.apiUrl);
        const data = await res.json();
        const table = document.getElementById("studentTable");
        table.innerHTML = "";

        data.forEach(student => {
            table.innerHTML += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.age}</td>
                    <td>${student.course}</td>
                    <td>
                        <button onclick="studentApp.editStudent(${student.id}, '${student.name}', ${student.age}, '${student.course}')">Edit</button>
                        <button onclick="studentApp.deleteStudent(${student.id})">Delete</button>
                    </td>
                </tr>
            `;
        });
    }

    getFormData() {
        return {
            id: document.getElementById("studentId").value,
            name: document.getElementById("name").value.trim(),
            age: document.getElementById("age").value,
            course: document.getElementById("course").value.trim()
        };
    }

    clearForm() {
        document.getElementById("studentId").value = "";
        document.getElementById("name").value = "";
        document.getElementById("age").value = "";
        document.getElementById("course").value = "";
    }

    async addStudent() {
    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value.trim();
    const course = document.getElementById("course").value.trim();

    if (!name || !age || !course) {
        alert("All fields required");
        return;
    }

    try {
        const response = await fetch(this.apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, age, course })
        });

        const result = await response.json();
        console.log("SERVER RESPONSE:", result);

        if (!response.ok) {
            alert("Error: " + result.error);
            return;
        }

        this.clearForm();
        this.fetchStudents();

    } catch (error) {
        console.error("Fetch error:", error);
        alert("Cannot connect to backend");
    }
}


    editStudent(id, name, age, course) {
        document.getElementById("studentId").value = id;
        document.getElementById("name").value = name;
        document.getElementById("age").value = age;
        document.getElementById("course").value = course;
    }

    async updateStudent() {
        const data = this.getFormData();
        if (!data.id) {
            alert("Select student to update");
            return;
        }

        await fetch(this.apiUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: parseInt(data.id),
                name: data.name,
                age: parseInt(data.age),
                course: data.course
            })
        });

        this.clearForm();
        this.fetchStudents();
    }

    async deleteStudent(id) {
        await fetch(this.apiUrl, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });

        this.fetchStudents();
    }
}

const studentApp = new StudentApp();
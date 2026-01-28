class StudentApp {
    constructor() {
        this.apiUrl = "http://127.0.0.1:8000/api/students/";
        this.currentPage = 1;
        this.fetchStudents(this.currentPage);
    }

    async fetchStudents(page = 1) {
        try {
            const res = await fetch(this.apiUrl + "?page=" + page);
            const result = await res.json();

            const data = result.students;
            const totalPages = result.total_pages;
            this.currentPage = result.current_page;

            const table = document.getElementById("studentTable");
            table.innerHTML = "";

            data.forEach((student, index) => {
                table.innerHTML += `
                    <tr>
                        <td>${(this.currentPage - 1) * 5 + index + 1}</td>
                        <td>${student.name}</td>
                        <td>${student.age}</td>
                        <td>${student.course}</td>
                        <td>
                            <button onclick="studentApp.editStudent(${student.id}, \`${student.name}\`, ${student.age}, \`${student.course}\`)">Edit</button>
                            <button onclick="studentApp.deleteStudent(${student.id})">Delete</button>
                        </td>
                    </tr>
                `;
            });

            this.renderPagination(totalPages);

        } catch (error) {
            console.error("Error fetching students:", error);
            alert("Cannot load students");
        }
    }

    renderPagination(totalPages) {
        const container = document.getElementById("pagination");
        container.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            container.innerHTML += `
                <button onclick="studentApp.fetchStudents(${i})"
                    style="margin:5px; padding:5px 10px; ${i === this.currentPage ? 'background:black;color:white;' : ''}">
                    ${i}
                </button>
            `;
        }
    }

    getFormData() {
        return {
            id: document.getElementById("studentId").value,
            name: document.getElementById("name").value.trim(),
            age: document.getElementById("age").value.trim(),
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
        const { name, age, course } = this.getFormData();

        if (!name || !age || !course) {
            alert("All fields required");
            return;
        }

        try {
            const response = await fetch(this.apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, age: parseInt(age), course })
            });

            const result = await response.json();

            if (!response.ok) {
                alert("Error: " + (result.error || "Failed to add"));
                return;
            }

            this.clearForm();
            this.fetchStudents(this.currentPage);

        } catch (error) {
            console.error("Add error:", error);
            alert("Backend not connected");
        }
    }

    editStudent(id, name, age, course) {
        document.getElementById("studentId").value = id;
        document.getElementById("name").value = name;
        document.getElementById("age").value = age;
        document.getElementById("course").value = course;
    }

    async updateStudent() {
        const { id, name, age, course } = this.getFormData();

        if (!id) {
            alert("Select a student to update");
            return;
        }

        try {
            const response = await fetch(this.apiUrl, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: parseInt(id),
                    name,
                    age: parseInt(age),
                    course
                })
            });

            const result = await response.json();

            if (!response.ok) {
                alert("Error: " + (result.error || "Failed to update"));
                return;
            }

            this.clearForm();
            this.fetchStudents(this.currentPage);

        } catch (error) {
            console.error("Update error:", error);
            alert("Backend not connected");
        }
    }

    async deleteStudent(id) {
        if (!confirm("Delete this student?")) return;

        try {
            const response = await fetch(this.apiUrl, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });

            const result = await response.json();

            if (!response.ok) {
                alert("Error: " + (result.error || "Failed to delete"));
                return;
            }

            this.fetchStudents(this.currentPage);

        } catch (error) {
            console.error("Delete error:", error);
            alert("Backend not connected");
        }
    }
}

const studentApp = new StudentApp();
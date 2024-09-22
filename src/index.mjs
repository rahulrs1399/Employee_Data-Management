import "./styles.css";

(async function () {
  const data = await fetch("./src/data.json");
  const res = await data.json();

  let employees = res;
  let selectedEmployeeId = String(employees[0].id);
  let selectedEmployee = employees[0];
  let isEditing = false; // To track whether it's an edit or add operation

  const employeeList = document.querySelector(".employees__names--list");
  const employeeInfo = document.querySelector(".employees__single--info");

  // Select elements for add/edit logic
  const createEmployeeBtn = document.querySelector(".createEmployee");
  const addEmployeeModal = document.querySelector(".addEmployee");
  const addEmployeeForm = document.querySelector(".addEmployee_create");
  const editEmployeeBtn = document.querySelector(".employees__single--editBtn");

  // Trigger add employee modal
  createEmployeeBtn.addEventListener("click", () => {
    isEditing = false;
    addEmployeeForm.reset(); // Clear form for adding new employee
    addEmployeeModal.style.display = "flex";
  });

  // Trigger edit employee modal
  editEmployeeBtn.addEventListener("click", () => {
    isEditing = true;
    addEmployeeModal.style.display = "flex";
    populateEditForm(selectedEmployee); // Populate the form with the selected employee's data
  });

  // Close modal when clicking outside of it
  addEmployeeModal.addEventListener("click", (e) => {
    if (e.target.className === "addEmployee") {
      addEmployeeModal.style.display = "none";
    }
  });

  // Handle form submission
  addEmployeeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(addEmployeeForm);
    const values = [...formData.entries()];
    let empData = {};
    values.forEach((val) => {
      empData[val[0]] = val[1];
    });
    empData.age =
      new Date().getFullYear() - parseInt(empData.dob.slice(0, 4), 10);
    empData.imageUrl =
      empData.imageUrl || "https://cdn-icons-png.flaticon.com/512/0/93.png";

    if (isEditing) {
      // Update the existing employee
      empData.id = selectedEmployee.id;
      employees = employees.map((emp) =>
        emp.id === empData.id ? empData : emp
      );
    } else {
      // Add a new employee
      empData.id = employees[employees.length - 1].id + 1;
      employees.push(empData);
    }

    renderEmployees();
    renderSingleEmployee();
    addEmployeeModal.style.display = "none"; // Close modal
    addEmployeeForm.reset();
  });

  // Populate form for editing
  const populateEditForm = (employee) => {
    addEmployeeForm.querySelector("input[name='firstName']").value =
      employee.firstName;
    addEmployeeForm.querySelector("input[name='lastName']").value =
      employee.lastName;
    addEmployeeForm.querySelector("input[name='email']").value = employee.email;
    addEmployeeForm.querySelector("input[name='contactNumber']").value =
      employee.contactNumber;
    addEmployeeForm.querySelector("input[name='salary']").value =
      employee.salary;
    addEmployeeForm.querySelector("input[name='address']").value =
      employee.address;
    addEmployeeForm.querySelector("input[name='dob']").value = employee.dob;
    addEmployeeForm.querySelector("input[name='imageUrl']").value =
      employee.imageUrl || "";
  };

  // Select employee logic
  employeeList.addEventListener("click", (e) => {
    if (e.target.tagName === "SPAN" && selectedEmployeeId !== e.target.id) {
      selectedEmployeeId = e.target.id;
      renderEmployees();
      renderSingleEmployee();
      addEmployeeModal.style.display = "none";
    }

    // Employee delete logic
    if (e.target.tagName === "I") {
      employees = employees.filter(
        (emp) => String(emp.id) !== e.target.parentNode.id
      );
      if (String(selectedEmployeeId) === e.target.parentNode.id) {
        selectedEmployeeId = employees[0].id || -1;
        selectedEmployee = employees[0] || {};
        renderSingleEmployee();
      }
      renderEmployees();
    }
  });

  // Render all employees
  const renderEmployees = () => {
    employeeList.innerHTML = "";

    employees.forEach((emp) => {
      const employee = document.createElement("span");

      employee.classList.add("employees__names--item");

      if (parseInt(selectedEmployeeId, 10) === emp.id) {
        employee.classList.add("selected");
        selectedEmployee = emp;
      }

      employee.setAttribute("id", emp.id);
      employee.innerHTML = `${emp.firstName} ${emp.lastName} <i class="employeeDelete">❌</i>`;

      employeeList.append(employee);
    });
  };

  // Render selected employee's info
  const renderSingleEmployee = () => {
    if (selectedEmployee === -1) {
      employeeInfo.innerHTML = "";
      return;
    }

    employeeInfo.innerHTML = `
      <img src="${selectedEmployee.imageUrl}" />
      <span class="employees__single--heading">
      ${selectedEmployee.firstName} ${selectedEmployee.lastName} (${selectedEmployee.age})
      </span>
      <span>${selectedEmployee.address}</span>
      <span>${selectedEmployee.email}</span>
      <span>${selectedEmployee.contactNumber}</span>
      <span>${selectedEmployee.dob}</span>
    `;
  };

  renderEmployees();
  if (selectedEmployee) renderSingleEmployee();
})();

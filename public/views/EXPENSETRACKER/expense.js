const myForm = document.getElementById("my-form");
const amount = document.getElementById("expense-amount");
const description = document.getElementById("description");
const category = document.getElementById("category");
const expense = document.getElementById("collection");
const msg = document.querySelector(".msg");
let id;

function showOnScreen(user) {
  const li = document.createElement("li");
  li.className = "col-sm";
  li.setAttribute("id", user.id);
  const textNode = `₹ ${user.amount}-  ${user.description}-  ${user.category}`;
  li.appendChild(document.createTextNode(textNode));
  expense.appendChild(li);

  var deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-danger btn-sm float-end delete";
  // Append text node
  deleteBtn.appendChild(document.createTextNode("DELETE"));
  // Append delete btn to li
  li.appendChild(deleteBtn);
  expense.appendChild(li);

  // Add Edit Button//
  var editBtn = document.createElement("button");
  editBtn.className = "btn btn-secondary btn-sm float-end edit";
  editBtn.appendChild(document.createTextNode("EDIT"));
  li.appendChild(editBtn);
  expense.appendChild(li);
}

async function showTotalExpense() {
  let sum = 0;
  const title = document.getElementById("expense-title");
  try {
    const response = await axios.get("http://localhost:4000/");
    // console.log(response)
    response.data.forEach((user) => {
      sum += user.amount;
    });
    title.innerText = `Total Expenditure: ${sum}`;
  } catch (err) {
    console.log(err);
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await axios.get("http://localhost:4000/");
    // console.log(response)
    response.data.forEach((user) => {
      showOnScreen(user);
    });
    showTotalExpense();
  } catch (err) {
    console.error(err);
  }
});
// listen on submit
myForm.addEventListener("submit", onSubmit);

async function onSubmit(e) {
  e.preventDefault();
  if (amount.value === "" || description.value === "") {
    // alert('Please enter all fields');
    msg.classList.add("error");
    msg.innerHTML = "Please enter all fields";

    // Remove error after 3 seconds
    setTimeout(() => msg.remove(), 3000);
  } else {
    var userExpense = {
      amount: amount.value,
      description: description.value,
      category: category.value,
    };
    try {
      const response = await axios.post(
        "http://localhost:4000/user",
        userExpense
      );
      showOnScreen(response.data);
      showTotalExpense();
      //clear fields
      amount.value = "";
      description.value = "";
    } catch (err) {
      console.log(err);
    }
  }
}
//Remove item
expense.addEventListener("click", removeItem);

async function removeItem(e) {
  try {
    if (e.target.classList.contains("delete")) {
      if (confirm("Are You Sure?")) {
        var li = e.target.parentElement;
        id = li.id;
        await axios.delete(`http://localhost:4000/delete/${id}`);
        expense.removeChild(li);
        showTotalExpense();
      }
    }
  } catch (err) {
    console.log(err);
  }
}
//Edit item//
expense.addEventListener("click", editUser);

async function editUser(e) {
  try {
    if (e.target.classList.contains("edit")) {
      var li = e.target.parentElement;
      id = li.id;
      const response = await axios.get(`http://localhost:4000/edit/${id}`);
      console.log(response);
      expense.removeChild(li);
      amount.value = response.data.amount;
      description.value = response.data.description;
      category.value = response.data.category;
      id = response.data.id;
      console.log(id);
      myForm.removeEventListener("submit", onSubmit);
      myForm.addEventListener("submit", updateItem);
    }
  } catch (err) {
    console.log(err);
  }
}

async function updateItem(e) {
  // e.preventDefault();
  var updatedExpense = {
    amount: amount.value,
    description: description.value,
    category: category.value,
  };
  try {
    // const response = await axios.put(`http://localhost:8080/update/${id}` , updatedExpense);
    const response = await axios.put(
      `http://localhost:4000/edit/${id}`,
      updatedExpense
    );
    showOnScreen(response.data);
    myForm.removeEventListener("submit", updateItem);
    myForm.addEventListener("submit", onSubmit);
    showTotalExpense();
    window.location.reload();
  } catch (err) {
    console.log(err);
  }
}
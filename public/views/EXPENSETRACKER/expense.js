const myForm = document.getElementById("my-form");
const amount = document.getElementById("expense-amount");
const description = document.getElementById("description");
const category = document.getElementById("category");
const expense = document.getElementById("collection");
const msg = document.querySelector(".msg");
const boardbtn = document.getElementById("board-btn");
const leaderBoard = document.getElementById("collection-board");
const leaderBoard1 = document.getElementById("leaderboard");
const boardSection = document.getElementById("leadership-br");
const token = localStorage.getItem("token");
const reportBtn = document.getElementById("report");
const pagination = document.getElementById("pagination");
const pageInfo = document.getElementById("page-info");

const displayedExpenses = [];


function showOnScreen(user) {
  const li = document.createElement("li");
  //li.className = "list-group-item";
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
  /*var editBtn = document.createElement("button");
  editBtn.className = "btn btn-secondary btn-sm float-end edit";
  editBtn.appendChild(document.createTextNode("EDIT"));
  li.appendChild(editBtn);
  expense.appendChild(li);*/

  displayedExpenses.push(li);
}
async function showTotalExpense() {
  let sum = 0;
  const title = document.getElementById("expense-title");
  try {
    const response = await axios.get("http://localhost:4000/user/expense" , {
      headers: { Authorization: token },
    });
    // console.log(response)
    response.data.forEach((user) => {
      sum += user.amount;
    });
    title.innerText = `Total Expenditure: ${sum}`;
  } catch (err) {
    console.log(err);
  }
}
const page = 1;
window.addEventListener("DOMContentLoaded", async () => {
  
  try {
    const response = await axios.get(`http://localhost:4000/user/expense/page/?page=${page}`, {
      headers: { Authorization: token },
    });
    // console.log(response)
    response.data.expenses.forEach((user) => {
      showOnScreen(user);
    });
    showPagination(response);

    
  } catch (err) {
    console.error(err);
  }
  showTotalExpense();
    isPremium();
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
        "http://localhost:4000/user/expense",
        userExpense,
        { headers: { Authorization: token } }
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
        await axios.delete(`http://localhost:4000/user/delete/${id}`, {
          headers: { Authorization: token },
        });
        expense.removeChild(li);
        showTotalExpense();
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function isPremium() {
  try {
    const user = await axios.get("http://localhost:4000/user/status" , {
      headers: { Authorization: token },
    });
    
    console.log(user)
    if (user.data === true) {
      document.getElementById('rzp-button1').style.visibility = "hidden"
       document.getElementById('message').innerHTML = "You are a premium user "
       document.getElementById('message').style.color = 'red'
      //razorpayPr.style.display = "flex";
      document.getElementById("board-btn").style.display = "inline";
      document.getElementById("leadership-br").style.display = "block";
      reportBtn.style.display = "inline";
    }
  } catch (err) {
    console.log(err);
  }
}

document.getElementById('rzp-button1').onclick = async function (e) {
  //const token = localStorage.getItem('token')
  const response  = await axios.get('http://localhost:4000/purchase/premiummembership', { headers: {"Authorization" : token} });
  console.log(response);
  var options =
  {
   "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
   "order_id": response.data.order.id,// For one time payment
   // This handler function will handle the success payment
   "handler": async function (response) {
      const res = await axios.post('http://localhost:4000/purchase/updatetransactionstatus',{
           order_id: options.order_id,
           payment_id: response.razorpay_payment_id,
       }, { headers: {"Authorization" : token} })
      
      console.log(res)
       alert('You are a Premium User Now')
       document.getElementById('rzp-button1').style.visibility = "hidden"
       document.getElementById('message').innerHTML = "You are a premium user "
       //localStorage.setItem('token', res.data.token)
       //showLeaderboard()
   },
};
const rzp1 = new Razorpay(options);
rzp1.open();
e.preventDefault();

rzp1.on('payment.failed', function (response){
  console.log(response)
  alert('Something went wrong')
});
}


boardbtn.addEventListener("click", showLeaderBoard);

async function showLeaderBoard(e) {
  e.preventDefault();
  try {
    document.getElementById("leaderboard").style.display = "block";
    const users = await axios.get(
      "http://localhost:4000/premium/leadershipboard",
      { headers: { Authorization: token } }
    );
    // console.log(users);
    users.data.forEach((user) => {
      // console.log(user)
      showBoard(user);
    });
  } catch (err) {
    console.log(err);
  }
}

function showBoard(user) {
  const li = document.createElement("li");
  li.className = "list-group-item";
  // li.setAttribute('id', user.id);
  const textNode = `Name: ${user.name}-  Total Expense:${user.totalExpense}`;
  li.appendChild(document.createTextNode(textNode));
  leaderBoard.appendChild(li);
}

reportBtn.addEventListener("click", report);

function report() {
  window.location.href = "../EXPENSEREPORT/index.html";
}


function showPagination(response) {
  pagination.innerHTML = '';
  const {
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage,
  } = response.data.pageData;

  if (hasPreviousPage) {
    const btn2 = document.createElement("button");
    // btn2.add.className = 'page-link'
    btn2.innerHTML = previousPage;
    btn2.addEventListener("click", () => getPage(previousPage));
    pagination.appendChild(btn2);
  }
  const btn1 = document.createElement("button");
  // btn1.add.className = 'page-link'
  btn1.innerHTML = `<h5>${currentPage}</h5>`;
  btn1.addEventListener("click", () => getPage(currentPage));
  pagination.appendChild(btn1);

  if (hasNextPage) {
    const btn3 = document.createElement("button");
    // btn3.add.className = 'page-link'
    btn3.innerHTML = nextPage;
    btn3.addEventListener("click", () => getPage(nextPage));
    pagination.appendChild(btn3);
  }
  pageInfo.textContent = `Page${currentPage} of ${lastPage}`;
}


async function getPage(page) {
  try {
    const response = await axios.get(
      `http://localhost:4000/user/expense/page/?page=${page}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    removeFromScreen()
    //   console.log(response);
    response.data.expenses.forEach((user) => {
      showOnScreen(user);
    });
    showPagination(response);
  } catch (err) {
    console.error(err);
  }
  showTotalExpense();
  isPremium();
}

function removeFromScreen(){
  displayedExpenses.forEach(li => {
      expense.removeChild(li);
    });
    // clear the displayedExpenses array
    displayedExpenses.length = 0;
}





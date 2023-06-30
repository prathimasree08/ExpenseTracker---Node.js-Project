const homeBtn = document.getElementById("homebtn");
const downloadBtn = document.getElementById("download");
const tableBody = document.getElementById("table-body");
const token = localStorage.getItem("token");

homeBtn.addEventListener("click", function home() {
  window.location.href = "../EXPENSETRACKER/expense.html";
});

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await axios.get("http://localhost:4000/user/expense", {
      headers: { Authorization: token },
    });
    // console.log(response)
    response.data.forEach((expense) => {
      onScreen(expense);
    });
  } catch (err) {
    console.error(err);
  }
});

downloadBtn.addEventListener("click", onDownload);

async function onDownload() {
  try {
    const response = await axios.get("http://localhost:4000/user/download", {
      headers: { Authorization: token },
    });
    if (response.status === 201) {
      //the bcakend is essentially sending a download link
      //  which if we open in browser, the file would download
      var a = document.createElement("a");
      a.href = response.data.fileUrl;
      a.download = "myexpense.csv";
      a.click();
    } else {
      throw new Error(response.data.message);
    }
  } catch (err) {
    showError(err);
  }
}

function onScreen(expense) {
  let tableRows = "";
  const incomeValue = expense.income ? expense.income : 0;
  tableRows += `<tr> <td>${expense.createdAt}</td> <td>${expense.description}</td> <td>${expense.category}</td> <td>${incomeValue}</td> <td>${expense.amount}</td> </tr>`;
  // update the table body with the new rows
  tableBody.innerHTML = tableRows;
}
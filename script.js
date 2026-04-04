const products = [
" ",
"سيلر ماجيكو",
"معجون برونزي",
"معجون كيما ٢٠٢٠",
"بلاستك كيما ٢٠٢٠",
"بلاستك توب تن",
"بلاستك سندرلا",
"بلاستك كلاسيكو",
"بلاستك برونزي"
];

function createRow(index) {
return `
<tr>
<td class="rowIndex">${index}</td>

<td>
<select>
${products.map(p => `<option>${p}</option>`).join("")}
</select>
</td>

<td>
<input type="number" class="qty" min="0" oninput="calculate()">
</td>

<td>
<input type="number" class="price" min="0" oninput="calculate()">
</td>

<td class="rowTotal">0</td>

<td>
<button onclick="deleteRow(this)" class="deleteBtn">X</button>
</td>

</tr>
`;
}

function addRow() {
const tableBody = document.getElementById("tableBody");
const rowCount = tableBody.rows.length + 1;
tableBody.insertAdjacentHTML("beforeend", createRow(rowCount));
}

function deleteRow(btn){
btn.closest("tr").remove();
updateRowNumbers();
calculate();
}

function updateRowNumbers(){
document.querySelectorAll("#tableBody tr").forEach((row,index)=>{
row.querySelector(".rowIndex").textContent = index + 1;
});
}

function calculate() {
let grandTotal = 0;

document.querySelectorAll("#tableBody tr").forEach(row => {

const qty = parseFloat(row.querySelector(".qty").value) || 0;
const price = parseFloat(row.querySelector(".price").value) || 0;

const total = qty * price;

row.querySelector(".rowTotal").textContent =
total.toLocaleString('en-US');

grandTotal += total;

});

document.getElementById("grandTotal").textContent =
grandTotal.toLocaleString('en-US');
}


addRow();


function downloadPDF() {

const { jsPDF } = window.jspdf;
const invoice = document.getElementById("invoice");

// تحويل اسم العميل لنص
const nameInput = document.getElementById("customerName");
const nameText = document.getElementById("customerNameText");
nameText.textContent = nameInput.value;

// تحويل التاريخ لنص
const dateInput = document.getElementById("date");
const dateText = document.getElementById("dateText");
dateText.textContent = dateInput.value;

// نخلي الصفحة في وضع PDF
invoice.classList.add("pdf-mode");

const rows = document.querySelectorAll("#tableBody tr");

// إخفاء الصفوف الفاضية
rows.forEach(row => {
const qty = row.querySelector(".qty").value;
const price = row.querySelector(".price").value;

if(!qty && !price){
row.style.display = "none";
}
});

html2canvas(invoice, { scale: 3 }).then(canvas => {

const imgData = canvas.toDataURL("image/png");
const pdf = new jsPDF('p','mm','a4');

const imgWidth = 210;
const imgHeight = canvas.height * imgWidth / canvas.width;

pdf.addImage(imgData,'PNG',0,0,imgWidth,imgHeight);
pdf.save("invoice.pdf");

// رجوع للوضع الطبيعي
invoice.classList.remove("pdf-mode");

rows.forEach(row=>{
row.style.display="table-row";
});

});
}

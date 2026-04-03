const products = [
"لمبة LED",
"فيشة",
"سلك كهرباء",
"مفتاح",
"لوحة كهرباء"
];

function createRow(index) {
return `
<tr>
<td>${index}</td>

<td>
<select>
${products.map(p => `<option>${p}</option>`).join("")}
</select>
</td>

<td>
<input type="number" class="qty" oninput="calculate()">
</td>

<td>
<input type="number" class="price" oninput="calculate()">
</td>

<td class="rowTotal">0</td>
</tr>
`;
}

function addRow() {
const tableBody = document.getElementById("tableBody");
const rowCount = tableBody.rows.length + 1;
tableBody.insertAdjacentHTML("beforeend", createRow(rowCount));
}

function calculate() {
let grandTotal = 0;

document.querySelectorAll("#tableBody tr").forEach(row => {
const qty = row.querySelector(".qty").value || 0;
const price = row.querySelector(".price").value || 0;
const total = qty * price;

row.querySelector(".rowTotal").textContent = total;
grandTotal += total;
});

document.getElementById("grandTotal").textContent = grandTotal;
}

for(let i = 1; i <= 20; i++){
addRow();
}
function downloadPDF() {

const { jsPDF } = window.jspdf;
const invoice = document.getElementById("invoice");
const rows = document.querySelectorAll("#tableBody tr");

// نخفي الصفوف الفاضية
rows.forEach(row => {
const qty = row.querySelector(".qty").value;
const price = row.querySelector(".price").value;

if(!qty && !price){
row.style.display = "none";
}
});

html2canvas(invoice, {
scale: 2,  // مهم جدا للجودة
useCORS: true
}).then(canvas => {

const imgData = canvas.toDataURL("image/png");
const pdf = new jsPDF("p", "mm", "a4");

const pageWidth = 210;
const pageHeight = 297;

const imgWidth = pageWidth;
const imgHeight = (canvas.height * imgWidth) / canvas.width;

pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
pdf.save("invoice.pdf");

// نرجع الصفوف
rows.forEach(row => {
row.style.display = "table-row";
});

});

}

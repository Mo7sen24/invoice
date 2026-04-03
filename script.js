document.addEventListener("DOMContentLoaded", () => {
    const products = ["لمبة LED","فيشة","سلك كهرباء","مفتاح","لوحة كهرباء"];

    function createRow(index) {
        return `<tr>
            <td>${index}</td>
            <td><select>${products.map(p => `<option>${p}</option>`).join("")}</select></td>
            <td><input type="number" class="qty" oninput="calculate()"></td>
            <td><input type="number" class="price" oninput="calculate()"></td>
            <td class="rowTotal">0</td>
        </tr>`;
    }

    function addRow() {
        const tableBody = document.getElementById("tableBody");
        const rowCount = tableBody.rows.length + 1;
        tableBody.insertAdjacentHTML("beforeend", createRow(rowCount));
    }

    function calculate() {
        let grandTotal = 0;
        document.querySelectorAll("#tableBody tr").forEach(row => {
            const qty = parseFloat(row.querySelector(".qty").value) || 0;
            const price = parseFloat(row.querySelector(".price").value) || 0;
            const total = qty * price;
            row.querySelector(".rowTotal").textContent = total.toFixed(2);
            grandTotal += total;
        });
        document.getElementById("grandTotal").textContent = grandTotal.toFixed(2);
    }

    window.calculate = calculate;

    for(let i=1;i<=20;i++){ addRow(); }
    document.getElementById("addRowBtn").addEventListener("click", addRow);

    document.getElementById("downloadPDFBtn").addEventListener("click", () => {
        const invoice = document.getElementById("invoice");
        const rows = invoice.querySelectorAll("#tableBody tr");

        // اخفاء الصفوف الفارغة
        rows.forEach(row => {
            const qty = row.querySelector(".qty").value;
            const price = row.querySelector(".price").value;
            if(!qty && !price){ row.style.display = "none"; }
        });

        // استخدام html2canvas وتحويلها ل jsPDF
        html2canvas(invoice, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pdfHeight);
            
            // setTimeout يحل مشاكل تحميل PDF في بعض المتصفحات
            setTimeout(() => {
                pdf.save("invoice.pdf");
            }, 100);

            // إعادة الصفوف
            rows.forEach(row => row.style.display = "table-row");
        });
    });
});
import { jsPDF } from 'jspdf';
import { LOGO_BASE64 } from '../assets/logoBase64';

interface InvoiceData {
    customerName: string;
    contactNumber: string;
    eventName: string;
    eventDate: string;
    eventTime: string;
    totalAmount: number;
    amountPaid: number;
    isAdvance: boolean;
    isFinal: boolean;
    paymentDate: string;
}

export const generateInvoice = async (data: InvoiceData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Robust Date Parsing
    let dateObj: Date;
    if (data.paymentDate.includes('/')) {
        const parts = data.paymentDate.split('/');
        if (parts[2].length === 4) {
            // DD/MM/YYYY or MM/DD/YYYY? 
            // Assuming DD/MM/YYYY for Indian locale
            dateObj = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        } else {
            dateObj = new Date(data.paymentDate);
        }
    } else {
        dateObj = new Date(data.paymentDate);
    }

    if (isNaN(dateObj.getTime())) {
        dateObj = new Date(); // Fallback to now
    }
    const dayName = dateObj.toLocaleDateString('en-IN', { weekday: 'long' });

    // Header Background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, 50, 'F');

    // Official Logo
    try {
        doc.addImage(`data:image/png;base64,${LOGO_BASE64}`, 'PNG', 20, 10, 80, 40);
    } catch (e) {
        console.warn('Could not add logo to PDF:', e);
    }

    // Invoice Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT RECEIPT', pageWidth / 2, 75, { align: 'center' });

    // Date and Day
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Receipt Date: ${data.paymentDate}`, 150, 75);
    doc.text(`Day: ${dayName}`, 150, 80);

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 85, pageWidth - 20, 85);

    // Customer Details Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER DETAILS', 20, 100);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Name: ${data.customerName}`, 20, 110);
    doc.text(`Contact: ${data.contactNumber}`, 20, 115);

    // Event Details Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('EVENT DETAILS', 20, 130);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Event Name: ${data.eventName}`, 20, 140);
    doc.text(`Event Date: ${data.eventDate}`, 20, 145);
    doc.text(`Event Time: ${data.eventTime}`, 20, 150);

    // Divider
    doc.line(20, 160, pageWidth - 20, 160);

    // Payment Details Table Header
    doc.setFillColor(245, 245, 245);
    doc.rect(20, 165, pageWidth - 40, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 25, 172);
    doc.text('Amount (INR)', 150, 172);

    // Table Content
    doc.setFont('helvetica', 'normal');
    doc.text('Total Contract Amount', 25, 185);
    doc.text(`Rs. ${data.totalAmount.toLocaleString()}`, 150, 185);

    doc.text('Amount Paid in this Transaction', 25, 195);
    doc.text(`Rs. ${data.amountPaid.toLocaleString()}`, 150, 195);

    // Section for Checkboxes
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Category:', 20, 215);

    // Advance Checkbox
    doc.rect(20, 220, 5, 5); 
    if (data.isAdvance) {
        doc.text('X', 21, 224);
    }
    doc.setFont('helvetica', 'normal');
    doc.text('Advance Payment', 30, 224);

    // Pending/Final Checkbox
    doc.rect(80, 220, 5, 5);
    if (data.isFinal) {
        doc.text('X', 81, 224);
    }
    doc.text('Final / Pending Amount', 90, 224);

    // Summary Box
    doc.setFillColor(255, 248, 231); // Cream
    doc.rect(130, 215, 60, 20, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Outstanding Balance:', 135, 223);
    const balance = data.totalAmount - (data.isFinal ? data.totalAmount : data.amountPaid);
    doc.text(`Rs. ${balance.toLocaleString()}`, 135, 230);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('This is a computer generated receipt and does not require a signature.', pageWidth / 2, 270, { align: 'center' });
    doc.text('Thank you for choosing JashanEdge!', pageWidth / 2, 275, { align: 'center' });

    doc.save(`Invoice_${data.eventName.replace(/\s+/g, '_')}_${data.paymentDate.replace(/\//g, '-')}.pdf`);
};

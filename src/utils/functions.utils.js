import { doc, setDoc } from "@firebase/firestore";
import { db } from "../firebase/firebase.utils";

export async function writeInvoices(invoice){
    try {
      const docRef = await setDoc(doc(db, "invoices", invoice.id),   {
        id: invoice.id,
        createdAt: invoice.createdAt,
        paymentDue: invoice.paymentDue,
        description: invoice.description,
        paymentTerms: invoice.paymentTerms,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        status: invoice.status,
        senderAddress: invoice.senderAddress,
        clientAddress: invoice.clientAddress,
        items: invoice.items,
        total: invoice.total
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
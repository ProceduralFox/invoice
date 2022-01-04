import InvoiceForm from "../components/form/form.component";
import InvoicesList from "../components/invoices_list/invoices_list.component";


const MainPage = () => {
    return ( 
    <>
        <InvoicesList></InvoicesList>
        <InvoiceForm edit={false}></InvoiceForm>
    </> );
}
 
export default MainPage;
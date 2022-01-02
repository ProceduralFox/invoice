import InvoiceForm from "../components/form/form.component";
import InvoicesList from "../components/invoices_list/invoices_list.component";


const MainPage = () => {
    return ( 
    <div className="">
        <InvoicesList></InvoicesList>
        <InvoiceForm edit={false}></InvoiceForm>
    </div> );
}
 
export default MainPage;
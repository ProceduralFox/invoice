import InvoiceView from '../components/invoice_view/invoice_view.component'
import InvoiceForm from "../components/form/form.component";

const ViewPage = ({ match }) => {
    return ( 
    <>
        <InvoiceView slug={match.params.id}></InvoiceView>
        <InvoiceForm edit={match.params.id}></InvoiceForm>
    </> );
}
 
export default ViewPage;
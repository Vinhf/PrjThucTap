import Breadcrumb from '../Components/Breadcrumbs/Breadcrumb';
import ListUserComponent from '../Components/ListUserComponent';


const TablesUser = () => {
  return (
    <div>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <ListUserComponent />
      </div>
    </div>
  );
};

export default TablesUser;

import Breadcrumb from '../Components/Breadcrumbs/Breadcrumb';
import ListUserComponent from '../Components/ListUserComponent';
import TableEnrollment from '../Components/Tables/TableEnrollment';

import TableFive from '../Components/Tables/TableFive';
import TableThree from '../Components/Tables/TableThree';

const TablesCatgories = () => {
  return (
    <div>
      <Breadcrumb pageName="protected/Tables" />
      <div className="flex flex-col gap-10">
        <TableFive/>
      </div>
    </div>
  );
};

export default TablesCatgories;

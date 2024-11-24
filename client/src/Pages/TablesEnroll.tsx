import Breadcrumb from '../Components/Breadcrumbs/Breadcrumb';
import TableEnrollment from '../Components/Tables/TableEnrollment';

import TableFive from '../Components/Tables/TableFive';
import DefaultLayout from '../layout/DefaultLayout';

const TablesEnroll = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="protected/Tables" />
      <div className="flex flex-col gap-10">
        <TableEnrollment/>
      </div>
    </DefaultLayout>
  );
};

export default TablesEnroll;

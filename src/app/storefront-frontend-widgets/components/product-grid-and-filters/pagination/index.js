import { Pagination as MuiPagination } from '@mui/material';

export default function PaginationWithMUI({ totalProducts, productsPerPage, currentPage, handlePaginationClick }) {
    const handleChange = (event, value) => {
        handlePaginationClick(value)
    };

    const count = Math.ceil(totalProducts / productsPerPage);

    return (
        <MuiPagination
            color={'primary'}
            size={'large'}
            count={count}
            page={currentPage}
            onChange={handleChange}
        />
    );

}
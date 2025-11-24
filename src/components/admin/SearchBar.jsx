import React from 'react'
import '../pages/Admin/Dashboard.css';

function SearchBar() {
    return (
        <div className='searchBox position-relative d-flex align-item-center'>
            <i className="bi bi-search"></i>
            <input type="text" placeholder='Search Here' />
        </div>
    )
}

export default SearchBar
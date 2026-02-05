import React, { useState } from 'react';
import './Table.css';

/**
 * Reusable Table Component
 * 
 * Features:
 * - Column definitions with sorting
 * - Pagination
 * - Row actions
 * - Empty state
 * - Loading state
 * - Responsive design
 */

const Table = ({
    columns = [],
    data = [],
    loading = false,
    emptyMessage = 'Không có dữ liệu',
    onRowClick,
    pagination = true,
    pageSize = 10,
    className = '',
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Sorting logic
    const sortedData = React.useMemo(() => {
        if (!sortConfig.key) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === bValue) return 0;

            const comparison = aValue < bValue ? -1 : 1;
            return sortConfig.direction === 'asc' ? comparison : -comparison;
        });
    }, [data, sortConfig]);

    // Pagination logic
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = pagination
        ? sortedData.slice(startIndex, endIndex)
        : sortedData;

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <div className="table-loading">
                <div className="spinner" />
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="table-empty">
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className={`table-container ${className}`}>
            <div className="table-wrapper">
                <table className="table">
                    <thead className="table-header">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={`table-th ${column.sortable ? 'sortable' : ''}`}
                                    onClick={() => column.sortable && handleSort(column.key)}
                                    style={{ width: column.width }}
                                >
                                    <div className="th-content">
                                        <span>{column.label}</span>
                                        {column.sortable && (
                                            <span className="sort-icon">
                                                {sortConfig.key === column.key
                                                    ? sortConfig.direction === 'asc' ? '↑' : '↓'
                                                    : '↕'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {paginatedData.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={`table-row ${onRowClick ? 'clickable' : ''}`}
                                onClick={() => onRowClick && onRowClick(row)}
                            >
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className="table-td">
                                        {column.render
                                            ? column.render(row[column.key], row)
                                            : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && totalPages > 1 && (
                <div className="table-pagination">
                    <div className="pagination-info">
                        Hiển thị {startIndex + 1}-{Math.min(endIndex, sortedData.length)} trong {sortedData.length} bản ghi
                    </div>
                    <div className="pagination-controls">
                        <button
                            className="pagination-btn"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            ← Trước
                        </button>

                        {[...Array(totalPages)].map((_, index) => {
                            const page = index + 1;
                            // Show first, last, current, and neighbors
                            if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={page}
                                        className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                );
                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                                return <span key={page} className="pagination-ellipsis">...</span>;
                            }
                            return null;
                        })}

                        <button
                            className="pagination-btn"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Sau →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;

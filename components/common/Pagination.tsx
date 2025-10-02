import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) {
        return null;
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };
    
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex items-center justify-between text-sm text-text-secondary px-4 py-2 bg-surface rounded-b-lg border-t border-border">
            <p>
                Showing <span className="font-semibold text-text-primary">{startItem}</span> to <span className="font-semibold text-text-primary">{endItem}</span> of <span className="font-semibold text-text-primary">{totalItems}</span> results
            </p>
            <div className="flex items-center space-x-2">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md bg-border hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    Previous
                </button>
                 <span className="px-3 py-1">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md bg-border hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

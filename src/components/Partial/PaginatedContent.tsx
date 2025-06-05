import React, { useState, useEffect } from "react";
import Pagination from "./Pagination";

interface PaginatedContentProps<T> {
  items: T[];
  itemsPerPage: number;
  renderItems: (items: T[]) => React.ReactNode;
  initialPage?: number;
  emptyMessage?: string;
}

const PaginatedContent = <T,>({
  items,
  itemsPerPage,
  renderItems,
  initialPage = 1,
  emptyMessage = "No items to display",
}: PaginatedContentProps<T>): React.ReactElement => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderedItems = renderItems(paginatedItems);
  return (
    <>
      {items.length > 0 ? (
        <>
          {renderedItems}

          {totalPages > 1 && (
            <div className="pagination-container">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <p>{emptyMessage}</p>
      )}
    </>
  );
};

export default PaginatedContent;

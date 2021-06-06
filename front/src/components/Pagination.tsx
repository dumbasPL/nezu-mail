import React from 'react'
import { Pagination as ReactPagination } from 'react-bootstrap'

interface IOpts { 
  total: number;
  current: number;
  perPage: number;
  onClick: (n: number) => void;
}


export default function Pagination(opts: IOpts) {
  if (opts.total <= opts.perPage) {
    return (null);
  }
  const numPages = Math.ceil(opts.total / opts.perPage) - 1;
  const curPage = Math.floor(opts.current / opts.perPage);
  const firstPage = Math.max(curPage - 3, 0);
  const lastPage = Math.min(curPage + 3, numPages);
  const pageNumbers: number[] = [];
  for (let i = firstPage; i <= lastPage; i++) {
    pageNumbers.push(i);
  }
  return (
    <ReactPagination>
      {curPage > 0 ? 
      <>
        <ReactPagination.First onClick={() => opts.onClick(0)} />
        <ReactPagination.Prev onClick={() => opts.onClick(opts.current - opts.perPage)}/>
      </> : (null)}
      {curPage - 3 > 0 ? <ReactPagination.Ellipsis key="ellipsis-start" disabled/> : (null)}

      {pageNumbers.map(i => <ReactPagination.Item key={i} active={i === curPage} onClick={() => opts.onClick(i * opts.perPage)}>{i + 1}</ReactPagination.Item>)}
      
      {curPage + 3 < numPages ? <ReactPagination.Ellipsis key="ellipsis-end" disabled/> : (null)}
      {curPage < numPages ? 
      <>
        <ReactPagination.Next onClick={() => opts.onClick(opts.current + opts.perPage)}/>
        <ReactPagination.Last onClick={() => opts.onClick(numPages * opts.perPage)} />
      </> : (null)}
    </ReactPagination>
  )
}

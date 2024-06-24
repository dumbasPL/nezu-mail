import ReactPagination from 'react-bootstrap/Pagination'

export default function Pagination(props: { 
  total: number;
  curPage: number;
  perPage: number;
  delta?: number;
  onClick: (n: number) => void;
}) {
  if (props.total <= props.perPage) {
    return null;
  }
  const delta = props.delta ?? 3;
  const numPages = Math.ceil(props.total / props.perPage) - 1;
  const firstPage = Math.max(props.curPage - delta, 0);
  const lastPage = Math.min(props.curPage + delta, numPages);
  const pageNumbers: number[] = [];
  for (let i = firstPage; i <= lastPage; i++) {
    pageNumbers.push(i);
  }
  return (
    <ReactPagination>
      <ReactPagination.First disabled={props.curPage == 0} onClick={() => props.onClick(0)} />
      <ReactPagination.Prev disabled={props.curPage == 0} onClick={() => props.onClick(props.curPage - 1)}/>

      {firstPage > 0 ? <ReactPagination.Ellipsis key="ellipsis-start" disabled/> : (null)}

      {pageNumbers.map(i => 
        <ReactPagination.Item
          key={i}
          active={i === props.curPage}
          onClick={() => props.onClick(i)}
        >{i + 1}</ReactPagination.Item>
      )}
      
      {lastPage < numPages ? <ReactPagination.Ellipsis key="ellipsis-end" disabled/> : (null)}

      <ReactPagination.Next disabled={props.curPage == numPages} onClick={() => props.onClick(props.curPage + 1)}/>
      <ReactPagination.Last disabled={props.curPage == numPages} onClick={() => props.onClick(numPages)} />
    </ReactPagination>
  )
}

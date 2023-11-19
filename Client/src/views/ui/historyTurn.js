import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Col, Input, Row, Table } from "reactstrap";
import ReactPaginate from "react-paginate";

const Tables = () => {
  // Sample data
  const [searchAttribute, setSearchAttribute] = useState("timestamp");
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemOffset, setItemOffset] = useState(0);

  const itemsPerPage = 20;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filteredData.slice(itemOffset, endOffset);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/history");
      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu từ máy chủ");
      }
      const data = await response.json();
      setTableData(data.historyData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchData, 2000);
    fetchData();
    return () => {
      clearInterval(intervalId);
    };
  }, [searchTerm]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredData.length;
    console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
    setItemOffset(newOffset);
  };

  useEffect(() => {
    filterData(searchTerm);
  }, [tableData]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const filterData = (term) => {
    const filtered = tableData.filter((item) => {
      // Use the selected attribute for filtering
      return item[searchAttribute].toString().toLowerCase().includes(term.toLowerCase());
    });
    setFilteredData(filtered);
    setItemOffset(0); // Reset to the first page when filtering
  };
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  return (
    <Row>
      <Col lg='12'>
        <Card>
          <CardTitle tag='h6' className='border-bottom p-3 mb-0'>
            <i className='bi bi-card-text me-2'> </i>
            Table with Striped
          </CardTitle>
          <CardBody>
            {/* <div className='search-bar mb-3'>
              <Input type='text' placeholder='Search...' value={searchTerm} onChange={handleSearch} />
              <select value={searchAttribute} onChange={(e) => setSearchAttribute(e.target.value)}>
                <option value='timestamp'>TIME</option>
                <option value='led_id'>TYPE</option>
                <option value='state'>STATE</option>
                <option value='id'>#</option>
              </select>
            </div> */}
            <Table bordered striped>
              <thead>
                <tr>
                  <th>#</th>
                  <th>TIME</th>
                  <th>TYPE</th>
                  <th>STATE</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item.id}>
                    <th scope='row'>{item.id}</th>
                    <td>{item.timestamp}</td>
                    <td>{item.led_id}</td>
                    <td>{item.state ? "ON" : "OFF"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <ReactPaginate className='react-paginate' breakLabel='...' nextLabel='>' onPageChange={handlePageClick} pageRangeDisplayed={5} pageCount={totalPages} previousLabel='<' />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Tables;

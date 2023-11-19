import { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import Controller from "../components/dashboard/Controller";
import SalesChart from "../components/dashboard/SalesChart";
import TopCards from "../components/dashboard/TopCards";
import BatDen from "./ui/batden";

const IoT = () => {
  const [randomValue1, setRandomValue1] = useState(null);
  const [randomValue2, setRandomValue2] = useState(null);
  const [randomValue3, setRandomValue3] = useState(null);
  const [randomValue4, setRandomValue4] = useState(null);
  const [id, setId] = useState(1);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/data-real-time"); // Đảm bảo URL chính xác
        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu từ máy chủ");
        }
        const data = await response.json();
        // eslint-disable-next-line no-unused-expressions
        setId(data.sensorData[0].id);
        setRandomValue1(data.sensorData[0].temperature);
        setRandomValue2(data.sensorData[0].humidity);
        setRandomValue3(data.sensorData[0].light);
        setRandomValue4(data.sensorData[0]?.dobui);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    const intervalId = setInterval(() => {
      fetchData();
    }, 2000);

    // Gọi fetchData() lần đầu khi component được render
    fetchData();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const [count, setcount] = useState(0);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/sensor-data");
      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu từ máy chủ");
      }
      const data = await response.json();
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    // const intervalId = setInterval(fetchData, 2000);
    fetchData();
    // return () => {
    //   clearInterval(intervalId);
    // };
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      {/***Top Cards***/}
      <Row style={{ height: "30%" }}>
        <Col lg='4' className='mb-4'>
          <TopCards title='Temp' subtitle='°C' earning={randomValue1} icon='bi bi-thermometer-half' />
        </Col>
        <Col lg='4' className='mb-4'>
          <TopCards title='Humidity' subtitle='%' earning={randomValue2} icon='bi bi-moisture' />
        </Col>
        <Col lg='4' className='mb-4'>
          <TopCards title='Brightness' subtitle='Lux' earning={randomValue3} low={200} mid={400} hight={700} icon='bi bi-brightness-high-fill' />
        </Col>
        {/* <Col lg='4' className='mb-4'>
          <TopCards title='Độ Bụi' subtitle='Lux' earning={randomValue4} low={200} mid={400} hight={700} icon='bi bi-brightness-high-fill' />
        </Col> */}
      </Row>
      {/***Sales & Feed***/}
      <Row>
        <Col lg='8'>
          <SalesChart id={id} />
        </Col>
        <Col lg='4'>
          <Row className='flex-column'>
            <Col>
              <BatDen />
            </Col>
            <Col lg='12' className='h-50'>
              <Controller devide='led1' animation='text-warning' title='Light' icon='bi bi-lightbulb-fill' iconOFF='bi bi-lightbulb-off-fill' />
            </Col>
            <Col lg='12' className='h-50'>
              <Controller devide='led2' animation='text-warning rotating' title='Fan' icon='bi bi-fan' />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default IoT;

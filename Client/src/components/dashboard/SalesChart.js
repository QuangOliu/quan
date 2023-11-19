import { useLayoutEffect, useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import axios from "axios";

const SalesChart = ({ id }) => {
  const [temperature, setTemperature] = useState([]);
  const [humidity, setHumidity] = useState([]);
  const [light, setLight] = useState([]);
  const [timestamp, setTimestamp] = useState([]);

  useEffect(() => {
    // Hàm để lấy dữ liệu từ API
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/chartdata`);
        const data = response.data.sensorData; // Lấy dữ liệu từ trường "sensorData"

        // Tách dữ liệu từ mảng data và cập nhật các state tương ứng
        const temperatures = data.map((item) => item.temperature);
        const humidities = data.map((item) => item.humidity);
        const lights = data.map((item) => item.light);
        const timestamp = data.map((item) => item.timestamp);

        setTemperature(temperatures);
        setHumidity(humidities);
        setLight(lights);
        setTimestamp(timestamp);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Gọi hàm fetchData khi component được mount hoặc khi id thay đổi
  }, [id]); // Sử dụng id làm phần tử trong mảng dependencies để lắng nghe sự thay đổi

  const chartoptions = {
    series: [
      {
        name: "Temperature",
        data: temperature,
      },
      {
        name: "Humidity",
        data: humidity,
      },
      {
        name: "Light",
        data: light,
      },
    ],
    options: {
      chart: {
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        strokeDashArray: 3,
      },

      stroke: {
        curve: "straight",
        width: 1,
      },
      xaxis: {
        categories: timestamp, // Bạn có thể cập nhật x-axis theo timestamp nếu cần
      },
    },
  };

  return (
    <Card style={{ height: "100%" }}>
      <CardBody>
        <CardTitle tag='h5'></CardTitle>
        <CardSubtitle className='text-muted' tag='h6'>
          
        </CardSubtitle>
        <Chart type='area' width='100%' height='auto' options={chartoptions.options} series={chartoptions.series}></Chart>
      </CardBody>
    </Card>
  );
};

export default SalesChart;

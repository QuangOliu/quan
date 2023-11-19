const express = require('express');
const mqtt = require('mqtt');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const registeredLeds = {
  led1: { topic: 'esp8266/led1' },
  led2: { topic: 'esp8266/led2' },
};

// Kết nối đến cơ sở dữ liệu MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect(err => {
  if (err) {
    console.error('Lỗi kết nối cơ sở dữ liệu:', err);
  } else {
    console.log('Đã kết nối cơ sở dữ liệu');
  }
});

// Kết nối đến MQTT broker
const mqttClient = mqtt.connect(`mqtt://${process.env.MQTT_BROKER}`);

mqttClient.on('connect', () => {
  console.log('Kết nối MQTT broker thành công');
  mqttClient.subscribe('esp8266/sensor');
});

mqttClient.on('message', (topic, message) => {
  if (topic === 'esp8266/sensor') {
    const data = JSON.parse(message.toString());
    // Lưu dữ liệu vào cơ sở dữ liệu
    console.log(data)
    if (data.humidity !== null && data.temperature !== null && data.light !== null) {
      const sql = 'INSERT INTO sensor_data (humidity, temperature, light, timestamp) VALUES ( ?, ?, ?, NOW())';
      const values = [data.humidity, data.temperature, data.light];
      // console.log(data.dobui)
      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Lỗi khi thêm dữ liệu vào cơ sở dữ liệu:', err);
        } else {
          console.log('Dữ liệu đã được lưu vào cơ sở dữ liệu');
        }
      });
    }
    else {
      console.error('Lỗi khi thêm dữ liệu vào cơ sở dữ liệu: NULL');
    }
  }
});


// Tạo HTTP server
const server = http.createServer(app);

// Tạo WebSocket server
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Gửi dữ liệu mới nhất cho máy khách khi có kết nối mới
  const sql = 'SELECT * FROM sensor_data ORDER BY timestamp DESC';
  db.query(sql, (err, result) => {
    if (!err && result.length > 0) {
      const latestData = result[0];
      socket.emit('data', latestData);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


// API để điều khiển đèn
app.post('/control/led/:ledId', (req, res) => {
  const ledId = req.params.ledId;
  const state = req.body.state; // Trạng thái mới của đèn (true hoặc false)

  // Kiểm tra xem ledId có hợp lệ và state có giá trị hợp lệ
  if (registeredLeds.hasOwnProperty(ledId) && (state === true || state === false)) {
    // Lấy thông tin về đèn từ registeredLeds
    const ledInfo = registeredLeds[ledId];

    // Gửi trạng thái đèn đến MQTT broker
    mqttClient.publish(ledInfo.topic, state ? 'on' : 'off');

    // Lưu trạng thái của đèn vào cơ sở dữ liệu
    const sql = 'INSERT INTO led_status (led_id, state, timestamp) VALUES (?, ?, NOW())';
    const values = [ledId, state, state ? new Date() : null, state ? null : new Date()];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Lỗi khi lưu trạng thái đèn vào cơ sở dữ liệu:', err);
      } else {
        console.log(`Trạng thái của ${ledId} đã được lưu vào cơ sở dữ liệu`);
      }
    });

    res.json({ success: true, message: `Đã thay đổi trạng thái của ${ledId} thành ${state ? 'Bật' : 'Tắt'}` });
  } else {
    res.status(400).json({ success: false, message: 'Yêu cầu không hợp lệ' });
  }
});

// API để truy vấn dữ liệu mới nhất của sensor_data với phân trang
app.get('/sensor-data', (req, res) => {
  const page = req.query.page || 1; // Trang mặc định là 1
  const perPage = req.query.perPage || 10; // Số lượng dòng trên mỗi trang mặc định là 10

  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

  const sql = `SELECT * FROM sensor_data ORDER BY timestamp DESC`;
  // const sql = `SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT ${startIndex}, ${perPage}`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Lỗi khi truy vấn dữ liệu:', err);
      res.status(500).json({ success: false, message: 'Lỗi khi truy vấn dữ liệu' });
    } else {
      const sensorData = result;
      res.json({ success: true, sensorData });
    }
  });
});

app.get('/chartdata', (req, res) => {
  const page = req.query.page || 1; // Trang mặc định là 1
  const perPage = req.query.perPage || 10; // Số lượng dòng trên mỗi trang mặc định là 10

  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

  const sql = `SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 10` ;
  // const sql = `SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT ${startIndex}, ${perPage}`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Lỗi khi truy vấn dữ liệu:', err);
      res.status(500).json({ success: false, message: 'Lỗi khi truy vấn dữ liệu' });
    } else {
      const sensorData = result;
      res.json({ success: true, sensorData });
    }
  });
});

// API để truy vấn dữ liệu mới nhất của sensor_data với phân trang
app.get('/data-real-time', (req, res) => {
  const page = req.query.page || 1; // Trang mặc định là 1
  const perPage = req.query.perPage || 10; // Số lượng dòng trên mỗi trang mặc định là 10

  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

  const sql = `SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 1`;
  // const sql = `SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT ${startIndex}, ${perPage}`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Lỗi khi truy vấn dữ liệu:', err);
      res.status(500).json({ success: false, message: 'Lỗi khi truy vấn dữ liệu' });
    } else {
      const sensorData = result;
      res.json({ success: true, sensorData });
    }
  });
});


app.get('/history', (req, res)=> {
  const page = req.query.page || 1; // Trang mặc định là 1
  const perPage = req.query.perPage || 10; // Số lượng dòng trên mỗi trang mặc định là 10

  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

  const sql = `SELECT * FROM led_status ORDER BY timestamp DESC`;
  // const sql = `SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT ${startIndex}, ${perPage}`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Lỗi khi truy vấn dữ liệu:', err);
      res.status(500).json({ success: false, message: 'Lỗi khi truy vấn dữ liệu' });
    } else {
      const historyData = result;
      res.json({ success: true, historyData });
    }
  });
})



app.listen(port, () => {
  console.log(`Máy chủ Node.js đang lắng nghe trên cổng ${port}`);
});

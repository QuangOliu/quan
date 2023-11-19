#include <DHT.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#define DHTPIN 14  // Chân dữ liệu của cảm biến DHT11
#define DHTTYPE DHT11
#define LIGHT_SENSOR A0  // Chân analog của cảm biến ánh sáng

DHT dht(DHTPIN, DHTTYPE);

// Thiết lập kết nối Wi-Fi
const char* ssid = "ssid";
const char* password = "123456781";

// Thiết lập thông tin MQTT broker
const char* mqtt_broker = "192.168.175.214";
// IPAddress mqtt_broker;

const int mqtt_port = 1883;
const char* mqtt_sensor_topic = "esp8266/sensor";

struct Led {
  int pin;
  const char* topic;
  bool state;
};

// Danh sách các đèn được cấu hình
Led leds[] = {
  // pin, kênh, trạng thái khởi tạo
  { 2, "esp8266/led1", false },
  { 4, "esp8266/led2", false },
  // { 5, "esp8266/led3", false },
  // {6, "esp8266/led4", false},
  // Thêm các đèn khác ở đây nếu cần
};

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  // Khởi động kết nối Wi-Fi
  Serial.begin(115200);
  delay(10);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Kết nối WiFi thành công");

  // Lấy địa chỉ IP của máy tính
  // Khởi tạo đèn theo mảng leds
  for (int i = 0; i < sizeof(leds) / sizeof(leds[0]); i++) {
    pinMode(leds[i].pin, OUTPUT);
    digitalWrite(leds[i].pin, LOW);  // Tắt đèn ban đầu
    client.subscribe(leds[i].topic);
    Serial.println(leds[i].topic);
  }

  // Kết nối đến MQTT broker
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);
  reconnect();
}

void loop() {
  delay(2000);
  client.loop();
  delay(100);  // Delay for a short period in each loop iteration

  // Đọc dữ liệu từ cảm biến DHT11 và cảm biến ánh sáng
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  int lightValue = analogRead(LIGHT_SENSOR);


  // Tạo đối tượng JSON
  StaticJsonDocument<200> jsonDoc;
  jsonDoc["humidity"] = humidity;
  jsonDoc["temperature"] = temperature;
  jsonDoc["light"] = lightValue;

  // Đặt trạng thái của đèn trong JSON
  for (int i = 0; i < sizeof(leds) / sizeof(leds[0]); i++) {
    jsonDoc[leds[i].topic] = leds[i].state;
  }

  // Chuyển đối tượng JSON thành chuỗi JSON
  String jsonString;
  serializeJson(jsonDoc, jsonString);

  // Gửi chuỗi JSON tới MQTT topic
  client.publish(mqtt_sensor_topic, jsonString.c_str());

  // In ra màn hình Serial (tùy chọn)
  Serial.println(jsonString);
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.println("-----------------------");
  Serial.println();
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  Serial.print("Message: ");
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];  // Convert *byte to string
  }
  Serial.print(message);

  // Tìm đèn tương ứng và thay đổi trạng thái
  for (int i = 0; i < sizeof(leds) / sizeof(leds[0]); i++) {
    if (strcmp(topic, leds[i].topic) == 0) {
      if (message == "on" && !leds[i].state) {
        digitalWrite(leds[i].pin, HIGH);  // Bật đèn
        leds[i].state = true;
      } else if (message == "off" && leds[i].state) {
        digitalWrite(leds[i].pin, LOW);  // Tắt đèn
        leds[i].state = false;
      }
    }
  }

  Serial.println();
  Serial.println("-----------------------");
}

void reconnect() {
  // Kết nối lại tới MQTT broker
  while (!client.connected()) {
    Serial.print("Kết nối tới MQTT broker...");
    if (client.connect("ESP8266Client")) {
      Serial.println("Kết nối MQTT thành công");
      // Đăng ký lại cho tất cả các đèn khi kết nối lại
      for (int i = 0; i < sizeof(leds) / sizeof(leds[0]); i++) {
        client.subscribe(leds[i].topic);
      }
    } else {
      Serial.print("Kết nối MQTT thất bại. Thử lại sau 5 giây...");
      delay(5000);
    }
  }
}
